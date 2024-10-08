import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Transaction, sendAndConfirmTransaction, PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { devnetConnection } from '../solanaConnection';

import * as buffer from 'buffer';
import { FaUserCircle } from 'react-icons/fa';
import './Home.css'; // CSS dosyasını import ediyoruz

window.Buffer = buffer.Buffer; // Import'lardan sonra


const Home: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState<string>('0');
  const [publicKeyStr, setPublicKeyStr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [senderKeypair, setSenderKeypair] = useState<Keypair | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // Menü durumu için ekledik

  const navigate = useNavigate();

  useEffect(() => {
    const lamportsToSol = (lamports: number) => lamports / 1_000_000_000;

    const userKeypairString = localStorage.getItem('userKeypair');

    if (userKeypairString !== null) {
      const userKeypairData = JSON.parse(userKeypairString);
      const { publicKey, privateKey } = userKeypairData;

      setPublicKeyStr(publicKey);

      // Özel anahtarı Uint8Array'e dönüştür
      const privateKeyUint8Array = new Uint8Array(privateKey);

      // Keypair oluştur
      const keypair = Keypair.fromSecretKey(privateKeyUint8Array);
      setSenderKeypair(keypair);

      // Bakiye bilgisini al
      const userPublicKey = new PublicKey(publicKey);

      devnetConnection.getBalance(userPublicKey)
        .then(balance => {
          const balanceInSol = lamportsToSol(balance);
          setBalance(balanceInSol);
        })
        .catch(error => {
          console.error('Bakiye alınırken hata oluştu:', error);
        });
    } else {
      console.error('Kullanıcı keypair\'i localStorage\'da bulunamadı');
      navigate('/'); // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    }
  }, [navigate]);

  const handleSend = async () => {
    setLoading(true);
    try {
      if (senderKeypair !== null) {
        const recipientPublicKey = new PublicKey(recipientAddress);

        const lamports = parseFloat(amount) * 1_000_000_000; // SOL'den lamport'a çevir

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: recipientPublicKey,
            lamports: lamports,
          })
        );

        const signature = await sendAndConfirmTransaction(devnetConnection, transaction, [senderKeypair]);
        console.log('İşlem gönderildi:', signature);

        // Bakiye bilgisini güncelle
        const newBalance = await devnetConnection.getBalance(senderKeypair.publicKey);
        setBalance(newBalance / 1_000_000_000);
      } else {
        console.error('Gönderen keypair mevcut değil');
      }
    } catch (error) {
      console.error('İşlem gönderilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // localStorage'dan verileri temizle
    localStorage.removeItem('userKeypair');
    setSenderKeypair(null);
    setPublicKeyStr(null);

    // Login sayfasına yönlendir
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Kullanıcı simgesi ve açılır menü */}
      <div className="user-menu">
        <FaUserCircle className="user-icon" onClick={toggleMenu} />
        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Çıkış Yap</button>
            {/* İleride eklemek isterseniz diğer ayar seçenekleri */}
            {/* <button onClick={handleSettings}>Ayarlar</button> */}
          </div>
        )}
      </div>

      <h1>Ana Sayfaya Hoş Geldiniz!</h1>
      <p>Cüzdan Adresi: {publicKeyStr}</p>
      <p>Cüzdan Bakiyesi: {balance} SOL</p>
      <input
        type="text"
        placeholder="Alıcının Adresi"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Miktar (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSend} disabled={loading}>
        Gönder
      </button>
      {loading && <p>İşlem gerçekleştiriliyor...</p>}
    </div>
  );
};

export default Home;
