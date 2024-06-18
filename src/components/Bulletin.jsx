import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Bulletin() {
  const [posts, setPosts] = useState([
  ]);

 useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchPosts();
  }, []); 

  return (
    <div className="bulletin-board p-4">
      <h2 className="text-2xl font-bold text-center mb-4">ข่าวสาร</h2>
      <div className="bulletin-posts grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="bulletin-post p-4 border rounded shadow-lg bg-white">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-700">{post.description}</p>
            {post.cover && (
              <img src={post.cover} alt={post.title} className="w-full h-48 object-cover mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bulletin;
