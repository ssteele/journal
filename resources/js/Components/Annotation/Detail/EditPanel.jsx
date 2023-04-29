import React from 'react';

export default function EditPanel({ annotation, annotationType }) {
    return (
        <div className="mt-6">
            <button>{ annotation?.name }</button>
        </div>
    );
}
