import { MarkerColorMap } from '@/Constants/MarkerColorMap';
import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import GetMarkerCategory from '@/Utils/GetMarkerCategory';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Index({ auth, errors, markerCategories, markers }) {
    const [filteredMarkers, setFilteredMarkers] = useState(markers);

    // function filterMarkers(e) {
    //     const filterTerm = e?.target?.value;
    //     if (filterTerm) {
    //         setFilteredMarkers(markers.filter(({ name }) => -1 !== name.indexOf(filterTerm)));
    //     } else {
    //         setFilteredMarkers(markers);
    //     }
    // }

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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/*
                        <div className="p-6 bg-white">
                            <input
                                className="w-full p-4 border border-gray-200"
                                label="Search"
                                name="search"
                                onChange={e => filterMarkers(e)}
                                placeholder='Search markers'
                                type="input"
                            />
                        </div>
                        */}

                        <div className="p-6 pt-0 bg-white">
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
