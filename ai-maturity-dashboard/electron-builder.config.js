module.exports = {
  appId: 'com.amdocs.ai-maturity-dashboard',
  productName: 'AI Maturity Dashboard',
  directories: {
    output: 'dist-electron',
    buildResources: 'build',
  },
  files: [
    'dist/**/*',
    'electron/**/*',
    'package.json',
    '!node_modules/**/*',
  ],
  extraResources: [
    {
      from: 'dist',
      to: 'app/dist',
    },
  ],
  mac: {
    category: 'public.app-category.business',
    target: ['dmg', 'zip'],
    icon: 'build/icon.icns', // You can add custom icons later
  },
  win: {
    target: ['nsis', 'portable'],
    icon: 'build/icon.ico', // You can add custom icons later
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Office',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};

