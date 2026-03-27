#!/usr/bin/env bash

set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script only runs on macOS." >&2
  exit 1
fi

developer_id_identity=$(
  security find-identity -v -p codesigning 2>/dev/null \
    | sed -n 's/.*"\\(Developer ID Application:.*\\)"/\\1/p' \
    | head -n 1
)

apple_development_identity=$(
  security find-identity -v -p codesigning 2>/dev/null \
    | sed -n 's/.*"\\(Apple Development:.*\\)"/\\1/p' \
    | head -n 1
)

echo "macOS distribution preflight"
echo

if [[ -n "$developer_id_identity" ]]; then
  echo "Developer ID certificate found:"
  echo "  $developer_id_identity"
else
  echo "Developer ID certificate not found."
fi

if [[ -n "$apple_development_identity" ]]; then
  echo "Apple Development certificate found:"
  echo "  $apple_development_identity"
fi

if xcrun notarytool --help >/dev/null 2>&1; then
  echo "notarytool is available."
else
  echo "notarytool is not available."
fi

if [[ -z "$developer_id_identity" ]]; then
  echo
  echo "Next step: create and install a 'Developer ID Application' certificate,"
  echo "then export it as a password-protected .p12 for GitHub Actions."
  exit 1
fi
