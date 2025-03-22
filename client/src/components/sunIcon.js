import React from 'react';

const SunIcon = () => (
  <svg width="100" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Kruhový střed */}
    <circle cx="50" cy="50" r="20" fill="#004d00" />
    {/* Paprsky */}
    <line x1="50" y1="10" x2="50" y2="0" stroke="#004d00" strokeWidth="2" /><line x1="50" y1="90" x2="50" y2="100" stroke="#004d00" strokeWidth="2" /><line x1="10" y1="50" x2="0" y2="50" stroke="#004d00" strokeWidth="2" /><line x1="90" y1="50" x2="100" y2="50" stroke="#004d00" strokeWidth="2" /><line x1="20" y1="20" x2="10" y2="10" stroke="#004d00" strokeWidth="2" /><line x1="80" y1="20" x2="90" y2="10" stroke="#004d00" strokeWidth="2" /><line x1="20" y1="80" x2="10" y2="90" stroke="#004d00" strokeWidth="2" /><line x1="80" y1="80" x2="90" y2="90" stroke="#004d00" strokeWidth="2" /></svg>
);

export default SunIcon