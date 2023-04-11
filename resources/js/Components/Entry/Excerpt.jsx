import ExpandBox from '@/Components/Icons/ExpandBox';
import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import React, { useState } from 'react';

export default function Excerpt({ entry: dbEntry, tag }) {
    const { date, entry = '', id } = dbEntry;
    const snippetLengths = [50, 100, 300];
    const [snippetLength, setSnippetLength] = useState(snippetLengths[0]);

    function getSpaceIndices(segment) {
        const spaceIndices = [...segment.matchAll(/\s/g)].map(s => s.index);
        return [0, ...spaceIndices, segment.length];
    }

    function getExcerptBack(segment, length, spaceIndices) {
        const target = segment.length - length;
        const wordBreak = spaceIndices.filter(v => v < target).pop();
        return segment.substring(wordBreak + 1);
    }

    function getExcerptForward(segment, length, spaceIndices) {
        const target = length;
        const wordBreak = spaceIndices.filter(v => v > target)[0];
        return segment.substring(0, wordBreak);
    }

    function getExcerpt(target, entry, length = snippetLength) {
        const [segBefore, segAfter] = entry.split(target);

        const segBeforeSpaceIndices = getSpaceIndices(segBefore);
        const segBeforeTrimmed = getExcerptBack(segBefore, length, segBeforeSpaceIndices);

        const segAfterSpaceIndices = getSpaceIndices(segAfter);
        const segAfterTrimmed = getExcerptForward(segAfter, length, segAfterSpaceIndices);

        return `...${segBeforeTrimmed}${target}${segAfterTrimmed}...`;
    }

    return (
        <div className="px-6 py-2 bg-white">
            <div>
                <span className="mr-2">
                    <a href={route('entries.show', id)} target="_blank" rel="noopener noreferrer">
                        <ExpandBox className="inline-block h-4 align-sub w-auto text-gray-600" />
                    </a>
                </span>

                <span className="inline sm:hidden">{ `${FormatDateForInputField(date)}` }</span>
                <span
                    className="hidden sm:inline"
                    dangerouslySetInnerHTML={{__html: `${FormatDateForInputField(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
                >
                </span>
            </div>

            <div className="p-4 border border-gray-100 bg-gray-100">
                { getExcerpt(tag?.name, entry) }
            </div>
        </div>
    );
}
