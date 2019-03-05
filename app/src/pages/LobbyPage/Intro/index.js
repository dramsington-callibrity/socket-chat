import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import Section from '../../../components/Section';
import Progress from '../../../components/Progress';
import SocketContext from '../../../contexts/Socket';

const renderJoinMessage = user => user ?
  <p><i>{ user.given_name }, you just joined our lobby!</i></p> :
  null;

const renderUserCountMessage = count => {
  switch(count) {
    case (0):
      return <p>There are no other users with you.</p>;
    case (1):
      return <p>There is {count} other user with you.</p>;
    default:
      return <p>There are {count} other users with you.</p>;
  }
}

const Intro = ({ user, history }) => {
  const { userCount, enableChat } = useContext(SocketContext);

  return (
    <Section anchor="intro-lobby-section">
      { renderJoinMessage(user) }
      { renderUserCountMessage(userCount ? userCount - 1 : 0) }
      {
        enableChat ?
          <Button color="primary" onClick={ () => { history.push('/chat'); } }>
            Chat
          </Button> :
          <Progress message="Please wait for us to start" />
      }
    </Section>
  );
}

Intro.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object
};

export default Intro;
