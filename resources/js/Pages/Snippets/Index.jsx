import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, snippets = [], errors, tags = [] }) {
    // const [filteredTags, setFilteredTags] = useState(tags);

    // function searchTags(e) {
    //     const searchTerm = e?.target?.value;
    //     if (searchTerm) {
    //         setFilteredTags(tags.filter(({ name }) => -1 !== name.indexOf(searchTerm)));
    //     } else {
    //         setFilteredTags(tags);
    //     }
    // }

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
                                    href={route('snippets.show', snippet?.id)}
                                    key={i}
                                >
                                    { console.log('SHS snippet:', snippet) }
                                    {/*
                                    <Card
                                        snippet={snippet}
                                    ></Card>
                                    */}
                                </Link>
                            );
                        })}

                        <div className="w-full mt-8 flex flex-col items-center">
                            {!snippets.length && (
                                <Link
                                    href={route('snippets.create')}
                                    className="py-4 text-sm text-blue-400"
                                >
                                    Create snippet
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
