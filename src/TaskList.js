import React from 'react';

const TaskList = ({ tasks, deleteTask, setTaskName, setResourcesNeeded, setSpecialtyRequired, setUrgency, setImportance, setPriority, setDaysToFinish, setEditIndex, setEditTaskState }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={task.id}>
          {task.taskName} - {task.resourcesNeeded} - {task.specialtyRequired} -
          Urgency: {task.urgency} - Importance: {task.importance} - Priority: {task.priority}
          <button onClick={() => {
            setTaskName(task.taskName);
            setResourcesNeeded(task.resourcesNeeded);
            setSpecialtyRequired(task.specialtyRequired);
            setUrgency(task.urgency);
            setImportance(task.importance);
            setPriority(task.priority);
            setDaysToFinish(task.daysToFinish);
            setEditIndex(index);
            setEditTaskState(task);
          }}>Edit</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
