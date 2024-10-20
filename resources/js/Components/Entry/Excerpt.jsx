import ExpandBox from '@/Components/Icons/ExpandBox';
import ExpandVertical from '@/Components/Icons/ExpandVertical';
import { FormatDateForInputField, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import React, { useEffect, useState } from 'react';

const excerptLengthOptions = [50, 100, 300];
const excerptLengths = {};

export default function Excerpt({ annotation, annotationType, entry: dbEntry }) {
  const { date, entry = '', id } = dbEntry;
  excerptLengths[id] = excerptLengths[id] ?? 0;
  const [doRefresh, setDoRefresh] = useState(false);

  useEffect(() => {
    if (doRefresh) {
      setDoRefresh(false);
    }
  }, [doRefresh]);

  function getSpaceIndices(segment) {
    const spaceIndices = [...segment.matchAll(/\s/g)].map(s => s.index);
    return [0, ...spaceIndices, segment.length];
  }

  function getExcerptBefore(segment, length, spaceIndices) {
    const target = segment.length - length;
    const wordBreak = spaceIndices.filter(v => v < target).at(-1);
    return segment.substring(wordBreak + 1);
  }

  function getExcerptAfter(segment, length, spaceIndices) {
    const target = length;
    const wordBreak = spaceIndices.filter(v => v > target)[0];
    return segment.substring(0, wordBreak);
  }

  function getEllipses(entry, segBeforeTrimmed, segAfterTrimmed) {
    const ellipsesBefore = (segBeforeTrimmed === entry.substring(0, segBeforeTrimmed.length)) ? '' : '...';
    const ellipsesAfter = (segAfterTrimmed === entry.substring(entry.length - segAfterTrimmed.length)) ? '' : '...';
    return [ellipsesBefore, ellipsesAfter];
  }

  function getExcerpt(target, annotationType, entry, length = excerptLengthOptions[0]) {
    const annotationSymbol = ('tag' === annotationType) ? '#' : '@';
    const [segBefore, segAfter] = entry.split(`${annotationSymbol}${target}`);

    const segBeforeSpaceIndices = getSpaceIndices(segBefore);
    const segBeforeTrimmed = getExcerptBefore(segBefore, length, segBeforeSpaceIndices);

    const segAfterSpaceIndices = getSpaceIndices(segAfter);
    const segAfterTrimmed = getExcerptAfter(segAfter, length, segAfterSpaceIndices);

    const [ellipsesBefore, ellipsesAfter] = getEllipses(entry, segBeforeTrimmed, segAfterTrimmed);

    return `${ellipsesBefore}${segBeforeTrimmed}${annotationSymbol}${target}${segAfterTrimmed}${ellipsesAfter}`;
  }

  async function expandExcerpt() {
    if (excerptLengths[id] < excerptLengthOptions.length - 1) {
      excerptLengths[id] += 1;
      setDoRefresh(true);
    }
  }

  return (
    <div className="pt-4 pb-2 border-b border-gray-200">
      <div>
        <span className="cursor-pointer" onClick={() => expandExcerpt()}>
          <ExpandVertical className="inline-block h-4 align-sub w-auto text-gray-600" />
        </span>

        <span className="ml-2 inline sm:hidden">{ `${FormatDateForInputField(date)}` }</span>
        <span
          className="ml-2 hidden sm:inline"
          dangerouslySetInnerHTML={{__html: `${FormatDateForInputField(date)} &#8211; ${FormatDateWeekdayLong(date)}`}}
        >
        </span>

        <span className="float-right">
          <a href={route('entries.show', date)} target="_blank" rel="noopener noreferrer">
            <ExpandBox className="inline-block h-4 align-sub w-auto text-gray-600" />
          </a>
        </span>
      </div>

      <div className="p-4">
        { !doRefresh && getExcerpt(annotation?.name, annotationType, entry, excerptLengthOptions[excerptLengths[id]]) }
      </div>
    </div>
  );
}
