# ----------------
# KMS
# ----------------

resource "aws_kms_alias" "db_enc_key_alias" {
  name          = "alias/db_enc_key-${var.codename}"
  target_key_id = aws_kms_key.db_enc_key.id
}

resource "aws_kms_key" "db_enc_key" {
  description = "Database encryption key"
}

# -------
# RDS Database
# -------

resource "aws_db_instance" "database" {
  allocated_storage       = 20
  max_allocated_storage   = 100
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "13.3"
  instance_class          = "db.t3.micro"
  name                    = "${var.codename}development"
  backup_retention_period = 7

  username = var.database-username
  password = var.database-password

  vpc_security_group_ids = [
    aws_security_group.private-default-sg.id
  ]
  db_subnet_group_name   = aws_db_subnet_group.database.name
  publicly_accessible    = false
  availability_zone      = "${var.aws-region}a"

  storage_encrypted   = true
  kms_key_id          = aws_kms_key.db_enc_key.arn
  deletion_protection = false
  skip_final_snapshot = true

  enabled_cloudwatch_logs_exports = [
    "upgrade"
  ]
}

resource "aws_db_subnet_group" "database" {
  name       = "${var.codename}-database-subnet-group"
  subnet_ids = [
    aws_subnet.private.id,
    aws_subnet.secondary-private.id
  ]
}

# DNS record for database
resource "aws_route53_record" "database" {
  zone_id = aws_route53_zone.private.zone_id
  name    = "database"
  type    = "CNAME"
  ttl     = "300"

  records = [
    aws_db_instance.database.address
  ]
}
