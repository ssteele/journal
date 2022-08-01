import Timeline from '@/Components/Annotation/Timeline';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, errors, tag, timeline }) {
    function getTimelineFrequency(timeline) {
        let timehash = {};
        timeline.forEach((time) => {
            const { date, entryId } = time;
            timehash[date] = {
                count: (timehash[date]?.count || 0) + 1,
                entryId,
            }
        });

        return Object.keys(timehash).map(date => {
            return {
                date: new Date(date),
                count: timehash[date]?.count,
                entryId: timehash[date]?.entryId,
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
                        <Timeline
                            timelineFrequency={timelineFrequency}
                            timelineYears={timelineYears}
                        ></Timeline>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
