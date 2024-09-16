// in config.js
import { createChatBotMessage } from 'react-chatbot-kit';
import DogPicture from '../chatbot/DogPicture';
import './ChatBot.css'; // We'll define the styles next


const botName = 'DA Assistance';

const config = {
  widgets: [
    {
      widgetName: 'dogPicture',
      widgetFunc: (props) => <DogPicture {...props} />,
    },
  ],
  initialMessages: [
    createChatBotMessage(
      `Hi I'm ${botName}. I’m here to help you explain how I work.`
    ),
    // createChatBotMessage(
    //   "Here's a quick overview over what I need to function. ask me about the different parts to dive deeper.",
    //   {
    //     withAvatar: false,
    //     delay: 500,
    //     widget: "dogPicture",

    //   }
    // ),
  ],
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: '#1565c0',
    },
    chatButton: {
      backgroundColor: '#1565c0',
    },
  },
};

export default config;