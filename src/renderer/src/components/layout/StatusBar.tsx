import React from 'react';
import { useStore } from '../../store/store';
import styles from './StatusBar.module.css';

const StatusBar: React.FC = () => {
  const { tabs, activeTabId } = useStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        <div className={styles.item}>
          <span className={styles.icon}>🔒</span>
          <span>Local Only</span>
        </div>
        {activeTab && (
          <>
            <div className={styles.separator} />
            <div className={styles.item}>
              <span>{activeTab.language.toUpperCase()}</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.center}>
        <div className={styles.item}>
          <span className={styles.brand}>Null IDE by NullSec</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.item}>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
