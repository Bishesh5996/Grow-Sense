// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PlantList from './components/PlantList';
import CreatePlant from './components/CreatePlant';
import UploadImage from './components/UploadImage';
import Timeline from './components/Timeline';
import GrowthRate from './components/GrowthRate';
import Navbar from './components/NavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<PlantList />} />
            <Route path="/create-plant" element={<CreatePlant />} />
            <Route path="/plants/:id/upload-image" element={<UploadImage />} />
            <Route path="/plants/:id/timeline" element={<Timeline />} />
            <Route path="/plants/:id/growth-rate" element={<GrowthRate />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;