# EasyScrcpy

A lightweight desktop GUI for scrcpy. Mirror Android tablets without touching the command line.

Built with Tauri for minimal footprint (~15MB) and fast startup. Bundles scrcpy and ADB—no additional dependencies required.

## Requirements

- **Computer:** Windows 10/11 or macOS 11+ (Intel/Apple Silicon)
- **Tablet:** Android 8.0+ with USB debugging enabled
- **Cable:** USB connection to computer

Audio forwarding requires Android 11+. Older devices mirror silently.

## Installation

Download the latest release for your platform:

- **Windows:** `EasyScrcpy_0.1.0_x64-setup.exe`
- **macOS:** `EasyScrcpy_0.1.0_universal.dmg`

Install and run. No additional setup needed.

## Quick Start

1. **Enable USB debugging** on your Android tablet:
   - Settings > About tablet > Tap "Build number" 7 times
   - Settings > Developer options > Enable "USB debugging"

2. **Connect** the tablet to your computer via USB

3. **Allow** the USB debugging prompt on the tablet

4. **Launch** EasyScrcpy and click "Start" on your device

The mirror window opens with touch indicators enabled. Multiple devices can run simultaneously.

## Development

**Prerequisites:**
- [Bun](https://bun.sh/) or Node.js
- [Rust](https://rustup.rs/)
- [Tauri CLI](https://tauri.app/start/prerequisites/)

**Setup:**
```bash
bun install
```

**Run in development mode:**
```bash
bun tauri dev
```

**Build release:**
```bash
bun tauri build
```

Output binaries are in `src-tauri/target/release/bundle/`.

## Architecture

- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Rust (Tauri 2.x)
- **State:** Zustand
- **Bundled binaries:** scrcpy + ADB per platform

## License

Apache 2.0
