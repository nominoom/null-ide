# Null IDE – The Ultimate Hacker's Code Editor & Security Toolkit

<div align="center">

**🔥 Cross-Platform IDE with 49+ Security Tools + Discord RPC 🔥**

[![Version](https://img.shields.io/badge/version-3.2.7-00ffaa.svg)](https://github.com/4fqr/null-ide/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey.svg)]()
[![Electron](https://img.shields.io/badge/electron-28.3.3-47848f.svg)](https://www.electronjs.org/)

</div>

---

## 🚀 Overview

**Null IDE** is a powerful, feature-rich code editor built specifically for security researchers, penetration testers, and developers who need integrated hacking tools alongside their development environment.

### Why Null IDE?

- **🛠️ 49+ Security Tools** - From port scanners to XSS detectors, all in one place
- **💻 Full-Featured IDE** - Monaco Editor (VSCode engine) with 50+ language support  
- **🔌 Dual Mode** - Switch between Code Mode (development) & Utility Mode (security tools)
- **🤖 AI Assistant** - Integrated DeepHat AI for code help
- **🎮 Discord RPC** - Show your activity in Discord
- **⚡ Fast & Responsive** - Built with Electron, React, TypeScript

---

## 📥 Installation

### Windows

Download `Null-IDE-Installer.exe` from [Releases](https://github.com/4fqr/null-ide/releases)

```cmd
Null-IDE-Installer.exe
```

### Linux

**AppImage (Universal)**
```bash
wget https://github.com/4fqr/null-ide/releases/latest/download/Null-IDE-3.2.7.AppImage
chmod +x Null-IDE-3.2.7.AppImage
./Null-IDE-3.2.7.AppImage
```

**Debian/Ubuntu**
```bash
wget https://github.com/4fqr/null-ide/releases/latest/download/null-ide_3.2.7_amd64.deb
sudo dpkg -i null-ide_3.2.7_amd64.deb
sudo apt-get install -f
null-ide
```

**Fedora/RHEL**
```bash
wget https://github.com/4fqr/null-ide/releases/latest/download/null-ide-3.2.7.x86_64.rpm
sudo rpm -i null-ide-3.2.7.x86_64.rpm
null-ide
```

---

## 🛠️ 49+ Security Tools

### Network Security
- Port Scanner, DNS Analyzer, WHOIS Lookup, Subdomain Finder
- Uptime Checker, IP Geolocation, Traceroute, Reverse DNS

### Web Security
- XSS Detector, SQL Injection Tester, Command Injection Tester
- SSRF Tester, Directory Fuzzer, LFI Scanner, CORS Tester
- XXE Tester, SSTI Detector, OAuth Tester, Header Analyzer
- File Upload Tester, HTTP Smuggling, Packet Analyzer

### Crypto & Encoding
- Hash Calculator (MD5, SHA-1, SHA-256, SHA-512)
- Base64, JWT Decoder, URL Encoder/Decoder
- Hex Converter, Caesar Cipher, ROT13

### Developer Utilities
- UUID Generator, Timestamp Converter, JSON Formatter
- Regex Tester, Code Obfuscator, Color Picker
- Lorem Ipsum, Diff Checker, SSL Certificate Viewer

---

## 🔧 Building from Source

### Prerequisites
- Node.js 18+
- npm
- Git

### Setup
```bash
git clone https://github.com/4fqr/null-ide.git
cd null-ide
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
# Build for current platform
npm run build
npm run package

# Linux-specific
npm run build:linux:appimage  # AppImage
npm run build:linux:deb       # Debian
npm run build:linux:rpm       # RPM
```

---

## 🎮 Discord Rich Presence

### Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Use application ID: `1459478156120428606`
3. Upload assets to **Rich Presence** → **Art Assets**:
   - `nullide` - Main logo (512x512)
   - `code` - Coding icon (512x512)
   - `idle` - Idle icon (512x512)
4. Restart Null IDE

RPC will show:
- Current file being edited
- "Hacking & Programming" when idle
- Auto-updates on file changes

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save File | `Ctrl+S` |
| Close Tab | `Ctrl+W` |
| Close All | `Ctrl+Shift+W` |
| Next Tab | `Ctrl+Tab` |
| Previous Tab | `Ctrl+Shift+Tab` |
| Toggle Left Sidebar | `Ctrl+B` |
| Toggle Right Sidebar | `Ctrl+Shift+B` |
| Toggle Terminal | `` Ctrl+` `` |
| Settings | `Ctrl+,` |

---

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript 5, Monaco Editor, Zustand, XTerm.js
- **Backend**: Electron 28.3.3, Node.js, discord-rpc 4.0.1
- **Build**: Vite 5, electron-builder 24

---

## 🐛 Troubleshooting

### Terminal Won't Resize Down
**Fixed in v3.2.8!** Now resizes down to 50px minimum.

### Discord RPC Not Showing
1. Make sure Discord is running
2. Upload 3 assets (`nullide`, `code`, `idle`)
3. Restart Null IDE

### Resize Handles Hard to Grab
v3.2.7+ has invisible 25-30px wide handles:
- **Terminal**: Top edge
- **Right Sidebar**: Left edge (30px area)

---

## 📜 License

MIT License - Copyright (c) 2026 NullSec

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit Pull Request

---

<div align="center">

Made with 💀 by [NullSec](https://github.com/4fqr)

[⬆ Back to Top](#null-ide--the-ultimate-hackers-code-editor--security-toolkit)

</div>
