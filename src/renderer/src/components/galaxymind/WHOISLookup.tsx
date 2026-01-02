import React, { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './GalaxyTool.module.css';

interface WHOISData {
  domain: string;
  registrar?: string;
  created?: string;
  expires?: string;
  status?: string;
  nameservers?: string[];
}

const WHOISLookup: React.FC = () => {
  const { setActiveGalaxyTool, addToolResult } = useStore();
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<WHOISData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupWHOIS = async () => {
    if (!domain.trim()) {
      setError('Domain is required');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Use a public WHOIS API
      const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_FREE&domainName=${domain}&outputFormat=JSON`);
      
      if (!response.ok) {
        throw new Error('WHOIS lookup failed');
      }

      const result = await response.json();
      
      const whoisData: WHOISData = {
        domain: domain,
        registrar: result.WhoisRecord?.registrarName || 'N/A',
        created: result.WhoisRecord?.createdDate || 'N/A',
        expires: result.WhoisRecord?.expiresDate || 'N/A',
        status: result.WhoisRecord?.status || 'N/A',
        nameservers: result.WhoisRecord?.nameServers?.hostNames || [],
      };

      setData(whoisData);

      addToolResult({
        id: Date.now().toString(),
        toolName: 'WHOIS Lookup',
        timestamp: Date.now(),
        input: { domain },
        output: whoisData,
        success: true,
      });
    } catch (err: any) {
      setError(err.message || 'WHOIS lookup failed. Note: Free API has limited requests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.tool}>
      <div className={styles.toolHeader}>
        <button className={styles.backButton} onClick={() => setActiveGalaxyTool(null)}>
          ← Back
        </button>
        <h2 className={styles.toolTitle}>
          <span className={styles.toolIcon}>📋</span>
          WHOIS Lookup
        </h2>
      </div>

      <div className={styles.toolContent}>
        <div className={styles.requestSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Domain Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <button className={styles.sendButton} onClick={lookupWHOIS} disabled={loading}>
            {loading ? 'Looking up...' : 'Lookup WHOIS'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Looking up WHOIS data...</span>
          </div>
        )}

        {data && (
          <div className={styles.results}>
            <h3 className={styles.sectionTitle}>WHOIS Information</h3>
            <div className={styles.resultItem}>
              <strong style={{ color: '#00ffaa' }}>Domain:</strong>
              <span style={{ color: '#e0e0ff', marginLeft: '8px' }}>{data.domain}</span>
            </div>
            <div className={styles.resultItem}>
              <strong style={{ color: '#00ffaa' }}>Registrar:</strong>
              <span style={{ color: '#e0e0ff', marginLeft: '8px' }}>{data.registrar}</span>
            </div>
            <div className={styles.resultItem}>
              <strong style={{ color: '#00ffaa' }}>Created:</strong>
              <span style={{ color: '#e0e0ff', marginLeft: '8px' }}>{data.created}</span>
            </div>
            <div className={styles.resultItem}>
              <strong style={{ color: '#00ffaa' }}>Expires:</strong>
              <span style={{ color: '#e0e0ff', marginLeft: '8px' }}>{data.expires}</span>
            </div>
            <div className={styles.resultItem}>
              <strong style={{ color: '#00ffaa' }}>Status:</strong>
              <span style={{ color: '#e0e0ff', marginLeft: '8px' }}>{data.status}</span>
            </div>
            {data.nameservers && data.nameservers.length > 0 && (
              <div className={styles.resultItem}>
                <strong style={{ color: '#00ffaa' }}>Nameservers:</strong>
                <div style={{ marginTop: '8px' }}>
                  {data.nameservers.map((ns, index) => (
                    <div key={index} style={{ color: '#e0e0ff', fontFamily: 'var(--font-mono)', marginLeft: '8px' }}>
                      {ns}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WHOISLookup;
