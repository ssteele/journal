import Card from '@/Components/Entry/Card';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Index({ auth, entries, errors }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Entries</h2>}
        >
            <Head title="Entries" />

            <div className="py-12">
                {entries.map((entry, i) => {
                    return (
                        <Card
                            key={i}
                            entry={entry}
                        ></Card>
                    );
                })}
            </div>
        </Authenticated>
    );
}
