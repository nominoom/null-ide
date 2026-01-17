import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../../store/store';
import styles from './MainEditorArea.module.css';

const MainEditorArea: React.FC = () => {
  const { tabs, activeTabId, updateTabContent, editorSettings } = useStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const [currentMonacoTheme, setCurrentMonacoTheme] = useState('vs-dark');

  useEffect(() => {
    // Get current theme from data attribute
    const theme = document.documentElement.getAttribute('data-theme') || 'null-dark';
    const monacoThemeName = `custom-${theme}`;
    setCurrentMonacoTheme(monacoThemeName);
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'null-dark';
      const monacoThemeName = `custom-${theme}`;
      setCurrentMonacoTheme(monacoThemeName);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleEditorMount = (editor: any, monaco: any) => {
    // Define custom Monaco themes for each app theme
    const defineCustomThemes = () => {
      // Null Dark
      monaco.editor.defineTheme('custom-null-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6a9955' },
          { token: 'keyword', foreground: '00d9ff', fontStyle: 'bold' },
          { token: 'variable', foreground: '9cdcfe' },
          { token: 'string', foreground: '00ff88' },
          { token: 'number', foreground: 'ffaa00' },
          { token: 'function', foreground: '00d9ff' },
          { token: 'class', foreground: '4ec9b0' },
          { token: 'tag', foreground: '00d9ff' },
          { token: 'attribute.name', foreground: '9cdcfe' },
          { token: 'delimiter.html', foreground: '808080' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#f0f0f0',
          'editorLineNumber.foreground': '#707070',
          'editorCursor.foreground': '#00d9ff',
        }
      });

      // Cyber Purple
      monaco.editor.defineTheme('custom-cyber-purple', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '806699' },
          { token: 'keyword', foreground: 'b366ff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ffccff' },
          { token: 'string', foreground: '66ff99' },
          { token: 'number', foreground: 'ffaa66' },
          { token: 'function', foreground: 'b366ff' },
          { token: 'class', foreground: 'dd99dd' },
          { token: 'tag', foreground: 'b366ff' },
          { token: 'attribute.name', foreground: 'ffccff' },
          { token: 'delimiter.html', foreground: '806699' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#f0e6ff',
          'editorLineNumber.foreground': '#806699',
          'editorCursor.foreground': '#b366ff',
        }
      });

      // Matrix Green
      monaco.editor.defineTheme('custom-matrix-green', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '007722' },
          { token: 'keyword', foreground: '00ff41', fontStyle: 'bold' },
          { token: 'variable', foreground: '00cc33' },
          { token: 'string', foreground: '00ff88' },
          { token: 'number', foreground: 'ffff00' },
          { token: 'function', foreground: '00ff41' },
          { token: 'class', foreground: '00aa2b' },
          { token: 'tag', foreground: '00ff41' },
          { token: 'attribute.name', foreground: '00cc33' },
          { token: 'delimiter.html', foreground: '007722' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#00ff41',
          'editorLineNumber.foreground': '#007722',
          'editorCursor.foreground': '#00ff41',
        }
      });

      // Nord
      monaco.editor.defineTheme('custom-nord', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'a3adb9' },
          { token: 'keyword', foreground: '88c0d0', fontStyle: 'bold' },
          { token: 'variable', foreground: 'eceff4' },
          { token: 'string', foreground: 'a3be8c' },
          { token: 'number', foreground: 'ebcb8b' },
          { token: 'function', foreground: '88c0d0' },
          { token: 'class', foreground: '81a1c1' },
          { token: 'tag', foreground: '88c0d0' },
          { token: 'attribute.name', foreground: 'd8dee9' },
          { token: 'delimiter.html', foreground: 'a3adb9' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#eceff4',
          'editorLineNumber.foreground': '#a3adb9',
          'editorCursor.foreground': '#88c0d0',
        }
      });

      // Dracula
      monaco.editor.defineTheme('custom-dracula', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '888882' },
          { token: 'keyword', foreground: 'bd93f9', fontStyle: 'bold' },
          { token: 'variable', foreground: 'f8f8f2' },
          { token: 'string', foreground: '50fa7b' },
          { token: 'number', foreground: 'ffb86c' },
          { token: 'function', foreground: 'bd93f9' },
          { token: 'class', foreground: 'b8b8b2' },
          { token: 'tag', foreground: 'bd93f9' },
          { token: 'attribute.name', foreground: 'f8f8f2' },
          { token: 'delimiter.html', foreground: '888882' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#f8f8f2',
          'editorLineNumber.foreground': '#888882',
          'editorCursor.foreground': '#bd93f9',
        }
      });

      // Tokyo Night
      monaco.editor.defineTheme('custom-tokyo-night', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '7982a9' },
          { token: 'keyword', foreground: '7aa2f7', fontStyle: 'bold' },
          { token: 'variable', foreground: 'c0caf5' },
          { token: 'string', foreground: '9ece6a' },
          { token: 'number', foreground: 'e0af68' },
          { token: 'function', foreground: '7aa2f7' },
          { token: 'class', foreground: 'a9b1d6' },
          { token: 'tag', foreground: '7aa2f7' },
          { token: 'attribute.name', foreground: 'c0caf5' },
          { token: 'delimiter.html', foreground: '7982a9' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#c0caf5',
          'editorLineNumber.foreground': '#7982a9',
          'editorCursor.foreground': '#7aa2f7',
        }
      });

      // Gruvbox Dark
      monaco.editor.defineTheme('custom-gruvbox-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'a89984' },
          { token: 'keyword', foreground: '83a598', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ebdbb2' },
          { token: 'string', foreground: 'b8bb26' },
          { token: 'number', foreground: 'fabd2f' },
          { token: 'function', foreground: '83a598' },
          { token: 'class', foreground: 'd5c4a1' },
          { token: 'tag', foreground: '83a598' },
          { token: 'attribute.name', foreground: 'ebdbb2' },
          { token: 'delimiter.html', foreground: 'a89984' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#ebdbb2',
          'editorLineNumber.foreground': '#a89984',
          'editorCursor.foreground': '#83a598',
        }
      });

      // One Dark Pro
      monaco.editor.defineTheme('custom-one-dark-pro', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '5c6370' },
          { token: 'keyword', foreground: '61afef', fontStyle: 'bold' },
          { token: 'variable', foreground: 'abb2bf' },
          { token: 'string', foreground: '98c379' },
          { token: 'number', foreground: 'e5c07b' },
          { token: 'function', foreground: '61afef' },
          { token: 'class', foreground: '8b929f' },
          { token: 'tag', foreground: '61afef' },
          { token: 'attribute.name', foreground: 'abb2bf' },
          { token: 'delimiter.html', foreground: '5c6370' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#abb2bf',
          'editorLineNumber.foreground': '#5c6370',
          'editorCursor.foreground': '#61afef',
        }
      });

      // Cosmic Void
      monaco.editor.defineTheme('custom-cosmic-void', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '8888a8' },
          { token: 'keyword', foreground: '7b68ee', fontStyle: 'bold' },
          { token: 'variable', foreground: 'e8e8ff' },
          { token: 'string', foreground: '88ffbb' },
          { token: 'number', foreground: 'ffdd88' },
          { token: 'function', foreground: '7b68ee' },
          { token: 'class', foreground: 'b8b8d8' },
          { token: 'tag', foreground: '7b68ee' },
          { token: 'attribute.name', foreground: 'e8e8ff' },
          { token: 'delimiter.html', foreground: '8888a8' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#e8e8ff',
          'editorLineNumber.foreground': '#8888a8',
          'editorCursor.foreground': '#7b68ee',
        }
      });

      // Digital Matrix
      monaco.editor.defineTheme('custom-digital-matrix', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '009988' },
          { token: 'keyword', foreground: '00ffcc', fontStyle: 'bold' },
          { token: 'variable', foreground: '00ccaa' },
          { token: 'string', foreground: '00ff88' },
          { token: 'number', foreground: 'ffcc00' },
          { token: 'function', foreground: '00ffcc' },
          { token: 'class', foreground: '00ddaa' },
          { token: 'tag', foreground: '00ffcc' },
          { token: 'attribute.name', foreground: '00ccaa' },
          { token: 'delimiter.html', foreground: '009988' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#00ffcc',
          'editorLineNumber.foreground': '#009988',
          'editorCursor.foreground': '#00ffcc',
        }
      });

      // Neon City
      monaco.editor.defineTheme('custom-neon-city', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'aa66aa' },
          { token: 'keyword', foreground: 'ff00ff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ffccff' },
          { token: 'string', foreground: '00ff99' },
          { token: 'number', foreground: 'ffaa00' },
          { token: 'function', foreground: 'ff00ff' },
          { token: 'class', foreground: 'dd99dd' },
          { token: 'tag', foreground: 'ff00ff' },
          { token: 'attribute.name', foreground: 'ffccff' },
          { token: 'delimiter.html', foreground: 'aa66aa' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#ffccff',
          'editorLineNumber.foreground': '#aa66aa',
          'editorCursor.foreground': '#ff00ff',
        }
      });

      // Purple Nebula
      monaco.editor.defineTheme('custom-purple-nebula', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '9877aa' },
          { token: 'keyword', foreground: 'bb88ff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'e8d9ff' },
          { token: 'string', foreground: '88ffbb' },
          { token: 'number', foreground: 'ffbb88' },
          { token: 'function', foreground: 'bb88ff' },
          { token: 'class', foreground: 'c8a9dd' },
          { token: 'tag', foreground: 'bb88ff' },
          { token: 'attribute.name', foreground: 'e8d9ff' },
          { token: 'delimiter.html', foreground: '9877aa' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#e8d9ff',
          'editorLineNumber.foreground': '#9877aa',
          'editorCursor.foreground': '#bb88ff',
        }
      });

      // Ocean Depths
      monaco.editor.defineTheme('custom-ocean-depths', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '7799bb' },
          { token: 'keyword', foreground: '00ccff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'd9f0ff' },
          { token: 'string', foreground: '00ffaa' },
          { token: 'number', foreground: 'ffcc66' },
          { token: 'function', foreground: '00ccff' },
          { token: 'class', foreground: 'a9d0ee' },
          { token: 'tag', foreground: '00ccff' },
          { token: 'attribute.name', foreground: 'd9f0ff' },
          { token: 'delimiter.html', foreground: '7799bb' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#d9f0ff',
          'editorLineNumber.foreground': '#7799bb',
          'editorCursor.foreground': '#00ccff',
        }
      });

      // Crimson Tech
      monaco.editor.defineTheme('custom-crimson-tech', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'aa7777' },
          { token: 'keyword', foreground: 'ff4466', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ffd9dd' },
          { token: 'string', foreground: '66ff99' },
          { token: 'number', foreground: 'ffaa44' },
          { token: 'function', foreground: 'ff4466' },
          { token: 'class', foreground: 'ddaaaa' },
          { token: 'tag', foreground: 'ff4466' },
          { token: 'attribute.name', foreground: 'ffd9dd' },
          { token: 'delimiter.html', foreground: 'aa7777' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#ffd9dd',
          'editorLineNumber.foreground': '#aa7777',
          'editorCursor.foreground': '#ff4466',
        }
      });

      // Emerald Forest
      monaco.editor.defineTheme('custom-emerald-forest', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '77aa77' },
          { token: 'keyword', foreground: '44ff88', fontStyle: 'bold' },
          { token: 'variable', foreground: 'd9ffd9' },
          { token: 'string', foreground: '66ff88' },
          { token: 'number', foreground: 'ffcc44' },
          { token: 'function', foreground: '44ff88' },
          { token: 'class', foreground: 'aaddaa' },
          { token: 'tag', foreground: '44ff88' },
          { token: 'attribute.name', foreground: 'd9ffd9' },
          { token: 'delimiter.html', foreground: '77aa77' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#d9ffd9',
          'editorLineNumber.foreground': '#77aa77',
          'editorCursor.foreground': '#44ff88',
        }
      });

      // Sunset Horizon
      monaco.editor.defineTheme('custom-sunset-horizon', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'aa8866' },
          { token: 'keyword', foreground: 'ff8844', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ffe8cc' },
          { token: 'string', foreground: '88ff66' },
          { token: 'number', foreground: 'ffaa22' },
          { token: 'function', foreground: 'ff8844' },
          { token: 'class', foreground: 'ddbb99' },
          { token: 'tag', foreground: 'ff8844' },
          { token: 'attribute.name', foreground: 'ffe8cc' },
          { token: 'delimiter.html', foreground: 'aa8866' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#ffe8cc',
          'editorLineNumber.foreground': '#aa8866',
          'editorCursor.foreground': '#ff8844',
        }
      });

      // Arctic Aurora
      monaco.editor.defineTheme('custom-arctic-aurora', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '77a8bb' },
          { token: 'keyword', foreground: '44ccff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'd9f8ff' },
          { token: 'string', foreground: '66ffaa' },
          { token: 'number', foreground: 'ffdd66' },
          { token: 'function', foreground: '44ccff' },
          { token: 'class', foreground: 'aad8ee' },
          { token: 'tag', foreground: '44ccff' },
          { token: 'attribute.name', foreground: 'd9f8ff' },
          { token: 'delimiter.html', foreground: '77a8bb' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#d9f8ff',
          'editorLineNumber.foreground': '#77a8bb',
          'editorCursor.foreground': '#44ccff',
        }
      });

      // Golden Hour
      monaco.editor.defineTheme('custom-golden-hour', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'aa9966' },
          { token: 'keyword', foreground: 'ffcc44', fontStyle: 'bold' },
          { token: 'variable', foreground: 'fff0cc' },
          { token: 'string', foreground: '88ff66' },
          { token: 'number', foreground: 'ffaa44' },
          { token: 'function', foreground: 'ffcc44' },
          { token: 'class', foreground: 'ddcc99' },
          { token: 'tag', foreground: 'ffcc44' },
          { token: 'attribute.name', foreground: 'fff0cc' },
          { token: 'delimiter.html', foreground: 'aa9966' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#fff0cc',
          'editorLineNumber.foreground': '#aa9966',
          'editorCursor.foreground': '#ffcc44',
        }
      });

      // Violet Dream
      monaco.editor.defineTheme('custom-violet-dream', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '9877aa' },
          { token: 'keyword', foreground: 'aa77ff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'e8d9ff' },
          { token: 'string', foreground: '88ffcc' },
          { token: 'number', foreground: 'ffaa88' },
          { token: 'function', foreground: 'aa77ff' },
          { token: 'class', foreground: 'c8a9dd' },
          { token: 'tag', foreground: 'aa77ff' },
          { token: 'attribute.name', foreground: 'e8d9ff' },
          { token: 'delimiter.html', foreground: '9877aa' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#e8d9ff',
          'editorLineNumber.foreground': '#9877aa',
          'editorCursor.foreground': '#aa77ff',
        }
      });

      // Midnight Blue
      monaco.editor.defineTheme('custom-midnight-blue', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '7798bb' },
          { token: 'keyword', foreground: '5588ff', fontStyle: 'bold' },
          { token: 'variable', foreground: 'dde8ff' },
          { token: 'string', foreground: '66ffaa' },
          { token: 'number', foreground: 'ffbb66' },
          { token: 'function', foreground: '5588ff' },
          { token: 'class', foreground: 'aac8ee' },
          { token: 'tag', foreground: '5588ff' },
          { token: 'attribute.name', foreground: 'dde8ff' },
          { token: 'delimiter.html', foreground: '7798bb' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#dde8ff',
          'editorLineNumber.foreground': '#7798bb',
          'editorCursor.foreground': '#5588ff',
        }
      });

      // Coral Reef
      monaco.editor.defineTheme('custom-coral-reef', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'aa9888' },
          { token: 'keyword', foreground: 'ff7788', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ffe8dd' },
          { token: 'string', foreground: '66ffaa' },
          { token: 'number', foreground: 'ffcc77' },
          { token: 'function', foreground: 'ff7788' },
          { token: 'class', foreground: 'ddc8bb' },
          { token: 'tag', foreground: 'ff7788' },
          { token: 'attribute.name', foreground: 'ffe8dd' },
          { token: 'delimiter.html', foreground: 'aa9888' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#ffe8dd',
          'editorLineNumber.foreground': '#aa9888',
          'editorCursor.foreground': '#ff7788',
        }
      });

      // Fire Ember
      monaco.editor.defineTheme('custom-fire-ember', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'aa7755' },
          { token: 'keyword', foreground: 'ff6633', fontStyle: 'bold' },
          { token: 'variable', foreground: 'ffddc8' },
          { token: 'string', foreground: '88ff66' },
          { token: 'number', foreground: 'ffaa22' },
          { token: 'function', foreground: 'ff6633' },
          { token: 'class', foreground: 'ddaa88' },
          { token: 'tag', foreground: 'ff6633' },
          { token: 'attribute.name', foreground: 'ffddc8' },
          { token: 'delimiter.html', foreground: 'aa7755' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#ffddc8',
          'editorLineNumber.foreground': '#aa7755',
          'editorCursor.foreground': '#ff6633',
        }
      });

      // Jade Mist
      monaco.editor.defineTheme('custom-jade-mist', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '77aa98' },
          { token: 'keyword', foreground: '66ffaa', fontStyle: 'bold' },
          { token: 'variable', foreground: 'd9ffe8' },
          { token: 'string', foreground: '77ffaa' },
          { token: 'number', foreground: 'ffdd88' },
          { token: 'function', foreground: '66ffaa' },
          { token: 'class', foreground: 'aaddc8' },
          { token: 'tag', foreground: '66ffaa' },
          { token: 'attribute.name', foreground: 'd9ffe8' },
          { token: 'delimiter.html', foreground: '77aa98' },
        ],
        colors: {
          'editor.background': '#00000000',
          'editor.foreground': '#d9ffe8',
          'editorLineNumber.foreground': '#77aa98',
          'editorCursor.foreground': '#66ffaa',
        }
      });
    };

    try {
      defineCustomThemes();
    } catch (error) {
      console.error('Failed to define Monaco themes:', error);
    }
  };

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
        theme={currentMonacoTheme}
        onMount={handleEditorMount}
        options={{
          fontSize: editorSettings.fontSize,
          lineHeight: 1.6,
          padding: { top: 20, bottom: 20 },
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
          fontLigatures: true,
          fontWeight: '400',
          letterSpacing: 0.3,
          minimap: { 
            enabled: editorSettings.minimap, 
            scale: 1, 
            showSlider: 'mouseover',
            renderCharacters: false,
            maxColumn: 80
          },
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          renderWhitespace: 'selection',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: editorSettings.tabSize,
          insertSpaces: true,
          wordWrap: editorSettings.wordWrap ? 'on' : 'off',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          cursorStyle: 'line',
          cursorWidth: 2,
          smoothScrolling: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
          guides: {
            bracketPairs: true,
            bracketPairsHorizontal: 'active',
            highlightActiveBracketPair: true,
            indentation: true,
            highlightActiveIndentation: true,
          },
          suggest: {
            snippetsPreventQuickSuggestions: false,
            showWords: true,
            showKeywords: true,
            showSnippets: true,
            preview: true,
            previewMode: 'subwordSmart',
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          parameterHints: { enabled: true, cycle: true },
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoIndent: 'full',
          folding: true,
          foldingStrategy: 'indentation',
          foldingHighlight: true,
          showFoldingControls: 'mouseover',
          matchBrackets: 'always',
          renderLineHighlight: 'all',
          renderControlCharacters: false,
          rulers: [],
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            alwaysConsumeMouseWheel: false,
          },
          overviewRulerBorder: false,
          occurrencesHighlight: true,
          selectionHighlight: true,
          codeLens: true,
          links: true,
          colorDecorators: true,
          comments: {
            insertSpace: true,
            ignoreEmptyLines: true,
          },
          inlayHints: { enabled: 'on' },
          stickyScroll: { enabled: true },
        }}
      />
    </div>
  );
};

export default MainEditorArea;
