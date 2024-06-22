import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDoc, doc, getFirestore } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { convertTimestamp } from '../util/ConvertTime';


function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
        const docRef = doc(db, "posts", id); // Assuming your collection is named "posts"
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setPost(docSnap.data());
          } else {
            console.log("No such document!");
          }
          setLoading(false);
      };
  
      fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='pt-40 pb-20 flex flex-col min-h-screen justify-center items-center'>
        <div className='w-3/4 h-auto p-10 bg-white shadow-lg rounded-lg'>
            <h2 className='text-2xl font-bold'>{post.title}</h2>
            <p className='text-sm mb-2'>{convertTimestamp(post.createdAt)}</p>
            <a href={`/editpost/${id}`} className="btn btn-secondary btn-xs">แก้ไข</a>
            <img src={post.cover} className='w-full' alt="" />
            <p className='text-gray-600 prose' dangerouslySetInnerHTML={{ __html: post.content}}></p>
        </div>
    </div>
  );
}

export default Post;