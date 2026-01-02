import React, { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './GalaxyTool.module.css';

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: { key: string; value: string }[];
  body: string;
}

const APITester: React.FC = () => {
  const { setActiveGalaxyTool, addToAPIHistory } = useStore();
  const [config, setConfig] = useState<RequestConfig>({
    method: 'GET',
    url: '',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: '',
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addHeader = () => {
    setConfig({ ...config, headers: [...config.headers, { key: '', value: '' }] });
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...config.headers];
    newHeaders[index][field] = value;
    setConfig({ ...config, headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    setConfig({ ...config, headers: config.headers.filter((_, i) => i !== index) });
  };

  const sendRequest = async () => {
    if (!config.url.trim()) {
      setError('URL is required');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {};
      config.headers.forEach((h) => {
        if (h.key.trim()) headers[h.key] = h.value;
      });

      const options: RequestInit = {
        method: config.method,
        headers,
      };

      if (config.method !== 'GET' && config.body.trim()) {
        options.body = config.body;
      }

      const res = await fetch(config.url, options);
      const endTime = Date.now();

      const contentType = res.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const result = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data,
        time: endTime - startTime,
      };

      setResponse(result);

      // Add to history
      addToAPIHistory(
        {
          id: Date.now().toString(),
          name: `${config.method} ${config.url}`,
          method: config.method,
          url: config.url,
          headers,
          body: config.body || undefined,
          timestamp: Date.now(),
        },
        result
      );
    } catch (err: any) {
      setError(err.message || 'Request failed');
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
          <span className={styles.toolIcon}>🔌</span>
          API Tester
        </h2>
      </div>

      <div className={styles.toolContent}>
        <div className={styles.requestSection}>
          <div className={styles.requestLine}>
            <select
              className={styles.methodSelect}
              value={config.method}
              onChange={(e) => setConfig({ ...config, method: e.target.value as any })}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <input
              type="text"
              className={styles.urlInput}
              placeholder="https://api.example.com/endpoint"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
            />
            <button className={styles.sendButton} onClick={sendRequest} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Headers</h3>
            {config.headers.map((header, index) => (
              <div key={index} className={styles.headerRow}>
                <input
                  type="text"
                  className={styles.headerInput}
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  className={styles.headerInput}
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                />
                <button className={styles.removeButton} onClick={() => removeHeader(index)}>
                  ✕
                </button>
              </div>
            ))}
            <button className={styles.addButton} onClick={addHeader}>
              + Add Header
            </button>
          </div>

          {config.method !== 'GET' && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Body</h3>
              <textarea
                className={styles.bodyInput}
                placeholder='{"key": "value"}'
                value={config.body}
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                rows={10}
              />
            </div>
          )}
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className={styles.responseSection}>
            <h3 className={styles.sectionTitle}>Response</h3>
            <div className={styles.responseStatus}>
              <span className={`${styles.statusBadge} ${styles[`status${Math.floor(response.status / 100)}xx`]}`}>
                {response.status} {response.statusText}
              </span>
              <span className={styles.responseTime}>⏱️ {response.time}ms</span>
            </div>

            <div className={styles.responseTabs}>
              <h4 className={styles.tabTitle}>Response Body</h4>
              <pre className={styles.responseBody}>
                {typeof response.data === 'object'
                  ? JSON.stringify(response.data, null, 2)
                  : response.data}
              </pre>
            </div>

            <div className={styles.responseTabs}>
              <h4 className={styles.tabTitle}>Response Headers</h4>
              <pre className={styles.responseBody}>
                {JSON.stringify(response.headers, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APITester;
