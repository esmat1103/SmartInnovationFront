import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

// Expanded sample data
const data = [
  { time: '2024-07-01', temperature: 22, humidity: 55, pressure: 1012 },
  { time: '2024-07-02', temperature: 24, humidity: 50, pressure: 1011 },
  { time: '2024-07-03', temperature: 26, humidity: 45, pressure: 1013 },
  { time: '2024-07-04', temperature: 23, humidity: 60, pressure: 1010 },
  { time: '2024-07-05', temperature: 25, humidity: 58, pressure: 1012 },
  { time: '2024-07-06', temperature: 27, humidity: 52, pressure: 1014 },
  { time: '2024-07-07', temperature: 28, humidity: 49, pressure: 1011 },
  { time: '2024-07-08', temperature: 29, humidity: 51, pressure: 1015 },
  { time: '2024-07-09', temperature: 30, humidity: 53, pressure: 1013 },
  { time: '2024-07-10', temperature: 28, humidity: 55, pressure: 1012 },
];

const StatBox10 = () => {
  return (
    <div className='StatBoxContainer4 rounded-lg shadow-md pl-3 pr-3'>
      <h1 className='text-white font-bold text-center text-lg mb-3 pt-4 '>Sensor Data Overview</h1>
      <div className='flex justify-center'>
        <LineChart width={400} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
          <Line type="monotone" dataKey="pressure" stroke="#ffc658" />
        </LineChart>
      </div>
    </div>
  );
};

export default StatBox10;
