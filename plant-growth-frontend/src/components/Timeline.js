// src/components/Timeline.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  PhotoIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import Card from './Card';

function Timeline() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get(`/api/plants/${id}/images`);
      setImages(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch images.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
          Image Timeline
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : images.length === 0 ? (
          <Card className="mb-8">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-yellow-700 mr-2" />
              <p className="text-yellow-700">
                No images uploaded.{' '}
                <Link
                  to={`/plants/${id}/upload-image`}
                  className="text-yellow-900 underline font-semibold"
                >
                  Upload one
                </Link>
                .
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {images.map((img) => (
              <Card key={img.id} className="flex flex-col md:flex-row items-center">
                {/* Image Section */}
                <div className="w-full md:w-1/3">
                  <img
                    src={`http://localhost:5000${img.image_url}`}
                    alt={`Plant ${img.plant_id} at ${format(
                      new Date(img.timestamp),
                      'PPpp'
                    )}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    loading="lazy"
                  />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6">
                  <div className="flex items-center mb-2">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p className="text-gray-700">
                      <strong>Timestamp:</strong>{' '}
                      {format(new Date(img.timestamp), 'PPpp')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <PhotoIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p className="text-gray-700">
                      <strong>Green Density:</strong>{' '}
                      {(img.green_density * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Plant List Link */}
        <div className="mt-12 text-center">
          <Link to="/" className="text-blue-500 hover:underline text-lg">
            &larr; Back to Plant List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Timeline;