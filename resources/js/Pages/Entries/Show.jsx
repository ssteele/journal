import Authenticated from '@/Layouts/Authenticated';
import FormatDate from '@/Utils/FormatDate';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, entry, errors, mentions, tags }) {
    const { id, date, tempo, entry: body } = entry;
    const formattedDate = FormatDate(date);

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Entry</h2>}
        >
            <Head title="Entry" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 bg-white">
                            <div className="flex flex-col">
                                <div className="mt-6">
                                    <label>Date</label>
                                    <Link href={route('entries.edit', id)}>
                                        <div className="p-4 border border-gray-100 bg-gray-100">{ formattedDate }</div>
                                    </Link>
                                </div>

                                <div className="mt-6">
                                    <label>Tempo</label>
                                    <Link href={route('entries.edit', id)}>
                                        <div className="p-4 border border-gray-100 bg-gray-100">{ tempo }</div>
                                    </Link>
                                </div>

                                <div className="mt-6">
                                    <label>Mentions</label>
                                    <div className="p-4 border border-gray-100 bg-gray-100">
                                        marilynwarren
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label>Tags</label>
                                    <div className="p-4 border border-gray-100 bg-gray-100">
                                        {
                                            tags.map((t) => t.name).join(' ')
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 px-6 bg-white">
                            <div className="flex flex-col">
                                <div className="mt-6">
                                    <label>Entry</label>
                                    <Link href={route('entries.edit', id)}>
                                        <div className="p-4 border border-gray-100 bg-gray-100">{ body }</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
