variable "environment" {
  description = "Environment name"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "domain_name" {
  description = "Custom domain name"
  type        = string
}

variable "zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the domain"
  type        = string
}

variable "api_gateway_endpoint" {
  description = "API Gateway endpoint"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket name for static assets"
  type        = string
}

variable "s3_oai_iam_arn" {
  description = "CloudFront OAI IAM ARN"
  type        = string
}

variable "image_optimization_function_arn" {
  description = "Image optimization Lambda function ARN"
  type        = string
}
