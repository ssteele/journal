import EditPanel from '@/Components/Annotation/Detail/EditPanel';
import ExcerptPanel from '@/Components/Annotation/Detail/ExcerptPanel';
import Timeline from '@/Components/Annotation/Timeline';
import Button from '@/Components/Button';
import Edit from '@/Components/Icons/Edit';
import ExpandBox from '@/Components/Icons/ExpandBox';
import XClose from '@/Components/Icons/XClose';
import { AnnotationDetailPanelTabs } from '@/Constants/AnnotationDetailPanelTabs';
import Authenticated from '@/Layouts/Authenticated';
import { ucFirst } from '@/Utils/String';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';

export default function Show({ auth, errors, tag, timeline = [] }) {
  const annotationMap = [tag.id];
  const timelineFrequency = getTimelineFrequency(timeline);
  const timelineYears = getTimelineYears(timelineFrequency);

  const [currentDetailPanelTab, setCurrentDetailPanelTab] = useState(AnnotationDetailPanelTabs.Edit);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(!isMobile);
  const [tagEntries, setTagEntries] = useState([]);

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

    const tagEntry = await fetch(route('api.entries.id', day?.entryId))
      .then(async response => response?.ok ? await response?.json() : null)
      .catch(error => console.log(error?.message));
    ;

    if (tagEntry) {
      if (!tagEntries?.find(entry => entry?.id === tagEntry?.id)) {
        setTagEntries([...tagEntries, tagEntry].sort((a, b) => new Date(a?.date) - new Date(b?.date)));
      }
    }
  }

  function handleOpenAllToTabs() {
    for (const { date } of tagEntries) {
      window.open(route('entries.show', date));
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
          {tag.name} <span className="text-xs font-thin">({timeline.length})</span>
        </h2>
      }
    >
      <Head title="Tag" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div
          className={`
            ${isDetailPanelOpen ? 'grid grid-cols-1 md:grid-cols-2' : ''}
            mt-12
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
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between">
                <ul className="flex justify-evenly divide-x divide-bg-gray-50 border-b border-gray-300">
                  <li
                    className={`
                      px-4 py-1 rounded-t-md cursor-pointer
                      ${isActiveTab(AnnotationDetailPanelTabs.Edit) ? 'bg-green-100' : 'bg-white'}
                    `}
                    onClick={() => handleSwitchDetailPanelTab(AnnotationDetailPanelTabs.Edit)}
                  >
                    { ucFirst(AnnotationDetailPanelTabs.Edit) }
                  </li>

                  {!!tagEntries.length && (
                    <li
                      className={`
                        px-4 py-1 rounded-t-md cursor-pointer
                        ${isActiveTab(AnnotationDetailPanelTabs.Excerpts) ? 'bg-green-100' : 'bg-white'}
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
                      annotation={tag}
                      annotationType="tag"
                    />
                  ),
                  excerpts: (
                    <ExcerptPanel
                      annotation={tag}
                      annotationType="tag"
                      annotationEntries={tagEntries}
                    />
                  ),
                }[currentDetailPanelTab]
              }

              {isDetailPanelOpen && tagEntries?.length > 1 && (
                <div className="flex justify-end mt-4">
                  <Button onClick={() => handleOpenAllToTabs()}>
                    Open all
                    <ExpandBox className="align-sub h-4 inline-block ml-4 text-white w-auto" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  );
}
