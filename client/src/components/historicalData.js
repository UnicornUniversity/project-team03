import React, { useState, useEffect } from 'react';
import { fetchHistoricalData } from '../services/api';
import { LineChart } from 'some-chart-library';

const HistoricalData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchHistoricalData('weekly');
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div><h2>Historical Data</h2><LineChart data={data} /></div>
  );
};

export default HistoricalData;