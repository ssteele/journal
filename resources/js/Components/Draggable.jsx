import React from 'react'
import { useDrag } from 'react-dnd'

export default function Draggable(content) {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'knight',
        // item: { content },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }),
    []
  )
  return (
    <div
        ref={dragRef}
        style={{
            opacity: isDragging ? 0.5 : 1,
            fontSize: 25,
            fontWeight: 'bold',
            cursor: 'move',
        }}
    >
      { content }
    </div>
  )
}