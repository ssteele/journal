import DragAndDrop from '@/Components/Icons/DragAndDrop';
import Card from '@/Components/Snippet/Card';
import { SnippetTypes } from '@/Constants/SnippetTypes';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
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
                console.log('SHS dbEntrySnippets:', dbEntrySnippets); // @debug
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

    const getItemStyle = (isDragging, draggableStyle) => ({
        background: isDragging ? 'rgba(230, 255, 230, 0.75)' : 'white',
        border: isDragging ? '1px solid black' : 'none',
        ...draggableStyle,
    });

    const handleDragEnd = (result) => {
        console.log('SHS handleDragEnd'); // @debug
        console.log('SHS result:', result); // @debug
        // if (!result.destination || result.destination.index === result.source.index) {
        //     return;
        // }

        // const items = Array.from(tasks);
        // const [reorderedItem] = items.splice(result.source.index, 1);
        // items.splice(result.destination.index, 0, reorderedItem);
        // reorderTasks(projectId, result.source.index + 1, result.destination.index + 1);

        // setTasks(items);
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
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                                        {currentSnippets().map((dbSnippet, i) => (
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
                                                        {/* @todo: rename to DragAndDropIcon */}
                                                        <DragAndDrop className="w-10 h-6 self-center" />

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
