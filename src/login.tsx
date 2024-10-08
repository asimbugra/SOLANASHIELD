// login.tsx
import React, { useState } from 'react';
import './App.css';
import { Keypair } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';

const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Sabit bir değer belirleyin
  const fixedValue = 'SABIT_DEGER'; // Bu değeri gizli tutun ve güçlü bir değer seçin

  // Email, şifre ve sabit değeri kullanarak keypair oluşturan fonksiyon
  const generateKeypair = (email: string, password: string): Keypair => {
    const combined = email + password + fixedValue;
    const hash = CryptoJS.SHA256(combined).toString();
    const seed = new Uint8Array(
      hash.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    ).slice(0, 32);
    console.log(Keypair.fromSeed(seed));
    return Keypair.fromSeed(seed);
  };

  const handleRegisterClick = () => {
    setIsRegistering(!isRegistering);
    setErrorMessage('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      setErrorMessage('Şifreler eşleşmiyor');
      return;
    }

    try {
      // Kullanıcının keypair'ini oluştur
      const userKeypair = generateKeypair(email, password);
      // Kullanıcının keypair'ini localStorage'a kaydet
      localStorage.setItem(
        'userKeypair',
        JSON.stringify({
          publicKey: userKeypair.publicKey.toString(),
          privateKey: Array.from(userKeypair.secretKey),
        })
      );
      console.log('Kullanıcı başarıyla kaydedildi');
      navigate('/Home');
    } catch (error) {
      console.error('Error generating keypair:', error);
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Kullanıcının keypair'ini oluştur
      const userKeypair = generateKeypair(email, password);
      // Kullanıcının keypair'ini localStorage'a kaydet
      localStorage.setItem(
        'userKeypair',
        JSON.stringify({
          publicKey: userKeypair.publicKey.toString(),
          privateKey: Array.from(userKeypair.secretKey),
        })
      );
      console.log('Giriş başarılı');
      navigate('/Home');
    } catch (error) {
      console.error('Error generating keypair:', error);
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="App">
      {isRegistering ? (
        <section>
          <form onSubmit={handleRegisterSubmit}>
            <h1>Kayıt Ol</h1>
            <div className="inputbox">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <div className="inputbox">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Şifre</label>
            </div>
            <div className="inputbox">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>Şifreyi Onayla</label>
            </div>
            <button type="submit">Kayıt Ol</button>

            {errorMessage && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
              </div>
            )}

            <div className="login">
              <p>
                Zaten bir hesabınız var mı?{' '}
                <button type="button" onClick={handleRegisterClick}>Giriş Yap</button>
              </p>
            </div>
          </form>
        </section>
      ) : (
        <section>
          <form onSubmit={handleLoginSubmit}>
            <h1>Giriş Yap</h1>
            <div className="inputbox">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <div className="inputbox">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Şifre</label>
            </div>
            <button type="submit">Giriş Yap</button>

            {errorMessage && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
              </div>
            )}

            <div className="register">
              <p>
                Henüz hesabınız yok mu?{' '}
                <a href="#" onClick={handleRegisterClick}>
                  Kayıt Ol
                </a>
              </p>
            </div>
          </form>
        </section>
      )}
      <script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
      ></script>
      <script
        noModule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
      ></script>
    </div>
  );
};

export default App;
