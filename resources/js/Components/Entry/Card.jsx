import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import React from 'react';

export default function Card({ entry }) {
    const { date, tempo } = entry;

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="grid grid-cols-12 items-center p-6 bg-white border-b border-gray-200">
                    <div className="col-start-1 col-span-4 lg:col-span-3">
                        <span className="inline sm:hidden">{ `${FormatDateForInputField(date)}` }</span>
                        <span
                            className="hidden sm:inline"
                            dangerouslySetInnerHTML={{__html: `${FormatDateForInputField(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
                        >
                        </span>
                    </div>

                    <div className="col-start-5 col-span-7 lg:col-start-4 lg:col-span-8">
                        <span></span>
                    </div>

                    <div className="col-start-12 text-right">
                        <span className="px-2 border bg-gray-100">{ tempo }</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
