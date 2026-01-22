output "web_resources_bucket_name" {
  description = "The name of the web resources S3 bucket"
  value       = module.web_resources.bucket_name
}

output "web_resources_bucket_arn" {
  description = "The ARN of the web resources S3 bucket"
  value       = module.web_resources.bucket_arn
}