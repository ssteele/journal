import AutoAnnotation from '@/Components/AutoAnnotation';
import { DailyTagsColors, EverydayTags, WeekdayTags, WeekendTags } from '@/Constants/DailyAnnotations';
import UseFocus from '@/Utils/UseFocus';
import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Form({ dbSnippet = {}, tags = [] }) {
    // const recentTagsCount = 25;
    const {
        id,
        body = '',
        // days = {
        //     0: true,
        //     1: true,
        //     2: true,
        //     3: true,
        //     4: true,
        //     5: true,
        //     6: true,
        // },
        days = [0, 1, 2, 3, 4, 5, 6],
        description = '',
        enabled = true,
        repeating = true,
        type = 'tag',
    } = dbSnippet;
    const isExistingSnippet = !!id;
    const initialState = {
        body,
        days,
        description,
        enabled,
        type,
        repeating,
    };
    const { data, errors, post, put, setData } = useForm(initialState);
    // const [annotationStartIndex, setAnnotationStartIndex] = useState(0);
    // const [isAnnotatingStart, setIsAnnotatingStart] = useState(false);
    // const [isAnnotating, setIsAnnotating] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [suggestedAnnotations, setSuggestedAnnotations] = useState([]);
    // const [reset, setReset] = useState(null);
    // const [inputRef, setInputFocus] = UseFocus();
    // const dailyTags = buildDailyTags(date, EverydayTags, WeekdayTags, WeekendTags);
    const dayAbbreviations = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

    function handleSubmit(e) {
        e.preventDefault();
        if (isExistingSnippet) {
            // put(route('snippets.update', id), {
            //     onSuccess: () => {
            //         // @todo: flash notify
            //         console.log('Snippet updated');
            //     },
            // });
        } else {
            console.log('SHS post');
            console.log('SHS data:', data);
            // post(route('snippets.store'), {
            //     onSuccess: () => {
            //         // @todo: flash notify
            //         console.log('Snippet added');
            //     },
            // });
        }
    }

    function isDayChecked(dayIndex) {
        const { days } = data;
        return days.includes(dayIndex);
    }

    function handleUpdateDay(dayIndex, isChecked) {
        let { days } = data;
        if (isChecked) {
            if (!days.includes(dayIndex)) {
                days.push(dayIndex);
            }
        } else {
            days = days.filter(d => d !== dayIndex);
        }
        setData('days', days);
    }

    // function populateTag(text) {
    //     const { snippet } = getAnnotationState();
    //     populateAnnotation({
    //         annotationStartIndex: snippet.length,
    //         snippet,
    //         searchTerm: '',
    //         text: `#${text} `,
    //     });
    // }

    // function getFilteredDailyTags(dailyTags, currentTags) {
    //     const filteredTags = dailyTags.map((group) => {
    //         return group.filter(a => !currentTags.includes(a));
    //     });
    //     return filteredTags;
    // }

    // function getFilteredRecentTags(recentTags, dailyTags, currentTags) {
    //     const flatDailyTags = dailyTags.flat();
    //     const visibleTags = [...new Set([...currentTags, ...flatDailyTags])];
    //     let filteredTags = [];
    //     for (let i=0; i<=recentTags.length; i++) {
    //         const recentTag = recentTags[i];
    //         if (!visibleTags.includes(recentTag)) {
    //             filteredTags.push(recentTag);
    //             if (filteredTags.length >= recentTagsCount) {
    //                 break;
    //             }
    //         }
    //     }
    //     return filteredTags;
    // }

    return (
        <div className="max-w-7xl mx-auto mt-12 sm:px-6 lg:px-8">
            <form name="snippetForm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <label>Description</label>
                            <input
                                className="w-full p-4 border border-gray-200"
                                label="description"
                                name="description"
                                onChange={e => setData('description', e?.target?.value)}
                                type="description"
                                value={data.description}
                            />
                            <span className="text-red-600">
                                {errors.description}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <div className="grid grid-cols-2 pb-4 bg-white">
                                <div className="grid grid-cols-2 bg-white">
                                    <div>
                                        <label>
                                            Enabled
                                            <input
                                                checked={data.enabled}
                                                className="mx-1"
                                                onChange={e => setData('enabled', e?.target?.checked)}
                                                type="checkbox"
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label>
                                            Repeating
                                            <input
                                                checked={data.repeating}
                                                className="mx-1"
                                                onChange={e => setData('repeating', e?.target?.checked)}
                                                type="checkbox"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="mr-2"
                                        // onClick="toggleAllDays"  // @todo
                                    >
                                        Days
                                    </label>

                                    {dayAbbreviations.map((dayAbbreviation, i) => {
                                        return (
                                            <label key={i}>
                                                { dayAbbreviation }
                                                <input
                                                    checked={isDayChecked(i)}
                                                    className="mx-1"
                                                    onChange={e => handleUpdateDay(i, e?.target?.checked)}
                                                    type="checkbox"
                                                />
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <div>
                                <label>Snippet</label>
                                <textarea
                                    className="w-full h-[32rem] p-4 border-gray-200"
                                    errors={errors.snippet}
                                    label="snippet"
                                    name="snippet"
                                    onChange={e => setData('snippet', e?.target?.value)}
                                    // onClick={_ => setReset()}
                                    // onKeyDown={e => listenForTab(e)}
                                    // onKeyUp={e => listenForAnnotation(e)}
                                    // ref={inputRef}
                                    type="text"
                                    value={data.snippet}
                                />
                                <span className="text-red-600">
                                    {errors.snippet}
                                </span>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 font-bold text-white bg-blue-500 rounded"
                                >
                                    {isExistingSnippet ? 'Update' : 'Log'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
