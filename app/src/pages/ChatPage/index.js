import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Chat from './Chat';
import SocketContext from '../../contexts/Socket';

const ChatPage = props => {
  const { enableChat } = useContext(SocketContext);

  useEffect(() => {
    if (!enableChat)
      props.history.push('/lobby');
  });

  return enableChat ?
    <div className="chat-page">
      <Chat { ...props } />
    </div> :
    null;
}

export default withRouter(ChatPage);
