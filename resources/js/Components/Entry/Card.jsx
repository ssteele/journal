import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import React from 'react';

export default function Card({ entry }) {
  const { date, entry_has_mention: entryMentions, tempo } = entry;

  function renderMentions(entryMentions) {
    return entryMentions.map(entryMention => {
      const { mention: { name } } = entryMention;
      return name;
    }).join(', ');
  }

  return (
    <div className="grid grid-cols-12 items-center p-6 bg-white border-b border-gray-200">
      <div className="col-start-1 col-span-4 lg:col-span-3">
        <span className="inline sm:hidden">{ `${FormatDateForInputField(date)}` }</span>
        <span
          className="hidden sm:inline"
          dangerouslySetInnerHTML={{__html: `${FormatDateForInputField(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
        >
        </span>
      </div>

      <div className="col-start-5 col-span-7 lg:col-start-4 lg:col-span-8">
        <span>{ renderMentions(entryMentions) }</span>
      </div>

      <div className="col-start-12 text-right">
        <span className="px-2 border bg-gray-100">{ tempo }</span>
      </div>
    </div>
  );
}
