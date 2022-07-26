import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Index({ auth, errors, tags }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tags
                </h2>
            }
        >
            <Head title="Tags" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">
                            {tags.map((tag, i) => {
                                return (
                                    <Link
                                        href={route('tags.show', tag?.id)}
                                        key={i}
                                    >
                                        <span className="inline-flex px-2 py-1">
                                            {tag.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
