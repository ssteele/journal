import React from 'react';

export default function SearchIcon({ className, strokeColor = 'black' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
