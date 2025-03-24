import React from 'react';
import { Card } from 'antd';
import './tile.css'; 


const Tile = ({ title, value, unit, status, imageSrc,minThreshold, maxThreshold, children }) => (
    <Card className="tile">
    <h1 className="tile-title">
        {title}
        <span className="tile-title-underline"></span>
    </h1>
    <h1 className={`tile-value ${status === 'warning' ? 'warning' : 'normal'}`}>
    {imageSrc && <img src={imageSrc} alt={title} className="responsive-image" style={{ width: '130px', height: '75px', marginBottom: '10px' }} />}
    {value} {unit}
    </h1>
    <p>
    {status === 'low' && <span style={{ color: 'red' }}>Příliš nízká hodnota</span>}
    {status === 'high' && <span style={{ color: 'red' }}>Příliš vysoká hodnota</span>}
      {status === 'normal' && 'V normálu'}
    </p>
    <div className="tile-thresholds">
      <p>Min: {minThreshold}</p>
      <p>Max: {maxThreshold}</p>
    </div>
    {children}
  </Card>
);

export default Tile;
