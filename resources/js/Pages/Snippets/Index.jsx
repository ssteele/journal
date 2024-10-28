import Checkbox from '@/Components/Checkbox';
import DragAndDropIcon from '@/Components/Icons/DragAndDrop';
import Card from '@/Components/Snippet/Card';
import { SnippetTypes } from '@/Constants/SnippetTypes';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm, usePage } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd';

export default function Index({
  auth,
  dbEntrySnippets = [],
  dbTagSnippets = [],
  dbMentionSnippets = [],
  errors,
}) {
  const defaultSnippetType = 'entry';
  const [currentSnippetType, setCurrentSnippetType] = useState(defaultSnippetType);
  const [showDisabled, setShowDisabled] = useState(false);
  const [currentSnippets, setCurrentSnippets] = useState([]);

  const { data, setData } = useForm([]);
  const { props } = usePage();

  useEffect(() => {
    handleSwitchSnippetType(defaultSnippetType);
  }, []);

  useEffect(() => {
    setSnippets(getCurrentSnippetType()?.value);
  }, [showDisabled]);

  // persist snippet reorder on backend
  useEffect(async () => {
    if (data?.idsOrders?.length) {
      const response = await fetch(route('api.snippets.update-order'), {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': props?.csrf_token,
        },
        method: 'POST',
      })
        .then(async response => response?.ok ? await response?.json() : null)
        .catch(error => console.log(error?.message));
      ;
      if (response?.message) {
        console.log(response?.message);
      }
    }
  }, [data]);

  function getCurrentSnippetType() {
    return SnippetTypes.find(snippetType => snippetType?.value === currentSnippetType);
  }

  function currentSnippetValue() {
    return getCurrentSnippetType()?.value;
  }

  function currentSnippetLabel() {
    return getCurrentSnippetType()?.label;
  }

  function isActiveType(type) {
    return type === currentSnippetType;
  }

  function filterStatus(snippets) {
    return snippets.filter(snippet => showDisabled ? !snippet?.enabled : !!snippet?.enabled);
  }

  function setSnippetOrder(snippets) {
    setCurrentSnippets(snippets);

    const snippetOrder = snippets.map(({ id }, i) => ({ id, order: i}));
    setData({ idsOrders: snippetOrder });
  }

  function setSnippets(type) {
    switch (type) {
      case 'tag':
        setCurrentSnippets(filterStatus(dbTagSnippets));
        break;
    
      case 'mention':
        setCurrentSnippets(filterStatus(dbMentionSnippets));
        break;
    
      default:
        setCurrentSnippets(filterStatus(dbEntrySnippets));
    }
  }

  function handleShowDisabledToggle() {
    setShowDisabled(!showDisabled);
  };

  function handleSwitchSnippetType(type) {
    setCurrentSnippetType(type);
    setSnippets(type);
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? 'rgba(230, 255, 230, 0.75)' : 'white',
    border: isDragging ? '1px solid black' : 'none',
    ...draggableStyle,
  });

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const snippets = [ ...currentSnippets ];

    const [ reorderedSnippet ] = snippets.splice(result.source.index, 1);
    snippets.splice(result.destination.index, 0, reorderedSnippet);

    setSnippetOrder(snippets);
  };

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
          <div className="flex justify-between">
            
            <label className="flex items-center">
              <Checkbox
                name="show-disabled"
                value={showDisabled}
                handleChange={handleShowDisabledToggle}
              />
              <span className="ml-2 text-sm text-gray-600">Show disabled</span>
            </label>
             

            <ul className="flex divide-x divide-bg-gray-50 border-b border-gray-300">
              {SnippetTypes.map((snippetType, i) => {
                return (
                  <li
                    className={`
                      px-4 py-1 rounded-t-md cursor-pointer
                      ${isActiveType(snippetType?.value) ? 'bg-green-100' : 'bg-white'}
                    `}
                    key={i}
                    onClick={() => handleSwitchSnippetType(snippetType?.value)}
                  >
                    { snippetType?.label }
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-b-lg">
            {!showDisabled && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                      {currentSnippets?.map((dbSnippet, i) => (
                        <Draggable key={dbSnippet?.id?.toString()} draggableId={dbSnippet?.id?.toString()} index={i}>
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex draggable-item"
                              key={i}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <DragAndDropIcon className="w-10 h-6 self-center" />

                              <Link
                                className="flex-auto"
                                href={route('snippets.edit', dbSnippet?.id)}
                              >
                                <Card
                                  dbSnippet={dbSnippet}
                                ></Card>
                              </Link>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            {showDisabled && (
              <ul>
                {currentSnippets?.map((dbSnippet, i) => (
                  <li
                    className="flex draggable-item"
                    key={i}
                  >
                    <Link
                      className="flex-auto"
                      href={route('snippets.edit', dbSnippet?.id)}
                    >
                      <Card
                        dbSnippet={dbSnippet}
                      ></Card>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="w-full mt-8 flex flex-col items-center">
              <Link
                href={route('snippets.create', {
                  type: currentSnippetValue(),
                })}
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
