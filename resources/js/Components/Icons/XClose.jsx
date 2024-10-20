import React from 'react';

export default function XClose({ className, strokeColor = 'black' }) {
  return (
    <svg className={className} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <line x1="1" y1="11" x2="11" y2="1" stroke={strokeColor} strokeWidth="2"/>
      <line x1="1" y1="1" x2="11" y2="11" stroke={strokeColor} strokeWidth="2"/>
    </svg>
  );
}
