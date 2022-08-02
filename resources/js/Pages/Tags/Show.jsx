import Timeline from '@/Components/Annotation/Timeline';
import Authenticated from '@/Layouts/Authenticated';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React from "react";

export default function Show({ auth, errors, tag, timeline }) {
    let doShowLoadMore = false;

    const timelineFrequency = getTimelineFrequency(timeline);
    const timelineYears = getTimelineYears(timelineFrequency);

    const tagLimitForPageLoad = 250;
    let timelineFrequencyAbridged = [];
    let timelineYearsAbridged = timelineYears;
    if (timelineFrequency.length > tagLimitForPageLoad) {
        doShowLoadMore = true;
        timelineFrequencyAbridged = timelineFrequency.slice(0, tagLimitForPageLoad);
        timelineYearsAbridged = getTimelineYears(timelineFrequencyAbridged);
    }

    function handleLoadMore() {
        doShowLoadMore = false;
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
                        {!doShowLoadMore && (
                            <Timeline
                                timelineFrequency={timelineFrequency}
                                timelineYears={timelineYears}
                            ></Timeline>
                        )}

                        {doShowLoadMore && (
                            <>
                                <button
                                    className="inline-block w-full text-center text-sm text-blue-400"
                                    onClick={() => handleLoadMore()}
                                >
                                    Load more
                                </button>

                                <Timeline
                                    timelineFrequency={timelineFrequencyAbridged}
                                    timelineYears={timelineYearsAbridged}
                                ></Timeline>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
