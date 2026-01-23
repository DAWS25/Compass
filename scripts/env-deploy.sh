#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."
#!

source "$DIR/env-build.sh"

aws sts get-caller-identity

pushd compass_tf/main
terraform init
terraform apply -auto-approve
popd

#!
popd
