# Include the variables file

variable "aws_region" {
  description = "The AWS region to deploy resources"
  default     = "us-east-1"  # Change to your desired region
}

provider "aws" {
  region = var.aws_region
}

module "web_resources" {
  source = "../modules/web-resources"
}