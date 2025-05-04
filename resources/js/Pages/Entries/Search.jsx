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
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [entryExcerpts, setEntryExcerpts] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [timelineFrequency, setTimelineFrequency] = useState([]);
  const [timelineYears, setTimelineYears] = useState([]);

  const annotationMap = [-1];

  useEffect(() => {
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      if (searchTerm?.length) {
        setIsSearching(true);
      }
      searchEntries(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!isInitializing) {
      setTimelineFrequency(getTimelineFrequency(timeline));
    }
  }, [timeline]);

  useEffect(() => {
    if (!isInitializing) {
      setTimelineYears(getTimelineYears(timelineFrequency));
    }
  }, [timelineFrequency]);

  useEffect(() => {
    if (!isInitializing) {
      setIsSearching(false);
    }
  }, [timelineYears]);

  function resetSearch() {
    setTimeline([]);
    setEntryExcerpts([]);
  }

  async function handleYearClick(year) {
    const timelineYear = timelineYears.find(timelineYear => timelineYear?.year === parseInt(year));
    const yearHasEntries = parseInt(timelineYear?.count) > 0;
    if (!yearHasEntries) {
      return;
    }

    const entriesList = await fetch(route('api.entries.list', { ids: timelineYear?.entryIds }))
      .then(async response => response?.ok
        ? await response?.json()
        : [{ id: 0, date: new Date().toISOString().slice(0, 10), entry: 'Could not get entries' }]
      )
      .catch(error => console.log(error?.message));
    ;

    if (entriesList?.length) {
      const entries = [];
      for (const entryItem of entriesList) {
        if (!entryExcerpts?.find(entry => entry?.id === entryItem?.id)) {
          entries.push(entryItem);
        }
      }
      if (entries.length) {
        setEntryExcerpts([...entryExcerpts, ...entries].sort((a, b) => new Date(a?.date) - new Date(b?.date)));
      }
    }
  }

  async function handleDayClick(day) {
    if (!entryExcerpts?.find(entry => entry?.id === day?.entryId)) {
      const entry = await fetch(route('api.entries.id', day?.entryId))
        .then(async response => response?.ok
          ? await response?.json()
          : { id: 0, date: new Date().toISOString().slice(0, 10), entry: `Could not get entry containing "${searchTerm}"` }
        )
        .catch(error => console.log(error?.message));

      if (entry) {
        setEntryExcerpts([...entryExcerpts, entry].sort((a, b) => new Date(a?.date) - new Date(b?.date)));
      }
    }
  }

  function handleOpenAllToTabsRead() {
    for (const { date } of entryExcerpts) {
      window.open(route('entries.show', date));
    }
  }

  function handleOpenAllToTabsEdit() {
    for (const { date } of entryExcerpts) {
      window.open(route('entries.edit', date));
    }
  }

  async function searchEntries(searchTerm) {
    if (searchTerm.length) {
      try {
        const entryResults = await fetch(route('api.entries.search', searchTerm))
          .then(async response => response?.ok ? await response?.json() : null)
          .catch(error => console.log(error?.message));

        if (!!entryResults && entryResults?.length) {
          setTimeline(entryResults.map(({date, id}) => ({date, entryId: id, annotationId: -1})));
        } else {
          resetSearch();
        }
      } catch (error) {
        console.error('There was a problem searching entries:', error);
        resetSearch();
      }
    }
  }

  function pollSearchBar(e) {
    const term = e?.target?.value;

    if ('Enter' === e.key) {
      if (term !== searchTerm) {
        setSearchTerm(term);
        setEntryExcerpts([]);
      }
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
            type="search"
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
                ${!!searchTerm?.length && !!timeline?.length ? 'grid grid-cols-1 md:grid-cols-2' : ''}
                bg-white
                overflow-hidden
                shadow-sm
                sm:rounded-lg
              `}
            >
              {!!searchTerm?.length && !!timeline?.length && (
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
                      annotation={{name: searchTerm}}
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

              {!!searchTerm.length && !timeline?.length && (
                <div className="grid grid-cols-1 content-center justify-items-center gap-8 h-96 p-6 bg-white border-b border-gray-200">
                  <SearchIcon className="block h-36 w-auto" strokeColor="#4b5563" />
                  <span className="text-gray-500">No search results found for { searchTerm }.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  );
}
