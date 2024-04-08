import React, { useEffect, useState } from 'react';
import { Transaction, sendAndConfirmTransaction, PublicKey, SystemProgram, Keypair} from '@solana/web3.js';
import { devnetConnection } from '../solanaConnection';

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [publicKeyStr, setPublicKeyStr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Yeni durum değişkeni: loading


  useEffect(() => {
    const lamportsToSol = (lamports: number) => {
      return lamports / 1000000000;
    };

    const publicKeyStr = localStorage.getItem('data');
    setPublicKeyStr(publicKeyStr);
    console.log(publicKeyStr);


    const senderPrivateKeyStr = localStorage.getItem('privatedata');

    if (senderPrivateKeyStr !== null) {
        // localStorage'dan özel anahtar başarıyla alındı
        // Şimdi geri kalan kodu buraya yerleştirin
        const base58 = require('bs58');
    
        // Verilen özel anahtar dizisi
        const privateKeyString = senderPrivateKeyStr;
    
        // Virgülle ayrılmış string'i sayılar dizisine dönüştür
        const numbersArray = privateKeyString.split(",").map(Number);
    
        // Sayılar dizisini bir Uint8Array (byte dizisi) haline getir
        const privateKeyBytes = new Uint8Array(numbersArray);
    
        // Byte dizisini base58 kodlayın
        const encodedPrivateKey = base58.encode(privateKeyBytes);
    
        console.log("Base58 kodlanmış özel anahtar:", encodedPrivateKey);
    } else {
        // localStorage'dan özel anahtar alınamadı
        console.error("localStorage'da 'privatedata' anahtarı bulunamadı veya null döndü.");
    }
    
    
    if (senderPrivateKeyStr !== null) {
      // Dizeyi virgüllerle ayırıp her bir elemanı onaltılık formata dönüştürüyoruz
      const privateKeyArray = senderPrivateKeyStr.split(',').map(Number);
      const privateKeyUint8Array = new Uint8Array(privateKeyArray);
      
      // fromSecretKey yöntemini kullanarak Keypair oluşturun
      const senderKeypair = Keypair.fromSecretKey(privateKeyUint8Array);
      console.log(senderKeypair.secretKey.toString());
      
      // Şimdi senderKeypair'i kullanabilirsiniz
  } else {
      console.error('Private key is missing from local storage');
  }
    // if (senderPrivateKeyStr !== null) {
    //     // Assuming senderPrivateKeyStr is a string representing numbers separated by commas
    //     const privateKeyNumbers = senderPrivateKeyStr.split(',').map(Number);
    //     const privateKey = new Uint8Array(privateKeyNumbers);
    //     console.log(privateKey.toString()); // Now privateKey can be used as needed



    // } else {
    //     // Handle the case where 'privatedata' is not found in localStorage
    //     console.error('Private key data not found in localStorage.');
    // }

    if (publicKeyStr !== null) {
      const publicKey = new PublicKey(publicKeyStr);

      devnetConnection.getBalance(publicKey)
        .then(balance => {
          const balanceInSol = lamportsToSol(balance);
          setBalance(balanceInSol);
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
        });
    }

    if (senderPrivateKeyStr === null) {
      console.error('Private key is missing from local storage');
    }
  }, []);

  const handleSend = async () => {
    try {
        const senderPrivateKeyStr = localStorage.getItem('privatedata');

        if (senderPrivateKeyStr !== null) {
            const base58 = require('bs58');

            const numbersArray = senderPrivateKeyStr.split(",").map(Number);
            const privateKeyBytes = new Uint8Array(numbersArray);

            const encodedPrivateKey = base58.encode(privateKeyBytes);

            console.log("Base58 kodlanmış özel anahtar:", encodedPrivateKey);

            const privateKeyUint8Array = base58.decode(encodedPrivateKey);
            const senderKeypair = Keypair.fromSecretKey(privateKeyUint8Array);

            const recipientPublicKey = new PublicKey(recipientAddress);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: senderKeypair.publicKey,
                    toPubkey: recipientPublicKey,
                    lamports: amount * 1000000000,
                })
            );

            const signature = await sendAndConfirmTransaction(devnetConnection, transaction, [senderKeypair]);
            console.log('Transaction sent:', signature);
            // İşlem başarıyla gönderildiğinde gerekli işlemleri burada yapabilirsiniz.
        } else {
            console.error('Private key is missing from local storage');
        }
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};


  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>wallet address: {publicKeyStr}</p>
      <p>Wallet Balance: {balance} SOL</p>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (in SOL)"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <button onClick={handleSend} disabled={loading}>Send</button> {/* Buton işlem sırasında devre dışı bırakılır */}
      {loading && <p>Loading...</p>} {/* İşlem sırasında loading durumu gösterilir */}
    </div>
  );
};

export default Home;
