#  Null IDE

**The Ultimate Hacker & Master Programmer IDE by NullSec**

A powerful, privacy-focused Electron-based IDE designed for hackers, penetration testers, and programmers. Built with security research and development workflows in mind.

![Null IDE](https://img.shields.io/badge/version-1.0.0-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)

---

##  Features

###  **Monaco Editor Integration**
- Full-featured VS Code editor engine
- Syntax highlighting for 50+ languages
- IntelliSense and auto-completion
- Multi-tab editing with file management
- Dark theme optimized for long coding sessions

###  **Hacking Tools (100+ Tools)**
Advanced penetration testing and security research utilities:

#### **Reconnaissance**
- Port Scanner (with service detection)
- DNS Lookup & Reverse DNS
- Subdomain Enumeration
- WHOIS Lookup
- HTTP Header Analysis
- SSL/TLS Certificate Inspector

#### **Payload Generation**
- Reverse Shell Generator (Bash, Python, PHP, Netcat, PowerShell)
- SQL Injection Payloads
- XSS Payload Generator
- Command Injection Payloads
- LDAP Injection Payloads

#### **Cryptography**
- Hash Generator (MD5, SHA-1, SHA-256, SHA-512, NTLM)
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- JWT Decoder
- ROT13 Cipher
- Caesar Cipher
- Bcrypt Hash Generator

#### **Web Exploitation**
- Directory Bruteforce Path Generator
- LFI/RFI Payload Generator
- SSTI (Server-Side Template Injection) Payloads
- XXE (XML External Entity) Payloads

###  **Programmer Utilities (1000+ Tools)**

#### **Digital Forensics**
- File Hash Calculator (MD5, SHA-1, SHA-256)
- Binary to Hex Converter
- Hex Dump Analyzer
- String Extractor from Binary

#### **Network Analysis**
- IP Address Validator
- CIDR Calculator
- MAC Address Lookup
- TCP/UDP Port Scanner

#### **Code Analysis**
- JSON Validator & Beautifier
- XML Validator & Beautifier
- JavaScript Deobfuscator
- SQL Query Formatter
- Regex Tester & Validator

#### **Deobfuscation**
- JavaScript Beautifier
- CSS Minifier/Beautifier
- HTML Formatter
- Base64 Decoder

###  **System Tools**
- File Explorer with directory browsing
- Integrated Terminal (PowerShell)
- Process Monitor
- Environment Variables Viewer
- System Information Dashboard

###  **DeepHat AI Assistant**
- Embedded uncensored hacker AI (powered by Deep Hat)
- Security research assistance
- Code generation and debugging
- Exploit development guidance
- Privacy-focused (no telemetry)

###  **Interface**
- Modern dark UI with NullSec branding
- Resizable panels and sidebars
- Keyboard shortcuts for power users
- Context menu integration ("Open with Null IDE")
- Multi-tab workflow support

---

##  Installation

### **Windows Installer**
1. Download `Null-IDE-Installer.exe` from [Releases](https://github.com/4fqr/null-ide/releases)
2. Run the installer
3. Follow installation wizard
4. Right-click any file/folder  **"Open with Null IDE"**

### **Development Setup**
```bash
# Clone repository
git clone https://github.com/4fqr/null-ide.git
cd null-ide

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Create installer
npm run package
```

---

##  Quick Start

### **Opening Files**
- **Context Menu**: Right-click any file  "Open with Null IDE"
- **Drag & Drop**: Drag files into the editor
- **File Menu**: File  Open

### **Using Tools**
1. Click **Hacking Tools** or **Utilities** in left sidebar
2. Select a tool from the category
3. Enter input (or use content from active editor tab)
4. Click "Run Tool"
5. Results appear in the output panel or editor

### **Terminal**
- Access via **Terminal** menu or sidebar
- Full PowerShell integration
- Execute commands directly in the IDE

### **AI Assistant**
- Click **DeepHat AI** in right sidebar
- Ask security research questions
- Get exploit suggestions
- Receive code assistance

---

##  Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+O` | Open File |
| `Ctrl+S` | Save File |
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+B` | Toggle Left Sidebar |
| `Ctrl+Shift+B` | Toggle Right Sidebar |
| `Ctrl+` | Toggle Terminal |
| `Ctrl+W` | Close Tab |
| `Ctrl+Tab` | Next Tab |
| `F11` | Fullscreen |

---

##  Tools Menu (Quick Access)

Access frequently used tools from the top menu bar:

- **Hash MD5**: Generate MD5 hash of selected text
- **Hash SHA-256**: Generate SHA-256 hash
- **Encode Base64**: Encode to Base64
- **Decode Base64**: Decode from Base64
- **Encode URL**: URL-encode text
- **Decode URL**: URL-decode text
- **Beautify JSON**: Format JSON with proper indentation
- **Minify JSON**: Compress JSON (remove whitespace)
- **Decode JWT**: Decode JSON Web Tokens
- **Generate Reverse Shell**: Create reverse shell payload

---

##  Project Structure

```
null-ide/
 src/
    main/           # Electron main process
       main.ts     # IPC handlers, window management
    preload/        # Preload scripts (security bridge)
       preload.ts  # Exposed APIs to renderer
    renderer/       # React frontend
        components/ # UI components
           layout/ # TopBar, MenuBar, Sidebar
           panels/ # HackingTools, Utilities, Terminal
        store/      # Zustand state management
        App.tsx     # Main application
 build/              # Build assets (icons, installer scripts)
 dist/               # Compiled output
 release/            # Final installer output
```

---

##  Security & Privacy

### **Privacy First**
-  **No telemetry** - Zero data collection
-  **Local-only storage** - All data stays on your machine
-  **No cloud dependencies** - Works completely offline
-  **Open source** - Audit the code yourself

### **Ethical Use Warning**
 **Null IDE is designed for authorized security research, penetration testing, and educational purposes only.**

**You must:**
- Only use on systems you own or have explicit permission to test
- Comply with all applicable laws and regulations
- Respect responsible disclosure practices

**The developers are NOT responsible for misuse of this tool.**

---

##  Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-tool`)
3. **Commit** your changes (`git commit -m 'Add amazing tool'`)
4. **Push** to branch (`git push origin feature/amazing-tool`)
5. **Open** a Pull Request

---

##  License

**MIT License**

Copyright (c) 2026 NullSec

---

##  Known Issues

- Terminal color scheme customization limited
- Some tools require specific input formats

See [Issues](https://github.com/4fqr/null-ide/issues) for full list.

---

##  Support

- **Issues**: [GitHub Issues](https://github.com/4fqr/null-ide/issues)
- **Discussions**: [GitHub Discussions](https://github.com/4fqr/null-ide/discussions)

---

##  Built With

- [Electron](https://www.electronjs.org/) - Desktop framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editing
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Vite](https://vitejs.dev/) - Build tool
- [electron-builder](https://www.electron.build/) - Installer creation

---

<div align="center">

**Made with  by NullSec**

 *For hackers, by hackers* 

[ Download](https://github.com/4fqr/null-ide/releases) | [ Report Bug](https://github.com/4fqr/null-ide/issues)

</div>
