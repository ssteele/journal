import AutoAnnotation from '@/Components/AutoAnnotation';
import UseFocus from '@/Utils/UseFocus';
import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Form({ dbEntry = {}, mentions, tags }) {
    const defaultDate = new Date().toISOString().slice(0, 10);
    const {
        id,
        date = defaultDate,
        tempo = '',
        entry = '',
    } = dbEntry;
    const isExistingEntry = !!id;
    const initialState = {
        date,
        tempo,
        entry,
    };
    const { data, errors: formErrors, post, put, setData } = useForm(initialState);
    const [annotationStartIndex, setAnnotationStartIndex] = useState(0);
    const [isAnnotatingStart, setIsAnnotatingStart] = useState(false);
    const [isAnnotating, setIsAnnotating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedAnnotations, setSuggestedAnnotations] = useState([]);
    const [reset, setReset] = useState(null);
    const [inputRef, setInputFocus] = UseFocus();

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
            const { entry } = getAnnotationState();
            let regex;
            if ('tag' === isAnnotating) {
                regex = /(?<=\s|^)#\w(?=\s|$)/
            } else if ('mention' === isAnnotating) {
                regex = /(?<=\s|^)@\w(?=\s|$)/
            }
            const annotationStartIndex = entry.search(regex) + 1;
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

    function triggerPopulateAnnotation(text) {
        populateAnnotation({
            ...getAnnotationState(),
            text,
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
                    triggerPopulateAnnotation(suggestedAnnotations[0]);
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

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <form name="entryForm" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 bg-white">
                            <div className="flex flex-col">
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
                                        {formErrors.date}
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
                                        {formErrors.tempo}
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
                                                    callback={triggerPopulateAnnotation}
                                                    key={i}
                                                    type="button"
                                                >{annotation}</AutoAnnotation>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 px-6 bg-white">
                            <div className="flex flex-col">
                                <div className="mt-6">
                                    <label>Entry</label>
                                    <textarea
                                        className="w-full h-[32rem] p-4 border-gray-200"
                                        errors={formErrors.entry}
                                        label="entry"
                                        name="entry"
                                        onChange={e => setData('entry', e?.target?.value)}
                                        onKeyDown={e => listenForTab(e)}
                                        onKeyUp={e => listenForAnnotation(e)}
                                        ref={inputRef}
                                        type="text"
                                        value={data.entry}
                                    />
                                    <span className="text-red-600">
                                        {formErrors.entry}
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
                </form>
            </div>
        </div>
    );
}
