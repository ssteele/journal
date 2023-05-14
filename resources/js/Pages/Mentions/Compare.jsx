import Timeline from '@/Components/Annotation/Timeline';
import { TimelineAnnotationColors } from '@/Constants/MarkerColorMap';
import Authenticated from '@/Layouts/Authenticated';
import {
    getTimelineFrequency,
    getTimelineYears,
    mergeTimelineFrequencies,
    mergeTimelineYearCounts,
} from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Compare({ auth, errors, mentions = [], timelines = [] }) {
    const annotationMap = mentions.map(mention => mention.id);
    let timelinesFrequency = [];
    let timelinesYears = [];

    for (const timeline of timelines) {
        const timelineFrequency = getTimelineFrequency(timeline);
        const timelineYears = getTimelineYears(timelineFrequency);

        timelinesFrequency.push(...timelineFrequency);
        timelinesYears.push(...timelineYears);
    };

    const mergedTimelineFrequency = mergeTimelineFrequencies(timelinesFrequency);
    const mergedTimelineYears = mergeTimelineYearCounts(timelinesYears);

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {
                        mentions.map((mention, i) => (
                            <span key={i}>
                                {i > 0 ? ' / ' : ''}
                                <span
                                    className={`bg-${TimelineAnnotationColors[i]}-100`}
                                >
                                    {mention?.name}
                                </span>
                            </span>
                        ))
                    }
                </h2>
            }
        >
            <Head title="Mention" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-12 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white">
                        <Timeline
                            annotationMap={annotationMap}
                            timelineFrequency={mergedTimelineFrequency}
                            timelineYears={mergedTimelineYears}
                        ></Timeline>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
