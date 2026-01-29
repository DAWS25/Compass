output "api_gateway_endpoint" {
  description = "API Gateway endpoint URL"
  value       = module.lambda_function.api_gateway_endpoint
}

output "application_url" {
  description = "Application custom domain URL"
  value       = module.cloudfront_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront_distribution.distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront_distribution.domain_name
}

output "cloudfront_oai_id" {
  description = "CloudFront Origin Access Identity ID"
  value       = module.static_assets.oai_id
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda_function.lambda_function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = module.lambda_function.lambda_function_arn
}

output "lambda_role_arn" {
  description = "Lambda role ARN"
  value       = module.lambda_function.lambda_role_arn
}

output "image_optimization_function_name" {
  description = "Image optimization Lambda function name"
  value       = module.image_optimization.image_optimization_function_name
}

output "image_optimization_function_arn" {
  description = "Image optimization Lambda function ARN"
  value       = module.image_optimization.image_optimization_function_arn
}

output "s3_bucket_name" {
  description = "S3 bucket name for static assets"
  value       = module.static_assets.bucket_name
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = module.static_assets.bucket_arn
}

output "route53_record_fqdn" {
  description = "Route53 record FQDN"
  value       = module.cloudfront_distribution.route53_record_fqdn
}

output "route53_record_name" {
  description = "Route53 record name"
  value       = module.cloudfront_distribution.route53_record_name
}

output "web_resources_bucket_name" {
  description = "The name of the web resources S3 bucket"
  value       = module.web_resources.bucket_name
}

output "web_resources_bucket_arn" {
  description = "The ARN of the web resources S3 bucket"
  value       = module.web_resources.bucket_arn
}