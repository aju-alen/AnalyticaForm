import React from 'react';
import DraggableItem from './DraggableItem';

function DraggableContainer({ items }) {
  return (
    <div style={{ width: '45%', border: '1px solid gray', padding: '10px' }}>
      <h3>Draggable Items</h3>
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id} text={item.text} />
      ))}
    </div>
  );
}

export default DraggableContainer;
