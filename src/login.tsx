import React, { useState } from 'react';
import './App.css';
import {Keypair} from "@solana/web3.js"
import { BrowserRouter as Router, Route, Routes, Link, } from 'react-router-dom';
import Home from './components/Home';
import { useNavigate } from 'react-router-dom';



const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [wallet, setWallet] = useState<any>(null); // "any" tipini geçici olarak kullanabilirsiniz, daha spesifik bir tip tercih edilir
  // const fs = require('fs');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook


  
  const handleRegisterClick = () => {
    setIsRegistering(!isRegistering);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    interface User {
      email: string;
      password: string;
      publicKey: string;
      privateKey: string;
    }
  
    e.preventDefault();
  
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
  
    // Solana cüzdanı oluştur
    const newAccount = Keypair.generate();
  
    const user: User = {
      email,
      password,
      publicKey: newAccount.publicKey.toString(),
      privateKey: newAccount.secretKey.toString(),
    };
  
    try {
      // API'ye POST isteği gönder
      const response = await fetch('http://localhost:3010/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: { success: boolean; error?: string } = await response.json();

      if (data.success) {
        console.log('User registered successfully');
        
        navigate('/Home');


      } else {
        console.error('Registration failed:', data.error ?? 'Unknown error');
      }
    } catch (error) {
      console.error('Error registering user:', (error as Error).message ?? 'Unknown error');
    }
  };
  
  

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3010/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.status === 401) {
        console.error('Invalid credentials. Authentication failed.');
        setErrorMessage('Invalid credentials. Authentication failed.');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
        
        return;
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success) {

        // Burada giriş başarılı olduğunda yapılacak işlemleri gerçekleştirebilirsiniz
        
        console.log('Login successful');
        console.log(data.publicKey);

        

        localStorage.setItem('privatedata', data.privateKey);
        localStorage.setItem('data', data.publicKey);
        localStorage.setItem('userData', JSON.stringify(data.userData));
        window.location.href = '/Home';

        

        

      } else {
        console.error('Login failed:', data.error ?? 'Unknown error');
        setErrorMessage(data.error ?? 'Unknown error');
      }
    } catch (error) {
      console.error('Error during login:', (error as Error).message ?? 'Unknown error');
    }
  };
  
  
  

  return (

        <div className="App">
          {isRegistering ? (
            <section>
              <form onSubmit={handleRegisterSubmit}>
                <h1>Register</h1>
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
                  <label>Password</label>
                </div>
                <div className="inputbox">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label>Confirm Password</label>
                </div>
                <button type="submit">Register</button>
  
                <div className="login">
                  <p>
                    Already have an account?{' '}
                    <a href="#" onClick={handleRegisterClick}>
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </section>
          ) : (
            <section>
              <form onSubmit={handleLoginSubmit}>
                <h1>Login</h1>
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
                  <label>Password</label>
                </div>
                <button type="submit">Log in</button>
                {errorMessage && (
                  <div style={{ color: 'red', marginTop: '10px' }}>
                    {errorMessage}
                  </div>
                )}
                <div className="register">
                  <p>
                    Don't have an account{' '}
                    <a href="#" onClick={handleRegisterClick}>
                      Register
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
