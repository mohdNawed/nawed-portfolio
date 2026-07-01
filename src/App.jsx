import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HireModal from './components/HireModal';
import NotFound from './components/NotFound';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AdminPanel from './components/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  const [hireOpen, setHireOpen] = useState(false);

  return (
    <AuthProvider>
      <Navbar onHireClick={() => setHireOpen(true)} />
      <Routes>
        <Route path="/" element={<Home onHireClick={() => setHireOpen(true)} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </AuthProvider>
  );
}

export default App;
