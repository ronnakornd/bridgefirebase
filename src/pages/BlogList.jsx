import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebaseConfig"; // Import db from firebaseConfig.js

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        // Retrieve posts from Firebase
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));
            console.log(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchPosts();
    }, []);

    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth()+1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        date = dd + '/' + mm + '/' + yyyy;
        return date;
    }

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='pt-40 pb-20 h-screen flex flex-col justify-between items-center gap-2 '>
            <div className=' flex flex-col items-center gap-2 w-full '>
                {currentPosts.map((post) => (
                    <div key={post.id} className='md:w-10/12 w-11/12 flex gap-2 items-center bg-base-300 p-2 rounded-xl shadow-md hover:bg-slate-300 cursor-pointer'>
                        <img src={post.cover} alt="" className='w-1/4 h-20 object-cover' />
                        <div className='w-full'>
                        <h2 className='text-xl font-bold'>{post.title}</h2>
                        <p>{post.description}</p>
                        <p className='text-sm float-right'>{convertTimestamp(post.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Render pagination */}
            <div>
                {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
                    <button className='btn btn-circle btn-info' key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlogList;