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
    <div className="bulletin-board p-4 md:p-10 h-screen md:h-auto w-full flex justify-center items-center flex-col">
      <h2 className="text-3xl font-bold text-center mb-4">ข่าวสาร</h2>
      <div className="bulletin-posts grid grid-cols-1 w-full md:grid-cols-2 gap-4">
        {posts.length > 0 &&
          <a href={`/post/${posts[0].id}`} key={posts[0].id} className="bulletin-post h-10/12 card card-body p-4 border rounded shadow-lg bg-white hover:bg-slate-300 cursor-pointer">
            {posts[0].cover && (
              <img src={posts[0].cover} alt={posts[0].title} className="w-full h-3/4 object-cover mt-2" />
            )}
            <h3 className="text-xl font-semibold">{posts[0].title}</h3>
            <p className="text-gray-700">{posts[0].description}</p>
          </a>
        }
        <div>
        {posts.slice(1).map(post => (
          <a href={`/post/${post.id}`} key={post.id} className="flex p-4 border rounded shadow-lg bg-white gap-3 hover:bg-slate-300 cursor-pointer">
            {post.cover && (
              <img src={post.cover} alt={post.title} className="w-1/4 h-20 object-cover mt-2" />
            )}
            <div className='w-3/4'>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-700">{post.description}</p>
            </div>
          </a>
        ))}
        </div>
      </div>
      <div className='p-5 w-full flex justify-center items-center gap-2'>
        <a href="/bloglist" className='btn capitalize btn-accent'>เพิ่มเติม</a>
        <a href="/newpost" className='btn capitalize btn-neutral'>new post</a>
      </div>
    </div>
  );
}

export default Bulletin;
