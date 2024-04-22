import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, database } from './firebase';
import './ProjectList.scss'; // Import SCSS file for styling

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    onValue(projectsRef, (snapshot) => {
      const projectList = [];
      snapshot.forEach((childSnapshot) => {
        const project = childSnapshot.val();
        project.id = childSnapshot.key;
        projectList.push(project);
      });
      setProjects(projectList);
    });
  }, []);

  return (
    <div className="project-list-container">
      <h2>List of Projects</h2>
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>
              <button className="project-button">{project.projectName}</button>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/create-project" className="create-project-link">Create New Project</Link>
    </div>
  );
};

export default ProjectList;


