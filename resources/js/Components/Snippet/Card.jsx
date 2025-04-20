import RepeatClockIcon from '@/Components/Icons/RepeatClock';
import React from 'react';

export default function Card({ dbSnippet }) {
  const { days, description, repeating } = dbSnippet;
  const dayAbbreviations = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

  function isDayChecked(dayIndex) {
    return days.split(',').includes(dayIndex.toString());
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-6 border-b border-gray-200">
      <span className="sm:col-span-4">{ description }</span>

      <span className="pt-4 text-center sm:col-span-6 sm:pt-0 sm:text-left">
        {dayAbbreviations.map((dayAbbreviation, i) => {
          return (
            <label key={i}>
              { dayAbbreviation }
              <input
                checked={isDayChecked(i)}
                className="mx-1 text-gray-400"
                readOnly="readOnly"
                type="checkbox"
              />
            </label>
          )
        })}
      </span>

      {!!repeating && (
        <span className="my-0 ml-auto mr-0 pt-2 sm:col-span-2 sm:pt-0">
          <RepeatClockIcon className="w-5" strokeColor="#6b7280" />
        </span>
      )}
    </div>
  );
}
