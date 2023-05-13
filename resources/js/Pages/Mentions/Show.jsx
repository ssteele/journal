import EditPanel from '@/Components/Annotation/Detail/EditPanel';
import ExcerptPanel from '@/Components/Annotation/Detail/ExcerptPanel';
import Timeline from '@/Components/Annotation/Timeline';
import Edit from '@/Components/Icons/Edit';
import XClose from '@/Components/Icons/XClose';
import { AnnotationDetailPanelTabs } from '@/Constants/AnnotationDetailPanelTabs';
import Authenticated from '@/Layouts/Authenticated';
import { ucFirst } from '@/Utils/String';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';

export default function Show({ auth, errors, mention, timeline = [] }) {
    const annotationMap = [mention.id];
    const timelineFrequency = getTimelineFrequency(timeline);
    const timelineYears = getTimelineYears(timelineFrequency);

    const [currentDetailPanelTab, setCurrentDetailPanelTab] = useState(AnnotationDetailPanelTabs.Edit);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(!isMobile);
    const [mentionEntries, setMentionEntries] = useState([]);

    function isActiveTab(tab) {
        return tab === currentDetailPanelTab;
    }

    function handleSwitchDetailPanelTab(tab) {
        setCurrentDetailPanelTab(tab);
    }

    async function handleDayClick(day) {
        if (!isDetailPanelOpen) {
            setIsDetailPanelOpen(true);
        }
        setCurrentDetailPanelTab(AnnotationDetailPanelTabs.Excerpts);

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

    function handleOpenDetailBar() {
        if (!isDetailPanelOpen) {
            setIsDetailPanelOpen(true);
        }
    }

    function handleCloseDetailBar() {
        if (isDetailPanelOpen) {
            setIsDetailPanelOpen(false);
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
                        ${isDetailPanelOpen ? 'grid grid-cols-1 md:grid-cols-2' : ''}
                        mt-12
                        pb-4
                        bg-white
                        overflow-hidden
                        shadow-sm
                        sm:rounded-lg
                    `}
                >
                    {!isDetailPanelOpen && !isMobile && (
                        <div className="mt-8 mr-6 float-right" onClick={() => handleOpenDetailBar()}>
                            <Edit className="block h-5 w-auto" strokeColor="#4b5563" />
                        </div>
                    )}

                    <div className="p-6">
                        <Timeline
                            annotationMap={annotationMap}
                            handleDayClick={handleDayClick}
                            timelineFrequency={timelineFrequency}
                            timelineYears={timelineYears}
                        ></Timeline>
                    </div>

                    {isDetailPanelOpen && (
                        <div className="p-6 bg-white">
                            <div className="flex justify-between">
                                <ul className="flex justify-evenly divide-x divide-white border-b border-gray-300">
                                    <li
                                        className={`
                                            px-4 py-1 rounded-t-md cursor-pointer
                                            ${isActiveTab(AnnotationDetailPanelTabs.Edit) ? 'bg-green-200' : 'bg-gray-200'}
                                        `}
                                        onClick={() => handleSwitchDetailPanelTab(AnnotationDetailPanelTabs.Edit)}
                                    >
                                        { ucFirst(AnnotationDetailPanelTabs.Edit) }
                                    </li>

                                    {!!mentionEntries.length && (
                                        <li
                                            className={`
                                                px-4 py-1 rounded-t-md cursor-pointer
                                                ${isActiveTab(AnnotationDetailPanelTabs.Excerpts) ? 'bg-green-200' : 'bg-gray-200'}
                                            `}
                                            onClick={() => handleSwitchDetailPanelTab(AnnotationDetailPanelTabs.Excerpts)}
                                        >
                                            { ucFirst(AnnotationDetailPanelTabs.Excerpts) }
                                        </li>
                                    )}
                                </ul>

                                <span className="mt-2" onClick={() => handleCloseDetailBar()}>
                                    <XClose className="block h-5 w-auto" strokeColor="#4b5563" />
                                </span>
                            </div>

                            {
                                {
                                    edit: (
                                        <EditPanel
                                            annotation={mention}
                                            annotationType="mention"
                                        />
                                    ),
                                    excerpts: (
                                        <ExcerptPanel
                                            annotation={mention}
                                            annotationType="mention"
                                            annotationEntries={mentionEntries}
                                        />
                                    ),
                                }[currentDetailPanelTab]
                            }
                        </div>
                    )}
                </div>
            </div>
        </Authenticated>
    );
}
