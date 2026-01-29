resource "aws_iam_role" "image_optimization_role" {
  name = "${var.app_name}-${var.environment}-image-optimization-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "image_optimization_basic" {
  role       = aws_iam_role.image_optimization_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "image_optimization" {
  filename      = var.lambda_zip_path
  function_name = "${var.app_name}-${var.environment}-image-optimization"
  role          = aws_iam_role.image_optimization_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 60
  memory_size   = 1024

  source_code_hash = filebase64sha256(var.lambda_zip_path)
}
