import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import styles from './TerminalPanel.module.css';

interface TerminalInstance {
  id: string;
  name: string;
  terminal: XTerm;
  fitAddon: FitAddon;
}

interface TerminalPanelProps {
  isVisible: boolean;
  height: number;
  onHeightChange: (height: number) => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ isVisible, height, onHeightChange }) => {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const [terminals, setTerminals] = useState<TerminalInstance[]>([]);
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const createTerminal = () => {
    const id = `term-${Date.now()}`;
    const name = `Terminal ${terminals.length + 1}`;
    
    const xterm = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: 'Consolas, monospace',
      fontSize: 13,
      theme: {
        background: '#0a0a0a',
        foreground: '#e0e0e0',
        cursor: '#00ffaa',
        black: '#1a1a1a',
        red: '#ff5f87',
        green: '#00ffaa',
        yellow: '#ffff87',
        blue: '#5fafff',
        magenta: '#ff87ff',
        cyan: '#87ffff',
        white: '#e0e0e0',
      },
      scrollback: 10000,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    const newTerminal: TerminalInstance = {
      id,
      name,
      terminal: xterm,
      fitAddon,
    };

    setTerminals(prev => [...prev, newTerminal]);
    setActiveTerminalId(id);

    // Spawn terminal process after state update
    setTimeout(() => {
      const container = document.getElementById(`terminal-${id}`);
      if (container) {
        xterm.open(container);
        fitAddon.fit();

        window.electronAPI.terminal.spawn(id, 'powershell.exe').then((res) => {
          if (res.success) {
            xterm.writeln('\x1b[1;32m✓\x1b[0m PowerShell Ready');
            xterm.writeln('');
          } else {
            xterm.writeln(`\x1b[1;31m✗\x1b[0m Failed: ${res.error}`);
          }
        }).catch((err) => {
          xterm.writeln(`\x1b[1;31m✗\x1b[0m Error: ${err.message}`);
        });

        xterm.onData((data) => {
          window.electronAPI.terminal.write(id, data);
        });

        window.electronAPI.terminal.onData((termId, data) => {
          if (termId === id) {
            xterm.write(data);
          }
        });

        window.electronAPI.terminal.onExit((termId, code) => {
          if (termId === id) {
            xterm.writeln(`\n\x1b[33mProcess exited with code ${code}\x1b[0m`);
          }
        });
      }
    }, 100);

    return newTerminal;
  };

  const closeTerminal = (id: string) => {
    const terminal = terminals.find(t => t.id === id);
    if (terminal) {
      window.electronAPI.terminal.kill(id);
      terminal.terminal.dispose();
      setTerminals(prev => prev.filter(t => t.id !== id));
      
      if (activeTerminalId === id) {
        const remaining = terminals.filter(t => t.id !== id);
        setActiveTerminalId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  useEffect(() => {
    if (terminals.length === 0) {
      createTerminal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isVisible && terminals.length > 0) {
      setTimeout(() => {
        terminals.forEach(t => {
          if (t.id === activeTerminalId) {
            t.fitAddon.fit();
          }
        });
      }, 100);
    }
  }, [isVisible, height, activeTerminalId, terminals]);

  useEffect(() => {
    return () => {
      terminals.forEach(t => {
        window.electronAPI.terminal.kill(t.id);
        t.terminal.dispose();
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      onHeightChange(Math.max(100, Math.min(600, newHeight)));
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
  }, [isResizing, onHeightChange]);

  if (!isVisible) return null;

  return (
    <div className={styles.terminalPanel} style={{ height: `${height}px` }}>
      <div className={styles.resizeHandle} onMouseDown={handleMouseDown} />
      
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTabs}>
          {terminals.map(term => (
            <div
              key={term.id}
              className={`${styles.terminalTab} ${activeTerminalId === term.id ? styles.active : ''}`}
              onClick={() => setActiveTerminalId(term.id)}
            >
              <span>{term.name}</span>
              <button
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTerminal(term.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button className={styles.newTerminalButton} onClick={createTerminal}>
            + New Terminal
          </button>
        </div>
      </div>

      <div className={styles.terminalContent} ref={terminalContainerRef}>
        {terminals.map(term => (
          <div
            key={term.id}
            id={`terminal-${term.id}`}
            className={styles.terminalInstance}
            style={{ display: activeTerminalId === term.id ? 'block' : 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

export default TerminalPanel;
