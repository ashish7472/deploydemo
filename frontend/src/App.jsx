import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Landing from './pages/LandingPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={</>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </div>
  );
};

export default App;
