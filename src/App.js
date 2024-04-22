import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectDashboard from './ProjectDashboard';
import ProjectCreationForm from './ProjectCreationForm';
import './App.scss'; // Import SCSS file for styling

const App = () => {
  return (
    <div className="app-container">
      <h1>Project Management System</h1>
      <Router>
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/create-project" element={<ProjectCreationForm />} />
          <Route path="/projects/:projectId" element={<ProjectDashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

