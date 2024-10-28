import React from 'react';

export default function Button({
  children,
  className = '',
  disabled = false,
  onClick = () => {},
  processing,
  type = 'submit',
}) {
  const defaultClasses = [
    'bg-blue-500',
    'font-bold',
    'px-6',
    'py-2',
    'rounded',
    'text-center',
    'text-white',
    'text-sm',
    'active:opacity-75',
  ];

  const classNames = className.split(' ');
  const passedBaseRules = classNames.map(c => {
    return c.split('-')[0];
  });

  const remainingDefaultClasses = defaultClasses.filter(c => {
    const baseRule = c.split('-')[0];
    return !passedBaseRules.includes(baseRule);
  });

  const mergedClassNames = [ ...remainingDefaultClasses, ...classNames].join(' ');

  return (
    <button
      type={type}
      className={`
        ${ mergedClassNames }
        ${ processing ? 'opacity-25' : ''}
      `}
      disabled={disabled || processing}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
