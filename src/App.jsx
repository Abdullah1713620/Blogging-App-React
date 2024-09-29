import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute element={<Dashboard />} user={user} />} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<Profile />} user={user} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
