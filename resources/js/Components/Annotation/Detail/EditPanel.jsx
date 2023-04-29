import React from 'react';

export default function EditPanel({ annotation, annotationType }) {
    return (
        <>
            <div className="mt-6">
                <label>Name</label>
                <div className="p-4 border border-gray-100 bg-gray-100 cursor-pointer">{ annotation?.name }</div>
            </div>

            <div className="mt-6">
                <label>Nest Under</label>
                <div className="p-4 border border-gray-100 bg-gray-100 cursor-pointer">{ annotation?.name }</div>
            </div>
        </>
    );
}
