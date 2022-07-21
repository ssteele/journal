import AutoAnnotation from '@/Components/AutoAnnotation';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useRef, useState } from 'react';

export default function Create({ auth, errors, mentions, tags }) {
    // @todo: extract me
    const useFocus = () => {
        const htmlElRef = useRef(null);
        const setFocus = (position = null) => {
            const { current } = htmlElRef;
            if (current) {
                current.focus();
                if (position) {
                    current.setSelectionRange(position, position);
                }
            }
        };
        return [htmlElRef, setFocus];
    }

    const defaultDate = new Date().toISOString().slice(0, 10);
    const initialState = {
        date: defaultDate,
        tempo: '',
        entry: '',
    };
    const { data, errors: formErrors, post, setData } = useForm(initialState);
    // let isMentioning = false;
    // let currentMention = '';
    const [annotationStartIndex, setAnnotationStartIndex] = useState(0);
    const [isTaggingStart, setIsTaggingStart] = useState(false);
    const [isTagging, setIsTagging] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [textAreaPosition, setTextAreaPosition] = useState(0);
    const [inputRef, setInputFocus] = useFocus();

    function getAnnotationState() {
        return {
            annotationStartIndex,
            currentTag,
            entry: data?.entry,
            suggestedTags,
        }
    }

    useEffect(() => {
        suggestTags(currentTag);
    }, [currentTag]);

    useEffect(() => {
        if (isTaggingStart) {
            setIsTaggingStart(false);
            const { entry } = getAnnotationState();
            const annotationStartIndex = entry.search(/(?<=\s|^)#(?=\s|$)/);
            setAnnotationStartIndex(annotationStartIndex + 1);
        }
    }, [data]);

    useEffect(() => {
        // reset textarea
        setInputFocus(textAreaPosition);
        setAnnotationStartIndex(0);
        setIsTagging(false);
        setCurrentTag('');
        setSuggestedTags([]);
    }, [textAreaPosition]);

    function populateAnnotation({
        annotationStartIndex,
        currentTag,
        entry,
        text,
    }) {
        const pre = entry.substring(0, annotationStartIndex);
        const post = entry.substring(annotationStartIndex + currentTag.length);
        entry = `${pre}${text} ${post}`;
        setData('entry', entry);

        const annotationEndIndex = annotationStartIndex + text.length + 1;
        setTextAreaPosition(annotationEndIndex);
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

    function suggestTags(partialTag = '') {
        if (!partialTag.length) {
            return;
        }
        const suggestions = tags.filter((t) => t.startsWith(partialTag));
        setSuggestedTags(suggestions);
    }

    function listenForAnnotation(e) {
        const { key: lastKey } = e;
        const { currentTag, suggestedTags } = getAnnotationState();

        if (isTagging) {
            if (isValidKey(lastKey)) {
                setCurrentTag(`${currentTag}${lastKey}`);
            } else if ('Backspace' === lastKey) {
                if (currentTag.length) {
                    setCurrentTag(currentTag.slice(0, -1));
                } else {
                    setTextAreaPosition();
                }
            } else if ('Tab' === lastKey) {
                e.preventDefault();
                triggerPopulateAnnotation(suggestedTags[0]);
            } else if (' ' === lastKey) {
                setTextAreaPosition();
            }
        }

        if ('#' === lastKey) {
            setIsTaggingStart(true);
            setIsTagging(true);
        }
        
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('entries.store'), {
            onSuccess: () => {
                // @todo: flash notify
                console.log('Entry added');
            },
        });
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Entry</h2>}
        >
            <Head title="Entry" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
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

                                    <div className="mb-4">
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

                                    <div className="mb-0">
                                        <label>Entry</label>
                                        <textarea
                                            className="w-full h-96 p-4 border-gray-200"
                                            errors={formErrors.entry}
                                            label="entry"
                                            name="entry"
                                            onChange={e => setData('entry', e?.target?.value)}
                                            onKeyDown={e => listenForAnnotation(e)}
                                            ref={inputRef}
                                            type="text"
                                            value={data.entry}
                                        />
                                        <span className="text-red-600">
                                            {formErrors.entry}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 font-bold text-white bg-blue-500 rounded"
                                    >
                                        Log
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <label>Suggested Tags</label>
                                    <div className="min-h-max p-4 border border-gray-200">
                                        {
                                            suggestedTags.map((tag, i) => {
                                                return <AutoAnnotation
                                                    callback={triggerPopulateAnnotation}
                                                    key={i}
                                                    type="button"
                                                >{tag}</AutoAnnotation>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
