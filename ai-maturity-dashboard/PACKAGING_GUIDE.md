# Packaging Guide for AI Maturity Dashboard

This guide provides two options for packaging and distributing your application.

## Option 1: Electron Desktop App (Recommended for Professional Distribution)

Creates a native desktop application that works on Windows, macOS, and Linux.

### Setup

1. Install Electron dependencies:
```bash
npm install --save-dev electron electron-builder @electron/remote
```

2. Build the web app:
```bash
npm run build
```

3. Package the Electron app:
```bash
npm run package
```

4. The installers will be in the `dist-electron` folder.

### Benefits
- ✅ Native desktop app experience
- ✅ Works offline
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Professional installer packages
- ✅ No need for users to have Node.js installed

---

## Option 2: Simple Static Build (Easiest to Share)

Creates a standalone folder that can be run with a simple server.

### Setup

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist` folder.

3. Share the `dist` folder along with the `run-server.sh` (or `run-server.bat` for Windows) script.

### Benefits
- ✅ Simple and lightweight
- ✅ No additional dependencies needed
- ✅ Works on any platform with Node.js
- ✅ Easy to share via zip file

---

## Quick Start

Choose one of the options above and follow the setup instructions. Both will create distributable packages.


