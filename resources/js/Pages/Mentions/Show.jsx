import Timeline from '@/Components/Annotation/Timeline';
import XClose from '@/Components/Icons/XClose';
import Excerpt from '@/Components/Entry/Excerpt';
import Authenticated from '@/Layouts/Authenticated';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Show({ auth, errors, mention, timeline = [] }) {
    const annotationMap = [mention.id];
    const timelineFrequency = getTimelineFrequency(timeline);
    const timelineYears = getTimelineYears(timelineFrequency);

    const [isDetailBarOpen, setIsDetailBarOpen] = useState(false);
    const [mentionEntries, setMentionEntries] = useState([]);

    async function handleDayClick(day) {
        if (!isDetailBarOpen) {
            setIsDetailBarOpen(true);
        }

        const mentionEntry = await fetch(route('api.entries.id', day?.entryId))
            .then(async response => response.ok ? await response.json() : null)
            .catch(error => console.log(error.message));
        ;
        if (mentionEntry) {
            if (!mentionEntries.find(entry => entry.id === mentionEntry.id)) {
                setMentionEntries([...mentionEntries, mentionEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
            }
        }
    }

    function handleCloseDetailBar() {
        if (isDetailBarOpen) {
            setIsDetailBarOpen(false);
        }
    }

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
                <div
                    className={`
                        ${isDetailBarOpen ? 'grid grid-cols-1 md:grid-cols-2' : ''}
                        mt-12
                        pb-4
                        bg-white
                        overflow-hidden
                        shadow-sm
                        sm:rounded-lg
                    `}
                >
                    <div className="p-6 bg-white">
                        <Timeline
                            annotationMap={annotationMap}
                            handleDayClick={handleDayClick}
                            timelineFrequency={timelineFrequency}
                            timelineYears={timelineYears}
                        ></Timeline>
                    </div>

                    {isDetailBarOpen && (
                        <div className="p-6 bg-white">
                            <span className="float-right" onClick={() => handleCloseDetailBar()}>
                                <XClose className="block h-5 w-auto" strokeColor="#4b5563" />
                            </span>

                            <div className="mt-6">
                                {
                                    mentionEntries.map((mentionEntry, i) => {
                                        return (
                                            <Excerpt
                                                annotation={mention}
                                                annotationType="mention"
                                                entry={mentionEntry}
                                                key={i}
                                            ></Excerpt>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Authenticated>
    );
}
