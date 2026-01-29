output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.app.id
}

output "domain_name" {
  description = "CloudFront distribution domain name"
  value       = "https://${var.domain_name}"
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.app.arn
}

output "route53_record_fqdn" {
  description = "Route53 record FQDN"
  value       = aws_route53_record.app.fqdn
}

output "route53_record_name" {
  description = "Route53 record name"
  value       = aws_route53_record.app.name
}
