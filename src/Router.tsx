
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// components
import Home from './components/Home';


const RouteComponent = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />

            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default RouteComponent