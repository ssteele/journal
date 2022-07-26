import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForInputField, FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import MarkupEntry from '@/Utils/MarkupEntry';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({ auth, entry: dbEntry, errors, idsPrevNext, mentions, tags }) {
    const { id, date, tempo, entry } = dbEntry;

    function renderMentions(mentions) {
        return mentions.map(m => m.name).join(', ');
    }

    function renderTags(tags) {
        let res = '';
        let tagsHash = {};
        let groupedByCount = {};
        let maxCount = 0;

        tags.map(t => {
            tagsHash[t.id] = tagsHash[t.id] ? tagsHash[t.id] + 1 : 1;
            return t;
        })
        .filter(t => {
            if (tagsHash[t.id]) {
                t.count = tagsHash[t.id];
                delete tagsHash[t.id];
                return t;
            }
        })
        .map(t => {
            const { count } = t;
            maxCount = (count > maxCount) ? count : maxCount;
            if (!groupedByCount[count]) {
                groupedByCount[count] = [t];
            } else {
                groupedByCount[count].push(t);
            }
        });

        for (let i=maxCount; i>0; i--) {
            const group = groupedByCount[i];
            if (!group) {
                continue;
            }
            const { count } = group[0]
            res += '<div>';
            res += `[${count}] `;
            res += group.map(g => g.name).join(', ');
            res += '</div>';
        }

        return res;
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    { `${FormatDateForTitle(date)} – ${FormatDateWeekdayLong(date)}` }
                </h2>
            }
        >
            <Head title="Entry" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between mt-2 px-6 text-2xl">
                    {idsPrevNext?.prev && (
                        <Link href={route('entries.show', idsPrevNext?.prev)}>
                            <button className="px-2 font-bold text-white bg-gray-500 rounded">&laquo;</button>
                        </Link>
                    )}

                    {idsPrevNext?.next && (
                        <Link href={route('entries.show', idsPrevNext?.next)}>
                            <button className="px-2 font-bold text-white bg-gray-500 rounded">&raquo;</button>
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 mt-2 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <label>Date</label>
                            <Link href={route('entries.edit', id)}>
                                <div className="p-4 border border-gray-100 bg-gray-100">{ FormatDateForInputField(date) }</div>
                            </Link>
                        </div>

                        <div className="mt-6">
                            <label>Tempo</label>
                            <Link href={route('entries.edit', id)}>
                                <div className="p-4 border border-gray-100 bg-gray-100">{ tempo }</div>
                            </Link>
                        </div>

                        {mentions.length > 0 && 
                            <div className="mt-6">
                                <label>Mentions</label>
                                <div className="p-4 border border-gray-100 bg-gray-100">
                                    { renderMentions(mentions) }
                                </div>
                            </div>
                        }

                        {tags.length > 0 && 
                            <div className="mt-6">
                                <label>Tags</label>
                                <div
                                    className="p-4 border border-gray-100 bg-gray-100"
                                    dangerouslySetInnerHTML={{__html: renderTags(tags)}}
                                >
                                </div>
                            </div>
                        }
                    </div>

                    <div className="md:col-span-2 px-6 bg-white">
                        <div className="mt-6">
                            <label>Entry</label>
                            <Link href={route('entries.edit', id)}>
                                <div
                                    className="p-4 border border-gray-100 bg-gray-100"
                                    dangerouslySetInnerHTML={{__html: MarkupEntry(entry)}}
                                ></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
