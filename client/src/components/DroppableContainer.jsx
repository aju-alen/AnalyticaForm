import React from 'react';
import { useDroppable, } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import DroppableItem from './DroppableItem';

function DroppableContainer({ items }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const style = {
    border: isOver ? '2px dashed green' : '1px solid gray',
    padding: '10px',
    height: '300px',
    width: '45%',
    overflowY: 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <h3>Droppable Area</h3>
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <DroppableItem key={item.id} id={item.id} text={item.value} />
        ))}
      </SortableContext>
    </div>
  );
}

export default DroppableContainer;
