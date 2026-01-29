#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."

echo "Loading environment variables..."
if [ -f .envrc ]; then
  source .envrc
fi

echo "Building application..."
source "$DIR/env-build.sh"

echo "Verifying AWS credentials..."
aws sts get-caller-identity

echo "Exporting Terraform variables..."
export TF_VAR_environment=${ENVIRONMENT_NAME:-compass-beta}
export TF_VAR_app_name=${APP_NAME:-compass}
export TF_VAR_domain_name=${DOMAIN_NAME:-compass-beta.env.daws25.com}
export TF_VAR_zone_id=${ZONE_ID}
export TF_VAR_certificate_arn=${CERTIFICATE_ARN}
export TF_VAR_lambda_zip_path="$(pwd)/server-function.zip"
export TF_VAR_aws_account_id=$(aws sts get-caller-identity --query Account --output text)

echo "Deploying with Terraform..."
pushd compass_tf/main
terraform init
terraform apply -auto-approve
popd

echo "Deployment complete!"
popd
