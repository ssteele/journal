import AutoAnnotation from '@/Components/AutoAnnotation';
import { DailyTagsColors } from '@/Constants/DailyAnnotations';
import { removeHashes } from '@/Utils/Snippet';
import UseFocus from '@/Utils/UseFocus';
import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Form({ dbEntry = {}, dbSnippets = [], currentTags = [], mentions, nextDate, recentTags, tags }) {
    const recentTagsCount = 25;
    const {
        id,
        date = nextDate || new Date().toISOString().slice(0, 10),
        tempo = '0',
        entry = '',
    } = dbEntry;
    const isExistingEntry = !!id;
    const initialState = {
        date,
        tempo,
        entry,
    };
    const { data, errors, post, put, setData } = useForm(initialState);
    const [annotationStartIndex, setAnnotationStartIndex] = useState(0);
    const [isAnnotatingStart, setIsAnnotatingStart] = useState(false);
    const [isAnnotating, setIsAnnotating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedAnnotations, setSuggestedAnnotations] = useState([]);
    const [reset, setReset] = useState(null);
    const [inputRef, setInputFocus] = UseFocus();
    const tagSnippets = dbSnippets.filter((snippet) => 'tag' === snippet.type);
    const dailyTags = buildDailyTags(date, tagSnippets);

    function handleSubmit(e) {
        e.preventDefault();
        if (isExistingEntry) {
            put(route('entries.update', id), {
                onSuccess: () => {
                    // @todo: flash notify
                    console.log('Entry updated');
                },
            });
        } else {
            post(route('entries.store'), {
                onSuccess: () => {
                    // @todo: flash notify
                    console.log('Entry added');
                },
            });
        }
    }

    function buildDailyTags(date, tagSnippets) {
        let tags = [];
        const day = new Date(date.split('-')).getDay();
        tagSnippets
            .filter(({ days, enabled }) => enabled && days.includes(day))
            .map(({ snippet }) => {
                tags = [...tags, ...JSON.parse(removeHashes(snippet))];
            })
        return tags;
    }

    function getAnnotationState() {
        return {
            annotationStartIndex,
            entry: data?.entry,
            searchTerm,
            suggestedAnnotations,
        }
    }

    useEffect(() => {
        suggestAnnotations(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        if (isAnnotatingStart) {
            setReset(null);
            setIsAnnotatingStart(false);
            const entryEl = document.getElementById('entry');
            const annotationStartIndex = entryEl.selectionStart - 1;
            setAnnotationStartIndex(annotationStartIndex);
        }
    }, [data?.entry]);

    useEffect(() => {
        if (null !== reset) {
            setInputFocus(reset);
            setAnnotationStartIndex(0);
            setIsAnnotating(false);
            setSearchTerm('');
            setSuggestedAnnotations([]);
        }
    }, [reset]);

    function populateAnnotation({
        annotationStartIndex,
        entry,
        searchTerm,
        text,
    }) {
        const pre = entry.substring(0, annotationStartIndex);
        const post = entry.substring(annotationStartIndex + searchTerm.length);
        entry = `${pre}${text}${post}`;
        setData('entry', entry);

        const annotationEndIndex = annotationStartIndex + text.length;
        setReset(annotationEndIndex);
    }

    function populateSuggestedAnnotation(text) {
        populateAnnotation({
            ...getAnnotationState(),
            text,
        });
    }

    function populateTag(text) {
        const { entry } = getAnnotationState();
        const entryEl = document.getElementById('entry');
        populateAnnotation({
            annotationStartIndex: (entryEl?.selectionStart) ?? entry.length,
            entry,
            searchTerm: '',
            text: `#${text}`,
        });
    }

    function isValidKey(key) {
        let isValid = false;
        if (1 === key.length) {
            if (/[0-9a-zA-Z]/.test(key)) {
                isValid = true;
            }
        }
        return isValid;
    }

    function suggestAnnotations(searchTerm = '') {
        if (!searchTerm.length) {
            return;
        }
        let suggestions = [];
        if ('tag' === isAnnotating) {
            suggestions = tags.filter((a) => a.includes(searchTerm));
        } else if ('mention' === isAnnotating) {
            suggestions = mentions.filter((a) => a.startsWith(searchTerm));
        }
        setSuggestedAnnotations(suggestions);
    }

    function listenForTab(e) {
        const { key } = e;
        const { suggestedAnnotations } = getAnnotationState();

        if (isAnnotating) {
            switch (key) {
                case 'Tab':
                    e.preventDefault();
                    populateSuggestedAnnotation(suggestedAnnotations[0]);
                    break;
            }
        }
    }

    function listenForAnnotation(e) {
        const { key } = e;
        const { searchTerm } = getAnnotationState();

        if (isAnnotating) {
            if (isValidKey(key)) {
                setSearchTerm(`${searchTerm}${key}`);
            } else {
                switch (key) {
                    case 'Backspace':
                        if (searchTerm.length) {
                            setSearchTerm(searchTerm.slice(0, -1));
                        } else {
                            setReset();
                        }
                        break;
                    case 'Escape':
                    case 'Enter':
                    case 'ArrowUp':
                    case 'ArrowDown':
                    case 'ArrowLeft':
                    case 'ArrowRight':
                    case ' ':
                        setReset();
                        break;
                }
            }
        }

        if ('#' === key) {
            setIsAnnotatingStart(true);
            setIsAnnotating('tag');
        }

        if ('@' === key) {
            setIsAnnotatingStart(true);
            setIsAnnotating('mention');
        }
    }

    function getFilteredDailyTags(dailyTags, currentTags) {
        const filteredTags = dailyTags.map((group) => {
            return group.filter(a => !currentTags.includes(a));
        });
        return filteredTags;
    }

    function getFilteredRecentTags(recentTags, dailyTags, currentTags) {
        const flatDailyTags = dailyTags.flat();
        const visibleTags = [...new Set([...currentTags, ...flatDailyTags])];
        let filteredTags = [];
        for (let i=0; i<=recentTags.length; i++) {
            const recentTag = recentTags[i];
            if (!visibleTags.includes(recentTag)) {
                filteredTags.push(recentTag);
                if (filteredTags.length >= recentTagsCount) {
                    break;
                }
            }
        }
        return filteredTags;
    }

    return (
        <div className="max-w-7xl mx-auto mt-12 sm:px-6 lg:px-8">
            <form name="entryForm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-t-lg">
                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <label>Date</label>
                            <input
                                className="w-full p-4 border-gray-200"
                                label="date"
                                name="date"
                                onChange={e => setData('date', e?.target?.value)}
                                type="date"
                                value={data.date}
                            />
                            <span className="text-red-600">
                                {errors.date}
                            </span>
                        </div>

                        <div className="mt-6">
                            <label>Tempo</label>
                            <input
                                className="w-full p-4 border-gray-200"
                                label="Tempo"
                                name="tempo"
                                onChange={e => setData('tempo', e?.target?.value)}
                                type="number"
                                value={data.tempo}
                            />
                            <span className="text-red-600">
                                {errors.tempo}
                            </span>
                        </div>

                        <div className="mt-6">
                            <label>Suggested</label>
                            <div className={`
                                h-20 md:h-72 p-2 overflow-auto border border-green-200 ${(isAnnotating) && 'bg-green-50'}
                            `}>
                                {
                                    suggestedAnnotations.map((annotation, i) => {
                                        return <AutoAnnotation
                                            callback={populateSuggestedAnnotation}
                                            key={i}
                                            type="button"
                                        >{annotation}</AutoAnnotation>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 px-6 bg-white">
                        <div className="flex flex-col">
                            <div className="mt-6">
                                <label>Entry</label>
                                <textarea
                                    className="w-full h-[32rem] p-4 border-gray-200"
                                    errors={errors.entry}
                                    id="entry"
                                    label="entry"
                                    name="entry"
                                    onChange={e => setData('entry', e?.target?.value)}
                                    onClick={_ => setReset()}
                                    onKeyDown={e => listenForTab(e)}
                                    onKeyUp={e => listenForAnnotation(e)}
                                    ref={inputRef}
                                    type="text"
                                    value={data.entry}
                                />
                                <span className="text-red-600">
                                    {errors.entry}
                                </span>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 font-bold text-white bg-blue-500 rounded"
                                >
                                    {isExistingEntry ? 'Update' : 'Log'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 pb-4 bg-white overflow-hidden shadow-sm">
                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <label>Daily</label>
                            <div 
                                className="w-full p-4 border border-gray-200"
                            >
                                {
                                    getFilteredDailyTags(dailyTags, currentTags).map((group, i) => {
                                        const colorIndex = i % DailyTagsColors.length;
                                        const color = DailyTagsColors[colorIndex];
                                        return group.map((annotation, j) => {
                                            return <AutoAnnotation
                                                callback={populateTag}
                                                className={color}
                                                key={j}
                                                type="button"
                                            >{annotation}</AutoAnnotation>
                                        })
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-b-lg">
                    <div className="px-6 bg-white">
                        <div className="mt-6">
                            <label>Recent</label>
                            <div 
                                className="w-full p-4 border border-gray-200"
                            >
                                {
                                    getFilteredRecentTags(recentTags, dailyTags, currentTags)
                                        .map((annotation, i) => {
                                            return <AutoAnnotation
                                                callback={populateTag}
                                                key={i}
                                                type="button"
                                            >{annotation}</AutoAnnotation>
                                        })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
