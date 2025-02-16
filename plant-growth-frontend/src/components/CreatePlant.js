// src/components/CreatePlant.js
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';
import Card from './Card';

function CreatePlant() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Plant name is required.');
      return;
    }

    try {
      const response = await api.post('/api/plants', { name, description });
      toast.success('Plant created successfully.');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create plant.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <Card>
          <div className="flex flex-col items-center">
            <ClipboardDocumentCheckIcon className="h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-6">Create New Plant</h1>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Plant Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter plant name"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter plant description"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200 flex items-center justify-center"
              >
                Create Plant
              </button>
            </form>
            <div className="mt-4 text-gray-600">
              <Link to="/" className="text-blue-500 hover:underline">
                &larr; Back to Plant List
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CreatePlant;