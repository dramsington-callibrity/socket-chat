import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../../components/Button';
import Section from '../../../components/Section';
import AuthenticatedView from './AuthenticatedView';
import { AuthContext } from '../../../okta';

const Intro = props => {
  const { auth, isAuthenticated, user } = useContext(AuthContext);

  const login = async () => {
    await auth.login('/lobby');
  };

  return <Section
    anchor="intro-chat-section"
    background="#f9f9f9"
    color="#555"
  >
    {
      isAuthenticated && user ?
        <AuthenticatedView { ...props } /> :
        <div>
          <p>
            Welcome to our socket chat. To join all the fun, please login.
          </p>
          <Button color="primary" onClick={ login }> Login </Button>
        </div>
    }
  </Section>;
};

Intro.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};

export default withRouter(Intro);
