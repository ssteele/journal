import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create(props) {
    const defaultDate = new Date().toISOString().slice(0, 10);
    const initialState = {
        date: defaultDate,
        tempo: '',
        entry: '',
    };
    const { data, errors, post, setData } = useForm(initialState);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('entries.store'), {
            onSuccess: () => {
                // @todo: flash notify
                console.log('Entry added');
            },
        });
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Entry</h2>}
        >
            <Head title="Entry" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-4 border-gray-200"
                                            label="date"
                                            name="date"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData("date", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.date}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <label>Tempo</label>
                                        <input
                                            type="number"
                                            className="w-full p-4 border-gray-200"
                                            label="Tempo"
                                            name="tempo"
                                            value={data.tempo}
                                            onChange={(e) =>
                                                setData("tempo", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.tempo}
                                        </span>
                                    </div>

                                    <div className="mb-0">
                                        <label>Entry</label>
                                        <textarea
                                            type="text"
                                            className="w-full h-96 p-4 border-gray-200"
                                            label="entry"
                                            name="entry"
                                            errors={errors.entry}
                                            value={data.entry}
                                            onChange={(e) =>
                                                setData("entry", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.entry}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 font-bold text-white bg-blue-500 rounded"
                                    >
                                        Log
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
