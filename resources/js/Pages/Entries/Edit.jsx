import Form from '@/Components/Entry/Form';
import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForTitle } from '@/Utils/FormatDate';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Edit({ auth, currentTags, entry, errors, mentions, recentTags, tags }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{ FormatDateForTitle(entry?.date) }</h2>}
        >
            <Head title="Update Entry" />

            <Form
                dbEntry={entry}
                currentTags={currentTags}
                mentions={mentions}
                recentTags={recentTags}
                tags={tags}
            />
        </Authenticated>
    );
}
