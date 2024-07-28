import { useState } from 'react';
import { NftCert_backend } from 'declarations/NftCert_backend';
import First from './First';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './Profile';
import GiftBoxMultiplier from './Gift';
import RealAssests from './RealAssests';
export default function App() {
  return (
    <Router>
     <Routes>
       <Route path="/" element={<First />} />
       <Route path="/Profile" element={<Profile />} />
       <Route path="/RealAssests" element={<RealAssests />} />
     </Routes>
    </Router>
  // <>
  //   <RealAssests />
  // </>
  );
}

