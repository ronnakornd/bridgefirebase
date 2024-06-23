import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import QuillEditor from '../components/QuillEditor';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [image, setImage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let cover = '';
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Handle progress if needed
        },
        error => {
          console.error('Error uploading image:', error);
        },
        async () => {
          cover = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "posts"), {
            title,
            content,
            description,
            cover,
            createdAt: Timestamp.now()
          });
          setTitle('');
          setContent('');
          setDescription('');
          setImage(null);
        }
      );
    } else {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        createdAt: Timestamp.now()
      });
      setTitle('');
      setContent('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };


  useEffect(() => {
    // Cleanup function to revoke the object URL
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <form onSubmit={handleSubmit} className="w-4/4 md:w-3/4 mx-auto py-32 px-5">
      <div className="w-full px-5 mb-2 bg-stone-300 rounded-xl shadow-md">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a href="/">หน้าแรก</a>
            </li>
            <li>
              <a className="link active">สร้างบทความ</a>
            </li>
          </ul>
        </div>
      </div>
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
        <label className="label" htmlFor="title">Description</label>
        <input
          id="title"
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
          className="file-input w-full max-w-xs"
          onChange={handleImageChange}
        />
      </div>
      {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" className="mt-4" />}
      <div className="form-control mt-4">
        <button type="submit" className="btn btn-primary">Add Post</button>
      </div>
    </form>
  );
}

export default NewPost;
