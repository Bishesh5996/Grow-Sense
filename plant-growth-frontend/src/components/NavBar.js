// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-green-600 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white text-xl font-bold">
          Plant Growth Monitor
        </Link>
        <div>
          <Link to="/create-plant" className="text-white hover:text-gray-200 mx-2">
            Create Plant
          </Link>
          <Link to="/" className="text-white hover:text-gray-200 mx-2">
            Plant List
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;