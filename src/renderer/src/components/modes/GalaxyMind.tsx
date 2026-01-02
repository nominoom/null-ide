import React from 'react';
import { useStore } from '../../store/store';
import ToolsGrid from '../galaxymind/ToolsGrid';
import APITester from '../galaxymind/APITester';
import PortScanner from '../galaxymind/PortScanner';
import SubdomainFinder from '../galaxymind/SubdomainFinder';
import DNSAnalyzer from '../galaxymind/DNSAnalyzer';
import WHOISLookup from '../galaxymind/WHOISLookup';
import UptimeChecker from '../galaxymind/UptimeChecker';
import HeaderAnalyzer from '../galaxymind/HeaderAnalyzer';
import SQLInjectionTester from '../galaxymind/SQLInjectionTester';
import XSSDetector from '../galaxymind/XSSDetector';
import styles from './GalaxyMind.module.css';

const GalaxyMind: React.FC = () => {
  const { activeGalaxyTool } = useStore();

  const renderTool = () => {
    switch (activeGalaxyTool) {
      case 'api-tester':
        return <APITester />;
      case 'port-scanner':
        return <PortScanner />;
      case 'subdomain-finder':
        return <SubdomainFinder />;
      case 'dns-analyzer':
        return <DNSAnalyzer />;
      case 'whois-lookup':
        return <WHOISLookup />;
      case 'uptime-checker':
        return <UptimeChecker />;
      case 'header-analyzer':
        return <HeaderAnalyzer />;
      case 'sql-injection':
        return <SQLInjectionTester />;
      case 'xss-detector':
        return <XSSDetector />;
      default:
        return <ToolsGrid />;
    }
  };

  return (
    <div className={styles.galaxyMind}>
      {renderTool()}
    </div>
  );
};

export default GalaxyMind;
