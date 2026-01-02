import React, { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './GalaxyTool.module.css';

interface DNSRecord {
  type: string;
  value: string;
}

const DNSAnalyzer: React.FC = () => {
  const { setActiveGalaxyTool, addToolResult } = useStore();
  const [domain, setDomain] = useState('');
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDNS = async () => {
    if (!domain.trim()) {
      setError('Domain is required');
      return;
    }

    setLoading(true);
    setError(null);
    setRecords([]);

    try {
      // Use public DNS APIs for lookup
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await response.json();

      const dnsRecords: DNSRecord[] = [];

      if (data.Answer) {
        data.Answer.forEach((answer: { type: number; data: string }) => {
          dnsRecords.push({
            type: getRecordType(answer.type),
            value: answer.data,
          });
        });
      }

      setRecords(dnsRecords);

      addToolResult({
        id: Date.now().toString(),
        toolName: 'DNS Analyzer',
        timestamp: Date.now(),
        input: { domain },
        output: dnsRecords,
        success: true,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'DNS lookup failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRecordType = (type: number): string => {
    const types: Record<number, string> = {
      1: 'A',
      2: 'NS',
      5: 'CNAME',
      6: 'SOA',
      15: 'MX',
      16: 'TXT',
      28: 'AAAA',
    };
    return types[type] || `TYPE${type}`;
  };

  return (
    <div className={styles.tool}>
      <div className={styles.toolHeader}>
        <button className={styles.backButton} onClick={() => setActiveGalaxyTool(null)}>
          ← Back
        </button>
        <h2 className={styles.toolTitle}>
          <span className={styles.toolIcon}>📡</span>
          DNS Analyzer
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

          <button className={styles.sendButton} onClick={analyzeDNS} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze DNS'}
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
            <span>Analyzing DNS records...</span>
          </div>
        )}

        {records.length > 0 && (
          <div className={styles.results}>
            <h3 className={styles.sectionTitle}>DNS Records ({records.length})</h3>
            {records.map((record, index) => (
              <div key={index} className={styles.resultItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#00ffaa', fontWeight: '700' }}>{record.type}</span>
                  <span style={{ color: '#e0e0ff', fontFamily: 'var(--font-mono)' }}>{record.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DNSAnalyzer;
