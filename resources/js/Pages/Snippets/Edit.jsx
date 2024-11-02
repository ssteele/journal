import CreateUpdateDeleteSnippetForm from '@/Components/Forms/CreateUpdateDeleteSnippetForm';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Edit({ auth, dbMentions = [], dbSnippet, dbTags = [], errors }) {
  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={
        <h2
          className="font-semibold text-xl text-gray-800 leading-tight"
          dangerouslySetInnerHTML={{__html: dbSnippet?.description}}
        >
        </h2>
      }
    >
      <Head title="Update Snippet" />

      <CreateUpdateDeleteSnippetForm
        dbSnippet={dbSnippet}
        mentions={dbMentions}
        tags={dbTags}
      />
    </Authenticated>
  );
}
