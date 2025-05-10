import CreateUpdateEntryForm from '@/Components/Forms/CreateUpdateEntryForm';
import NewIcon from '@/Components/Icons/New';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create({
  auth,
  dbMentions = [],
  dbNextDate,
  dbRecentMentions = [],
  dbRecentTags = [],
  dbSnippets = [],
  dbTags = [],
  errors,
}) {
  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={
        <>
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Create Entry
          </h2>

          <span className="float-right relative bottom-6" title="New">
            <NewIcon className="block h-8 w-auto" strokeColor="#000" />
          </span>
        </>
      }
    >
      <Head title="Create Entry" />

      <CreateUpdateEntryForm
        dbSnippets={dbSnippets}
        mentions={dbMentions}
        nextDate={dbNextDate}
        recentTags={dbRecentTags}
        recentMentions={dbRecentMentions}
        tags={dbTags}
      />
    </Authenticated>
  );
}
