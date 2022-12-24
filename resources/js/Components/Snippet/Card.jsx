import React from 'react';

export default function Card({ dbSnippet }) {
    const { days, description, enabled } = dbSnippet;
    const dayAbbreviations = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

    function isDayChecked(dayIndex) {
        return days.split(',').includes(dayIndex.toString());
    }

    return (
        <div className="grid grid-cols-12 items-center p-6 bg-white border-b border-gray-200">
            <div className="col-start-1 col-span-4">
                <span>{ description }</span>
            </div>

            <div className="col-start-5 col-span-7">
                <span>
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
            </div>

            <div className="col-start-12 text-right">
                <span>{ (enabled) ? 'Enabled' : 'Disabled' }</span>
            </div>
        </div>
    );
}
