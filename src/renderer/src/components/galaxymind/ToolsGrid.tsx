import React from 'react';
import { useStore } from '../../store/store';
import styles from './ToolsGrid.module.css';

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
}

const tools: Tool[] = [
  { id: 'api-tester', name: 'API Tester', icon: '🔌', category: 'Network', description: 'Test REST & GraphQL APIs' },
  { id: 'port-scanner', name: 'Port Scanner', icon: '🔍', category: 'Network', description: 'Scan ports on target hosts' },
  { id: 'subdomain-finder', name: 'Subdomain Finder', icon: '🌐', category: 'Reconnaissance', description: 'Discover subdomains' },
  { id: 'dns-analyzer', name: 'DNS Analyzer', icon: '📡', category: 'Network', description: 'Analyze DNS records' },
  { id: 'whois-lookup', name: 'WHOIS Lookup', icon: '📋', category: 'Reconnaissance', description: 'Domain registration info' },
  { id: 'uptime-checker', name: 'Uptime Checker', icon: '⏱️', category: 'Monitoring', description: 'Monitor website availability' },
  { id: 'header-analyzer', name: 'Header Analyzer', icon: '📑', category: 'Security', description: 'Analyze HTTP headers' },
  { id: 'sql-injection', name: 'SQL Injection', icon: '💉', category: 'Security', description: 'Test SQL injection vectors' },
  { id: 'xss-detector', name: 'XSS Detector', icon: '⚡', category: 'Security', description: 'Detect XSS vulnerabilities' },
];

const ToolsGrid: React.FC = () => {
  const { setActiveGalaxyTool } = useStore();

  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className={styles.toolsGrid}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleIcon}>🌌</span>
          GalaxyMind
        </h1>
        <p className={styles.subtitle}>Professional Security & Penetration Testing Suite</p>
      </div>

      {categories.map((category) => (
        <div key={category} className={styles.category}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          <div className={styles.toolCards}>
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => (
                <div
                  key={tool.id}
                  className={styles.toolCard}
                  onClick={() => setActiveGalaxyTool(tool.id)}
                >
                  <div className={styles.toolIcon}>{tool.icon}</div>
                  <h3 className={styles.toolName}>{tool.name}</h3>
                  <p className={styles.toolDescription}>{tool.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsGrid;
