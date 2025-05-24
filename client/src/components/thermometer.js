import React from 'react';

const Thermometer = ({ minTemperature, maxTemperature }) => (
    <svg width="150" height="80" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
    {/* Obal teploměru */}
    <rect x="10" y="20" width="130" height="10" fill="#e0e0e0" stroke="#004d00" strokeWidth="1" rx="5" ry="5" />
    {/* Zelená část teploměru */}
    <rect x="10" y="20" width="100" height="10" fill="#004d00" rx="5" ry="5" />
    {/* Oranžová část teploměru */}
    <rect x="110" y="20" width="30" height="10" fill="#ff6600" rx="5" ry="5" />
    {/* Text pro teploty */}
    <text x="10" y="15" fill="#004d00" fontSize="10">{minTemperature} °C</text>
    <text x="115" y="15" fill="#004d00" fontSize="10">{maxTemperature} °C</text>
    </svg>
);

export default Thermometer;