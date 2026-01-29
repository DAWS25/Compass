provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

module "lambda_function" {
  source = "../modules/lambda-function"

  environment       = var.environment
  app_name          = var.app_name
  lambda_zip_path   = var.lambda_zip_path
}

module "image_optimization" {
  source = "../modules/image-optimization"

  environment     = var.environment
  app_name        = var.app_name
  lambda_zip_path = var.lambda_zip_path
}

module "static_assets" {
  source = "../modules/static-assets"

  environment     = var.environment
  app_name        = var.app_name
  aws_account_id  = data.aws_caller_identity.current.account_id
}

module "cloudfront_distribution" {
  source = "../modules/cloudfront-distribution"

  environment                      = var.environment
  app_name                         = var.app_name
  domain_name                      = var.domain_name
  zone_id                          = var.zone_id
  certificate_arn                  = var.certificate_arn
  api_gateway_endpoint             = module.lambda_function.api_gateway_endpoint
  s3_bucket_name                   = module.static_assets.bucket_name
  s3_oai_iam_arn                   = module.static_assets.oai_iam_arn
  image_optimization_function_arn  = module.image_optimization.image_optimization_function_arn
}

module "web_resources" {
  source = "../modules/web-resources"
}