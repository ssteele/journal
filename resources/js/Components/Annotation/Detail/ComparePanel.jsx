import { Link } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function ComparePanel({ annotation, annotations, annotationType }) {
  const [filteredAnnotations, setFilteredAnnotations] = useState(annotations);

  function compareLink(compareAnnotationName) {
    switch (annotationType) {
      case 'tag':
        return route('tags.compare', {tag1: annotation?.name, tag2: compareAnnotationName});
    
      case 'mention':
        return route('mentions.compare', {mention1: annotation?.name, mention2: compareAnnotationName});
    }
  }

  function searchAnnotations(e) {
    if ('Enter' === e.key && filteredAnnotations.length) {
      const compareAnnotationName = filteredAnnotations[0]?.name;
      if (compareAnnotationName) {
        window.location.href = compareLink(compareAnnotationName);
      }
    }

    const searchTerm = e?.target?.value;
    if (searchTerm) {
      setFilteredAnnotations(annotations.filter(({ name }) => -1 !== name.indexOf(searchTerm)));
    } else {
      setFilteredAnnotations(annotations);
    }
  }

  return (
    <>
      <div className="mt-6">
        <label>Compare To</label>

        <div className="p-6 bg-white">
          <input
            autoComplete="off"
            autoFocus
            className="w-full p-4 border border-gray-200"
            label="Search"
            name="search"
            onChange={e => searchAnnotations(e)}
            placeholder="Search annotations"
            type="search"
          />
        </div>

        <div className="p-6 pt-0 bg-white max-h-screen overflow-y-scroll">
          {filteredAnnotations.map((filteredAnnotation, i) => {
            const compareAnnotationName = filteredAnnotation?.name;
            return (
              <Link
                href={compareLink(compareAnnotationName)}
                key={i}
              >
                <span className="inline-flex px-2 py-1">
                  {compareAnnotationName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
