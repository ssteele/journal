import Timeline from '@/Components/Annotation/Timeline';
import LoadingSpinner from '@/Components/LoadingSpinner';
import Authenticated from '@/Layouts/Authenticated';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Show({ auth, errors, tags, timelines }) {
    const [isLoading, setIsLoading] = useState(false);
    let doShowLoadMore = false;

    let timelineFrequencies = [];
    let timelineYears = [];
    let timelineFrequenciesAbridged = [];
    let timelineYearsAbridged = [];
    const tagLimitForPageLoad = 250;
    timelines.forEach((timeline, i) => {
        timelineFrequencies[i] = getTimelineFrequency(timeline);
        timelineYears[i] = getTimelineYears(timelineFrequencies[i]);

        timelineFrequenciesAbridged[i] = [];
        timelineYearsAbridged[i] = timelineYears;
        if (timelineFrequencies[i].length > tagLimitForPageLoad) {
            doShowLoadMore = true;
            timelineFrequenciesAbridged[i] = timelineFrequencies[i].slice(0, tagLimitForPageLoad);
            timelineYearsAbridged[i] = getTimelineYears(timelineFrequencyAbridged);
        }
    });
    const tmpIndex = 1;

    const [isMoreToLoad, setIsMoreToLoad] = useState(doShowLoadMore);

    useEffect(() => {
        if (isLoading && !isMoreToLoad) {
            setIsLoading(false);
        }
    }, [isLoading, isMoreToLoad]);

    function handleLoadMore() {
        setTimeout(() => {
            setIsMoreToLoad(false);
        });
        setIsLoading(true);
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {tags.map(tag => tag?.name).join(' / ')}
                </h2>
            }
        >
            <Head title="Tag" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-12 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white">
                        {!isMoreToLoad && (
                            <Timeline
                                timelineFrequency={timelineFrequencies[tmpIndex]}
                                timelineYears={timelineYears[tmpIndex]}
                            ></Timeline>
                        )}

                        {isMoreToLoad && (
                            <Timeline
                                timelineFrequency={timelineFrequenciesAbridged[tmpIndex]}
                                timelineYears={timelineYearsAbridged[tmpindex]}
                            ></Timeline>
                        )}

                        <div className="w-full mt-8 flex flex-col items-center">
                            {isMoreToLoad && !isLoading && (
                                <button
                                    className="py-4 text-sm text-blue-400"
                                    onClick={() => handleLoadMore()}
                                >
                                    Load more
                                </button>
                            )}

                            {isLoading && (
                                <div className="py-px">
                                    <LoadingSpinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
