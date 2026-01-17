import { app, BrowserWindow, ipcMain, BrowserView, powerMonitor } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as net from 'net';
import * as dns from 'dns';
import { promisify } from 'util';
import * as pty from 'node-pty';
import { initDiscordRPC, updateActivity, disconnectDiscordRPC, isDiscordConnected } from './discordRPC';


const dnsResolve = promisify(dns.resolve);
const dnsReverse = promisify(dns.reverse);

let mainWindow: BrowserWindow | null = null;
let deephatBrowserView: BrowserView | null = null;
let fileToOpen: string | null = null;

const isDev = process.env.NODE_ENV === 'development';

// Handle file/folder opening from context menu
if (process.argv.length > 1) {
  const argPath = process.argv[process.argv.length - 1];
  if (argPath && !argPath.includes('--') && fs.existsSync(argPath)) {
    fileToOpen = argPath;
  }
}

/**
 * Create the main application window
 */
function createWindow() {
  console.log('Creating main window...');
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    title: 'Null IDE – NullSec',
    icon: path.join(__dirname, 'null_ide.png'),
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, '../../../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  console.log('Window created, loading URL...');
  
  // Track if this is the first load
  let isFirstLoad = true;
  
  mainWindow.webContents.on('did-finish-load', () => {
    if (isFirstLoad) {
      console.log('First load complete, reloading to ensure proper initialization...');
      isFirstLoad = false;
      mainWindow?.webContents.reload();
    } else {
      console.log('Content loaded successfully');
    }
  });
  
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready, showing...');
    mainWindow?.show();
  });

  // Load the app
  if (isDev) {
    console.log('Dev mode: loading http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173').catch((err) => {
      console.error('Failed to load URL:', err);
      // Retry after a short delay
      setTimeout(() => {
        mainWindow?.loadURL('http://localhost:5173').catch(e => {
          console.error('Retry failed:', e);
        });
      }, 1000);
    });
    // DevTools can be opened with F12 or Ctrl+Shift+I
  } else {
    console.log('Production mode: loading from file');
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html')).catch((err) => {
      console.error('Failed to load file:', err);
    });
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed!');
  });

  mainWindow.on('unresponsive', () => {
    console.error('Window became unresponsive');
  });

  mainWindow.on('closed', () => {
    console.log('Main window closed');
    // Kill all terminal processes to prevent zombies
    terminals.forEach((terminal, id) => {
      try {
        console.log(`Killing terminal ${id}`);
        terminal.kill();
      } catch (error) {
        console.error(`Failed to kill terminal ${id}:`, error);
      }
    });
    terminals.clear();
    mainWindow = null;
    deephatBrowserView = null;
  });
}

/**
 * Create and attach the DeepHat browser view for the right sidebar
 */
function createDeepHatView() {
  if (!mainWindow) return;

  deephatBrowserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Set initial bounds to 0x0 (hidden) to prevent overlay on entire window
  deephatBrowserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
  
  mainWindow.addBrowserView(deephatBrowserView);
  deephatBrowserView.webContents.loadURL('https://app.deephat.ai/');
}

/**
 * Position the DeepHat browser view (called when sidebar is shown/resized)
 */
ipcMain.on('position-deephat-view', (event, bounds) => {
  if (deephatBrowserView) {
    deephatBrowserView.setBounds(bounds);
  }
});

/**
 * Show/hide the DeepHat browser view
 */
ipcMain.on('toggle-deephat-view', (event, show) => {
  if (!mainWindow) return;

  if (show && !deephatBrowserView) {
    createDeepHatView();
  } else if (!show && deephatBrowserView) {
    mainWindow.removeBrowserView(deephatBrowserView);
    deephatBrowserView = null;
  }
});

/**
 * Reload DeepHat view
 */
ipcMain.on('reload-deephat', () => {
  if (deephatBrowserView) {
    deephatBrowserView.webContents.reload();
  }
});

/**
 * File system operations
 */
ipcMain.handle('fs:readFile', async (event, filePath: string) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:writeFile', async (event, filePath: string, content: string) => {
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:readDir', async (event, dirPath: string) => {
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    // Limit to 500 items to prevent crashes
    const limitedEntries = entries.slice(0, 500);
    const items = limitedEntries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      path: path.join(dirPath, entry.name),
    }));
    return { success: true, items, truncated: entries.length > 500 };
  } catch (error: any) {
    console.error('Error reading directory:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:exists', async (event, filePath: string) => {
  try {
    await fs.promises.access(filePath);
    return { success: true, exists: true };
  } catch {
    return { success: true, exists: false };
  }
});

ipcMain.handle('fs:stat', async (event, filePath: string) => {
  try {
    const stats = await fs.promises.stat(filePath);
    return {
      success: true,
      stats: {
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modified: stats.mtime,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:createFile', async (event, filePath: string) => {
  try {
    await fs.promises.writeFile(filePath, '', 'utf-8');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:createFolder', async (event, folderPath: string) => {
  try {
    await fs.promises.mkdir(folderPath, { recursive: false });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:delete', async (event, itemPath: string) => {
  try {
    const stats = await fs.promises.stat(itemPath);
    if (stats.isDirectory()) {
      await fs.promises.rmdir(itemPath, { recursive: true });
    } else {
      await fs.promises.unlink(itemPath);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs:rename', async (event, oldPath: string, newPath: string) => {
  try {
    await fs.promises.rename(oldPath, newPath);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/**
 * App info
 */
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getUserDataPath', () => {
  return app.getPath('userData');
});

/**
 * Config storage
 */
ipcMain.handle('config:read', async () => {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    if (fs.existsSync(configPath)) {
      const content = await fs.promises.readFile(configPath, 'utf-8');
      return { success: true, config: JSON.parse(content) };
    }
    return { success: true, config: {} };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('config:write', async (event, config: any) => {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/**
 * Hashing utilities
 */
ipcMain.handle('crypto:hash', (event, algorithm: string, data: string) => {
  try {
    const hash = crypto.createHash(algorithm).update(data).digest('hex');
    return { success: true, hash };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/**
 * Network utilities
 */
ipcMain.handle('net:scanPort', async (event, host: string, port: number, timeout = 1000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isOpen = false;

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      isOpen = true;
      socket.destroy();
    });

    socket.on('timeout', () => {
      socket.destroy();
    });

    socket.on('error', () => {
      socket.destroy();
    });

    socket.on('close', () => {
      resolve({ success: true, isOpen, host, port });
    });

    socket.connect(port, host);
  });
});

ipcMain.handle('net:dnsLookup', async (event, hostname: string) => {
  try {
    const addresses = await dnsResolve(hostname);
    return { success: true, addresses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('net:reverseDns', async (event, ip: string) => {
  try {
    const hostnames = await dnsReverse(ip);
    return { success: true, hostnames };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('net:httpFetch', async (event, url: string, options: any = {}) => {
  try {
    const https = require('https');
    const http = require('http');
    const urlModule = require('url');
    
    const parsedUrl = urlModule.parse(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const lib = isHttps ? https : http;
    
    return new Promise((resolve, reject) => {
      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.path,
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: options.timeout || 10000,
      };
      
      const req = lib.request(requestOptions, (res: any) => {
        let data = '';
        res.on('data', (chunk: any) => { data += chunk; });
        res.on('end', () => {
          const headers: Record<string, string> = {};
          Object.keys(res.headers).forEach(key => {
            headers[key] = res.headers[key];
          });
          
          resolve({
            success: true,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            data,
          });
        });
      });
      
      req.on('error', (error: any) => {
        resolve({ success: false, error: error.message });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Request timeout' });
      });
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

/**
 * Dialog operations
 */
ipcMain.handle('dialog:openFile', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
  });
  return result;
});

ipcMain.handle('dialog:saveFile', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showSaveDialog(mainWindow!, {});
  return result;
});

ipcMain.handle('dialog:openDirectory', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
  });
  return result;
});

/**
 * Terminal operations
 */
const terminals = new Map<string, pty.IPty>();

ipcMain.handle('terminal:spawn', (event, terminalId: string, shell?: string, cwd?: string) => {
  try {
    // Auto-detect shell based on OS
    if (!shell) {
      if (process.platform === 'win32') {
        shell = 'powershell.exe';
      } else if (process.platform === 'darwin') {
        shell = '/bin/zsh'; // macOS default
      } else {
        shell = '/bin/bash'; // Linux default
      }
    }
    
    console.log(`Spawning terminal ${terminalId} with shell ${shell} on ${process.platform}`);
    
    // Use node-pty for proper PTY with echo and interactive mode
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: cwd || process.cwd(),
      env: process.env as { [key: string]: string },
    });

    if (!ptyProcess || !ptyProcess.pid) {
      throw new Error('Failed to spawn terminal process');
    }

    terminals.set(terminalId, ptyProcess);

    // Handle data from terminal
    ptyProcess.onData((data: string) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('terminal:data', terminalId, data);
      }
    });

    // Handle terminal exit
    ptyProcess.onExit(({ exitCode }: { exitCode: number; signal?: number }) => {
      console.log(`Terminal ${terminalId} exited with code ${exitCode}`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('terminal:exit', terminalId, exitCode);
      }
      terminals.delete(terminalId);
    });

    console.log(`Terminal ${terminalId} spawned successfully with PID ${ptyProcess.pid}`);
    return { success: true, pid: ptyProcess.pid };
  } catch (error: any) {
    console.error('Error spawning terminal:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('terminal:write', (event, terminalId: string, data: string) => {
  const terminal = terminals.get(terminalId);
  if (terminal) {
    try {
      terminal.write(data);
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to write to terminal ${terminalId}:`, error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('terminal:resize', (event, terminalId: string, cols: number, rows: number) => {
  const terminal = terminals.get(terminalId);
  if (terminal) {
    try {
      terminal.resize(cols, rows);
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to resize terminal ${terminalId}:`, error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('terminal:kill', (event, terminalId: string) => {
  const terminal = terminals.get(terminalId);
  if (terminal) {
    try {
      terminal.kill();
      terminals.delete(terminalId);
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to kill terminal ${terminalId}:`, error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Terminal not found' };
});

/**
 * Handle getting initial file/folder to open
 */
ipcMain.handle('app:getInitialPath', () => {
  return fileToOpen;
});

/**
 * App lifecycle
 */
app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();
  console.log('Window created successfully');
  
  // Power monitoring to watch for sleep/wake behaviors
  powerMonitor.on('suspend', () => {
    console.log('System going to sleep');
  });

  powerMonitor.on('resume', () => {
    console.log('System waking up - forcing repaint');
    
    if (mainWindow && !mainWindow.isDestroyed()) {
      // Force the main window to repaint instead of reload
      mainWindow.invalidateShadow();
      mainWindow.webContents.invalidate();
      
      // Hide and show to force full re-render
      mainWindow.hide();
      setTimeout(() => {
        mainWindow?.show();
      }, 100);
    }
    
    // Handle DeepHat BrowserView separately with a small delay
    if (deephatBrowserView && !deephatBrowserView.webContents.isDestroyed()) {
      setTimeout(() => {
        deephatBrowserView?.webContents.invalidate();
        deephatBrowserView?.webContents.reload();
      }, 150);
    }
  });
  
  // Initialize Discord Rich Presence immediately
  console.log('Initializing Discord RPC...');
  initDiscordRPC();
  
  // Retry if first attempt fails
  setTimeout(() => {
    if (!isDiscordConnected()) {
      console.log('Discord RPC not connected, retrying...');
      initDiscordRPC();
    }
  }, 3000);
  
  // Send initial file path to renderer after window loads
  if (fileToOpen && mainWindow) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow?.webContents.send('open-initial-path', fileToOpen);
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Handle opening files from Windows Explorer when app is already running
app.on('second-instance', (_event, commandLine) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    
    const filePath = commandLine[commandLine.length - 1];
    if (filePath && !filePath.includes('--') && fs.existsSync(filePath)) {
      mainWindow.webContents.send('open-initial-path', filePath);
    }
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.on('window-all-closed', () => {
  disconnectDiscordRPC();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Discord RPC IPC handlers
ipcMain.on('discord:update-activity', (_event, fileName: string | null) => {
  if (fileName) {
    updateActivity('Editing', fileName);
  } else {
    updateActivity('Idling', null);
  }
});
