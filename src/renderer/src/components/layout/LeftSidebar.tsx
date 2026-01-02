import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/store';
import FileExplorer from '../panels/FileExplorer';
import HackingTools from '../panels/HackingTools';
import ProgrammerUtilities from '../panels/ProgrammerUtilities';
import ExtensionsPanel from '../panels/ExtensionsPanel';
import { FolderIcon, LockIcon, ToolsIcon, ExtensionsIcon, ChevronLeftIcon } from '../icons/Icons';
import styles from './LeftSidebar.module.css';

const LeftSidebar: React.FC = () => {
  const { activeLeftPanel, setActiveLeftPanel, leftSidebarWidth, setLeftSidebarWidth } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const panels = [
    { id: 'explorer', name: 'Explorer', icon: <FolderIcon size={18} />, component: FileExplorer },
    { id: 'hacking', name: 'Hacking Tools', icon: <LockIcon size={18} />, component: HackingTools },
    { id: 'utilities', name: 'Utilities', icon: <ToolsIcon size={18} />, component: ProgrammerUtilities },
    { id: 'extensions', name: 'Extensions', icon: <ExtensionsIcon size={18} />, component: ExtensionsPanel },
  ];

  const ActiveComponent = panels.find((p) => p.id === activeLeftPanel)?.component || FileExplorer;

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 500) {
        setLeftSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setLeftSidebarWidth]);

  if (collapsed) {
    return (
      <div className={styles.sidebarCollapsed}>
        {panels.map((panel) => (
          <button
            key={panel.id}
            className={`${styles.iconBtn} ${panel.id === activeLeftPanel ? styles.active : ''}`}
            onClick={() => {
              setActiveLeftPanel(panel.id);
              setCollapsed(false);
            }}
            title={panel.name}
          >
            {panel.icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.sidebar} ref={sidebarRef} style={{ width: `${leftSidebarWidth}px` }}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {panels.map((panel) => (
            <button
              key={panel.id}
              className={`${styles.tab} ${panel.id === activeLeftPanel ? styles.activeTab : ''}`}
              onClick={() => setActiveLeftPanel(panel.id)}
              title={panel.name}
            >
              <span className={styles.tabIcon}>{panel.icon}</span>
              <span className={styles.tabName}>{panel.name}</span>
            </button>
          ))}
        </div>
        <button className={styles.collapseBtn} onClick={() => setCollapsed(true)} title="Collapse">
          <ChevronLeftIcon size={16} />
        </button>
      </div>

      <div className={styles.content}>
        <ActiveComponent />
      </div>
      
      <div 
        className={styles.resizeHandle}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

export default LeftSidebar;
