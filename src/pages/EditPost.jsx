import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import QuillEditor from '../components/QuillEditor';
function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState(null);
  const [description, setDescription] = useState(''); // Add this line
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        setTitle(postData.title);
        setContent(postData.content);
        setDescription(postData.description); 
        setCoverUrl(postData.cover);
      } else {
        console.error('No such document!');
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCover(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newImageUrl = coverUrl;
    if (cover) {
      const storageRef = ref(storage, `images/${cover.name}`);
      const uploadTask = uploadBytesResumable(storageRef, cover);

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Handle progress if needed
        },
        error => {
          console.error('Error uploading image:', error);
        },
        async () => {
          newImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, 'posts', id), {
            title,
            content,
            description,
            cover: newImageUrl,
          });
          navigate('/');
        }
      );
    } else {
      await updateDoc(doc(db, 'posts', id), {
        title,
        content,
        description,
        imageUrl: newImageUrl,
      });
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto py-32 my-4">
      <div className="form-control">
        <label className="label" htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          className="input input-bordered"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-control mt-4">
        <label className="label" htmlFor="content">Content</label>
        <QuillEditor defaultValue={content} contentChange={setContent} />
      </div>
      <div className="form-control mt-4">
        <label className="label" htmlFor="image">Cover Image</label>
        <input
          id="image"
          type="file"
          className="file-input"
          onChange={handleImageChange}
        />
        {coverUrl && <img src={coverUrl} alt="Current" className="w-full h-48 object-cover mt-2" />}
      </div>
      <div className="form-control mt-4">
        <button type="submit" className="btn btn-primary">Update Post</button>
      </div>
    </form>
  );
}

export default EditPost;
