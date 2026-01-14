# Packaging Instructions

## Quick Start - Option 1: Simple Static Build (Recommended for Quick Sharing)

This is the easiest way to share your application.

### Steps:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Create a distribution package:**
   - Zip the `dist` folder
   - Include `run-server.sh` (for Mac/Linux) or `run-server.bat` (for Windows)
   - Include a `README_INSTALL.txt` file (see below)

3. **Share the zip file**

### For the recipient:

1. Extract the zip file
2. Open terminal/command prompt in the extracted folder
3. Run:
   - **Mac/Linux:** `./run-server.sh` or `bash run-server.sh`
   - **Windows:** `run-server.bat`
4. Open browser to `http://localhost:3000`

---

## Option 2: Electron Desktop App (Professional Distribution)

Creates a native desktop application installer.

### Prerequisites:

Install Electron dependencies first:
```bash
npm install --save-dev electron electron-builder
```

### Steps:

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Package for your platform:**
   ```bash
   # For current platform
   npm run package
   
   # Or for specific platforms:
   npm run package:mac    # macOS
   npm run package:win    # Windows
   npm run package:linux  # Linux
   ```

3. **Find the installer:**
   - The installers will be in the `dist-electron` folder
   - Share the appropriate installer for the recipient's OS

### For the recipient:

1. Download and run the installer
2. Install the application
3. Launch from Applications/Programs menu

---

## Which Option Should I Choose?

- **Option 1 (Static Build):** Best for quick sharing, testing, or when recipients have Node.js installed
- **Option 2 (Electron):** Best for professional distribution, end users without technical knowledge, or when you want a native app experience

---

## Troubleshooting

### Static Build Issues:

- **Port already in use:** Change the port: `./run-server.sh 8080`
- **No server found:** Install Python 3 or Node.js
- **Routing not working:** Make sure you're accessing via `http://localhost:PORT` not `file://`

### Electron Issues:

- **Build fails:** Make sure you've run `npm run build` first
- **App won't start:** Check that `dist` folder exists and contains `index.html`


