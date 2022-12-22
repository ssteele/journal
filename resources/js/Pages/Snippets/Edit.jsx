import Form from '@/Components/Snippet/Form';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Edit({ auth, errors, snippet, tags = [] }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2
                    className="font-semibold text-xl text-gray-800 leading-tight"
                    dangerouslySetInnerHTML={{__html: snippet?.description}}
                >
                </h2>
            }
        >
            <Head title="Update Snippet" />

            <Form
                dbSnippet={snippet}
                tags={tags}
            />
        </Authenticated>
    );
}
