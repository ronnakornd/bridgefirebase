import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SectionManagement = ({
  sections,
  courseId,
  newSectionTitle,
  newSectionDescription,
  setNewSectionTitle,
  setNewSectionDescription,
  fetchSections,
  setSections
}) => {
  
  const handleAddSection = async () => {
    if (newSectionTitle.trim() === '' || newSectionDescription.trim() === '') return;

    const newSection = {
      title: newSectionTitle,
      description: newSectionDescription,
      courseId,
      order: sections.length, // Add order field
    };

    const docRef = await addDoc(collection(db, 'sections'), newSection);
    fetchSections(); // Refetch sections to include the new section
    setNewSectionTitle('');
    setNewSectionDescription('');
  };

  const handleRemoveSection = async (sectionId) => {
    await deleteDoc(doc(db, 'sections', sectionId));
    fetchSections(); // Refetch sections to exclude the deleted section
  };

  const handleSectionChange = async (sectionId, key, value) => {
    const sectionRef = doc(db, 'sections', sectionId);
    await updateDoc(sectionRef, { [key]: value });
    fetchSections(); // Optionally refetch sections after update
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedSections = reorder(
      sections,
      result.source.index,
      result.destination.index
    );

    // Update the order in the local state
    setSections(reorderedSections);

    // Update the order in Firestore
    await Promise.all(
      reorderedSections.map((section, index) =>
        updateDoc(doc(db, 'sections', section.id), { order: index })
      )
    );

    fetchSections(); // Optionally refetch sections after update
  };

  return (
    <div>
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
                <Draggable key={section.id} draggableId={section.id} index={index}>
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
                          onClick={() => handleRemoveSection(section.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Section Title"
                        className="input"
                        value={section.title}
                        onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                      />
                      <textarea
                        placeholder="Section Description"
                        className="input textarea"
                        value={section.description}
                        onChange={(e) =>
                          handleSectionChange(section.id, 'description', e.target.value)
                        }
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
        <button type="button" className="btn btn-neutral mt-2" onClick={handleAddSection}>
          Add Section
        </button>
      </div>
    </div>
  );
};

export default SectionManagement;
