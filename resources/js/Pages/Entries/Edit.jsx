import CreateUpdateEntryForm from '@/Components/Forms/CreateUpdateEntryForm';
import New from '@/Components/Icons/New';
import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Edit({
  auth,
  dbCurrentTags = [],
  dbDatesPrevNext,
  dbEntry,
  dbMentions = [],
  dbRecentMentions = [],
  dbRecentTags = [],
  dbSnippets = [],
  dbTags = [],
  errors,
}) {
  const { date } = dbEntry;

  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={
        <>
          <h2
            className="font-semibold text-xl text-gray-800 leading-tight"
            dangerouslySetInnerHTML={{__html: `${FormatDateForTitle(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
          ></h2>

          {date === dbDatesPrevNext?.dateToday && (
            <span className="float-right relative bottom-6" title="Today">
              <New className="block h-8 w-auto" strokeColor="#000" />
            </span>
          )}
        </>
      }
    >
      <Head title="Update Entry" />

      <CreateUpdateEntryForm
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
