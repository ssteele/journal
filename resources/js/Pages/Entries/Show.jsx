import NewIcon from '@/Components/Icons/New';
import { MarkerColorMap } from '@/Constants/MarkerColorMap';
import Authenticated from '@/Layouts/Authenticated';
import GetMarkerCategory from '@/Utils/GetMarkerCategory';
import { FormatDateForInputField, FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import MarkupEntry from '@/Utils/MarkupEntry';
import { Head, Link } from '@inertiajs/inertia-react';
import React from 'react';

export default function Show({
  auth,
  dbEntry,
  dbDatesPrevNext,
  dbMarkerCategories = [],
  dbMarkers = [],
  dbMentions = [],
  dbTags = [],
  errors,
}) {
  const { date, tempo, entry } = dbEntry;

  function renderMarkers(markers, markerCategories) {
    return markers.map((marker, i) => {
      const categoryName = GetMarkerCategory(markerCategories, marker?.marker_category_id);
      return (
        <div
          className={`
            mt-4
            first:mt-0
            p-4
            ${MarkerColorMap[marker?.marker_category_id] || bg-gray-200}
            rounded-lg
          `}
          key={i}
        >
          <div>
            <span className="font-bold">
              {categoryName}
            </span>
          </div>
          {marker?.marker}
        </div>
      );
    })
  }

  function renderMentions(mentions) {
    return mentions.map((mention, i) => {
      return (
        <li className="inline-block pr-1.5" key={i}>
          <Link
            href={route('mentions.show', mention?.name)}
          >
            {mention?.name}
          </Link>
        </li>
      );
    })
  }

  function groupTagsByCount(tags) {
    let tagsHash = {};
    let groupedByCount = {};

    tags.sort((a, b) => {
      if (a?.name < b?.name) return -1;
      if (a?.name > b?.name) return 1;
      return 0;
    });

    tags.map(t => {
      tagsHash[t.id] = tagsHash[t.id] ? tagsHash[t.id] + 1 : 1;
      return t;
    })
    .filter(t => {
      if (tagsHash[t.id]) {
        t.count = tagsHash[t.id];
        delete tagsHash[t.id];
        return t;
      }
    })
    .map(t => {
      const { count } = t;
      if (!groupedByCount[count]) {
        groupedByCount[count] = [t];
      } else {
        groupedByCount[count].push(t);
      }
    });

    return groupedByCount;
  }

  function renderTags(groupedTags) {
    return Object.keys(groupedTags)
      .reverse()
      .map((tagCount) => {
        const group = groupedTags[tagCount];
        if (group) {
          const { count } = group[0]
          return (
            <ul key={count}>
              {`[${count}] `}
              {group.map((tag, i) => {
                return (
                  <li className="inline-block pr-1.5" key={i}>
                    <Link
                      href={route('tags.show', tag?.name)}
                    >
                      {tag?.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        }
      })
  }

  return (
    <Authenticated
      auth={auth}
      errors={errors}
      header={
        <>
          <h2
            className="font-semibold text-xl text-gray-800 leading-tight"
            dangerouslySetInnerHTML={{__html: `${FormatDateForTitle(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
          ></h2>

          {date === dbDatesPrevNext?.dateToday && (
            <span className="float-right relative bottom-6" title="Today">
              <NewIcon className="block h-8 w-auto" strokeColor="#000" />
            </span>
          )}
        </>
      }
    >
      <Head title="Entry" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between mt-2 px-6 text-2xl">
          {dbDatesPrevNext?.prev && (
            <Link href={route('entries.show', dbDatesPrevNext?.prev)}>
              <button className="px-2 font-bold text-white bg-gray-400 rounded">&laquo;</button>
            </Link>
          )}

          {dbDatesPrevNext?.next && (
            <Link href={route('entries.show', dbDatesPrevNext?.next)}>
              <button className="px-2 font-bold text-white bg-gray-400 rounded">&raquo;</button>
            </Link>
          )}

          {!dbDatesPrevNext?.next && (
            <Link href={route('entries.next', dbDatesPrevNext?.dateNext)}>
              <button className="px-2 font-bold text-white bg-green-400 rounded">&raquo;</button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 pb-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="px-6 bg-white">
            <div className="mt-6">
              <label>Date</label>
              <Link href={route('entries.edit', date)}>
                <div className="p-4 border border-gray-100 bg-gray-100">{ FormatDateForInputField(date) }</div>
              </Link>
            </div>

            <div className="mt-6">
              <label>Tempo</label>
              <Link href={route('entries.edit', date)}>
                <div className="p-4 border border-gray-100 bg-gray-100">{ tempo }</div>
              </Link>
            </div>

            {dbMentions.length > 0 && 
              <div className="mt-6">
                <label>Mentions</label>
                <div className="p-4 border border-gray-100 bg-gray-100">
                  { renderMentions(dbMentions) }
                </div>
              </div>
            }

            {dbTags.length > 0 && 
              <div className="mt-6">
                <label>Tags</label>
                <div className="p-4 border border-gray-100 bg-gray-100">
                  { renderTags(groupTagsByCount(dbTags)) }
                </div>
              </div>
            }

            {dbMarkers.length > 0 && 
              <div className="mt-6">
                <label>Markers</label>
                <div>
                  { renderMarkers(dbMarkers, dbMarkerCategories) }
                </div>
              </div>
            }
          </div>

          <div className="md:col-span-2 px-6 bg-white">
            <div className="mt-6">
              <label>Entry</label>
              <Link href={route('entries.edit', date)}>
                <div
                  className="p-4 border border-gray-100 bg-gray-100"
                  dangerouslySetInnerHTML={{__html: MarkupEntry(entry)}}
                ></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
