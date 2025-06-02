import React from 'react';
import { Card } from 'antd';
import './tile.css';

const TileContainer = ({ children }) => (
  <div className="tile-container">
    {children}
  </div>
);

const Tile = ({ title, value, unit, status, imageSrc,minThreshold, maxThreshold, children, isAuthenticated, thresholds, data }) => (
  <Card className="tile">
    <div className="tile-content">
     <h1 className="tile-title">
         {title}
         <span className="tile-title-underline"></span>
     </h1>
     <h1 className={`tile-value ${status === 'warning' ? 'warning' : 'normal'}`}>
      {imageSrc && <img src={imageSrc} alt={title} className="responsive-image" />}
      {value} {unit}
     </h1>
   
 <div className="tile-status">
  {status === 'low' && <span className="tile-warning">Příliš nízká hodnota</span>}
  {status === 'high' && <span className="tile-warning">Příliš vysoká hodnota</span>}
  {status === 'normal' && <span className="tile-ok">V normálu</span>}
 </div>
 <div className="tile-thresholds">
    <p>Min: {minThreshold}</p>
    <p>Max: {maxThreshold}</p>
  </div>
  {children}
  </div>
 </Card>
);

export { Tile, TileContainer };