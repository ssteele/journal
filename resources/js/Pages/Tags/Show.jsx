import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '@/../css/react-calendar-heatmap.css';

export default function Show({ auth, errors, tag, timeline }) {
    function getTimelineFrequency(timeline) {
        let timehash = {};
        timeline.forEach((time) => {
            const { date } = time;
            timehash[date] = (timehash[date] || 0) + 1;
        });

        return Object.keys(timehash).map(date => {
            let dateObj = new Date(date);           // @hack: address an off-by-one-day bug in react-calendar-heatmap
            dateObj.setDate(dateObj.getDate() + 1); // https://github.com/kevinsqi/react-calendar-heatmap/issues/112
            return {
                date: dateObj,
                count: timehash[date],
            };
        });
    }
    const timelineFrequency = getTimelineFrequency(timeline);

    function getTimelineYears(timelineFrequency) {
        const { date: timelineStart } = timelineFrequency[timelineFrequency.length - 1];
        const { date: timelineEnd } = timelineFrequency[0];
        const timelineStartYear = timelineStart.getFullYear();
        const timelineEndYear = timelineEnd.getFullYear();
        let timelineYears = [];
        for (let i=timelineStartYear; i<=timelineEndYear; i++) {
            timelineYears.push(i);
        }
        return timelineYears;
    }
    const timelineYears = getTimelineYears(timelineFrequency);

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
                        {
                            timelineYears.map((year, i) => {
                                return (
                                    <div className="mt-3 sm:mt-4 md:mt-6" key={i}>
                                        <CalendarHeatmap
                                            startDate={new Date(`${year}-01-01`)}
                                            endDate={new Date(`${year}-12-31`)}
                                            horizontal={true}
                                            showMonthLabels={year === timelineYears[0]}
                                            showWeekdayLabels={false}
                                            values={timelineFrequency}
                                            classForValue={(value) => {
                                                if (!value) {
                                                return 'color-empty';
                                                }
                                                return `color-scale-${value.count}`;
                                            }}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
