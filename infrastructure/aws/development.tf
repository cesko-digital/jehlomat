# ---------
# Web frontend S3 bucket
# ---------

resource "aws_s3_bucket" "frontend" {
  bucket = var.development-frontend-bucket-name
  acl    = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  policy = templatefile("roles/s3-cloudfront-policy.tmpl", {
    cloudfront-arn = aws_cloudfront_origin_access_identity.default.iam_arn,
    bucket-name    = var.development-frontend-bucket-name
  })
}

# ----------
# ECR (Docker repositories)
# ----------

resource "aws_ecr_repository" "service-jehlomat" {
  name                 = "service-jehlomat"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# -------------
# IAM roles
# -------------

resource "aws_iam_role" "ecs-task-execution-role" {
  name = "ecs-task-execution-role"

  assume_role_policy = file("roles/ecs-assume.json")
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-policy-attachment" {
  role       = aws_iam_role.ecs-task-execution-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "secrets-manager-policy-attachment" {
  role       = aws_iam_role.ecs-task-execution-role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource aws_iam_role_policy_attachment lambda-policy-attachment {
  role       = aws_iam_role.ecs-task-execution-role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaRole"
}

# --------
# service-jehlomat
# --------

resource "aws_ecs_cluster" "service-jehlomat" {
  name = "service-jehlomat"
}

resource "aws_ecs_task_definition" "service-jehlomat" {
  family                = "service-jehlomat"
  container_definitions = templatefile("ecs/service-jehlomat.tmpl", {
    aws-region          = var.aws-region,
    aws-repository      = aws_ecr_repository.service-jehlomat.repository_url,
    database-host       = aws_route53_record.database.fqdn,
    database-port       = "5432",
    database-name       = aws_db_instance.database.name,
    database-username   = var.database-username,
    database-password   = var.database-password,
    super-admin-email   = var.super-admin-email,
    jwt-issuer          = var.jwt-issuer,
    jwt-audience        = var.jwt-audience,
    jwt-realm           = var.jwt-realm,
    mailjet_public_key  = var.mailjet_public_key,
    mailjet_private_key = var.mailjet_private_key
  })
  network_mode          = "awsvpc"
  execution_role_arn    = aws_iam_role.ecs-task-execution-role.arn
  task_role_arn         = aws_iam_role.ecs-task-execution-role.arn
  memory                = "512"
  cpu                   = "256"
}

resource "aws_ecs_service" "service-jehlomat" {
  name                               = "service-jehlomat"
  cluster                            = aws_ecs_cluster.service-jehlomat.id
  task_definition                    = aws_ecs_task_definition.service-jehlomat.arn
  launch_type                        = "FARGATE"
  desired_count                      = 1
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 20

  network_configuration {
    subnets          = [
      aws_subnet.private.id
    ]
    security_groups  = [
      aws_security_group.private-default-sg.id
    ]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service-jehlomat-tg.arn
    container_name   = "service-jehlomat"
    container_port   = 8082
  }
}

resource "aws_cloudwatch_log_group" "service-jehlomat-lg" {
  name = "/ecs/service-jehlomat"
}

# --------------
# Load Balancers
# --------------

resource "aws_lb_listener" "service-jehlomat-elb-listener" {
  load_balancer_arn = aws_lb.service-elb.arn
  port              = "8082"
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service-jehlomat-tg.arn
  }
}

resource "aws_lb_target_group" "service-jehlomat-tg" {
  name        = "service-jehlomat-tg"
  port        = 8082
  protocol    = "TCP"
  vpc_id      = aws_vpc.vpc.id
  target_type = "ip"
}

# ------------
# API gateway
# ------------

resource "aws_api_gateway_vpc_link" "service-link" {
  name        = "service-link"
  target_arns = [
    aws_lb.service-elb.arn
  ]
}

resource "aws_api_gateway_rest_api" "service-api" {
  name = "${var.codename}-api-development"
  endpoint_configuration {
    types = [
      "REGIONAL"
    ]
  }
}

resource "aws_api_gateway_resource" "api" {
  rest_api_id = aws_api_gateway_rest_api.service-api.id
  parent_id   = aws_api_gateway_rest_api.service-api.root_resource_id
  path_part   = "api"
}

resource "aws_api_gateway_resource" "service-proxy" {
  rest_api_id = aws_api_gateway_rest_api.service-api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "service-proxy" {
  rest_api_id        = aws_api_gateway_rest_api.service-api.id
  resource_id        = aws_api_gateway_resource.service-proxy.id
  http_method        = "ANY"
  authorization      = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "service-proxy" {
  rest_api_id = aws_api_gateway_rest_api.service-api.id
  resource_id = aws_api_gateway_resource.service-proxy.id
  http_method = aws_api_gateway_method.service-proxy.http_method

  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_lb.service-elb.dns_name}:8082/api/{proxy}"
  integration_http_method = aws_api_gateway_method.service-proxy.http_method

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }

  connection_type = "VPC_LINK"
  connection_id   = aws_api_gateway_vpc_link.service-link.id
}

resource "aws_api_gateway_deployment" "service" {
  depends_on = [
    aws_api_gateway_integration.service-proxy
  ]

  rest_api_id = aws_api_gateway_rest_api.service-api.id
  stage_name  = "development"
}

# ------------
# CloudFront
# ------------

resource "aws_cloudfront_origin_access_identity" "default" {
  comment = "CloudFront Orgin Identity"
}

resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = replace(aws_api_gateway_deployment.service.invoke_url, "/^https?://([^/]*).*/", "$1")
    origin_id   = aws_api_gateway_deployment.service.id
    origin_path = "/development"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = [
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2"
      ]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [
    var.development-public-domain
  ]

  default_cache_behavior {
    allowed_methods  = [
      "GET",
      "HEAD"
    ]
    cached_methods   = [
      "GET",
      "HEAD"
    ]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = [
      "GET",
      "HEAD",
      "OPTIONS",
      "PUT",
      "POST",
      "PATCH",
      "DELETE"
    ]
    cached_methods   = [
      "GET",
      "HEAD"
    ]
    target_origin_id = aws_api_gateway_deployment.service.id

    forwarded_values {
      query_string = true
      headers      = [
        "Authorization",
      ]
      cookies {
        forward = "all"
      }
    }
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    smooth_streaming       = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.development-domain-certificate-arn
    cloudfront_default_certificate = false
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2018"
  }

  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 300
    response_code         = 200
    response_page_path    = "/index.html"
  }
}