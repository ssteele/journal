import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import React from 'react';

export default function Create({ auth, errors: authErrors }) {
    const initialState = {
        csv: '',
    };
    const { errors, post, progress, setData } = useForm(initialState);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('entries.store-upload'), {
            onSuccess: () => {
                // @todo: flash notify
                console.log('File uploaded');
            },
        });
    }

    return (
        <Authenticated
            auth={auth}
            errors={authErrors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Upload
                </h2>
            }
        >
            <Head title="Upload" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form
                                // encType="multipart/form-data"
                                name="createForm"
                                onSubmit={handleSubmit}
                            >
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label>File</label>
                                        <input
                                            className="w-full p-4 border border-gray-200"
                                            label="csv"
                                            name="csv"
                                            onChange={(e) => setData("csv", e.target.files[0])}
                                            type="file"
                                        />
                                        {progress && (
                                            <progress value={progress.percentage} max="100">
                                                {progress.percentage}%
                                            </progress>
                                        )}
                                        <span className="text-red-600">
                                            {errors.csv}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 font-bold text-white bg-blue-500 rounded"
                                    >
                                        Upload
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
