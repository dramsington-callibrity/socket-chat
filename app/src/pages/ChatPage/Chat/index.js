import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Card, CardContent, InputBase } from '@material-ui/core';
import Section from '../../../components/Section';
import './index.css';
import useSocket from '../../../hooks/useSocket';
import { getSocketData } from '../../../utils';

const Chat = props => {
  const { user } = props;
  const [ ws ] = useSocket();

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = msg => {
        const { content } = getSocketData(msg);
        if (content.type === 'message') {
          addMessage(moment().format(), content.message, content.user);
        }
      };
    }
  });

  const addMessage = (timestamp, message, user) => {
    setMessages([
      ...messages,
      { message, user, timestamp }
    ]);
  };

  const sendMessage = () => {
    const data = {
      user,
      message: newMessage,
      type: 'message'
    };

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ username: user.preferred_username, content: JSON.stringify(data), channel: 'chat' }));
      setNewMessage('');
    }
  };

  return (
    <Section
      anchor="chat-section"
      color="#222"
      style={ { minHeight: '450px' } }
    >
      {
        messages.map((mess, index) =>
          <div className="message" key={ index }>
            { mess.user.given_name } { mess.user.family_name }<br />
            <span style={ { opacity: 0.7 } }>
              { moment(mess.timestamp).format('LT - LL') }
            </span>
            <Card style={ { marginTop: '5px' } } >
              <CardContent>
                { mess.message }
              </CardContent>
            </Card>
          </div>
        )
      }

      <form onSubmit={ e => { e.preventDefault(); sendMessage(); } }>
        <InputBase onChange={ e => setNewMessage(e.target.value) } value={ newMessage } />
        <Button type="submit">Send</Button>
      </form>
    </Section>
  );
};

Chat.propTypes = {
  user: PropTypes.object
};

export default Chat;
