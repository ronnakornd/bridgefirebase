import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { convertTimestamp } from "../util/ConvertTime";
import { useOutletContext } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [deletePost, setDeletePost] = useState(null);
  const [user,setUser] = useOutletContext();


  useEffect(() => {
    const fetchPosts = async () => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), );
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
  
      fetchPosts();
  }, []);

  // Get current posts
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(posts.filter(post => post.id !== id));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pt-24 pb-20 min-h-screen flex flex-col justify-between items-center gap-2 ">
      <Breadcrumbs items={[{name:'หน้าแรก',link:'/'},{name:'บทความ',link:'/bloglist'}]} />
      <div className=" flex flex-col justify-start min-h-screen items-center pt-5 gap-2 w-full ">
        {posts.map((post) => (
          <a
            href={`/post/${post.id}`}
            key={post.id}
            className="md:w-11/12 w-11/12 flex gap-2 items-center bg-base-200 p-5 rounded-xl shadow-lg hover:bg-slate-300 cursor-pointer"
          >
            <img src={post.cover} alt="" className="w-1/4 h-20 object-cover" />
            <div className="w-full">
              <h2 className="text-2xl font-bold">{post.title}    {user && user.role == "admin" &&
                <button className="mr-5" onClick={(e)=> {e.stopPropagation(); e.preventDefault();setDeletePost(post);document.getElementById('delete_modal').showModal();}} className="btn btn-error btn-xs float-right">delete</button>
              }</h2>
              <p>{post.description}</p>
              <p className="text-sm float-right text-slate-400">
                {convertTimestamp(post.createdAt)}
              </p>
            </div>
          </a>
        ))}
      </div>
      <div>
        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map(
          (_, index) => (
            <button
              className="btn btn-circle btn-neutral"
              key={index}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">ยืนยันการลบบทความ {deletePost? deletePost.title:""}</h3>
          <p className="py-4">
            คุณต้องการลบบทความนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error" onClick={()=>handleDelete(deletePost.id)}>Delete</button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BlogList;
