import React, { useEffect } from 'react';
import { useStore } from './store/store';
import TopBar from './components/layout/TopBar';
import LeftSidebar from './components/layout/LeftSidebar';
import MainEditorArea from './components/layout/MainEditorArea';
import RightSidebar from './components/layout/RightSidebar';
import StatusBar from './components/layout/StatusBar';
import TerminalPanel from './components/panels/TerminalPanelMulti';
import SettingsModal from './components/modals/SettingsModal';
import AboutModal from './components/modals/AboutModal';
import styles from './App.module.css';

const App: React.FC = () => {
  const {
    leftSidebarVisible,
    rightSidebarVisible,
    terminalVisible,
    terminalHeight,
    setTerminalHeight,
    settingsOpen,
    aboutOpen,
    closeSettings,
    closeAbout,
  } = useStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+B: Toggle left sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        useStore.getState().toggleLeftSidebar();
      }
      
      // Ctrl+Shift+B: Toggle right sidebar
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        useStore.getState().toggleRightSidebar();
      }

      // Ctrl+`: Toggle terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        useStore.getState().toggleTerminal();
      }
      
      // Ctrl+,: Open settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        useStore.getState().openSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.app}>
      <TopBar />
      
      <div className={styles.mainContainer}>
        {leftSidebarVisible && <LeftSidebar />}
        <div className={styles.editorAndTerminal}>
          <MainEditorArea />
          <TerminalPanel 
            isVisible={terminalVisible} 
            height={terminalHeight}
            onHeightChange={setTerminalHeight}
          />
        </div>
        {rightSidebarVisible && <RightSidebar />}
      </div>
      
      <StatusBar />
      
      {settingsOpen && <SettingsModal onClose={closeSettings} />}
      {aboutOpen && <AboutModal onClose={closeAbout} />}
    </div>
  );
};

export default App;
