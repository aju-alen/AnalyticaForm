import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function DraggableItem({ id, text }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {text}
    </div>
  );
}

export default DraggableItem;