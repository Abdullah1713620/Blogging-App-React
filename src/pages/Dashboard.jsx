// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db } from '../firebase/config';
import { addDoc, collection, onSnapshot, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { register, handleSubmit, reset } = useForm();
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    // Redirect if user is not authenticated
    if (!user) {
      navigate('/login'); 
      return; // Ensure we exit early if there's no user
    }

    const q = query(collection(db, 'blogs'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userBlogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(userBlogs);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const onSubmit = async (data) => {
    const user = auth.currentUser;

    if (editing) {
      await updateDoc(doc(db, 'blogs', editing.id), {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
      });
      setEditing(null);
    } else {
      await addDoc(collection(db, 'blogs'), {
        userId: user.uid,
        username: user.displayName,
        title: data.title,
        content: data.content,
        createdAt: new Date(),
      });
    }

    reset(); // Reset form after submission
  };

  const handleEdit = (blog) => {
    setEditing(blog);
    reset(blog); // Populate form with the blog to be edited
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteDoc(doc(db, 'blogs', id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md mb-8">
        <input
          {...register('title')}
          placeholder="Blog Title"
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <textarea
          {...register('content')}
          placeholder="Blog Content"
          className="w-full mb-4 p-2 border rounded"
          rows={4}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {editing ? 'Update Blog' : 'Post Blog'}
        </button>
      </form>

      <div>
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="text-xl font-bold">{blog.title}</h3>
            <p className="text-sm text-gray-600">by {blog.username} on {new Date(blog.createdAt.seconds * 1000).toLocaleString()}</p>
            <p className="mt-2">{blog.content}</p>
            <div className="mt-4">
              <button onClick={() => handleEdit(blog)} className="mr-2 bg-yellow-500 px-3 py-1 text-white rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(blog.id)} className="bg-red-500 px-3 py-1 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
