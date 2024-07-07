import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "teachers"), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      setTeachers(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="text-3xl font-bold">ครูผู้สอน</div>
      <div className="w-full h-min-screen grid grid-cols-1 gap-4 mb-2 justify-center items-center">
        {teachers.map((teacher) => (
          <div className="flex justify-center items-center">
            <div
              key={teacher.id}
              className="p-4 flex flex-col justify-center items-center w-2/4"
            >
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-64 h-auto mb-4 rounded-xl"
              />
              <h3 className="text-xl font-bold">{teacher.name}</h3>
              <p className="text-gray-500">{teacher.education}</p>
              <p className="text-gray-600">สอน{teacher.subject}</p>
            </div>
          </div>
        ))}
        <div className="w-full flex justify-center items-center">
          <a href="/newteacher" className="btn btn-info btn-sm">
            เพิ่มผู้สอน
          </a>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
