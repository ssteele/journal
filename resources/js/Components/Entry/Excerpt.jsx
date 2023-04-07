import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import React, { useState } from 'react';

export default function Excerpt({ entry: dbEntry, tag }) {
    const { date, entry = '' } = dbEntry;
    const snippetLengths = [50, 100, 300];
    const [snippetLength, setSnippetLength] = useState(snippetLengths[0]);

    function getSnippet(target, entry, length = snippetLength) {
        const [segBefore, segAfter] = entry.split(target);
        const segBeforeTrimmed = segBefore.substring(segBefore.length - length);
        const segAfterTrimmed = segAfter.substring(0, length);
        return `...${segBeforeTrimmed}${target}${segAfterTrimmed}...`;
    }

    return (
        <div className="px-6 py-2 bg-white">
            <div>
                <span className="inline sm:hidden">{ `${FormatDateForInputField(date)}` }</span>
                <span
                    className="hidden sm:inline"
                    dangerouslySetInnerHTML={{__html: `${FormatDateForInputField(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
                >
                </span>
            </div>

            <div className="p-4 border border-gray-100 bg-gray-100">
                { getSnippet(tag?.name, entry) }
            </div>
        </div>
    );
}
