import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';

const AuthenticatedView = ({ user, history }) =>
  <div>
    <h5>Hey { user.given_name },</h5>
    <p>You escaped the lobby! Please find your way back to the lobby before we begin to participate in loads of fun.</p>
    <Button color="primary" onClick={ () => { history.push('/lobby'); } }>Join Lobby</Button>
  </div>;

AuthenticatedView.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object
};

export default AuthenticatedView;
