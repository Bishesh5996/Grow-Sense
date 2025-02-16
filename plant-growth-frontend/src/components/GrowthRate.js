// src/components/GrowthRate.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid';
import Card from './Card';

function GrowthRate() {
  const { id } = useParams();
  const [growthRate, setGrowthRate] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthRate();
    // eslint-disable-next-line
  }, []);

  const fetchGrowthRate = async () => {
    try {
      const response = await api.get(`/api/plants/${id}/growth`);
      setGrowthRate(response.data.growth_rate);
      setDetails(response.data.calculation_details);

      // Format data points for the chart
      const formattedData = response.data.data_points.map((point) => ({
        timestamp: format(parseISO(point.timestamp), 'MM/dd/yyyy'),
        green_density: parseFloat((point.green_density * 100).toFixed(2)), // Convert to percentage
      }));
      setDataPoints(formattedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to fetch growth rate.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-600 mb-8 text-center">
          Growth Rate Analysis
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        ) : growthRate === null ? (
          <Card className="mb-8">
            <div className="flex items-center">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-700 mr-2" />
              <p className="text-yellow-700">
                No data available to calculate growth rate.{' '}
                <Link
                  to={`/plants/${id}/upload-image`}
                  className="text-yellow-900 underline font-semibold"
                >
                  Upload images
                </Link>
                .
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Overall Growth Rate Card */}
            <Card className="mb-8">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-2xl font-semibold">Overall Growth Rate</h2>
              </div>
              <p className="text-lg mb-4">
                <strong>Growth Rate:</strong> {(growthRate * 100).toFixed(2)}% per day
              </p>
              <div>
                <h3 className="text-xl font-semibold mb-2">Calculation Details:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>
                    <strong>Green Density at Time T1:</strong>{' '}
                    {(details.density_t1 * 100).toFixed(2)}%
                  </li>
                  <li>
                    <strong>Green Density at Time T2:</strong>{' '}
                    {(details.density_t2 * 100).toFixed(2)}%
                  </li>
                  <li>
                    <strong>Time Difference:</strong> {details.time_difference_days}{' '}
                    day(s)
                  </li>
                </ul>
              </div>
            </Card>

            {/* Green Density Over Time Chart */}
            <Card className="mb-8">
              <div className="flex items-center mb-4">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-semibold">Green Density Over Time</h2>
              </div>
              {dataPoints.length < 2 ? (
                <p className="text-gray-600">
                  Not enough data points to display the growth trend.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="green_density"
                      name="Green Density (%)"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Statistical Insights Card */}
            <Card>
              <div className="flex items-center mb-4">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-500 mr-2" />
                <h2 className="text-2xl font-semibold">Statistical Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p>
                      <strong>Initial Green Density (T1):</strong>{' '}
                      {(details.density_t1 * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p>
                      <strong>Final Green Density (T2):</strong>{' '}
                      {(details.density_t2 * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p>
                      <strong>Total Time:</strong> {details.time_difference_days} day(s)
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p>
                      <strong>Percentage Change:</strong>{' '}
                      {(
                        ((details.density_t2 - details.density_t1) / details.density_t1) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p>
                      <strong>Average Daily Change:</strong>{' '}
                      {(growthRate * 100).toFixed(2)}% per day
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <p>
                      <strong>Projected Green Density in Next 7 Days:</strong>{' '}
                      {((details.density_t2 + growthRate * 7) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </>
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

export default GrowthRate;