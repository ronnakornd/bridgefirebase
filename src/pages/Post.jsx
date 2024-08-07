import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDoc, doc, getFirestore } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { convertTimestamp } from "../util/ConvertTime";
import { useOutletContext } from "react-router-dom";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useOutletContext();

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
    <div className="pt-20 md:pt-40 md:pb-20 flex flex-col min-h-screen md:justify-center md:items-center gap-2">
      <div className="w-full hidden md:block md:w-3/4 px-5 bg-stone-300 rounded-xl shadow-md"></div>
      <div className="w-4/4 md:w-3/4 h-auto p-10 bg-white shadow-lg rounded-lg">
        <a href="/bloglist" className="relative -left-5 -top-5 text-stone-300 hover:text-stone-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 16l1.4-1.4l-1.6-1.6H16v-2h-4.2l1.6-1.6L12 8l-4 4zm0 6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
            ></path>
          </svg>
        </a>
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-sm mb-2">{convertTimestamp(post.createdAt)}</p>
        {user && user.role == "admin" && (
          <a href={`/editpost/${id}`} className="btn btn-secondary btn-xs mb-5">
            แก้ไข
          </a>
        )}
        <p
          className="text-gray-600 prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></p>
      </div>
    </div>
  );
}

export default Post;
