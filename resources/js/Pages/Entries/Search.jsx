import ExcerptPanel from '@/Components/Annotation/Detail/ExcerptPanel';
import AnnotationTimeline from '@/Components/Annotation/Timeline';
import Button from '@/Components/Button';
import ExpandBoxIcon from '@/Components/Icons/ExpandBox';
import SearchIcon from '@/Components/Icons/Search';
import LoadingSpinner from '@/Components/LoadingSpinner';
import { AnnotationDetailPanelTabs } from '@/Constants/AnnotationDetailPanelTabs';
import Authenticated from '@/Layouts/Authenticated';
import { ucFirst } from '@/Utils/String';
import { getTimelineFrequency, getTimelineYears } from '@/Utils/Timeline';
import { Head } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Search({ auth, errors: authErrors }) {
  const [searchTerm, setSearchTerm] = useState('implore');
  // const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [entryExcerpts, setEntryExcerpts] = useState([]);

  // @todo: handle vars appropriately
  const annotationMap = [-1];
  const timeline = [{ date: "2021-06-22", entryId: 4882, annotationId: -1 }];
  const timelineFrequency = getTimelineFrequency(timeline);
  const timelineYears = getTimelineYears(timelineFrequency);

  useEffect(() => {
    searchEntries(searchTerm);
  }, [searchTerm]);

  async function handleYearClick(year) {}

  async function handleDayClick(day) {}

  function handleOpenAllToTabsRead() {
    // for (const { date } of tagEntries) {
    //   window.open(route('entries.show', date));
    // }
  }

  function handleOpenAllToTabsEdit() {
    // for (const { date } of tagEntries) {
    //   window.open(route('entries.edit', date));
    // }
  }

  async function searchEntries(searchTerm) {
    if (searchTerm.length) {
      try {
        setIsSearching(true);
        const results = await fetch(route('api.entries.search', searchTerm))
          .then(async response => response?.ok ? await response?.json() : null)
          .catch(error => console.log(error?.message));

        if (results?.length) {
          console.log('SHS results:', results); // @debug
          // @todo: render in calendar
          // setEntries([...entries, ...more]);
          // setLastEntryId(more[more?.length - 1]?.id);
        }
      } catch (error) {
        console.error('There was a problem searching entries:', error);
      } finally {
        setIsSearching(false);
      }
    }
  }

  function pollSearchBar(e) {
    const term = e?.target?.value;

    if ('Enter' === e.key) {
      setSearchTerm(term);
    }
  }

  return (
    <Authenticated
      auth={auth}
      errors={authErrors}
      header={
        <div className="flex gap-4 justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            <span>Search</span>
          </h2>

          <input
            autoComplete="off"
            autoFocus
            className="w-full p-3 border border-gray-200"
            label="Search"
            name="search"
            onKeyUp={e => pollSearchBar(e)}
            placeholder="Search entries"
            type="input"
          />
        </div>
      }
    >
      <Head title="Search" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {isSearching && (
            <div className="grid content-center justify-items-center h-96 p-6 bg-white border-b border-gray-200">
              <LoadingSpinner />
            </div>
          )}

          {!isSearching && (
            <div
              className={`
                ${!!searchTerm?.length ? 'grid grid-cols-1 md:grid-cols-2' : ''}
                bg-white
                overflow-hidden
                shadow-sm
                sm:rounded-lg
              `}
            >
              {!!searchTerm?.length && (
                <>
                  <div className="p-6">
                    <AnnotationTimeline
                      annotationMap={annotationMap}
                      handleDayClick={handleDayClick}
                      handleYearClick={handleYearClick}
                      timelineFrequency={timelineFrequency}
                      timelineYears={timelineYears}
                    ></AnnotationTimeline>
                  </div>

                  <div className="p-6 bg-gray-50">
                    <div className="flex justify-between">
                      <ul className="flex justify-evenly divide-x divide-bg-gray-50 border-b border-gray-300">
                        <li className="px-4 py-1 rounded-t-md cursor-pointer bg-green-100">
                          { ucFirst(AnnotationDetailPanelTabs.Excerpts) }
                        </li>
                      </ul>
                    </div>

                    <ExcerptPanel
                      annotation=""
                      annotationType="search"
                      annotationEntries={entryExcerpts}
                    />

                    {entryExcerpts?.length > 1 && (
                      <div className="flex gap-4 justify-end mt-4">
                        <Button onClick={() => handleOpenAllToTabsRead()}>
                          Open all
                          <ExpandBoxIcon className="align-sub h-4 inline-block ml-4 text-white w-auto" />
                        </Button>

                        <Button
                          className="bg-green-500"
                          onClick={() => handleOpenAllToTabsEdit()}
                        >
                          Edit all
                          <ExpandBoxIcon className="align-sub h-4 inline-block ml-4 text-white w-auto" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!searchTerm?.length && (
                <div className="grid grid-cols-1 content-center justify-items-center gap-8 h-96 p-6 bg-white border-b border-gray-200">
                  <SearchIcon className="block h-36 w-auto" strokeColor="#4b5563" />
                  <span className="text-gray-500">Enter your search in the box above.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  );
}
