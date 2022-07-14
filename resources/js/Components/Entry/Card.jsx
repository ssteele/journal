import { Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Card({ entry }) {
    const { id, date, tempo, entry: body } = entry;

    return (
        <Link
            href={route('entries.show', id)}
            className=""
        >
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200 flex justify-between">
                        <span>{ date }</span>
                        <span className="px-2 border bg-gray-100">{ tempo }</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
