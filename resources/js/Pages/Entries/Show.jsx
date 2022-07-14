import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, entry, errors }) {
    const { id, date, tempo, entry: body } = entry;

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Entry</h2>}
        >
            <Head title="Entry" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <label>Date</label>
                                    <div className="p-4 border bg-gray-100">{ date }</div>
                                </div>

                                <div className="mb-4">
                                    <label>Tempo</label>
                                    <div className="p-4 border bg-gray-100">{ tempo }</div>
                                </div>

                                <div className="mb-0">
                                    <label>Entry</label>
                                    <div className="p-4 border bg-gray-100">{ body }</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
