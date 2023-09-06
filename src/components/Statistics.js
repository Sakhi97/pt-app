import React, { useState, useEffect } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import _ from 'lodash';

const Statistics = () => {
  const GET_ALL_URL = 'https://traineeapp.azurewebsites.net/gettrainings';
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GET_ALL_URL);
        if (!response.ok) {
          throw new Error(`Error fetching trainings: ${response.status}`);
        }
        const data = await response.json();
        setTrainings(data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };

    fetchData();
  }, []);

  const barChartData = _(trainings)
    .groupBy(training => training.activity.toLowerCase())
    .map((group, name) => ({
      name: _.startCase(name),
      minutes: _.sumBy(group, 'duration'),
    }))
    .value();

  const pieChartData = _(trainings)
    .map(training => {
      const date = new Date(training.date);
      return { ...training, day: date.toLocaleString('en-US', { weekday: 'long' }) };
    })
    .groupBy('day')
    .map((group, day) => ({
      name: day,
      value: group.length,
    }))
    .value();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1', '#a4de6c'];

  return (
    <div>
      <h2>Activity Statistics</h2>
      <div style={{ marginBottom: '32px' }}>
        <BarChart width={600} height={300} data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="minutes" fill="#8884d8" />
        </BarChart>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <PieChart width={500} height={330}>
          <Pie
            data={pieChartData}
            cx={200}
            cy={150}
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={85}
            fill="#8884d8"
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Statistics;
