import React, { useEffect, useState } from 'react';

const TemperatureData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/temperature')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Temperature Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.temperature} °C at {item.timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default TemperatureData;
