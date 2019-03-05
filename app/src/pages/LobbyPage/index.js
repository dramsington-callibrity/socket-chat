import React from 'react';
import { withRouter } from 'react-router-dom';
import Intro from './Intro';
import SocketContext from '../../contexts/Socket';
import useSocket from '../../hooks/useSocket';

const LobbyPage = props => {
  const [ websocket ] = useSocket(props);

  return <div className="lobby-page">
    <Intro { ...props } />
    <SocketContext.Consumer>
      { ({ ws, setWs }) => {
        ws === null && websocket && setWs(websocket);
      } }
    </SocketContext.Consumer>
  </div>;
};

export default withRouter(LobbyPage);
