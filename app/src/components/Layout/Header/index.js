import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import AppBar from '../../AppBar';
import { AuthContext } from '../../../okta';
import './index.css';

const styles = {
  cursor: 'pointer',
  fontFamily: '\'Nanum Gothic\', sans-serif'
};

const Header = ({ history }) => {
  const { auth, isAuthenticated, user } = useContext(AuthContext);

  const login = async () => {
    await auth.login('/lobby');
  };

  const logout = async () => {
    await auth.logout('/');
    window.location.reload();
  };

  const renderUser = () =>
    user && <span className="user-info">Hi, { user.given_name }</span>;

  if (isAuthenticated === null) return null;

  return (
    <AppBar>
      <Typography variant="title"
        color="inherit"
        className="noselect"
        styles={ styles }
        onClick={ () => history.push('/') }
      >
        Socket Chat
      </Typography>
      <div style={ { marginLeft: 'auto' } } >
        {
          isAuthenticated ?
            <div>
              { renderUser() } &nbsp;
              <Button color="inherit" onClick={ () => { logout(); } }>Logout</Button>
            </div> :
            <Button color="inherit" onClick={ () => { login(); } }>Login</Button>
        }
      </div>
    </AppBar>
  );
};

Header.propTypes = {
  history: PropTypes.object
};

export default withRouter(Header);
