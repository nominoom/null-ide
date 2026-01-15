import { Client } from 'discord-rpc';

const clientId = '1459478156120428606'; // You'll need to create a Discord app and get this ID

let rpc: Client | null = null;
let connected = false;
let retryCount = 0;
const MAX_RETRIES = 3;

export function initDiscordRPC() {
  if (rpc) {
    console.log('Discord RPC already initialized');
    return;
  }

  // Don't retry if we've already exceeded max retries
  if (retryCount >= MAX_RETRIES) {
    console.log('Discord RPC max retries exceeded. Not attempting to connect.');
    return;
  }

  try {
    console.log('Initializing Discord RPC with Client ID:', clientId);
    rpc = new Client({ transport: 'ipc' });

    rpc.on('ready', () => {
      console.log('✅ Discord RPC connected successfully!');
      console.log('Make sure you uploaded assets (null-ide, code, idle) to Discord Developer Portal');
      connected = true;
      retryCount = 0; // Reset retry count on successful connection
      // Set initial activity
      setTimeout(() => {
        updateActivity('Idling', null);
      }, 500);
    });

    rpc.on('disconnected', () => {
      console.log('❌ Discord RPC disconnected');
      connected = false;
    });

    rpc.on('error', (err: Error) => {
      console.error('Discord RPC error:', err);
      connected = false;
    });

    // Login with retry mechanism
    rpc.login({ clientId }).then(() => {
      console.log('Discord RPC login successful');
    }).catch((err: Error) => {
      console.error('Failed to connect to Discord RPC:', err);
      console.error('Make sure Discord is running and the client ID is correct');
      connected = false;
      
      // Retry with limit
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          console.log(`Retrying Discord RPC connection... (${retryCount}/${MAX_RETRIES})`);
          rpc = null;
          initDiscordRPC();
        }, 5000);
      } else {
        console.log('Discord RPC connection failed after maximum retries. Giving up.');
        rpc = null;
      }
    });
  } catch (error) {
    console.error('Error initializing Discord RPC:', error);
    connected = false;
  }
}

export function updateActivity(state: string, fileName: string | null) {
  if (!rpc || !connected) {
    console.log('Discord RPC not connected, skipping activity update');
    return;
  }

  try {
    const activity: any = {
      details: fileName ? `Editing ${fileName}` : 'Hacking & Programming',
      state: fileName ? 'Working on code' : 'Null IDE - Security Toolkit',
      startTimestamp: Date.now(),
      largeImageKey: 'nullide',
      largeImageText: 'Null IDE',
      smallImageKey: fileName ? 'code' : 'idle',
      smallImageText: fileName ? 'Coding' : 'Idle',
      instance: false,
    };

    rpc.setActivity(activity).then(() => {
      console.log(`✅ Discord activity updated: ${fileName || 'Idling'}`);
    }).catch((err: Error) => {
      console.error('Failed to set Discord activity:', err);
    });
  } catch (error) {
    console.error('Error updating Discord activity:', error);
  }
}

export function clearActivity() {
  if (!rpc || !connected) return;
  rpc.clearActivity().catch((err: Error) => {
    console.error('Failed to clear Discord activity:', err);
  });
}

export function disconnectDiscordRPC() {
  if (rpc && connected) {
    try {
      rpc.destroy().catch((err: Error) => {
        console.error('Error destroying Discord RPC:', err);
      });
    } catch (error) {
      console.error('Error disconnecting Discord RPC:', error);
    }
  }
  rpc = null;
  connected = false;
}

export function isDiscordConnected(): boolean {
  return connected;
}
