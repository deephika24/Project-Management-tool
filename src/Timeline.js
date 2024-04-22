import React from 'react';

const Timeline = ({ startDate, endDate, tasks }) => {
  // Calculate total number of days for the project
  const projectStartDate = new Date(startDate);
  const projectEndDate = new Date(endDate);
  const totalDaysForProject = Math.floor((projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24));

  // Sort tasks based on the greedy approach: urgency, importance, priority
  const sortedTasks = [...tasks].sort((taskA, taskB) => {
    // Sort by urgency
    if (taskA.urgency !== taskB.urgency) {
      return taskA.urgency - taskB.urgency; // Sort in ascending order of urgency
    }
    // If urgency is equal, sort by importance
    if (taskA.importance !== taskB.importance) {
      return taskA.importance - taskB.importance; // Sort in descending order of importance
    }
    // If importance is equal, sort by priority
    return taskA.priority - taskB.priority; // Sort in descending order of priority
  });

  // Check if any task doesn't fit within the project duration
  const tasksExceedingProjectDuration = sortedTasks.filter(task => task.daysToFinish > totalDaysForProject);

  return (
    <div>
      <h3>Project Timeline</h3>
      <p>Start Date: {startDate}</p>
      <p>End Date: {endDate}</p>
      <p>Total Number of Days for Project: {totalDaysForProject}</p>
      {/* Display tasks exceeding project duration */}
      {tasksExceedingProjectDuration.length > 0 && (
        <div>
          <h4>Tasks Exceeding Project Duration:</h4>
          <ul>
            {tasksExceedingProjectDuration.map(task => (
              <li key={task.id}>
                Task Name: {task.taskName} | Days to Finish: {task.daysToFinish}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Display sorted task names with number of days to finish */}
      <h4>Task Details:</h4>
      <ul>
        {sortedTasks.map((task) => (
          <li key={task.id}>
            Task Name: {task.taskName} | Days to Finish: {task.daysToFinish}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
