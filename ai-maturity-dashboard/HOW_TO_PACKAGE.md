# How to Package and Share Your Application

## 🎯 Recommended Approach: Static Build (Easiest)

This is the simplest way to share your application. Perfect for quick demos and testing.

### Step-by-Step:

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with all the production files.

2. **Package for distribution:**
   ```bash
   ./package-for-distribution.sh
   ```
   This creates a zip file ready to share.

3. **Or manually create the package:**
   - Create a new folder (e.g., `ai-maturity-dashboard-package`)
   - Copy the `dist` folder into it
   - Copy `run-server.sh` and `run-server.bat` into it
   - Copy `README_INSTALL.txt` into it
   - Zip the folder

4. **Share the zip file!**

### What the recipient needs to do:

1. Extract the zip file
2. Open terminal/command prompt in the extracted folder
3. Run:
   - **Mac/Linux:** `./run-server.sh` or `bash run-server.sh`
   - **Windows:** `run-server.bat`
4. Open browser to `http://localhost:3000`

**Requirements for recipient:** Node.js OR Python 3 (most computers have one of these)

---

## 💼 Professional Option: Electron Desktop App

Creates a native desktop application with an installer. Best for professional distribution.

### First-time setup:

1. **Install Electron dependencies:**
   ```bash
   npm install --save-dev electron electron-builder
   ```

### Packaging:

1. **Build and package:**
   ```bash
   npm run package
   ```
   
   Or for specific platforms:
   ```bash
   npm run package:mac    # macOS (.dmg)
   npm run package:win    # Windows (.exe installer)
   npm run package:linux  # Linux (.AppImage, .deb)
   ```

2. **Find the installer:**
   - Look in the `dist-electron` folder
   - Share the appropriate installer for the recipient's operating system

### What the recipient needs to do:

1. Download and run the installer
2. Install the application
3. Launch from Applications/Programs menu

**Requirements for recipient:** None! It's a native app.

---

## 📊 Comparison

| Feature | Static Build | Electron |
|---------|-------------|----------|
| **Setup Time** | ⚡ Instant | 🔧 5 minutes |
| **File Size** | 📦 Small (~5MB) | 💾 Larger (~100MB) |
| **Recipient Needs** | Node.js or Python | Nothing |
| **User Experience** | Browser-based | Native app |
| **Best For** | Quick sharing, demos | Professional distribution |

---

## 🚨 Important Notes

1. **Always test the build first:**
   ```bash
   npm run build
   npm run preview
   ```
   Visit `http://localhost:4173` to verify everything works.

2. **For Electron:** Make sure you've built the web app first (`npm run build`) before packaging.

3. **Routing:** The app uses React Router, so it needs to be served via HTTP (not opened as a file). The server scripts handle this automatically.

---

## 🆘 Troubleshooting

### Build fails:
- Check for TypeScript errors: `npm run lint`
- Make sure all dependencies are installed: `npm install`

### Server won't start:
- Try a different port: `./run-server.sh 8080`
- Make sure port isn't already in use
- Check that `dist` folder exists

### Electron packaging fails:
- Make sure you've run `npm run build` first
- Check that `dist` folder contains `index.html`
- Try building for your current platform first: `npm run package`

---

## 📝 Quick Reference

```bash
# Build only
npm run build

# Test the build
npm run preview

# Package for static distribution
./package-for-distribution.sh

# Package as Electron app (after installing electron)
npm install --save-dev electron electron-builder
npm run package
```

---

**Need help?** Check `README_PACKAGING.md` for more detailed instructions.


