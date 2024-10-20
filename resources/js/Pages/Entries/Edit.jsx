import Form from '@/Components/Entry/Form';
import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Edit({
  auth,
  dbCurrentTags = [],
  dbEntry,
  dbMentions = [],
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
        <h2
          className="font-semibold text-xl text-gray-800 leading-tight"
          dangerouslySetInnerHTML={{__html: `${FormatDateForTitle(dbEntry?.date)} &#8211; ${FormatDateWeekdayLong(dbEntry?.date)}`}}
        >
        </h2>
      }
    >
      <Head title="Update Entry" />

      <Form
        currentTags={dbCurrentTags}
        dbEntry={dbEntry}
        dbSnippets={dbSnippets}
        mentions={dbMentions}
        recentMentions={dbRecentMentions}
        recentTags={dbRecentTags}
        tags={dbTags}
      />
    </Authenticated>
  );
}
