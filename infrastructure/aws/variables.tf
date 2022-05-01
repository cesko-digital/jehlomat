variable "aws-region" {
  type    = string
  default = "eu-central-1"
}

variable "codename" {
  type    = string
  default = "jehlomat"
}

# Internal domain, its not visible publicly, but it should be domain we own
# to comply with best practices => it ensures the internal domain names are globally unique.
variable "codename-domain" {
  type    = string
  default = "jehlomat.cz"
}

variable "development-frontend-bucket-name" {
  type = string
}

variable "development-domain-certificate-arn" {
  type = string
}

variable "development-public-domain" {
  type = string
}

variable "database-username" {
  type = string
}

variable "database-password" {
  type = string

  sensitive = true

  validation {
    condition     = length(var.database-password) >= 12
    error_message = "The password must be at least 12 character long."
  }
}

variable "super-admin-email" {
  type = string

  sensitive = true
}

variable "jwt-issuer" {
  type = string
}

variable "jwt-audience" {
  type = string
}

variable "jwt-realm" {
  type = string
}

variable "mailjet-public-key" {
  type = string
}

variable "mailjet-private-key" {
  type = string
}

variable "frontend-url" {
  type = string
}
