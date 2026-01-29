#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$DIR/.."

echo "Building Next.js application..."
pushd compass_next
npm install
npm run build
popd

echo "Packaging with OpenNext..."
pushd compass_next
npx open-next build
popd

echo "Creating Lambda deployment package..."
cd .open-next
zip -r ../server-function.zip . > /dev/null 2>&1 || true
cd ..

echo "Build complete!"
popd
