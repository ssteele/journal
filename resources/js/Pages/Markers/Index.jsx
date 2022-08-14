import { MarkerColorMap } from '@/Constants/MarkerColorMap';
import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import GetMarkerCategory from '@/Utils/GetMarkerCategory';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, errors, markerCategories, markers }) {
    const [filteredMarkers, setFilteredMarkers] = useState(markers);

    function filterMarkerCategory(e) {
        const categoryId = parseInt(e?.target?.value);
        if (categoryId) {
            setFilteredMarkers(markers.filter(({ marker_category_id }) => marker_category_id === categoryId));
        } else {
            setFilteredMarkers(markers);
        }
    }

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Markers
                </h2>
            }
        >
            <Head title="Markers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">
                            <div>
                                <label>Filter Category</label>
                            </div>

                            <select
                                className="w-full mt-2"
                                defaultValue={0} 
                                onChange={e => filterMarkerCategory(e)}
                            >
                                <option value="0">All</option>
                                <option value="1">Feeling</option>
                                <option value="2">Health</option>
                                <option value="3">Milestone</option>
                                <option value="4">Event</option>
                            </select>
                        {/*
                            <input
                                className="w-full p-4 border border-gray-200"
                                label="Search"
                                name="search"
                                onChange={e => filterMarkers(e)}
                                placeholder='Search markers'
                                type="input"
                            />
                        */}
                        </div>

                        <div className="md:col-span-2 p-6 pt-2 bg-white">
                            {
                                filteredMarkers.map((marker, i) => {
                                    const categoryName = GetMarkerCategory(markerCategories, marker?.marker_category_id);
                                    return (
                                        <Link
                                            href={route('entries.show', marker?.entry_id)}
                                            className={`
                                                block
                                                mt-4
                                                p-4
                                                ${MarkerColorMap[marker?.marker_category_id] || bg - gray - 200}
                                                rounded-lg
                                            `}
                                            key={i}
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-bold">
                                                    {categoryName}
                                                </span>

                                                <span
                                                    dangerouslySetInnerHTML={
                                                        {__html: `${FormatDateWeekdayLong(marker?.date)} &#8211; ${FormatDateForInputField(marker?.date)}`}
                                                    }
                                                ></span>
                                            </div>

                                            <div className='mt-4'>
                                                {marker?.marker}
                                            </div>
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
