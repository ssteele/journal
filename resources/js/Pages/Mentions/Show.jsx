import Timeline from '@/Components/Annotation/Timeline';
import Authenticated from '@/Layouts/Authenticated';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, errors, mention = [], timeline = [] }) {
    const timelineFrequency = getTimelineFrequency(timeline);
    const timelineYears = getTimelineYears(timelineFrequency);

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {mention.name} <span className="text-xs font-thin">({timeline.length})</span>
                </h2>
            }
        >
            <Head title="Mention" />

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
