import { useState } from 'react';
import { NftCert_backend } from 'declarations/NftCert_backend';
import First from './First';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './Profile';
import RealAssests from './RealAssests';
import MintOrReal from './MintOrReal';
import User from './User';
export default function App() {
  return (
    <Router>
     <Routes>
     <Route path="/" element={<MintOrReal />} />
     <Route path="/User" element={<User />} />
       <Route path="/First" element={<First />} />
       <Route path="/Profile" element={<Profile />} />
       <Route path="/RealAssests" element={<RealAssests />} />
     </Routes>
    </Router>
  // <>
  //   <RealAssests />
  // </>
  );
}

