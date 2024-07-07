import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import QuillEditor from '../components/QuillEditor';

function NewTeacher() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [education, setEducation] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [image, setImage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let profileImage = '';
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
          profileImage = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "teachers"), {
            name: name,
            subject: subject,
            education: education,
            image: profileImage,
            createdAt: Timestamp.now()
          });
          setName('');
          setSubject('');
          setEducation('');
          setImage(null);
        }
      );
    } else {
      await addDoc(collection(db, "teachers"), {
        name: name,
        subject: subject,
        education: education,
        createdAt: Timestamp.now()
      });
      setName('');
      setSubject('');
      setEducation('');
      setImage(null);
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
              <a className="link active">เพิ่มผู้สอน</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="form-control">
        <label className="label" htmlFor="title">ชื่อ</label>
        <input
          id="title"
          type="text"
          className="input input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="title">การศึกษา</label>
        <input
          id="title"
          type="text"
          className="input input-bordered"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          required
        />
      </div>
      <div className="form-control mt-4">
        <label className="label" htmlFor="content">วิชาที่สอน</label>
        <input
          id="title"
          type="text"
          className="input input-bordered"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="form-control mt-4">
        <label className="label" htmlFor="image">รูปภาพ</label>
        <input
          id="image"
          type="file"
          className="file-input w-full max-w-xs"
          onChange={handleImageChange}
        />
      </div>
      {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" className="mt-4" />}
      <div className="form-control mt-4">
        <button type="submit" className="btn btn-primary">เพิ่มผู้สอน</button>
      </div>
    </form>
  );
}

export default NewTeacher;
