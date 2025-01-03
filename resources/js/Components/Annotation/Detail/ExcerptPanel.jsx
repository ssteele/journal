import Excerpt from '@/Components/Entry/Excerpt';
import React from 'react';

export default function ExcerptPanel({ annotation, annotationEntries, annotationType }) {
  return annotationEntries?.length > 0 && (
    <div className="mt-6">
      {
        annotationEntries.map((annotationEntry, i) => {
          return (
            <Excerpt
              annotation={annotation}
              annotationType={annotationType}
              entry={annotationEntry}
              key={i}
            ></Excerpt>
          )
        })
      }
    </div>
  );
}
