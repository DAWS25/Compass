#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."

echo "Cleaning build artifacts and dependencies..."

# Clean Next.js build artifacts
echo "Removing .next directory..."
rm -rf compass_next/.next

# Clean OpenNext build artifacts
echo "Removing .open-next directory..."
rm -rf .open-next

# Clean Turbo cache
echo "Removing .turbo directory..."
rm -rf compass_next/.turbo

# Clean node_modules
echo "Removing node_modules..."
rm -rf compass_next/node_modules

# Clean Terraform state and cache
echo "Removing Terraform state and cache..."
rm -rf compass_tf/main/.terraform
rm -rf compass_tf/main/.terraform.lock.hcl
rm -f compass_tf/main/terraform.tfstate
rm -f compass_tf/main/terraform.tfstate.backup

# Remove Lambda package
echo "Removing Lambda deployment package..."
rm -f server-function.zip

echo "Cleanup complete! (~500MB+ freed)"
popd
