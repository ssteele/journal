import LoadingSpinner from '@/Components/LoadingSpinner';
import { MarkerColorMap } from '@/Constants/MarkerColorMap';
import Authenticated from '@/Layouts/Authenticated';
import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import GetMarkerCategory from '@/Utils/GetMarkerCategory';
import { Head, Link } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';

export default function Index({ auth, errors, markerCategories = [], markers = [] }) {
  const initialMarkerLimit = 100;
  const abridgedMarkers = markers.slice(0, initialMarkerLimit);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState(abridgedMarkers);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreToLoad, setIsMoreToLoad] = useState(true);

  useEffect(() => {
    if (isLoading && !isMoreToLoad) {
      setIsLoading(false);
    }
  }, [isLoading, isMoreToLoad]);

  function handleLoadMore() {
    setTimeout(() => {
      filterMarkerCategory(markers, filterCategory);
      setIsMoreToLoad(false);
    });
    setIsLoading(true);
  }

  function renderMarkerCategoryOptions(markerCategories) {
    return markerCategories.map((markerCategory, i) => {
      const { name } = markerCategory;
      const category = `${name[0].toUpperCase()}${name.slice(1)}`
      return (
        <option
          key={i}
          value={markerCategory?.id}
        >
          {category}
        </option>
      );
    });
  }

  function filterMarkerCategory(markers = [], categoryId = null) {
    if (categoryId) {
      setFilteredMarkers(markers.filter(({ marker_category_id }) => marker_category_id === categoryId));
    } else {
      setFilteredMarkers(markers);
    }
  }

  function triggerFilterMarkerCategory(e) {
    const categoryId = parseInt(e?.target?.value);
    setFilterCategory(categoryId);
    if (isMoreToLoad) {
      filterMarkerCategory(abridgedMarkers, categoryId);
    } else {
      filterMarkerCategory(markers, categoryId);
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
                onChange={e => triggerFilterMarkerCategory(e)}
              >
                <option value="0">All</option>
                { renderMarkerCategoryOptions(markerCategories) }
              </select>
            </div>

            <div className="md:col-span-2 p-6 pt-2 bg-white">
              {
                filteredMarkers.map((marker, i) => {
                  const categoryName = GetMarkerCategory(markerCategories, marker?.marker_category_id);
                  return (
                    <Link
                      href={route('entries.show', marker?.date)}
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

              <div className="w-full mt-8 flex flex-col items-center">
                {isMoreToLoad && !isLoading && (
                  <button
                    className="py-4 text-sm text-blue-400"
                    onClick={() => handleLoadMore()}
                  >
                    Load more
                  </button>
                )}

                {isLoading && (
                  <div className="py-px">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
