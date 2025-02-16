// src/components/PlantList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  PlusCircleIcon,
  PhotoIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import Card from './Card';

function PlantList() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetchPlants();
    // eslint-disable-next-line
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await api.get('/api/plants');
      setPlants(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch plants.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-600">Plant List</h1>
          <Link
            to="/create-plant"
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Plant
          </Link>
        </div>

        {plants.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-700">
                No plants found.{' '}
                <Link
                  to="/create-plant"
                  className="text-green-600 underline font-semibold"
                >
                  Create one
                </Link>
                .
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <Card  key={plant.id}>
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                      {plant.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{plant.description}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex space-x-2">
                      <Link
                        to={`/plants/${plant.id}/upload-image`}
                        className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                      >
                        <PhotoIcon className="h-5 w-5 mr-1" />
                        Upload
                      </Link>
                      <Link
                        to={`/plants/${plant.id}/timeline`}
                        className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                      >
                        <ChartBarIcon className="h-5 w-5 mr-1" />
                         Timeline
                      </Link>
                      <Link
                        to={`/plants/${plant.id}/growth-rate`}
                        className="flex items-center bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition duration-200"
                      >
                        <ChartBarIcon className="h-5 w-5 mr-1" />
                        Growth
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantList;