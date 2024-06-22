import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';

const TeamList = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const snapshot = await db.collection('teachers').get();
                const teachersData = snapshot.docs.map((doc) => doc.data());
                setTeachers(teachersData);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
                <div key={teacher.id} className="p-4 bg-white rounded shadow">
                    <img src={teacher.image} alt={teacher.name} className="w-full h-auto mb-4 rounded" />
                    <h3 className="text-xl font-bold">{teacher.name}</h3>
                    <p className="text-gray-500">{teacher.role}</p>
                    <p className="text-gray-500">{teacher.education}</p>
                </div>
            ))}
        </div>
    );
};

export default TeamList;