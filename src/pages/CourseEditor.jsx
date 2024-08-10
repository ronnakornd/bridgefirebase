import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import Breadcrumbs from '../components/Breadcrumbs';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import InstructorManagement from '../components/InstructorManagement';
import StudentManagement from '../components/StudentManagement';
import SectionManagement from '../components/SectionManagement';

const CourseEditor = () => {
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const data = courseDoc.data();
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setSubject(data.subject);
        setLevel(data.level);
        setCoverImagePreview(data.coverImage);
        setInstructors(data.instructors || []);
        setStudents(data.students || []);
      }
    };

    fetchCourse();
    fetchUsers();
    fetchSections();
  }, [courseId]);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  const fetchSections = async () => {
    const q = query(collection(db, 'sections'), where('courseId', '==', courseId));
    const querySnapshot = await getDocs(q);
    const fetchedSections = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSections(fetchedSections.sort((a, b) => a.order - b.order));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        title,
        description,
        subject,
        level,
        instructors,
        students
      });

      if (coverImage) {
        if (course.coverImage) {
          const oldImageRef = ref(storage, course.coverImage);
          await deleteObject(oldImageRef);
        }
        const storageRef = ref(storage, `course-covers/${coverImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, coverImage);

        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Upload failed:', error);
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, 'courses', courseId), {
              coverImage: downloadURL,
            });
            setUploading(false);
            alert('Course updated successfully');
          }
        );
      } else {
        setUploading(false);
        alert('Course updated successfully');
      }
    } catch (error) {
      console.error('Error updating course: ', error);
      setUploading(false);
    }
  };

  const instructorOptions = users
    .filter(user => user.role === 'instructor')
    .map(user => ({
      value: user.id,
      label: user.name,
    }));

  const studentOptions = users
    .filter(user => user.role === 'student')
    .map(user => ({
      value: user.id,
      label: user.name,
    }));

  const handleInstructorChange = (selectedOptions) => {
    setInstructors(selectedOptions.map(option => option.value));
  };

  const handleStudentChange = (selectedOptions) => {
    setStudents(selectedOptions.map(option => option.value));
  };

  return (
    <div className="mx-auto w-full">
      <div className="pt-24">
        <Breadcrumbs
          items={[
            { name: 'หน้าแรก', link: '/' },
            { name: 'คอร์ส', link: '/courses' },
            { name: 'แก้ไขคอร์ส', link: `/courses/${courseId}/edit` },
          ]}
        />
      </div>
      <div className="mx-auto px-5 py-16">
        <h1 className="text-5xl font-bold mb-5">Edit Course</h1>
        <form className="flex flex-col gap-2" onSubmit={handleUpdateCourse}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="input textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="Coding">Coding</option>
            <option value="Social">Social</option>
            <option value="Thai">Thai</option>
          </select>
          <label htmlFor="level">Level</label>
          <select
            id="level"
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="preschool">อนุบาล</option>
            <option value="pratom1">ป.1</option>
            <option value="pratom2">ป.2</option>
            <option value="pratom3">ป.3</option>
            <option value="pratom4">ป.4</option>
            <option value="pratom5">ป.5</option>
            <option value="pratom6">ป.6</option>
            <option value="m1">ม.1</option>
            <option value="m2">ม.2</option>
            <option value="m3">ม.3</option>
          </select>
          <label htmlFor="coverImage">Cover Image (Optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {coverImagePreview && (
            <img src={coverImagePreview} alt="Cover Preview" className="w-24 h-24 mt-2" />
          )}

          <InstructorManagement 
            instructors={instructors}
            instructorOptions={instructorOptions}
            handleInstructorChange={handleInstructorChange}
          />

          <StudentManagement 
            students={students}
            studentOptions={studentOptions}
            handleStudentChange={handleStudentChange}
          />

          <SectionManagement 
            sections={sections}
            courseId={courseId}
            newSectionTitle={newSectionTitle}
            newSectionDescription={newSectionDescription}
            setNewSectionTitle={setNewSectionTitle}
            setNewSectionDescription={setNewSectionDescription}
            fetchSections={fetchSections}
            setSections={setSections}
          />

          <button type="submit" className="btn btn-neutral w-1/4 self-center mt-8" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Update Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
