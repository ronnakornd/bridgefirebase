import React from 'react';
import Select from 'react-select';

const InstructorManagement = ({ instructors, instructorOptions, handleInstructorChange }) => {
  return (
    <div>
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
    </div>
  );
};

export default InstructorManagement;
