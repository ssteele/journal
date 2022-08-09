import Card from '@/Components/Entry/Card';
import LoadingSpinner from '@/Components/LoadingSpinner';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, entries: dbEntries, errors }) {
    const [entries, setEntries] = useState(dbEntries);
    const [lastEntryId, setLastEntryId] = useState(entries[entries.length - 1]?.id);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLoadMore() {
        setIsLoading(true);
        await axios(route('entries.more', lastEntryId))
            .then((response) => response?.data)
            .then((more) => {
                setEntries([...entries, ...more]);
                setLastEntryId(more[more.length - 1]?.id);
            });
        setIsLoading(false);
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Entries
                </h2>
            }
        >
            <Head title="Entries" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {entries.map((entry, i) => {
                            return (
                                <Link
                                    href={route('entries.show', entry?.id)}
                                    key={i}
                                >
                                    <Card
                                        entry={entry}
                                    ></Card>
                                </Link>
                            );
                        })}

                        <div className="w-full mt-8 flex flex-col items-center">
                            {!isLoading && (
                                <>
                                    {!!entries.length && (
                                        <button
                                            className="py-4 text-sm text-blue-400"
                                            onClick={() => handleLoadMore()}
                                        >
                                            Load more
                                        </button>
                                    )}

                                    {!entries.length && (
                                        <Link
                                            href={route('entries.create')}
                                            className="py-4 text-sm text-blue-400"
                                        >
                                            Create entry
                                        </Link>
                                    )}
                                </>
                            )}

                            {isLoading && (
                                <div className="py-px">
                                    <LoadingSpinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
