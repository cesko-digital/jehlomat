terraform {
  required_version = ">= 0.14.7"

  required_providers {
    aws = ">= 3.28.0"
  }

  backend "s3" {
    bucket = "jehlomat-terraform-backend"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = var.aws-region
}

# ----------------
# VPC
# ----------------

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = var.codename
  }
}

resource "aws_subnet" "private" {
  cidr_block        = "10.0.0.0/20"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = "${var.aws-region}a"

  tags = {
    Name = "${var.codename}-private"
  }
}

resource "aws_subnet" "public" {
  cidr_block        = "10.0.16.0/20"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = "${var.aws-region}a"

  tags = {
    Name = "${var.codename}-public"
  }
}

# ---------
# Internet Gateway
# ---------

resource "aws_internet_gateway" "internet-gateway" {
  vpc_id = aws_vpc.vpc.id
  tags   = {
    Name = "${var.codename}-internet-gateway"
  }
}

# ---------
# NAT Gateway
# ---------

resource "aws_eip" "nat-gateway-ip" {
  vpc = true
}

resource "aws_nat_gateway" "nat-gateway" {
  subnet_id     = aws_subnet.public.id
  allocation_id = aws_eip.nat-gateway-ip.id
}

# Routing table settings, we have 2 routing tables
# 1. public -> have access directly to internet gateway
# 2. private -> is routed to internet via NAT Gateway
#
# There is default table (set as main) without access to internet, only for local routes. Which is good default.
resource "aws_route_table" "public-routes" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet-gateway.id
  }

  tags = {
    Name = "${var.codename}-public-routes"
  }
}

resource "aws_route_table" "private-routes" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat-gateway.id
  }

  tags = {
    Name = "${var.codename}-private-routes"
  }
}

resource "aws_route_table_association" "private-subnet" {
  route_table_id = aws_route_table.private-routes.id
  subnet_id      = aws_subnet.private.id
}

resource "aws_route_table_association" "public-subnet" {
  route_table_id = aws_route_table.public-routes.id
  subnet_id      = aws_subnet.public.id
}

# -----------
# Security Groups
# -----------

resource "aws_security_group" "private-default-sg" {
  name        = "${var.codename}-private-default-sg"
  description = "Default, fully open SG for private network."
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [
      "10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [
      "0.0.0.0/0"]
  }
}

# --------
# Route53 Internal Zone
# --------

resource "aws_route53_zone" "private" {
  name = "internal.${var.codename-domain}"

  vpc {
    vpc_id = aws_vpc.vpc.id
  }
}

# -----------
# Elastic Load balancers
# -----------

resource "aws_lb" "service-elb" {
  name               = "service-elb"
  internal           = true
  load_balancer_type = "network"
  subnets            = [
    aws_subnet.private.id
  ]

  idle_timeout = 400

  tags = {
    Name = "service-elb"
  }
}

resource "aws_route53_record" "service-elb" {
  zone_id = aws_route53_zone.private.id
  name    = "service"
  type    = "A"

  alias {
    name                   = aws_lb.service-elb.dns_name
    zone_id                = aws_lb.service-elb.zone_id
    evaluate_target_health = false
  }
}