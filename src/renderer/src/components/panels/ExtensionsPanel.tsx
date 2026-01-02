import React from 'react';

const ExtensionsPanel: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '32px',
      textAlign: 'center',
      gap: '16px'
    }}>
      <div style={{ fontSize: '48px' }}>🧩</div>
      <h2 style={{ 
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        margin: 0
      }}>
        Extensions
      </h2>
      <p style={{ 
        fontSize: '14px',
        color: 'var(--color-text-secondary)',
        margin: 0
      }}>
        Browse and install extensions to enhance your IDE
      </p>
      <div style={{
        marginTop: '16px',
        padding: '12px 24px',
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        color: 'var(--color-accent)',
        fontWeight: 500
      }}>
        Coming Soon...
      </div>
      <p style={{ 
        fontSize: '12px',
        color: 'var(--color-text-tertiary)',
        margin: '24px 0 0 0',
        maxWidth: '300px'
      }}>
        Plugin system in development. Soon you'll be able to extend Null IDE with custom themes, languages, and tools.
      </p>
    </div>
  );
};

export default ExtensionsPanel;
