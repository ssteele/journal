import SearchIcon from '@/Components/Icons/Search';
import LoadingSpinner from '@/Components/LoadingSpinner';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Search({ auth, errors: authErrors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    searchEntries(searchTerm);
  }, [searchTerm]);

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
            className="w-full p-4 border border-gray-200"
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
                ${searchTerm?.length ? 'grid grid-cols-1 md:grid-cols-2' : ''}
                bg-white
                overflow-hidden
                shadow-sm
                sm:rounded-lg
              `}
            >

              {!searchTerm?.length && (
                <div className="grid grid-cols-1 content-center justify-items-center gap-8 h-96 p-6 bg-white border-b border-gray-200">
                  <SearchIcon className="block h-36 w-auto" strokeColor="#4b5563" />
                  <span className="text-gray-500">No search term entered</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Authenticated>
  );
}
