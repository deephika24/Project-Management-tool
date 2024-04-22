import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, push, database } from './firebase';
import './ProjectCreationForm.scss';

const ProjectCreationForm = () => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [specialty, setSpecialty] = useState('');

  const addProject = () => {
    const newProject = {
      projectName,
      startDate,
      endDate,
      teamMembers,
    };

    // Update projects in the database
    push(ref(database, 'projects'), newProject)
      .then(() => {
        // Reset form fields after successfully adding project
        setProjectName('');
        setStartDate('');
        setEndDate('');
        setTeamMembers([]);
      })
      .catch((error) => {
        console.error('Error adding project: ', error);
      });
  };

  const addTeamMember = () => {
    const newMember = {
      name: memberName,
      jobTitle,
      specialty,
    };

    setTeamMembers([...teamMembers, newMember]);

    // Reset member fields
    setMemberName('');
    setJobTitle('');
    setSpecialty('');
  };

  return (
    <div className="project-creation-form-container">
      <h3>Add New Project:</h3>
      <form onSubmit={(e) => { e.preventDefault(); addProject(); }}>
        <label>
          Project Name:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <h4>Team Members:</h4>
        <ul>
          {teamMembers.map((member, index) => (
            <li key={index}>
              {member.name} - {member.jobTitle} - {member.specialty}
            </li>
          ))}
        </ul>
        <label>
          Member Name:
          <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
        </label>
        <label>
          Job Title:
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </label>
        <label>
          Specialty:
          <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
        </label>
        <button type="button" onClick={addTeamMember}>Add Team Member</button>
        <button type="submit">Create Project</button>
      </form>
      <Link to="/">Back to Projects</Link> {/* Link to navigate back to projects */}
    </div>
  );
};

export default ProjectCreationForm;

