import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForInputField, FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import MarkupEntry from '@/Utils/MarkupEntry';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, errors, tag, timeline }) {
    console.log('timeline:', timeline);
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {tag.name}
                </h2>
            }
        >
            <Head title="Tag" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-2 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="px-6 bg-white">
                        {tag.name}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
