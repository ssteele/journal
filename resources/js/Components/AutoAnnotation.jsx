import React from 'react';

export default function AutoAnnotation({ callback, className = '', children }) {
  return (
    <span
      className={
        `inline-flex px-2 py-1 text-blue-400 cursor-pointer ` + className
      }
      onClick={(e) => callback(e?.target?.innerText)}
    >
      {children}
    </span>
  );
}
