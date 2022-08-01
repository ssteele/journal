import Timeline from '@/Components/Annotation/Timeline';
import Authenticated from '@/Layouts/Authenticated';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React, { Suspense } from "react";

const FullTimeline = React.lazy(() => import('../../Components/Annotation/Timeline'));

export default function Show({ auth, errors, tag, timeline }) {
    const timelineFrequency = getTimelineFrequency(timeline);
    const timelineYears = getTimelineYears(timelineFrequency);
    const mostRecentTimelineYear = [timelineYears[timelineYears.length - 1]];

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
                        <Suspense fallback={
                            <Timeline
                                timelineFrequency={timelineFrequency}
                                timelineYears={mostRecentTimelineYear}
                            ></Timeline>
                        }>
                            <FullTimeline
                                timelineFrequency={timelineFrequency}
                                timelineYears={timelineYears}
                            ></FullTimeline>
                        </Suspense>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
