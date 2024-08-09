import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import Breadcrumbs from '../components/Breadcrumbs';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
      setSections(data.sections || []);
    }
  };

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchCourse();
    fetchUsers();
  }, [courseId]);

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
      // Update the course data in Firestore
      await updateDoc(doc(db, 'courses', courseId), {
        title,
        description,
        subject,
        level,
        instructors,
        students,
        sections, // Include sections in the course update
      });

      if (coverImage) {
        // If a new cover image is uploaded, delete the old image and upload the new one
        if (course.coverImage) {
          const oldImageRef = ref(storage, course.coverImage);
          await deleteObject(oldImageRef);
        }
        const storageRef = ref(storage, `course-covers/${coverImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, coverImage);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Optional: handle upload progress
          },
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

  const handleInstructorChange = (selectedOptions) => {
    setInstructors(selectedOptions.map(option => option.value));
  };

  const handleStudentChange = (selectedOptions) => {
    setStudents(selectedOptions.map(option => option.value));
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

  const handleAddSection = () => {
    setSections([
      ...sections,
      { title: newSectionTitle, description: newSectionDescription }
    ]);
    setNewSectionTitle('');
    setNewSectionDescription('');
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, key, value) => {
    const updatedSections = sections.map((section, i) => 
      i === index ? { ...section, [key]: value } : section
    );
    setSections(updatedSections);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
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

          <h2 className="text-4xl font-bold mt-8">Manage Instructors</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Instructors</h3>
              <Select
                isMulti
                options={instructorOptions}
                value={instructors.map(id => instructorOptions.find(option => option.value === id))}
                onChange={handleInstructorChange}
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold mt-8">Manage Students</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Students</h3>
              <Select
                isMulti
                options={studentOptions}
                value={students.map(id => studentOptions.find(option => option.value === id))}
                onChange={handleStudentChange}
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold mt-8">Manage Sections</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-4"
                >
                  {sections.map((section, index) => (
                    <Draggable key={index} draggableId={`section-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex flex-col gap-2 bg-gray-100 p-3 rounded shadow"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl">Section {index + 1}</h3>
                            <button 
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => handleRemoveSection(index)}
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Section Title"
                            className="input"
                            value={section.title}
                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                          />
                          <textarea
                            placeholder="Section Description"
                            className="input textarea"
                            value={section.description}
                            onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-xl">Add New Section</h3>
            <input
              type="text"
              placeholder="New Section Title"
              className="input"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
            <textarea
              placeholder="New Section Description"
              className="input textarea"
              value={newSectionDescription}
              onChange={(e) => setNewSectionDescription(e.target.value)}
            />
            <button 
              type="button" 
              className="btn btn-neutral mt-2"
              onClick={handleAddSection}
            >
              Add Section
            </button>
          </div>

          <button type="submit" className="btn btn-neutral w-1/4 self-center mt-8" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Update Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
