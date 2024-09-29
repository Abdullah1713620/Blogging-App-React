import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
    } else {
      setUsername(user.displayName);
    }
  }, [navigate]);

  const handleUpdateUsername = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: username });
      alert('Username updated successfully');
    } catch (error) {
      setError(`Error updating username: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      alert('Password updated successfully');
    } catch (error) {
      setError(`Error updating password: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Profile</h2>
      {error && <p className="text-red-500">{error}</p>} {}
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <label className="block mb-2 font-semibold">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button onClick={handleUpdateUsername} className="w-full bg-blue-500 text-white p-2 rounded">
          Update Username
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2 font-semibold">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2 font-semibold">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2 font-semibold">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button onClick={handleChangePassword} className="w-full bg-blue-500 text-white p-2 rounded">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
