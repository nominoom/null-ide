import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import styles from './TerminalPanelMulti.module.css';

interface TerminalTab {
  id: string;
  name: string;
  terminal: Terminal;
  fitAddon: FitAddon;
}

export default function TerminalPanelMulti() {
  const [terminals, setTerminals] = useState<TerminalTab[]>([]);
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);

  const createTerminal = () => {
    const terminalId = `term-${Date.now()}`;
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#cccccc'
      }
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    const newTab: TerminalTab = {
      id: terminalId,
      name: `Terminal ${terminals.length + 1}`,
      terminal: term,
      fitAddon
    };

    setTerminals(prev => [...prev, newTab]);
    setActiveTerminalId(terminalId);

    // Wait for DOM to be ready before initializing
    setTimeout(async () => {
      const terminalElement = document.getElementById(terminalId);
      if (terminalElement) {
        term.open(terminalElement);
        fitAddon.fit();

        // Set up data listener with cleanup
        const cleanupData = window.electronAPI.terminal.onData((id: string, data: string) => {
          if (id === terminalId) {
            term.write(data);
          }
        });

        // Set up exit listener with cleanup
        const cleanupExit = window.electronAPI.terminal.onExit((id: string, code: number | null) => {
          if (id === terminalId) {
            console.log(`Terminal ${terminalId} exited with code ${code}`);
          }
        });

        // Store cleanup functions for later
        (term as any)._cleanupFunctions = { cleanupData, cleanupExit };

        // Handle terminal input
        term.onData((data) => {
          window.electronAPI.terminal.write(terminalId, data);
        });

        // Spawn the terminal process
        await window.electronAPI.terminal.spawn(terminalId);

        // Get terminal dimensions and resize
        const dims = fitAddon.proposeDimensions();
        if (dims) {
          window.electronAPI.terminal.resize(terminalId, dims.cols, dims.rows);
        }
      }
    }, 50);
  };

  const closeTerminal = (terminalId: string) => {
    const terminalToClose = terminals.find(t => t.id === terminalId);
    if (!terminalToClose) return;

    // Clean up event listeners BEFORE disposing
    if ((terminalToClose.terminal as any)._cleanupFunctions) {
      try {
        (terminalToClose.terminal as any)._cleanupFunctions.cleanupData();
        (terminalToClose.terminal as any)._cleanupFunctions.cleanupExit();
      } catch (err) {
        console.error('Error cleaning up terminal listeners:', err);
      }
    }

    // Kill the terminal process
    try {
      window.electronAPI.terminal.kill(terminalId);
    } catch (err) {
      console.error('Error killing terminal:', err);
    }

    // Dispose the terminal
    try {
      terminalToClose.terminal.dispose();
    } catch (err) {
      console.error('Error disposing terminal:', err);
    }

    // Update state
    setTerminals(prevTerminals => {
      const newTerminals = prevTerminals.filter(t => t.id !== terminalId);
      return newTerminals;
    });

    // Update active terminal if we closed the active one
    if (activeTerminalId === terminalId) {
      const remaining = terminals.filter(t => t.id !== terminalId);
      setActiveTerminalId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const switchTerminal = (terminalId: string) => {
    setActiveTerminalId(terminalId);
    setTimeout(() => {
      const tab = terminals.find(t => t.id === terminalId);
      if (tab) {
        tab.fitAddon.fit();
        // Resize terminal to match fit dimensions
        const dims = tab.fitAddon.proposeDimensions();
        if (dims) {
          window.electronAPI.terminal.resize(terminalId, dims.cols, dims.rows);
        }
      }
    }, 10);
  };

  useEffect(() => {
    if (terminals.length === 0) {
      createTerminal();
    }

    return () => {
      // Cleanup all terminals when component unmounts
      setTerminals(prevTerminals => {
        prevTerminals.forEach(t => {
          // Clean up event listeners
          if ((t.terminal as any)._cleanupFunctions) {
            (t.terminal as any)._cleanupFunctions.cleanupData();
            (t.terminal as any)._cleanupFunctions.cleanupExit();
          }
          window.electronAPI.terminal.kill(t.id);
          t.terminal.dispose();
        });
        return [];
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      terminals.forEach(tab => {
        tab.fitAddon.fit();
        // Resize terminal to match fit dimensions
        const dims = tab.fitAddon.proposeDimensions();
        if (dims) {
          window.electronAPI.terminal.resize(tab.id, dims.cols, dims.rows);
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [terminals]);

  useEffect(() => {
    let fitTimer: NodeJS.Timeout;

    if (activeTerminalId) {
      fitTimer = setTimeout(() => {
        const tab = terminals.find(t => t.id === activeTerminalId);
        if (tab) {
          tab.fitAddon.fit();
          // Resize terminal to match fit dimensions
          const dims = tab.fitAddon.proposeDimensions();
          if (dims) {
            window.electronAPI.terminal.resize(activeTerminalId, dims.cols, dims.rows);
          }
        }
      }, 100);
    }

    return () => {
      if (fitTimer) clearTimeout(fitTimer);
    };
  }, [activeTerminalId, terminals]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      setTerminalHeight(Math.max(100, Math.min(600, newHeight)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Refit all terminals after resize
      terminals.forEach(tab => {
        tab.fitAddon.fit();
        // Resize terminal to match fit dimensions
        const dims = tab.fitAddon.proposeDimensions();
        if (dims) {
          window.electronAPI.terminal.resize(tab.id, dims.cols, dims.rows);
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, terminals]);

  return (
    <div className={styles.terminalPanel} style={{ height: `${terminalHeight}px` }}>
      <div
        className={styles.resizeHandle}
        onMouseDown={() => setIsResizing(true)}
      />
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          {terminals.map(tab => (
            <div
              key={tab.id}
              className={`${styles.tab} ${activeTerminalId === tab.id ? styles.active : ''}`}
              onClick={() => switchTerminal(tab.id)}
            >
              <span className={styles.tabName}>{tab.name}</span>
              <button
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTerminal(tab.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button className={styles.newTabButton} onClick={createTerminal}>
          +
        </button>
      </div>
      <div className={styles.terminalContainer} ref={containerRef}>
        {terminals.map(tab => (
          <div
            key={tab.id}
            id={tab.id}
            className={styles.terminal}
            style={{ display: activeTerminalId === tab.id ? 'block' : 'none' }}
          />
        ))}
      </div>
    </div>
  );
}
