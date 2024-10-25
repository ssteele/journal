import CreateUpdateDeleteSnippetForm from '@/Components/Forms/CreateUpdateDeleteSnippetForm';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create({ auth, dbMentions = [], dbTags = [], errors }) {
  const snippetType = route().params?.type;

  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Create Snippet
        </h2>
      }
    >
      <Head title="Create Snippet" />

      <CreateUpdateDeleteSnippetForm
        mentions={dbMentions}
        snippetType={snippetType}
        tags={dbTags}
      />
    </Authenticated>
  );
}
