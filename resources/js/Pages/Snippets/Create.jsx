import Form from '@/Components/Snippet/Form';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create({ auth, dbMentions = [], dbTags = [], errors }) {
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

            <Form
                mentions={dbMentions}
                tags={dbTags}
            />
        </Authenticated>
    );
}
