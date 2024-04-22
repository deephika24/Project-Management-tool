// tasksUtils.js

export const scheduleTasks = (tasks, setSchedule) => {
  // Basic greedy scheduling algorithm based on urgency, importance, and priority
  const sortedTasks = [...tasks].sort((taskA, taskB) => {
    // Sort by urgency first
    if (taskA.urgency !== taskB.urgency) {
      return taskA.urgency - taskB.urgency; // Lower urgency comes first
    }
    // If urgency is the same, sort by importance
    if (taskA.importance !== taskB.importance) {
      return taskA.importance - taskB.importance; // Lower importance comes first
    }
    // If urgency and importance are the same, sort by priority
    return taskA.priority - taskB.priority; // Lower priority comes first
  });
  
  // Store the sorted tasks as schedule
  setSchedule(sortedTasks);
};

export const allocateTasks = (tasks, project, setAllocationTable, setShowAllocation) => {
  // Sort tasks based on urgency, importance, and priority using the scheduleTasks function
  scheduleTasks(tasks, (sortedTasks) => {
    const availableTeamMembers = [...project.teamMembers];
    const allocation = [];
  
    // Iterate over the sorted tasks
    sortedTasks.forEach((task) => {
      const matchingMember = availableTeamMembers.find((member) => member.specialty === task.specialtyRequired);
      if (matchingMember) {
        allocation.push({ taskName: task.taskName, teamMember: matchingMember.name, specialty: matchingMember.specialty });
        availableTeamMembers.splice(availableTeamMembers.indexOf(matchingMember), 1);
      } else {
        allocation.push({ taskName: task.taskName, teamMember: 'NA', specialty: 'NA' });
      }
    });
  
    // Add idle team members
    availableTeamMembers.forEach((member) => {
      allocation.push({ taskName: 'TeamMember Idle', teamMember: member.name, specialty: member.specialty });
    });
  
    // Update the allocation table state and set show allocation flag to true
    setAllocationTable(allocation);
    setShowAllocation(true);
  });
};

