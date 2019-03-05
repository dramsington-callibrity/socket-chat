import React, { useState, useEffect, useContext } from 'react';
import SocketContext from '../../contexts/Socket';
import { getSocketData } from '../../utils';
import { AuthContext } from '../../okta';

const SocketContainer = ({ render, ...props }) => {
  const { user } = useContext(AuthContext);
  const [ ws, setWs ] = useState(null);
  const [ userCount, setUserCount ] = useState(null);
  const [ enableChat, setEnableChat ] = useState(false);

  useEffect(() => {
    if (ws) {
      ws.onmessage = msg => {
        const data = getSocketData(msg);
        if (data.username === 'SYSTEM') {
          console.log(data.content);
          switch(data.content.command) {
            case 'authorize_channel:chat': {
              console.log('enable chat');
              setEnableChat(true);
              break;
            }
            case 'upgrade:token': {
              console.log('setting new access token');
              localStorage.setItem('socket-chat-token', data.content.token);
              break;
            }
            default: {
              console.log('user count: ', data.content.users);
              setUserCount(data.content.users);
            }
          }
        } 
      };

      if (user) {
        setInterval(() => {
          ws.send(JSON.stringify({ username: user.preferred_username, content: JSON.stringify({type: 'ping'}), channel: 'lobby' }));
        }, 30000);
      }
    }
  });

  return (
    <SocketContext.Provider value={ { ws, setWs, userCount, enableChat } } >
      { render(props) }
    </SocketContext.Provider>
  );
}

export default SocketContainer;
