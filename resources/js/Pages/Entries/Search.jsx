import SearchIcon from '@/Components/Icons/Search';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Search({ auth, errors: authErrors }) {
  const [searchTerm, setSearchTerm] = useState('');

  function searchEntries(e) {
    const term = e?.target?.value;

    if ('Enter' === e.key && term.length) {
      setSearchTerm(term);
      console.log('SHS searchTerm:', searchTerm); // @debug
      // @todo: search
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
            onKeyUp={e => searchEntries(e)}
            placeholder="Search entries"
            type="input"
          />
        </div>
      }
    >
      <Head title="Search" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {!searchTerm?.length && (
              <div className="grid grid-cols-1 justify-items-center gap-8 px-6 py-12 bg-white border-b border-gray-200">
                <SearchIcon className="block h-36 w-auto" strokeColor="#4b5563" />
                <span className="text-gray-500">No search term entered</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
