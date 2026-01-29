variable "environment" {
  description = "Environment name"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to Lambda function zip file"
  type        = string
}
