import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db, storage } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SignUp = () => {
  const { register, handleSubmit } = useForm();
  const [image, setImage] = useState(null); 
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log('Attempting to create user...');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('User created:', user);

      
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
        console.log('Image uploaded:', imageUrl);
      }

      await updateProfile(user, { displayName: data.username, photoURL: imageUrl });
      console.log('User profile updated');


      await setDoc(doc(db, 'users', user.uid), {
        username: data.username,
        email: data.email,
        photoURL: imageUrl,
      });
      console.log('User data saved to Firestore');

    
      navigate('/');
      console.log('Redirecting to home page');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2 font-semibold">Username</label>
        <input
          {...register('username')}
          className="w-full mb-4 p-2 border rounded"
          required
        />
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
        <label className="block mb-2 font-semibold">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;