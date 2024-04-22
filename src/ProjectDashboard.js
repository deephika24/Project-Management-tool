import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Timeline from './Timeline';
import { scheduleTasks, allocateTasks } from './tasksUtils';
import './ProjectDashboard.scss'; // Import SCSS file
import { ref, database, onValue, push, remove, set } from './firebase';

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [resourcesNeeded, setResourcesNeeded] = useState('');
  const [specialtyRequired, setSpecialtyRequired] = useState('');
  const [urgency, setUrgency] = useState('');
  const [importance, setImportance] = useState('');
  const [priority, setPriority] = useState('');
  const [daysToFinish, setDaysToFinish] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTaskState, setEditTaskState] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [showAllocation, setShowAllocation] = useState(false);
  const [allocationTable, setAllocationTable] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [projectDuration, setProjectDuration] = useState(null);
  const [showAddEditTask, setShowAddEditTask] = useState(false);
  const [showScheduleTasks, setShowScheduleTasks] = useState(false);
  const [showAllocateTasks, setShowAllocateTasks] = useState(false);
  
  const setTasksOutsideProjectDuration = (tasks) => {
    if (project && project.startDate && project.endDate) {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      return tasks.filter(task => parseInt(task.daysToFinish) > durationInDays);
    }
    return [];
  };
  

  useEffect(() => {
    const projectRef = ref(database, `projects/${projectId}`);
    onValue(projectRef, (snapshot) => {
      const projectData = snapshot.val();
      setProject(projectData);
      if (projectData && projectData.tasks) {
        const tasksArray = Object.entries(projectData.tasks).map(([id, task]) => ({
          id,
          ...task,
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
      if (projectData.startDate && projectData.endDate) {
        const startDate = new Date(projectData.startDate);
        const endDate = new Date(projectData.endDate);
        const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        setProjectDuration(durationInDays); // Set project duration
      }
    });
  }, [projectId]);


  const toggleAddEditTask = () => {
    setShowAddEditTask(true);
    setShowScheduleTasks(false);
    setShowAllocateTasks(false);
    setShowTimeline(false);
  };

  const toggleScheduleTasks = () => {
    setShowAddEditTask(false);
    setShowScheduleTasks(true);
    setShowAllocateTasks(false);
    setShowTimeline(false);
  };

  const toggleAllocateTasks = () => {
    setShowAddEditTask(false);
    setShowScheduleTasks(false);
    setShowAllocateTasks(true);
    setShowTimeline(false);
  };

  const toggleTimeline = () => {
    setShowAddEditTask(false);
    setShowScheduleTasks(false);
    setShowAllocateTasks(false);
    setShowTimeline(!showTimeline);
  
    if (!showTimeline && project && project.startDate && project.endDate) {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
      const tasksWithinDuration = tasks.filter(task => parseInt(task.daysToFinish) <= durationInDays);
      const tasksOutsideDuration = tasks.filter(task => parseInt(task.daysToFinish) > durationInDays);
  
      setTasks(tasksWithinDuration);
  
      // Check if tasks outside project duration should be displayed
      if (showTimeline) {
        setTasksOutsideProjectDuration(tasksOutsideDuration);
      } else {
        setTasksOutsideProjectDuration([]);
      }
    } else {
      // Set tasks within and outside project duration based on showTimeline state
      if (showTimeline) {
        setTasks(filterTasksWithinProjectDuration());
        setTasksOutsideProjectDuration(filterTasksOutsideProjectDuration());
      } else {
        setTasks(filterTasksWithinProjectDuration());
        setTasksOutsideProjectDuration([]);
      }
    }
  };
  
  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      updateTask();
    } else {
      addTask();
    }
  };

  const addTask = () => {
    const newTask = {
      id: uuidv4(),
      taskName,
      resourcesNeeded,
      specialtyRequired,
      urgency,
      importance,
      priority,
      daysToFinish,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    push(ref(database, `projects/${projectId}/tasks`), newTask);

    resetFormFields();
  };

  const updateTask = () => {
    if (editIndex !== null && editTaskState) {
      const updatedTasks = tasks.map((task, index) => {
        if (index === editIndex) {
          return {
            ...task,
            taskName,
            resourcesNeeded,
            specialtyRequired,
            urgency,
            importance,
            priority,
            daysToFinish,
          };
        }
        return task;
      });

      setTasks(updatedTasks);

      const taskIdToUpdate = editTaskState.id;
      set(ref(database, `projects/${projectId}/tasks/${taskIdToUpdate}`), {
        ...editTaskState,
        taskName,
        resourcesNeeded,
        specialtyRequired,
        urgency,
        importance,
        priority,
        daysToFinish,
      });

      resetFormFields();
      setEditIndex(null);
      setEditTaskState(null);
    }
  };

  const resetFormFields = () => {
    setTaskName('');
    setResourcesNeeded('');
    setSpecialtyRequired('');
    setUrgency('');
    setImportance('');
    setPriority('');
    setDaysToFinish('');
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    remove(ref(database, `projects/${projectId}/tasks/${taskId}`));
  };

  const handleScheduleTasks = () => {
    scheduleTasks(tasks, setSchedule);
  };

  const handleAllocateTasks = () => {
    allocateTasks(tasks, project, setAllocationTable, setShowAllocation);
  };
  const filterTasksWithinProjectDuration = () => {
    if (project && project.startDate && project.endDate) {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      return tasks.filter(task => parseInt(task.daysToFinish) <= durationInDays);
    }
    return [];
  };

  const filterTasksOutsideProjectDuration = () => {
    if (project && project.startDate && project.endDate) {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      return tasks.filter(task => parseInt(task.daysToFinish) > durationInDays);
    }
    return [];
  };

  

  return (
    <div className="project-dashboard-container">
      <div className="menu-container">
        <button style={{backgroundColor: 'lightpink'}} onClick={toggleAddEditTask}>Add/Edit Task</button>
        <button style={{backgroundColor: 'lightpink'}} onClick={toggleScheduleTasks}>Schedule Tasks</button>
        <button style={{backgroundColor: 'lightpink'}} onClick={toggleAllocateTasks}>Allocate Tasks</button>
        <button style={{backgroundColor: 'lightpink'}} onClick={toggleTimeline}>Toggle Timeline</button>
      </div>
      {showAddEditTask && (
  <div className="add-edit-task-container">
    <TaskForm
      taskName={taskName}
      setTaskName={setTaskName}
      resourcesNeeded={resourcesNeeded}
      setResourcesNeeded={setResourcesNeeded}
      specialtyRequired={specialtyRequired}
      setSpecialtyRequired={setSpecialtyRequired}
      urgency={urgency}
      setUrgency={setUrgency}
      importance={importance}
      setImportance={setImportance}
      priority={priority}
      setPriority={setPriority}
      daysToFinish={daysToFinish}
      setDaysToFinish={setDaysToFinish}
      handleFormSubmit={handleFormSubmit}
      editIndex={editIndex}
      resetFormFields={resetFormFields}
      setEditIndex={setEditIndex}
      setEditTaskState={setEditTaskState}
    />
  </div>
)}


      {showScheduleTasks && (
        <div className="schedule-tasks-container">
          <button style={{backgroundColor: 'lightpink'}} onClick={handleScheduleTasks}>Schedule Tasks</button>
          {/* Render schedule tasks functionality here */}
          {schedule && (
            <div>
              <h4>Schedule:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Resources Needed</th>
                    <th>Specialty Required</th>
                    <th>Urgency</th>
                    <th>Importance</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((task) => (
                    <tr key={task.id}>
                      <td>{task.taskName}</td>
                      <td>{task.resourcesNeeded}</td>
                      <td>{task.specialtyRequired}</td>
                      <td>{task.urgency}</td>
                      <td>{task.importance}</td>
                      <td>{task.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showAllocateTasks && (
        <div className="allocate-tasks-container">
          <button style={{backgroundColor: 'lightpink'}} onClick={handleAllocateTasks}>Allocate Tasks</button>
          {/* Render allocate tasks functionality here */}
          {showAllocation && (
            <div>
              <h4>Task Allocation:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Team Member</th>
                    <th>Specialty</th>
                  </tr>
                </thead>
                <tbody>
                  {allocationTable.map((allocation, index) => (
                    <tr key={index}>
                      <td>{allocation.taskName}</td>
                      <td>{allocation.teamMember}</td>
                      <td>{allocation.specialty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      
<      div className="tasks-list-container">
      <h4>Tasks:</h4>
      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        setTaskName={setTaskName}
        setResourcesNeeded={setResourcesNeeded}
        setSpecialtyRequired={setSpecialtyRequired}
        setUrgency={setUrgency}
        setImportance={setImportance}
        setPriority={setPriority}
        setDaysToFinish={setDaysToFinish}
        setEditIndex={setEditIndex}
        setEditTaskState={setEditTaskState}
      />
        

      {showTimeline && project.startDate && project.endDate && (

          <Timeline
            startDate={project.startDate}
            endDate={project.endDate}
            tasks={filterTasksWithinProjectDuration()}
          />

      )}

      {showTimeline && project.startDate && project.endDate && (
        <div>
          <h4>Tasks Outside Project Duration:</h4>
          <TaskList
            tasks={filterTasksOutsideProjectDuration()}
            deleteTask={deleteTask}
            setTaskName={setTaskName}
            setResourcesNeeded={setResourcesNeeded}
            setSpecialtyRequired={setSpecialtyRequired}
            setUrgency={setUrgency}
            setImportance={setImportance}
            setPriority={setPriority}
            setDaysToFinish={setDaysToFinish}
            setEditIndex={setEditIndex}
            setEditTaskState={setEditTaskState}
          />
        </div>
      )}
      </div>
      
    </div>
  );
};

export default ProjectDashboard;




