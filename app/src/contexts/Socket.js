import React from 'react';

const SocketContext = React.createContext({
  ws: null,
  setWs: () => {},
  userCount: 0,
  enableChat: false
});

export default SocketContext;
