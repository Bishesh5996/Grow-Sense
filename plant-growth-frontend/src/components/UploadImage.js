// src/components/UploadImage.js
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PhotoIcon, CalendarDaysIcon } from '@heroicons/react/24/solid';
import Card from './Card';

function UploadImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [timestamp, setTimestamp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image to upload.');
      return;
    }
    if (!timestamp) {
      toast.error('Please select a timestamp.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('timestamp', timestamp);

    try {
      await api.post(`/api/plants/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Image uploaded successfully.');
      navigate(`/plants/${id}/timeline`);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to upload image.');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <Card>
          <div className="flex flex-col items-center">
            <PhotoIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Upload Plant Image</h1>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="image">
                  Select Image <span className="text-red-500">*</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="w-full text-gray-700"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="timestamp">
                  Timestamp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="timestamp"
                    type="datetime-local"
                    className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
              >
                <PhotoIcon className="h-5 w-5 mr-2" />
                Upload 
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

export default UploadImage;