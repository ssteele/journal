import Card from '@/Components/Snippet/Card';
import { SnippetTypes } from '@/Constants/SnippetTypes';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({
    auth,
    dbEntrySnippets = [],
    dbTagSnippets = [],
    dbMentionSnippets = [],
    errors,
}) {
    const defaultSnippetTab = 'entry';
    const [currentSnippetTab, setCurrentSnippetTab] = useState(defaultSnippetTab);

    function currentSnippetType() {
        return SnippetTypes.find(snippetType => snippetType?.value === currentSnippetTab);
    }

    function currentSnippets() {
        const currentType = currentSnippetType()?.value;
        switch (currentType) {
            case 'tag':
                return dbTagSnippets;
        
            case 'mention':
                return dbMentionSnippets;
        
            default:
                return dbEntrySnippets;
        }
    }

    function currentSnippetLabel() {
        return currentSnippetType()?.label;
    }

    function isActiveTab(tab) {
        return tab === currentSnippetTab;
    }

    function handleSwitchSnippetTypeTab(tab) {
        setCurrentSnippetTab(tab);
    }

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
                    <ul className="flex justify-end divide-x divide-bg-gray-50 border-b border-gray-300">
                        {SnippetTypes.map((snippetType, i) => {
                            return (
                                <li
                                    className={`
                                        px-4 py-1 rounded-t-md cursor-pointer
                                        ${isActiveTab(snippetType?.value) ? 'bg-green-100' : 'bg-white'}
                                    `}
                                    key={i}
                                    onClick={() => handleSwitchSnippetTypeTab(snippetType?.value)}
                                >
                                    { snippetType?.label }
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-b-lg">
                        {currentSnippets().map((dbSnippet, i) => {
                            return (
                                <Link
                                    href={route('snippets.edit', dbSnippet?.id)}
                                    key={i}
                                >
                                    <Card
                                        dbSnippet={dbSnippet}
                                    ></Card>
                                </Link>
                            );
                        })}

                        <div className="w-full mt-8 flex flex-col items-center">
                            <Link
                                href={route('snippets.create')}
                                className="py-4 text-sm text-blue-400"
                            >
                                {`Create ${currentSnippetLabel()} Snippet`}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
