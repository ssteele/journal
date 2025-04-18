import AutoAnnotation from '@/Components/AutoAnnotation';
import Button from '@/Components/Button';
import { SnippetTypes } from '@/Constants/SnippetTypes';
import { expandJsonSnippet, minifyJsonSnippet } from '@/Utils/Snippet';
import { ucFirst } from '@/Utils/String';
import UseFocus from '@/Utils/UseFocus';
import { useForm } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

const InitialDays =  '0,1,2,3,4,5,6';

export default function CreateUpdateDeleteSnippetForm({ dbSnippet = {}, mentions = [], tags = [], snippetType = null }) {
  const {
    id,
    days = InitialDays,
    description = '',
    enabled = true,
    deleted = false,
    repeating = true,
    type = snippetType,
  } = dbSnippet;
  let { snippet = '' } = dbSnippet;
  const isExistingSnippet = !!id;
  const initialState = {
    days,
    description,
    enabled,
    deleted,
    repeating,
    snippet: (!!snippet && 'entry' !== type) ? expandJsonSnippet(snippet) : snippet,
    type,
  };
  const {
    clearErrors,
    data,
    delete: destroy, // delete is a reserved word
    errors,
    hasErrors,
    post,
    put,
    setData,
    setError,
  } = useForm(initialState);
  const [annotationStartIndex, setAnnotationStartIndex] = useState(0);
  const [isAnnotatingStart, setIsAnnotatingStart] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedAnnotations, setSuggestedAnnotations] = useState([]);
  const [doSubmit, setDoSubmit] = useState(false);
  const [reset, setReset] = useState(null);
  const [inputRef, setInputFocus] = UseFocus();
  const dayAbbreviations = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

  // handle submit
  useEffect(() => {
    if (doSubmit && !hasErrors) {
      if (isExistingSnippet) {
        put(route('snippets.update', id), {
          onSuccess: () => {
            // @todo: flash notify
            console.log('Snippet updated');
          },
        });
      } else {
        post(route('snippets.store'), {
          onSuccess: () => {
            // @todo: flash notify
            console.log('Snippet added');
          },
        });
      }
    }
    setDoSubmit(false);
  }, [doSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    if ('entry' !== data?.type) {
      setData('snippet', minifyJsonSnippet(data?.snippet));
    }
    setDoSubmit(true);
  }

  function handleDelete() {
    destroy(route('snippets.destroy', id), {
      onSuccess: () => {
        // @todo: flash notify
        console.log('Snippet deleted');
        return;
      },
    });

    // @todo: flash notify
    console.log('Snippet not deleted');
  }

  function isDayChecked(dayIndex) {
    const { days } = data;
    return days.split(',').includes(dayIndex.toString());
  }

  function handleUpdateDay(dayIndex, isChecked) {
    const dayIndexString = dayIndex.toString();
    let { days } = data;
    let daysArray = days.split(',');
    if (isChecked) {
      if (!daysArray.includes(dayIndexString)) {
        daysArray.push(dayIndexString);
      }
    } else {
      daysArray = daysArray.filter(d => d !== dayIndexString);
    }
    const daysString = daysArray
      .filter(d => !!d)
      .join(',');
    setData('days', daysString);
  }

  function toggleAllDays() {
    const { days } = data;
    const daysArray = days.split(',');
    const initialDaysArray = InitialDays.split(',');
    if (daysArray.length === initialDaysArray.length) {
      setData('days', '');
    } else {
      setData('days', InitialDays);
    }
  }

  function getAnnotationState() {
    return {
      annotationStartIndex,
      searchTerm,
      snippet: data?.snippet,
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
      const snippetEl = document.getElementById('snippet');
      const annotationStartIndex = snippetEl.selectionStart - 1;
      setAnnotationStartIndex(annotationStartIndex);
    }
  }, [data?.snippet]);

  useEffect(() => {
    if (null !== reset) {
      setInputFocus(reset);
      setAnnotationStartIndex(0);
      setIsAnnotating(false);
      setSearchTerm('');
      setSuggestedAnnotations([]);
    }
  }, [reset]);

  function setSnippet(snippet) {
    if ('entry' == data?.type) {
      clearErrors('snippet');
      setData('snippet', snippet);
      return;
    }

    let jsonSnippet;
    try {
      jsonSnippet = JSON.parse(snippet);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError('snippet', `${ucFirst(data?.type)} snippet type should be valid JSON`);
      } else {
        setError('snippet', 'An error occurred');
        throw error;
      }
      setData('snippet', snippet);
      return;
    }
    clearErrors('snippet');
    setData('snippet', JSON.stringify(jsonSnippet, null, 4));
  }

  function populateAnnotation({
    annotationStartIndex,
    searchTerm,
    snippet,
    text,
  }) {
    const pre = snippet.substring(0, annotationStartIndex);
    const post = snippet.substring(annotationStartIndex + searchTerm.length);
    snippet = `${pre}${text}${post}`;
    setSnippet(snippet);

    const annotationEndIndex = annotationStartIndex + text.length;
    setReset(annotationEndIndex);
  }

  function populateSuggestedAnnotation(text) {
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
      suggestions = mentions.filter((a) => a.includes(searchTerm));
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
                value={data?.description}
              />
              <span className="text-red-600">
                {errors?.description}
              </span>
            </div>
          </div>

          <div className="px-6 bg-white">
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 pb-4 bg-white">
                <div className="pb-4">
                  <select
                    className="w-full border border-gray-200"
                    onChange={e => setData('type', e?.target?.value)}
                    value={data?.type}
                  >
                    {SnippetTypes.map((option, index) => {
                      return (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:justify-self-end bg-white">
                  <div className="pt-3">
                    <label>
                      Enabled
                      <input
                        checked={data?.enabled}
                        className="mx-1"
                        onChange={e => setData('enabled', e?.target?.checked)}
                        type="checkbox"
                      />
                    </label>
                  </div>

                  <div className="pt-3">
                    <label>
                      Repeating
                      <input
                        checked={data?.repeating}
                        className="mx-1"
                        onChange={e => setData('repeating', e?.target?.checked)}
                        type="checkbox"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 pb-4 bg-white">
                <div className="pt-3 sm:justify-self-end">
                  <label
                    className="mr-2"
                    onClick={_ => toggleAllDays()}
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

          <div className="grid grid-cols-1 md:grid-cols-3 pb-4 bg-white overflow-hidden">
            <div className="px-6 bg-white">
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
                  <label>Snippet</label>
                  <textarea
                    className="w-full h-[32rem] p-4 border-gray-200"
                    errors={errors?.snippet}
                    id="snippet"
                    label="snippet"
                    name="snippet"
                    onChange={e => setSnippet(e?.target?.value)}
                    onClick={_ => setReset()}
                    onKeyDown={e => listenForTab(e)}
                    onKeyUp={e => listenForAnnotation(e)}
                    ref={inputRef}
                    type="text"
                    value={data?.snippet}
                  />
                  <span className="text-red-600">
                    {errors?.snippet}
                  </span>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  {isExistingSnippet && !data?.enabled && (
                    <Button
                      className="bg-red-500 active:bg-gray-900 active:opacity-25"
                      type="button"
                      onClick={_ => handleDelete()}
                    >
                      Delete
                    </Button>
                  )}

                  <Button type="submit">
                    {isExistingSnippet ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
