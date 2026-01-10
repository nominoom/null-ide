import { useState } from 'react';
import styles from './Tool.module.css';

type Algorithm = 'AES-GCM' | 'AES-CBC' | 'RSA-OAEP';
type Mode = 'encrypt' | 'decrypt';

export default function EncryptionTool() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('AES-GCM');
  const [mode, setMode] = useState<Mode>('encrypt');
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [iv, setIv] = useState('');
  const [processing, setProcessing] = useState(false);

  const generateKey = async (password: string, algorithm: Algorithm): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const salt = enc.encode('NullIDE-Salt-2026'); // Fixed salt for demo
    
    if (algorithm.startsWith('AES')) {
      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: algorithm.split('-')[0], length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } else {
      // RSA would need different key generation
      throw new Error('RSA not implemented in this demo');
    }
  };

  const encryptData = async () => {
    if (!input.trim() || !password.trim()) {
      alert('Please enter data and password');
      return;
    }

    setProcessing(true);
    try {
      const enc = new TextEncoder();
      const data = enc.encode(input);
      const key = await generateKey(password, algorithm);
      const ivArray = crypto.getRandomValues(new Uint8Array(12));
      
      let encrypted: ArrayBuffer;
      
      if (algorithm === 'AES-GCM') {
        encrypted = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: ivArray },
          key,
          data
        );
      } else if (algorithm === 'AES-CBC') {
        const ivArray16 = crypto.getRandomValues(new Uint8Array(16));
        encrypted = await crypto.subtle.encrypt(
          { name: 'AES-CBC', iv: ivArray16 },
          key,
          data
        );
        setIv(Array.from(ivArray16).map(b => b.toString(16).padStart(2, '0')).join(''));
        setOutput(Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''));
        setProcessing(false);
        return;
      } else {
        throw new Error('Algorithm not supported');
      }

      const ivHex = Array.from(ivArray).map(b => b.toString(16).padStart(2, '0')).join('');
      const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
      
      setIv(ivHex);
      setOutput(encryptedHex);
    } catch (error: any) {
      alert('Encryption failed: ' + error.message);
    }
    setProcessing(false);
  };

  const decryptData = async () => {
    if (!output.trim() || !password.trim() || !iv.trim()) {
      alert('Please enter encrypted data, password, and IV');
      return;
    }

    setProcessing(true);
    try {
      const key = await generateKey(password, algorithm);
      const ivArray = new Uint8Array(iv.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      const encryptedArray = new Uint8Array(output.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

      let decrypted: ArrayBuffer;
      
      if (algorithm === 'AES-GCM') {
        decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: ivArray },
          key,
          encryptedArray
        );
      } else if (algorithm === 'AES-CBC') {
        decrypted = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv: ivArray },
          key,
          encryptedArray
        );
      } else {
        throw new Error('Algorithm not supported');
      }

      const dec = new TextDecoder();
      const decryptedText = dec.decode(decrypted);
      setInput(decryptedText);
    } catch (error: any) {
      alert('Decryption failed: ' + error.message);
    }
    setProcessing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.tool}>
      <div className={styles.toolHeader}>
        <div className={styles.toolTitle}>
          <span className={styles.toolIcon}>🔐</span>
          Encryption Tool
        </div>
        <div className={styles.toolSubtitle}>
          Encrypt and decrypt data using AES-GCM/CBC with Web Crypto API
        </div>
      </div>

      <div className={styles.toolContent}>
        <div className={styles.inputGroup}>
          <label>Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as Algorithm)}>
            <option value="AES-GCM">AES-256-GCM (Recommended)</option>
            <option value="AES-CBC">AES-256-CBC</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Password / Key</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter encryption password"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>{mode === 'encrypt' ? 'Plaintext Data' : 'Decrypted Data'}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter data to encrypt..."
            rows={6}
          />
        </div>

        {mode === 'decrypt' && (
          <div className={styles.inputGroup}>
            <label>Initialization Vector (IV) - Hex</label>
            <input
              type="text"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              placeholder="Enter IV in hex format"
            />
          </div>
        )}

        <button
          className={styles.primaryBtn}
          onClick={mode === 'encrypt' ? encryptData : decryptData}
          disabled={processing}
        >
          {processing ? 'Processing...' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>

        {mode === 'encrypt' && iv && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <label>Initialization Vector (IV) - Save this!</label>
              <button className={styles.copyBtn} onClick={() => copyToClipboard(iv)}>
                Copy
              </button>
            </div>
            <div className={styles.output}>{iv}</div>
          </div>
        )}

        {output && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <label>Encrypted Data (Hex)</label>
              <button className={styles.copyBtn} onClick={() => copyToClipboard(output)}>
                Copy
              </button>
            </div>
            <div className={styles.output}>{output}</div>
          </div>
        )}

        <div className={styles.infoBox}>
          <h3>Encryption Details</h3>
          <ul>
            <li><strong>AES-256-GCM:</strong> Authenticated encryption with associated data (AEAD)</li>
            <li><strong>AES-256-CBC:</strong> Cipher block chaining mode (requires separate authentication)</li>
            <li><strong>Key Derivation:</strong> PBKDF2 with 100,000 iterations and SHA-256</li>
            <li><strong>IV:</strong> Randomly generated for each encryption (must be saved for decryption)</li>
          </ul>
          <p className={styles.warning}>
            ⚠️ Store the IV along with the ciphertext. Without the IV, decryption is impossible. Use strong passwords (16+ characters).
          </p>
        </div>
      </div>
    </div>
  );
}
