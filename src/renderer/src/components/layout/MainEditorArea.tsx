import React from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../../store/store';
import styles from './MainEditorArea.module.css';

const MainEditorArea: React.FC = () => {
  const { tabs, activeTabId, updateTabContent, editorSettings } = useStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  if (!activeTab) {
    return (
      <div className={styles.editorArea}>
        <div className={styles.empty}>
          <p>No file open</p>
          <p className="text-secondary">Open a file to start editing</p>
        </div>
      </div>
    );
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeTab) {
      updateTabContent(activeTab.id, value);
    }
  };

  return (
    <div className={styles.editorArea}>
      <Editor
        height="100%"
        language={activeTab.language}
        value={activeTab.content}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: editorSettings.fontSize,
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
          fontLigatures: true,
          minimap: { enabled: editorSettings.minimap, scale: 1 },
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: editorSettings.tabSize,
          insertSpaces: true,
          wordWrap: editorSettings.wordWrap ? 'on' : 'off',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          mouseWheelZoom: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggest: {
            snippetsPreventQuickSuggestions: false,
          },
          quickSuggestions: true,
          parameterHints: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default MainEditorArea;
