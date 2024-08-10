import React from 'react';
import Select from 'react-select';

const StudentManagement = ({ students, studentOptions, handleStudentChange }) => {
  return (
    <div>
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
    </div>
  );
};

export default StudentManagement;
