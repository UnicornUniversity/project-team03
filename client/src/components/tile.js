import React from 'react';
import { Card } from 'antd';
import './tile.css'; 


const Tile = ({ title, value, unit, status, imageSrc,minThreshold, maxThreshold }) => (
    <Card className="tile">
    <h1 className="tile-title">
        {title}
        <span className="tile-title-underline"></span>
    </h1>
    <h1 className={`tile-value ${status === 'warning' ? 'warning' : 'normal'}`}>
    {imageSrc && <img src={`/${imageSrc}`} alt={title} className="responsive-image" 
            style={{ width: '100px', height: '70px', marginBottom: '3px' }} />}
    {value} {unit}
    </h1>
    <p>{status === 'warning' ? 'Příliš zima' : 'V normálu'}</p>
    <div className="tile-thresholds">
            <p>Min: {minThreshold}</p>
            <p>Max: {maxThreshold}</p>
        </div>
    </Card>
  );

export default Tile;