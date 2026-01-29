output "image_optimization_function_name" {
  description = "Image optimization Lambda function name"
  value       = aws_lambda_function.image_optimization.function_name
}

output "image_optimization_function_arn" {
  description = "Image optimization Lambda function ARN"
  value       = aws_lambda_function.image_optimization.arn
}
