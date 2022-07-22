import Form from '@/Components/Entry/Form';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Edit({ auth, entry, errors, mentions, tags }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Update</h2>}
        >
            <Head title="Update Entry" />

            <Form
                dbEntry={entry}
                mentions={mentions}
                tags={tags}
            />
        </Authenticated>
    );
}
