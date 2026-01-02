import React, { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './ToolsPanel.module.css';

const ProgrammerUtilities: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['forensics']);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { tabs, activeTabId, updateTabContent } = useStore();

  const getEditorContent = () => {
    const tab = activeTabId ? tabs.find(t => t.id === activeTabId) : null;
    return tab?.content || output || '';
  };

  const insertToEditor = (text: string) => {
    if (activeTabId) {
      const tab = tabs.find(t => t.id === activeTabId);
      if (tab) {
        updateTabContent(tab.id, text);
      }
    } else {
      setOutput(text);
    }
  };

  const runTool = async (toolName: string, action: () => Promise<string> | string) => {
    setLoading(true);
    const input = getEditorContent();
    setOutput(`[${toolName}]\nProcessing: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}\n\n`);
    try {
      const result = await action();
      insertToEditor(`[${toolName}]\n\n${result}`);
      setOutput(`[${toolName}]\n\n${result}`);
    } catch (error) {
      const msg = `[${toolName}]\nError: ${error}`;
      setOutput(msg);
      insertToEditor(msg);
    }
    setLoading(false);
  };

  const categories = [
    {
      name: 'Digital Forensics',
      icon: '🔬',
      tools: [
        {
          id: 'hex-viewer',
          name: 'Hex/ASCII Viewer',
          description: 'View text in hex and ASCII format',
          action: () => runTool('Hex Viewer', () => {
            const text = getEditorContent().trim() || 'Hello World!';
            let result = 'OFFSET  HEX                                              ASCII\n';
            result += '━'.repeat(70) + '\n';
            
            for (let i = 0; i < text.length; i += 16) {
              const chunk = text.slice(i, i + 16);
              const offset = i.toString(16).padStart(6, '0').toUpperCase();
              const hex = Array.from(chunk)
                .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(' ');
              const ascii = chunk.replace(/[^\x20-\x7E]/g, '.');
              result += `${offset}  ${hex.padEnd(48)}  ${ascii}\n`;
            }
            return result;
          }),
        },
        {
          id: 'strings-extract',
          name: 'String Extractor',
          description: 'Extract readable strings (4+ chars)',
          action: () => runTool('String Extractor', () => {
            const text = getEditorContent().trim() || 'abc\x00\x01def\x02test123\x00hidden';
            const strings = text.match(/[\x20-\x7E]{4,}/g) || [];
            return `Found ${strings.length} strings:\n\n` + strings.join('\n');
          }),
        },
        {
          id: 'file-signature',
          name: 'File Signature Analyzer',
          description: 'Detect file type from magic bytes',
          action: () => runTool('File Signature', () => {
            const signatures: Record<string, string> = {
              '89504E47': 'PNG Image',
              'FFD8FFE0': 'JPEG Image',
              '25504446': 'PDF Document',
              '504B0304': 'ZIP Archive',
              '7F454C46': 'ELF Executable',
              '4D5A9000': 'Windows PE Executable',
              '1F8B0800': 'GZIP Archive',
              '526172211A': 'RAR Archive',
              'D0CF11E0': 'Microsoft Office Document',
              '47494638': 'GIF Image',
            };
            
            const hex = getEditorContent().trim().toUpperCase().replace(/[^0-9A-F]/g, '');
            let result = 'File Signature Analysis\n\n';
            
            if (hex.length < 8) {
              return 'Input hex bytes in output (e.g., 89504E47)';
            }
            
            result += `Input: ${hex.substring(0, 16)}\n\n`;
            let found = false;
            
            for (const [sig, type] of Object.entries(signatures)) {
              if (hex.startsWith(sig)) {
                result += `✓ Detected: ${type}\n`;
                result += `  Signature: ${sig}\n`;
                found = true;
                break;
              }
            }
            
            if (!found) {
              result += '✗ Unknown file signature\n';
            }
            
            return result;
          }),
        },
      ],
    },
    {
      name: 'Network Analysis',
      icon: '📡',
      tools: [
        {
          id: 'ip-info',
          name: 'IP Address Analyzer',
          description: 'Analyze IP addresses and CIDR ranges',
          action: () => runTool('IP Analyzer', () => {
            const ip = getEditorContent().trim() || '192.168.1.100/24';
            const [addr, cidr] = ip.split('/');
            const octets = addr.split('.').map(Number);
            
            if (octets.length !== 4 || octets.some(o => o < 0 || o > 255)) {
              return 'Invalid IP address';
            }
            
            let result = `IP Address: ${addr}\n\n`;
            
            // IP Class
            if (octets[0] < 128) result += `Class: A (1.0.0.0 - 126.255.255.255)\n`;
            else if (octets[0] < 192) result += `Class: B (128.0.0.0 - 191.255.255.255)\n`;
            else if (octets[0] < 224) result += `Class: C (192.0.0.0 - 223.255.255.255)\n`;
            else result += `Class: D/E (Multicast/Reserved)\n`;
            
            // Private/Public
            const isPrivate = 
              (octets[0] === 10) ||
              (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
              (octets[0] === 192 && octets[1] === 168);
            result += `Type: ${isPrivate ? 'Private' : 'Public'}\n`;
            
            // CIDR
            if (cidr) {
              const mask = parseInt(cidr);
              const hosts = Math.pow(2, 32 - mask) - 2;
              result += `\nCIDR: /${mask}\n`;
              result += `Subnet Mask: ${Array(4).fill(0).map((_, i) => {
                const bits = Math.max(0, Math.min(8, mask - i * 8));
                return 256 - Math.pow(2, 8 - bits);
              }).join('.')}\n`;
              result += `Usable Hosts: ${hosts}\n`;
            }
            
            // Binary
            result += `\nBinary: ${octets.map(o => o.toString(2).padStart(8, '0')).join('.')}\n`;
            result += `Hex: ${octets.map(o => o.toString(16).padStart(2, '0')).join('.')}\n`;
            
            return result;
          }),
        },
        {
          id: 'http-parser',
          name: 'HTTP Request Parser',
          description: 'Parse HTTP requests and responses',
          action: () => runTool('HTTP Parser', () => {
            const http = getEditorContent().trim() || 'GET /index.php?id=1 HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0\nCookie: session=abc123';
            
            const lines = http.split('\n');
            const [method, path, version] = (lines[0] || '').split(' ');
            
            let result = `HTTP Request Analysis\n\n`;
            result += `Method: ${method}\n`;
            result += `Path: ${path}\n`;
            result += `Version: ${version}\n\n`;
            
            result += `Headers:\n`;
            for (let i = 1; i < lines.length; i++) {
              const [key, ...value] = lines[i].split(':');
              if (key && value.length) {
                result += `  ${key.trim()}: ${value.join(':').trim()}\n`;
              }
            }
            
            // Parse query params
            const queryMatch = path?.match(/\?(.+)/);
            if (queryMatch) {
              result += `\nQuery Parameters:\n`;
              const params = queryMatch[1].split('&');
              params.forEach(p => {
                const [k, v] = p.split('=');
                result += `  ${k} = ${v}\n`;
              });
            }
            
            return result;
          }),
        },
        {
          id: 'user-agent-parse',
          name: 'User-Agent Parser',
          description: 'Parse and analyze User-Agent strings',
          action: () => runTool('User-Agent Parser', () => {
            const ua = getEditorContent().trim() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            
            let result = `User-Agent Analysis\n\n`;
            result += `Full String:\n${ua}\n\n`;
            
            // Browser
            if (ua.includes('Chrome')) result += `Browser: Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1]}\n`;
            else if (ua.includes('Firefox')) result += `Browser: Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1]}\n`;
            else if (ua.includes('Safari')) result += `Browser: Safari ${ua.match(/Version\/([\d.]+)/)?.[1]}\n`;
            else result += `Browser: Unknown\n`;
            
            // OS
            if (ua.includes('Windows NT 10')) result += `OS: Windows 10/11\n`;
            else if (ua.includes('Windows NT 6')) result += `OS: Windows 7/8\n`;
            else if (ua.includes('Mac OS X')) result += `OS: macOS ${ua.match(/Mac OS X ([\d_]+)/)?.[1].replace(/_/g, '.')}\n`;
            else if (ua.includes('Linux')) result += `OS: Linux\n`;
            else if (ua.includes('Android')) result += `OS: Android ${ua.match(/Android ([\d.]+)/)?.[1]}\n`;
            else result += `OS: Unknown\n`;
            
            // Device
            if (ua.includes('Mobile') || ua.includes('Android')) result += `Device: Mobile\n`;
            else result += `Device: Desktop\n`;
            
            // Architecture
            if (ua.includes('Win64') || ua.includes('x86_64')) result += `Arch: 64-bit\n`;
            else result += `Arch: 32-bit\n`;
            
            return result;
          }),
        },
      ],
    },
    {
      name: 'Code Analysis',
      icon: '🔍',
      tools: [
        {
          id: 'regex-tester',
          name: 'Regex Pattern Tester',
          description: 'Test regex patterns with highlighting',
          action: () => runTool('Regex Tester', () => {
            const lines = getEditorContent().trim().split('\n');
            const pattern = lines[0] || '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b';
            const text = lines.slice(1).join('\n') || 'test@example.com, invalid.email, admin@site.org';
            
            try {
              const regex = new RegExp(pattern, 'g');
              const matches = Array.from(text.matchAll(regex));
              
              let result = `Pattern: ${pattern}\n`;
              result += `Flags: g (global)\n\n`;
              result += `Matches Found: ${matches.length}\n\n`;
              
              if (matches.length > 0) {
                matches.forEach((match, i) => {
                  result += `[${i + 1}] "${match[0]}" at index ${match.index}\n`;
                });
              } else {
                result += 'No matches found\n';
              }
              
              return result;
            } catch (e: any) {
              return `Regex Error: ${e.message}`;
            }
          }),
        },
        {
          id: 'jwt-analyzer',
          name: 'JWT Security Analyzer',
          description: 'Analyze JWT token security',
          action: () => runTool('JWT Security', () => {
            const jwt = getEditorContent().trim() || 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.';
            
            try {
              const parts = jwt.split('.');
              if (parts.length !== 3) return 'Invalid JWT format';
              
              const header = JSON.parse(atob(parts[0]));
              const payload = JSON.parse(atob(parts[1]));
              
              let result = `JWT Security Analysis\n\n`;
              
              // Algorithm check
              result += `[Algorithm]\n`;
              if (header.alg === 'none') {
                result += `⚠️  CRITICAL: Algorithm is "none" (no signature!)\n`;
              } else if (header.alg?.startsWith('HS')) {
                result += `✓ Symmetric: ${header.alg}\n`;
              } else if (header.alg?.startsWith('RS')) {
                result += `✓ Asymmetric: ${header.alg}\n`;
              }
              
              // Expiration check
              result += `\n[Expiration]\n`;
              if (payload.exp) {
                const exp = new Date(payload.exp * 1000);
                const now = new Date();
                result += `Expires: ${exp.toISOString()}\n`;
                result += exp < now ? '⚠️  EXPIRED\n' : '✓ Valid\n';
              } else {
                result += `⚠️  No expiration set\n`;
              }
              
              // Claims
              result += `\n[Claims]\n`;
              Object.entries(payload).forEach(([k, v]) => {
                result += `${k}: ${JSON.stringify(v)}\n`;
              });
              
              return result;
            } catch {
              return 'Invalid JWT token';
            }
          }),
        },
        {
          id: 'unicode-analyzer',
          name: 'Unicode/Encoding Analyzer',
          description: 'Analyze character encodings and Unicode',
          action: () => runTool('Unicode Analyzer', () => {
            const text = getEditorContent().trim() || '©2024 Test™ 你好';
            
            let result = `Text: ${text}\n\n`;
            result += `Length: ${text.length} characters\n`;
            result += `Bytes (UTF-8): ${new Blob([text]).size}\n\n`;
            
            result += `Character Analysis:\n`;
            Array.from(text).slice(0, 20).forEach((char, i) => {
              const code = char.charCodeAt(0);
              result += `[${i}] '${char}' → U+${code.toString(16).toUpperCase().padStart(4, '0')} (${code})\n`;
            });
            
            return result;
          }),
        },
      ],
    },
    {
      name: 'Deobfuscation',
      icon: '🔓',
      tools: [
        {
          id: 'js-beautify',
          name: 'JavaScript Beautifier',
          description: 'Format and beautify minified JS',
          action: () => runTool('JS Beautify', () => {
            const js = getEditorContent().trim() || 'function test(){var a=1;if(a>0){console.log("test");}}';
            
            // Simple beautification
            let result = js
              .replace(/([{;])/g, '$1\n')
              .replace(/([}])/g, '\n$1\n')
              .replace(/\n\s*\n/g, '\n');
            
            // Add indentation
            const lines = result.split('\n');
            let indent = 0;
            result = lines.map(line => {
              const trimmed = line.trim();
              if (trimmed.startsWith('}')) indent--;
              const formatted = '  '.repeat(Math.max(0, indent)) + trimmed;
              if (trimmed.endsWith('{')) indent++;
              return formatted;
            }).join('\n');
            
            return result;
          }),
        },
        {
          id: 'decode-all',
          name: 'Multi-Decoder',
          description: 'Decode Base64, URL, HTML, Hex',
          action: () => runTool('Multi-Decoder', () => {
            const text = getEditorContent().trim() || 'SGVsbG8lMjBXb3JsZCE%3D';
            let result = `Input: ${text}\n\n`;
            
            // Base64
            try {
              result += `Base64 Decode:\n${atob(text)}\n\n`;
            } catch {
              result += `Base64 Decode: [Invalid]\n\n`;
            }
            
            // URL Decode
            try {
              result += `URL Decode:\n${decodeURIComponent(text)}\n\n`;
            } catch {
              result += `URL Decode: [Invalid]\n\n`;
            }
            
            // Hex to String
            try {
              const hex = text.replace(/[^0-9a-f]/gi, '');
              if (hex.length % 2 === 0) {
                const str = hex.match(/.{2}/g)?.map(h => String.fromCharCode(parseInt(h, 16))).join('');
                result += `Hex Decode:\n${str}\n\n`;
              }
            } catch {}
            
            return result;
          }),
        },
      ],
    },
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className={styles.toolsPanel}>
      <div className={styles.header}>
        <h2>⚡ Analysis & Forensics Toolkit</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.categories}>
          {categories.map((category) => (
            <div key={category.name} className={styles.category}>
              <div
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category.name)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryToggle}>
                  {expandedCategories.includes(category.name) ? '▼' : '▶'}
                </span>
              </div>

              {expandedCategories.includes(category.name) && (
                <div className={styles.tools}>
                  {category.tools.map((tool) => (
                    <button
                      key={tool.id}
                      className={styles.tool}
                      onClick={tool.action}
                      disabled={loading}
                    >
                      <div className={styles.toolName}>{tool.name}</div>
                      <div className={styles.toolDesc}>{tool.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <span>Output</span>
            <button
              className={styles.clearBtn}
              onClick={() => setOutput('')}
            >
              Clear
            </button>
          </div>
          <pre className={styles.outputContent}>{output || 'Tool output will appear here...'}</pre>
        </div>
      </div>
    </div>
  );
};

export default ProgrammerUtilities;



