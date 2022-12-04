import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, errors, tags }) {
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
                { console.log('SHS tags:', tags) }
            </div>
        </Authenticated>
    );
}
