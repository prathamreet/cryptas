// lib/crypto.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your_shared_secret_key_2024';
const MARKER = '~';

export function process(text: string): { result: string; mode: 'encrypt' | 'decrypt' } {
  if (!text.trim()) return { result: '', mode: 'encrypt' };
  
  if (text.startsWith(MARKER)) {
    try {
      const cleaned = text.slice(1);
      const decrypted = CryptoJS.AES.decrypt(cleaned, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      if (result) {
        return { result, mode: 'decrypt' };
      }
    } catch {
      // Fall through to encrypt
    }
  }
  
  const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  return { result: MARKER + encrypted, mode: 'encrypt' };
}