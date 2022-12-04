import Form from '@/Components/Entry/Form';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create({ auth, errors, mentions = [], nextDate, recentTags = [], tags = [] }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Entry
                </h2>
            }
        >
            <Head title="Create Entry" />

            <Form
                mentions={mentions}
                nextDate={nextDate}
                recentTags={recentTags}
                tags={tags}
            />
        </Authenticated>
    );
}
