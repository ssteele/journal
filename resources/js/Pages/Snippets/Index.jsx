import Card from '@/Components/Snippet/Card';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Index({ auth, snippets = [], errors, tags = [] }) {
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Snippets
                </h2>
            }
        >
            <Head title="Snippets" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {snippets.map((snippet, i) => {
                            return (
                                <Link
                                    href={route('snippets.edit', snippet?.id)}
                                    key={i}
                                >
                                    <Card
                                        dbSnippet={snippet}
                                    ></Card>
                                </Link>
                            );
                        })}

                        <div className="w-full mt-8 flex flex-col items-center">
                            <Link
                                href={route('snippets.create')}
                                className="py-4 text-sm text-blue-400"
                            >
                                Create snippet
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
