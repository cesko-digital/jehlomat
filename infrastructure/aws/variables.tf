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
  type    = string
  default = "jehlomat-frontend-development"
}

variable "development-domain-certificate-arn" {
  type    = string
  default = "arn:aws:acm:us-east-1:313370994665:certificate/92346f6e-1016-4471-834a-a9c12ab70663"
}

variable "development-public-domain" {
  type    = string
  default = "jehlomat.ceskodigital.net"
}
