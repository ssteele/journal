import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, errors, tags = [] }) {
    const [filteredTags, setFilteredTags] = useState(tags);

    function searchTags(e) {
        if ('Enter' === e.key && filteredTags.length) {
            const tagName = filteredTags[0]?.name;
            if (tagName) {
                window.location.href = route('tags.show', tagName);
            }
        }

        const searchTerm = e?.target?.value;
        if (searchTerm) {
            setFilteredTags(tags.filter(({ name }) => -1 !== name.indexOf(searchTerm)));
        } else {
            setFilteredTags(tags);
        }
    }

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
                            <input
                                autoComplete="off"
                                autoFocus
                                className="w-full p-4 border border-gray-200"
                                label="Search"
                                name="search"
                                onKeyUp={e => searchTags(e)}
                                placeholder='Search tags'
                                type="input"
                            />
                        </div>

                        <div className="p-6 pt-0 bg-white">
                            {filteredTags.map((tag, i) => {
                                return (
                                    <Link
                                        href={route('tags.show', tag?.name)}
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
