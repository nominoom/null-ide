import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/store';
import styles from './MenuBar.module.css';

const MenuBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { 
    newFile, 
    openFile, 
    saveFile, 
    closeAllTabs, 
    openSettings, 
    openAbout,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleTerminal,
    tabs,
    activeTabId,
  } = useStore();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const hasActiveTab = activeTab !== undefined;

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  return (
    <div className={styles.menuBar}>
      {/* File Menu */}
      <div className={styles.menuContainer}>
        <button
          className={`${styles.menuButton} ${activeMenu === 'file' ? styles.active : ''}`}
          onClick={(e) => { e.stopPropagation(); handleMenuClick('file'); }}
        >
          File
        </button>
        {activeMenu === 'file' && (
          <div className={styles.dropdown}>
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(newFile)}>
              <span className={styles.label}>New File</span>
              <span className={styles.shortcut}>Ctrl+N</span>
            </button>
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(openFile)}>
              <span className={styles.label}>Open File</span>
              <span className={styles.shortcut}>Ctrl+O</span>
            </button>
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(saveFile)}>
              <span className={styles.label}>Save</span>
              <span className={styles.shortcut}>Ctrl+S</span>
            </button>
            <div className={styles.separator} />
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(closeAllTabs)}>
              <span className={styles.label}>Close All Tabs</span>
              <span className={styles.shortcut}>Ctrl+Shift+W</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className={styles.menuContainer}>
        <button
          className={`${styles.menuButton} ${activeMenu === 'edit' ? styles.active : ''}`}
          onClick={(e) => { e.stopPropagation(); handleMenuClick('edit'); }}
        >
          Edit
        </button>
        {activeMenu === 'edit' && (
          <div className={styles.dropdown}>
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Undo</span>
              <span className={styles.shortcut}>Ctrl+Z</span>
            </button>
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Redo</span>
              <span className={styles.shortcut}>Ctrl+Y</span>
            </button>
            <div className={styles.separator} />
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Cut</span>
              <span className={styles.shortcut}>Ctrl+X</span>
            </button>
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Copy</span>
              <span className={styles.shortcut}>Ctrl+C</span>
            </button>
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Paste</span>
              <span className={styles.shortcut}>Ctrl+V</span>
            </button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className={styles.menuContainer}>
        <button
          className={`${styles.menuButton} ${activeMenu === 'view' ? styles.active : ''}`}
          onClick={(e) => { e.stopPropagation(); handleMenuClick('view'); }}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className={styles.dropdown}>
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(toggleLeftSidebar)}>
              <span className={styles.label}>Toggle Explorer</span>
              <span className={styles.shortcut}>Ctrl+B</span>
            </button>
            <button className={styles.menuItem} onClick={() => {
              console.log('Toggle DeepHat AI clicked', toggleRightSidebar);
              handleMenuItemClick(toggleRightSidebar);
            }}>
              <span className={styles.label}>Toggle DeepHat AI</span>
              <span className={styles.shortcut}>Ctrl+Shift+B</span>
            </button>
            <div className={styles.separator} />
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(toggleTerminal)}>
              <span className={styles.label}>Toggle Terminal</span>
              <span className={styles.shortcut}>Ctrl+`</span>
            </button>
          </div>
        )}
      </div>

      {/* Window Menu */}
      <div className={styles.menuContainer}>
        <button
          className={`${styles.menuButton} ${activeMenu === 'window' ? styles.active : ''}`}
          onClick={(e) => { e.stopPropagation(); handleMenuClick('window'); }}
        >
          Window
        </button>
        {activeMenu === 'window' && (
          <div className={styles.dropdown}>
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Minimize</span>
            </button>
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Maximize</span>
            </button>
            <div className={styles.separator} />
            <button className={`${styles.menuItem} ${styles.disabled}`}>
              <span className={styles.label}>Close Window</span>
              <span className={styles.shortcut}>Alt+F4</span>
            </button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className={styles.menuContainer}>
        <button
          className={`${styles.menuButton} ${activeMenu === 'help' ? styles.active : ''}`}
          onClick={(e) => { e.stopPropagation(); handleMenuClick('help'); }}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className={styles.dropdown}>
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(openAbout)}>
              <span className={styles.label}>About Null IDE</span>
            </button>
            <button className={styles.menuItem} onClick={() => handleMenuItemClick(openSettings)}>
              <span className={styles.label}>Settings</span>
              <span className={styles.shortcut}>Ctrl+,</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
