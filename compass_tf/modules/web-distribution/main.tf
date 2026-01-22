resource "aws_s3_bucket" "web_resources" {
    bucket = var.bucket_name

    tags = merge(
        var.tags,
        {
            Name = var.bucket_name
        }
    )
}
