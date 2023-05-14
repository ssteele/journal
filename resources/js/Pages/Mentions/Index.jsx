import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, errors, mentions = [] }) {
    const [filteredMentions, setFilteredMentions] = useState(mentions);

    function searchMentions(e) {
        if ('Enter' === e.key && filteredMentions.length) {
            const mentionName = filteredMentions[0]?.name;
            if (mentionName) {
                window.location.href = route('mentions.show', mentionName);
            }
        }

        const searchTerm = e?.target?.value;
        if (searchTerm) {
            setFilteredMentions(mentions.filter(({ name }) => -1 !== name.indexOf(searchTerm)));
        } else {
            setFilteredMentions(mentions);
        }
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Mentions
                </h2>
            }
        >
            <Head title="Mentions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">
                            <input
                                autoComplete="off"
                                autoFocus
                                className="w-full p-4 border border-gray-200"
                                label="Search"
                                name="search"
                                onKeyUp={e => searchMentions(e)}
                                placeholder="Search mentions"
                                type="input"
                            />
                        </div>

                        <div className="p-6 pt-0 bg-white">
                            {filteredMentions.map((mention, i) => {
                                return (
                                    <Link
                                        href={route('mentions.show', mention?.name)}
                                        key={i}
                                    >
                                        <span className="inline-flex px-2 py-1">
                                            {mention.name}
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
