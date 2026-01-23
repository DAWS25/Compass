#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."
echo "script [$0] started"
#!

# SSH key setup
SSH_KEY_PATH="$HOME/.ssh/id_rsa"
if [ -f "$SSH_KEY_PATH" ]; then
  echo "Using existing SSH key at $SSH_KEY_PATH"
  chmod 600 "$SSH_KEY_PATH"
fi

# Check secrets
SECRETS_DIR="$DIR/../../GitOps-Secrets"
SECRETS_REPO="git@github.com:DAWS25/GitOps-Secrets.git"

if [ ! -d "$SECRETS_DIR" ]; then
  echo "Secrets directory not found: $SECRETS_DIR"
  GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git clone "$SECRETS_REPO" "$SECRETS_DIR"
else
  echo "Secrets directory found: $SECRETS_DIR"
  git -C "$SECRETS_DIR" pull origin main
fi

# Check if flutter is installed, install if not
if ! command -v flutter &> /dev/null; then
    echo "Flutter not found, installing..."
    sudo apt-get update
    sudo apt-get install -y curl git unzip xz-utils zip
    # download flutter latest
    curl ???

    tar xf /tmp/flutter_linux_latest.tar.xz -C $HOME
    export PATH="$PATH:$HOME/flutter/bin"
    rm /tmp/flutter_linux_latest.tar.xz
fi

# Check dependencies versions
aws --version
cdk --version
flutter --version

#!
popd
echo "script [$0] completed"
