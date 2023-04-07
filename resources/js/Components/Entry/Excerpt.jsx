import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import React, { useState } from 'react';

export default function Excerpt({ entry: dbEntry, tag }) {
    const { date, entry = '' } = dbEntry;
    const snippetLengths = [50, 100, 300];
    const [snippetLength, setSnippetLength] = useState(snippetLengths[0]);

    function getSpaceIndices(segment) {
        const spaceIndices = [...segment.matchAll(/\s/g)].map(s => s.index);
        return [0, ...spaceIndices, segment.length];
    }

    function getSnippet(target, entry, length = snippetLength) {
        const [segBefore, segAfter] = entry.split(target);

        const segBeforeSpaceIndices = getSpaceIndices(segBefore);

        const segBeforeSubstringTarget = segBefore.length - length;
        const segBeforeSubstringBreak = segBeforeSpaceIndices.filter(v => v < segBeforeSubstringTarget).pop();
        const segBeforeTrimmed = segBefore.substring(segBeforeSubstringBreak + 1);

        const segAfterSpaceIndices = getSpaceIndices(segAfter);

        const segAfterSubstringTarget = length;
        const segAfterSubstringBreak = segAfterSpaceIndices.filter(v => v > segAfterSubstringTarget)[0];
        const segAfterTrimmed = segAfter.substring(0, segAfterSubstringBreak);

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
