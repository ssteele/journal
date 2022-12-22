import { SnippetTypes } from '@/Constants/SnippetTypes';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, errors, snippet: dbSnippet = '', tags = [] }) {
    const { days, description, enabled, id, repeating, snippet, type } = dbSnippet;
    const dayAbbreviations = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

    function isDayChecked(dayIndex) {
        return days.split(',').includes(dayIndex.toString());
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    { description }
                </h2>
            }
        >
            <Head title="Snippet" />

            <div className="max-w-7xl mx-auto mt-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <label>Description</label>
                            <Link href={route('snippets.edit', id)}>
                                <div className="p-4 border border-gray-100 bg-gray-100">{ description }</div>
                            </Link>
                        </div>
                    </div>

                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 pb-4 bg-white">
                                <div className="pb-4">
                                    <Link href={route('snippets.edit', id)}>
                                        <div className="px-3 py-2 border border-gray-100 bg-gray-100">{ SnippetTypes.find((s) => s?.value === type)?.label }</div>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 sm:justify-self-end bg-white">
                                    <div className="pt-3">
                                        <Link href={route('snippets.edit', id)}>
                                            <label>
                                                Enabled
                                                <input
                                                    checked={enabled}
                                                    className="mx-1 text-gray-400"
                                                    readOnly="readOnly"
                                                    type="checkbox"
                                                />
                                            </label>
                                        </Link>
                                    </div>

                                    <div className="pt-3">
                                        <Link href={route('snippets.edit', id)}>
                                            <label>
                                                Repeating
                                                <input
                                                    checked={repeating}
                                                    className="mx-1 text-gray-400"
                                                    readOnly="readOnly"
                                                    type="checkbox"
                                                />
                                            </label>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 pb-4 bg-white">
                                <div className="pt-3 sm:justify-self-end">
                                    <Link href={route('snippets.edit', id)}>
                                        <label
                                            className="mr-2"
                                        >
                                            Days
                                        </label>

                                        {dayAbbreviations.map((dayAbbreviation, i) => {
                                            return (
                                                <label key={i}>
                                                    { dayAbbreviation }
                                                    <input
                                                        checked={isDayChecked(i)}
                                                        className="mx-1 text-gray-400"
                                                        readOnly="readOnly"
                                                        type="checkbox"
                                                    />
                                                </label>
                                            )
                                        })}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-t-lg">
                        <div className="px-6 bg-white">
                            <div className="mt-6">
                                <Link href={route('snippets.edit', id)}>
                                    <label>Suggested</label>
                                    <div className="h-20 md:h-72 p-2 overflow-auto border border-gray-100 bg-gray-100"></div>
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-2 px-6 bg-white">
                            <div className="flex flex-col">
                                <div className="mt-6">
                                    <Link href={route('snippets.edit', id)}>
                                        <label>Snippet</label>
                                        <textarea
                                            className="w-full h-[32rem] p-4 border-gray-200"
                                            label="snippet"
                                            name="snippet"
                                            readOnly="readOnly"
                                            type="text"
                                            value={snippet}
                                        />
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
