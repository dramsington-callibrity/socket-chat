import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SocketContext from '../contexts/Socket';
import AuthContext from '../okta/AuthContext';

const url = process.env.NODE_ENV === 'production' ? 
  `ws://${window.location.hostname}/ws` : 
  `ws://${window.location.hostname}:4000/ws`;

const useSocket = () => {
  const [ token, setToken ] = useState(null);
  const { ws, setWs } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && (ws === null)) {
      if (!token) {
        getToken();
      } else {
        /* eslint-disable */
        setWs(new WebSocket(`${url}?auth=${encodeURIComponent(token)}`));
        /* eslint-enable */
      }
    }
  });

  const getToken = async () => {
    let token = window.localStorage.getItem('socket-chat-token');
    if (! token) {
      let registerURL = process.env.NODE_ENV === 'production' ? 
      `http://${window.location.hostname}/register` : 
      `http://${window.location.hostname}:4000/register`;
      let response = await axios.post(registerURL, {
        channel: 'chat',
        username: user && user.preferred_username
      });
      token = response.data.token;
    }

    setToken(token);
    window.localStorage.setItem('socket-chat-token', token);
  };

  return [ws, token];
};

export default useSocket;
