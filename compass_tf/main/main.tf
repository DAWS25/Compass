provider "aws" {
  region = var.aws_region
}

module "web_resources" {
  source = "../modules/web-resources"
}