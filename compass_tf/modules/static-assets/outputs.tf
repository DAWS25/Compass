output "bucket_name" {
  description = "S3 bucket name for static assets"
  value       = aws_s3_bucket.assets.id
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.assets.arn
}

output "oai_id" {
  description = "CloudFront Origin Access Identity ID"
  value       = data.aws_cloudfront_origin_access_identity.assets.id
}

output "oai_iam_arn" {
  description = "CloudFront Origin Access Identity IAM ARN"
  value       = data.aws_cloudfront_origin_access_identity.assets.iam_arn
}
