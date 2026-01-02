import { create } from 'zustand';

export interface EditorTab {
  id: string;
  path: string;
  name: string;
  language: string;
  content: string;
  modified: boolean;
}

interface UIState {
  // Sidebar visibility
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;
  terminalVisible: boolean;
  terminalHeight: number;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  
  // Active sections
  activeLeftPanel: string;
  
  // Editor tabs
  tabs: EditorTab[];
  activeTabId: string | null;
  
  // Editor settings
  editorSettings: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  
  // Modals
  settingsOpen: boolean;
  aboutOpen: boolean;
  
  // Theme
  theme: 'dark';
  
  // Selection and content
  selectedText: string;
  setSelectedText: (text: string) => void;
  
  // Actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleTerminal: () => void;
  setTerminalHeight: (height: number) => void;
  setActiveLeftPanel: (panel: string) => void;
  
  openTab: (tab: EditorTab) => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  setLeftSidebarWidth: (width: number) => void;
  setRightSidebarWidth: (width: number) => void;
  updateEditorSettings: (settings: Partial<UIState['editorSettings']>) => void;
  
  openSettings: () => void;
  closeSettings: () => void;
  openAbout: () => void;
  closeAbout: () => void;
}

export const useStore = create<UIState>((set) => ({
  // Initial state
  leftSidebarVisible: true,
  rightSidebarVisible: true,
  terminalVisible: false,
  terminalHeight: 250,
  leftSidebarWidth: 250,
  rightSidebarWidth: 250,
  activeLeftPanel: 'explorer',
  selectedText: '',
  editorSettings: {
    fontSize: 15,
    tabSize: 2,
    wordWrap: false,
    minimap: true,
  },
  tabs: [
    {
      id: 'welcome',
      path: '',
      name: 'Welcome',
      language: 'markdown',
      content: `# Welcome to Null IDE

**NullSec - The Ultimate Hacker & Master Programmer IDE**

## Quick Start

- **Ctrl+O**: Open file
- **Ctrl+S**: Save file
- **Ctrl+Shift+P**: Command palette
- **Ctrl+B**: Toggle left sidebar
- **Ctrl+Shift+B**: Toggle right sidebar

## Features

✓ Monaco Editor with syntax highlighting
✓ 100+ hacking utilities
✓ 1000+ programmer tools
✓ Embedded DeepHat AI assistant
✓ Privacy-focused (local-only storage)

## Left Sidebar Tools

Explore the Swiss army knife of tools in the left sidebar:
- **File Explorer**: Browse and manage files
- **Hacking Tools**: Network, security, and penetration testing utilities
- **Programmer Utilities**: Text transformations, encoders, generators
- **System Tools**: OS information and diagnostics

## Right Sidebar

Access DeepHat AI - your uncensored hacker AI assistant - in the right sidebar.

---

**Privacy Notice**: All your code and data stays local. No telemetry, no tracking.
`,
      modified: false,
    },
  ],
  activeTabId: 'welcome',
  settingsOpen: false,
  aboutOpen: false,
  theme: 'dark',
  
  // Actions
  setSelectedText: (text) => set({ selectedText: text }),
  toggleLeftSidebar: () => set((state) => ({ leftSidebarVisible: !state.leftSidebarVisible })),
  toggleRightSidebar: () => set((state) => ({ rightSidebarVisible: !state.rightSidebarVisible })),
  toggleTerminal: () => set((state) => ({ terminalVisible: !state.terminalVisible })),
  setTerminalHeight: (height) => set({ terminalHeight: height }),
  setActiveLeftPanel: (panel) => set({ activeLeftPanel: panel }),
  
  openTab: (tab) =>
    set((state) => {
      const existingTab = state.tabs.find((t) => t.path === tab.path && tab.path !== '');
      if (existingTab) {
        return { activeTabId: existingTab.id };
      }
      return { tabs: [...state.tabs, tab], activeTabId: tab.id };
    }),
    
  closeTab: (tabId) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== tabId);
      const closedTabIndex = state.tabs.findIndex((t) => t.id === tabId);
      let newActiveId = state.activeTabId;
      
      if (tabId === state.activeTabId && newTabs.length > 0) {
        const newIndex = Math.min(closedTabIndex, newTabs.length - 1);
        newActiveId = newTabs[newIndex]?.id || null;
      }
      
      return { tabs: newTabs, activeTabId: newActiveId };
    }),

  closeAllTabs: () => set({ tabs: [], activeTabId: null }),
  
  closeOtherTabs: (tabId) =>
    set((state) => {
      const keepTab = state.tabs.find((t) => t.id === tabId);
      return keepTab ? { tabs: [keepTab], activeTabId: tabId } : state;
    }),
    
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  
  updateTabContent: (tabId, content) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, content, modified: true } : tab
      ),
    })),
    
  setLeftSidebarWidth: (width) => set({ leftSidebarWidth: width }),
  setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),
  updateEditorSettings: (newSettings) => 
    set((state) => ({ 
      editorSettings: { ...state.editorSettings, ...newSettings } 
    })),
    
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  openAbout: () => set({ aboutOpen: true }),
  closeAbout: () => set({ aboutOpen: false }),
}));
