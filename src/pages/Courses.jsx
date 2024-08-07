// src/CourseManagement.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Breadcrumbs from "../components/Breadcrumbs";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [level, setLevel] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const fetchCourses = async () => {
    const coursesSnapshot = await getDocs(collection(db, "courses"));
    setCourses(
      coursesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    setUnfilteredCourses(
      coursesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "courses"), {
      title,
      description,
      subject,
      level,
      instructors: [],
      students: [],
      sections: [],
    });
    alert("สร้างคอร์สเรียบร้อย");
    setTitle("");
    setDescription("");
    fetchCourses();
  };

  const handleDeleteCourse = async (id) => {
    await deleteDoc(doc(db, "courses", id));
    fetchCourses();
  };

  return (
    <div className=" mx-auto w-full">
      <div className="pt-24">
        <Breadcrumbs
          items={[
            { name: "หน้าแรก", link: "/" },
            { name: "คอร์ส", link: "/courses" },
          ]}
        />
      </div>
      <div className="mx-auto px-5  py-16">
        <h1 className="text-5xl font-bold mb-5">Course Management</h1>
        <form className="flex flex-col gap-2" onSubmit={handleAddCourse}>
          <label htmlFor="">Title</label>
          <input
            type="text"
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="">Description</label>
          <textarea
            className="input textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="">Subject</label>
          <select
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
          <label htmlFor="">Level</label>
          <select
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
          <button type="submit" className="btn btn-neutral w-1/4 self-center">
            Add Course
          </button>
        </form>
        <h2 className="text-4xl font-bold">Courses</h2>
        <div className="flex items-center gap-3 mb-4 mt-4">
          <label htmlFor="search" className="text-lg">
            Search:
          </label>
          <input
            type="text"
            id="search"
            className="input"
            placeholder="Search by title"
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              setFilterTitle(searchTerm);
            }}
          />
          {showFilter ? (
          <>
          <label htmlFor="">Subject:</label>
          <select
            className="input input-bordered w-48"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="" >Select Subject</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="Coding">Coding</option>
            <option value="Social">Social</option>
            <option value="Thai">Thai</option>
          </select>

          <label htmlFor="">Level:</label>
          <select
            className="input input-bordered w-48"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="" >Select Level</option>
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
          </>
          )
          : null}
          <button
            className="btn btn-neutral"
            onClick={() => setShowFilter(!showFilter)}>
            {showFilter ? "Hide" : "Filter"}
            </button>
        </div>
        <ul className="w-full ">
          {courses
            .filter((course) =>
              course.title.toLowerCase().includes(filterTitle) && course.subject.includes(subjectFilter) && course.level.includes(levelFilter)
            )
            .map((course) => (
              <li
                key={course.id}
                className="flex justify-between p-3 items-center gap-2 mb-2 bg-stone-300"
              >
                <div className="flex items-center gap-5">
                  <img src="" alt="" className="w-24 h-24" />
                  <div>
                  <h3 className="text-xl">{course.title}</h3>
                  <h4 className="text-sm text-blue-500">{course.subject}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm btn-neutral">Edit</button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDeleteCourse(course);
                      document.getElementById("delete_modal").showModal();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            ยืนยันการลบคอร์ส {deleteCourse ? deleteCourse.title : ""}
          </h3>
          <p className="py-4">
            คุณต้องการลบคอร์สนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-error"
                onClick={() => handleDeleteCourse(deleteCourse.id)}
              >
                Delete
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Courses;
