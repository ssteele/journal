import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '@/../css/react-calendar-heatmap.css';

export default function Show({ auth, errors, tag, timeline }) {
    console.log('timeline:', timeline);
    function getTimelineFrequency(timeline) {
        let timehash = {};
        timeline.forEach((time) => {
            const { date } = time;
            timehash[date] = (timehash[date] || 0) + 1;
        });

        return Object.keys(timehash).map(date => {
            return {
                date,
                count: timehash[date],
            };
        });
    }
    
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {tag.name}
                </h2>
            }
        >
            <Head title="Tag" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-12 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white">
                        <CalendarHeatmap
                            startDate={new Date('2022-01-01')}
                            endDate={new Date('2022-12-31')}
                            horizontal={true}
                            showWeekdayLabels={true}
                            weekdayLabels={['U', 'M', 'T', 'W', 'R', 'F', 'S']}
                            values={getTimelineFrequency(timeline)}
                            classForValue={(value) => {
                                if (!value) {
                                  return 'color-empty';
                                }
                                return `color-scale-${value.count}`;
                            }}
                        />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
