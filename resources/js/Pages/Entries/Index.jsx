import Card from '@/Components/Entry/Card';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Index({ auth, entries, errors }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Entries
                </h2>
            }
        >
            <Head title="Entries" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {entries.map((entry, i) => {
                            return (
                                <Link
                                    href={route('entries.show', entry?.id)}
                                    key={i}
                                >
                                    <Card
                                        entry={entry}
                                    ></Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
