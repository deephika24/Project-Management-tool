import React from 'react';

const TaskForm = ({
  taskName,
  setTaskName,
  resourcesNeeded,
  setResourcesNeeded,
  specialtyRequired,
  setSpecialtyRequired,
  urgency,
  setUrgency,
  importance,
  setImportance,
  priority,
  setPriority,
  daysToFinish,
  setDaysToFinish,
  handleFormSubmit,
  editIndex,
  resetFormFields,
  setEditIndex,
  setEditTaskState
}) => {
  return (
    <form onSubmit={handleFormSubmit}>
      {/* Task Name */}
      <div>
        <label htmlFor="taskName">Task Name:</label>
        <input type="text" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
      </div>
      {/* Resources Needed */}
      <div>
        <label htmlFor="resourcesNeeded">Resources Needed:</label>
        <input type="text" id="resourcesNeeded" value={resourcesNeeded} onChange={(e) => setResourcesNeeded(e.target.value)} />
      </div>
      {/* Specialty Required */}
      <div>
        <label htmlFor="specialtyRequired">Specialty Required:</label>
        <input type="text" id="specialtyRequired" value={specialtyRequired} onChange={(e) => setSpecialtyRequired(e.target.value)} />
      </div>
      {/* Urgency */}
      <div>
        <label htmlFor="urgency">Urgency:</label>
        <input type="number" id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
      </div>
      {/* Importance */}
      <div>
        <label htmlFor="importance">Importance:</label>
        <input type="number" id="importance" value={importance} onChange={(e) => setImportance(e.target.value)} />
      </div>
      {/* Priority */}
      <div>
        <label htmlFor="priority">Priority:</label>
        <input type="number" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} />
      </div>
      {/* Days to Finish */}
      <div>
        <label htmlFor="daysToFinish">Days to Finish:</label>
        <input type="number" id="daysToFinish" value={daysToFinish} onChange={(e) => setDaysToFinish(e.target.value)} />
      </div>
      {/* Buttons */}
      <button type="submit">Submit</button>
      {editIndex !== null && (
        <button onClick={() => {
          resetFormFields();
          setEditIndex(null);
          setEditTaskState(null);
        }}>Cancel</button>
      )}
    </form>
  );
};

export default TaskForm;
