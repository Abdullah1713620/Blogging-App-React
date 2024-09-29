import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else {
        setError('Error logging in. Please try again.');
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>} {}
      {success && (
        <div className="bg-green-500 text-white text-center p-2 rounded mb-4 animate-fade-in">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2 font-semibold">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <label className="block mb-2 font-semibold">Password</label>
        <input
          {...register('password')}
          type="password"
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Log In</button>
      </form>
    </div>
  );
};

export default Login;
