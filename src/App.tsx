import React, { useState } from 'react';
import {Keypair} from "@solana/web3.js"
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter, } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './login';





const App: React.FC = () => {

  return (
    <Router>
      <div>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/Home"
              element={<Home />}
            />
            <Route
              path="/about"
              element={<About />}
            />
          </Routes>

      </div>
    </Router>
  );
};


export default App;
