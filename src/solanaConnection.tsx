// solanaConnection.tsx

import { Connection } from '@solana/web3.js';

export const mainnetConnection = new Connection('https://api.mainnet-beta.solana.com');
export const devnetConnection = new Connection('https://api.devnet.solana.com');
export const testnetConnection = new Connection('https://api.testnet.solana.com');
export const localConnection = new Connection('http://localhost:8899'); // Örnek bir local bağlantı
