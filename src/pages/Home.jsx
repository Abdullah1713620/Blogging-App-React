// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const allBlogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(allBlogs);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Welcome To My Blogging App</h2>
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Blogs!</h2>
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="text-xl font-bold">{blog.title}</h3>
          <p className="text-sm text-gray-600">by {blog.username} on {new Date(blog.createdAt.seconds * 1000).toLocaleString()}</p>
          <p className="mt-2">{blog.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
