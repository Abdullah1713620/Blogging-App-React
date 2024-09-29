// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Blogging App</Link>
        <div>
          {user ? (
            <>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
              <Link to="/profile" className="mr-4">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/signup">
              <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition duration-200">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition duration-200">
                  Log In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
