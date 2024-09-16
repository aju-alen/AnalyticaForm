// in MessageParser.js
import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.toLowerCase().includes('hello')) {
      actions.handleHello();
    }
    else if (message.toLowerCase().includes('pricing') || message.toLowerCase().includes('price') || message.toLowerCase().includes('plan') || message.toLowerCase().includes('package') || message.toLowerCase().includes('free') || message.toLowerCase().includes('paid')) {
        console.log('pricing');
        
        actions.handlePricing();
    }
    else if (message.includes('dog')) {
        actions.handleDog();
      }
    else if (message.toLowerCase().includes('') || message.toLowerCase().includes('price') ) {

    }
    
  };
  

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;