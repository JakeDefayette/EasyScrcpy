# macOS Distribution Setup

EasyScrcpy can ship a valid ad-hoc signed macOS app today, but to remove the
Gatekeeper warning for downloaded releases you need both:

1. A `Developer ID Application` certificate
2. Apple notarization during the GitHub release workflow

## What You Need

- Active Apple Developer Program membership
- A `Developer ID Application` certificate installed in Keychain
- An Apple ID app-specific password for notarization

## Current Local Status

Run:

```bash
bash scripts/check-macos-distribution-prereqs.sh
```

If you only see `Apple Development`, that is not enough for public downloads.

## Create The Correct Certificate

1. Open Apple Developer and create a `Developer ID Application` certificate.
2. Install it into your login keychain.
3. Verify it exists:

```bash
security find-identity -v -p codesigning | grep "Developer ID Application"
```

The identity string should look like:

```text
Developer ID Application: Your Name (TEAMID)
```

## Export For GitHub Actions

Export the `Developer ID Application` certificate from Keychain Access as a
password-protected `.p12` file, then base64-encode it:

```bash
base64 -i /path/to/developer-id.p12 | pbcopy
```

## GitHub Secrets

Add these repository secrets:

- `APPLE_CERTIFICATE`: base64-encoded `.p12`
- `APPLE_CERTIFICATE_PASSWORD`: the password used for the `.p12`
- `APPLE_SIGNING_IDENTITY`: the full `Developer ID Application: ...` string
- `APPLE_ID`: your Apple ID email
- `APPLE_PASSWORD`: an app-specific password from appleid.apple.com
- `APPLE_TEAM_ID`: your Apple Developer team ID

## What The Workflow Does

Once those secrets exist, the release workflow will:

1. Import your certificate
2. Sign the macOS app with `Developer ID Application`
3. Submit it for notarization
4. Staple the notarization ticket
5. Validate the stapled app and DMG in CI

Without those secrets, the workflow falls back to ad-hoc signing so macOS
artifacts are still structurally valid, but users will still see the Apple
verification warning.
