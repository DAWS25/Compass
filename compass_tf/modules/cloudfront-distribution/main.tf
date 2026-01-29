resource "aws_cloudfront_distribution" "app" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name = replace(var.api_gateway_endpoint, "https://", "")
    origin_id   = "api_gateway"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = "${var.s3_bucket_name}.s3.amazonaws.com"
    origin_id   = "s3_assets"

    s3_origin_config {
      origin_access_identity = "origin-access-identity/cloudfront/E1P7YZ5BACFRY2"
    }
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = "api_gateway"
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    cache_policy_id            = aws_cloudfront_cache_policy.api_gateway.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.api_gateway.id
  }

  cache_behavior {
    path_pattern             = "/_next/static/*"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "s3_assets"
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"
    cache_policy_id          = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.static_assets.id
  }

  cache_behavior {
    path_pattern             = "/public/*"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "s3_assets"
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"
    cache_policy_id          = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.static_assets.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [aws_cloudfront_cache_policy.api_gateway]
}

resource "aws_cloudfront_cache_policy" "api_gateway" {
  name        = "${var.app_name}-${var.environment}-api-cache"
  comment     = "Cache policy for API Gateway origin"
  default_ttl = 0
  max_ttl     = 0
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "all"
    }

    headers_config {
      header_behavior = "whitelist"
      headers = [
        "accept",
        "accept-encoding",
        "accept-language",
        "authorization",
        "cache-control",
        "content-type",
        "origin",
        "pragma",
        "referer",
        "user-agent",
        "x-forwarded-for",
        "x-forwarded-port",
        "x-forwarded-proto"
      ]
    }

    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

resource "aws_cloudfront_origin_request_policy" "api_gateway" {
  name = "${var.app_name}-${var.environment}-api-origin-request"

  cookies_config {
    cookie_behavior = "all"
  }

  headers_config {
    header_behavior = "whitelist"
    headers = [
      "accept",
      "accept-encoding",
      "accept-language",
      "authorization",
      "cache-control",
      "content-type",
      "origin",
      "pragma",
      "referer",
      "user-agent",
      "x-forwarded-for",
      "x-forwarded-port",
      "x-forwarded-proto"
    ]
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_cache_policy" "static_assets" {
  name        = "${var.app_name}-${var.environment}-static-cache"
  comment     = "Cache policy for static assets"
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_origin_request_policy" "static_assets" {
  name = "${var.app_name}-${var.environment}-static-origin-request"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "none"
  }

  query_strings_config {
    query_string_behavior = "none"
  }
}

resource "aws_route53_record" "app" {
  zone_id = var.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.app.domain_name
    zone_id                = aws_cloudfront_distribution.app.hosted_zone_id
    evaluate_target_health = false
  }
}
