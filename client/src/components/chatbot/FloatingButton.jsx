import React, { useState } from 'react';
import './ChatBot.css'; // We'll define the styles next

import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';


const FloatingButton = () => {
  const [isChatbotVisible, setChatbotVisible] = useState(false);

  const handleClick = () => {
    setChatbotVisible(!isChatbotVisible);
  };

  return (
    <div>
      {!isChatbotVisible && (
        <button className="floating-button" onClick={handleClick}>
          💬
        </button>
      )}
      {isChatbotVisible && (
        <div className="chatbot-container ">
          <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
        </div>
      )}
    </div>
  );
};

export default FloatingButton;
