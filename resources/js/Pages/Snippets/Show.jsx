import { SnippetTypes } from '@/Constants/SnippetTypes';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, errors, snippet: dbSnippet = '', tags = [] }) {
    const { description, id, type } = dbSnippet;

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

                    {/*
                                <div className="grid grid-cols-2 sm:justify-self-end bg-white">
                                    <div className="pt-3">
                                        <label>
                                            Enabled
                                            <input
                                                checked={data.enabled}
                                                className="mx-1"
                                                onChange={e => setData('enabled', e?.target?.checked)}
                                                type="checkbox"
                                            />
                                        </label>
                                    </div>

                                    <div className="pt-3">
                                        <label>
                                            Repeating
                                            <input
                                                checked={data.repeating}
                                                className="mx-1"
                                                onChange={e => setData('repeating', e?.target?.checked)}
                                                type="checkbox"
                                            />
                                        </label>
                                    </div>
                                </div>
                    */}
                            </div>

                            {/*
                            <div className="grid grid-cols-1 pb-4 bg-white">
                                <div className="pt-3 sm:justify-self-end">
                                    <label
                                        className="mr-2"
                                        onClick={_ => toggleAllDays()}
                                    >
                                        Days
                                    </label>

                                    {dayAbbreviations.map((dayAbbreviation, i) => {
                                        return (
                                            <label key={i}>
                                                { dayAbbreviation }
                                                <input
                                                    checked={isDayChecked(i)}
                                                    className="mx-1"
                                                    onChange={e => handleUpdateDay(i, e?.target?.checked)}
                                                    type="checkbox"
                                                />
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                            */}
                        </div>
                    </div>

                    {/*
                    <div className="grid grid-cols-1 md:grid-cols-3 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-t-lg">
                        <div className="px-6 bg-white">
                            <div className="mt-6">
                                <label>Suggested</label>
                                <div className={`
                                    h-20 md:h-72 p-2 overflow-auto border border-green-200 ${(isAnnotating) && 'bg-green-50'}
                                `}>
                                    {
                                        suggestedAnnotations.map((annotation, i) => {
                                            return <AutoAnnotation
                                                callback={populateSuggestedAnnotation}
                                                key={i}
                                                type="button"
                                            >{annotation}</AutoAnnotation>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 px-6 bg-white">
                            <div className="flex flex-col">
                                <div className="mt-6">
                                    <label>Snippet</label>
                                    <textarea
                                        className="w-full h-[32rem] p-4 border-gray-200"
                                        errors={errors.snippet}
                                        label="snippet"
                                        name="snippet"
                                        onChange={e => setData('snippet', e?.target?.value)}
                                        onClick={_ => setReset()}
                                        onKeyDown={e => listenForTab(e)}
                                        onKeyUp={e => listenForAnnotation(e)}
                                        ref={inputRef}
                                        type="text"
                                        value={data.snippet}
                                    />
                                    <span className="text-red-600">
                                        {errors.snippet}
                                    </span>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 font-bold text-white bg-blue-500 rounded"
                                    >
                                        {isExistingSnippet ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    */}
                </div>
            </div>
        </Authenticated>
    );
}
