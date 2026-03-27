#!/usr/bin/env bash

set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This verification script only runs on macOS." >&2
  exit 1
fi

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/AppName.app" >&2
  exit 1
fi

app_path="$1"
code_resources="$app_path/Contents/_CodeSignature/CodeResources"

if [[ ! -d "$app_path" ]]; then
  echo "App bundle not found: $app_path" >&2
  exit 1
fi

if [[ ! -f "$code_resources" ]]; then
  echo "Missing bundle signature resources: $code_resources" >&2
  exit 1
fi

echo "Verifying macOS code signature for $app_path"
codesign --verify --deep --strict --verbose=2 "$app_path"
codesign -dv --verbose=2 "$app_path" 2>&1 | sed -n '1,20p'
