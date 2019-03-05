import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Auth } from '@okta/okta-react';
import AuthContext from '../AuthContext';
import useAuth from '../useAuth';

const Security = props => {
  const auth = props.auth || new Auth(props);
  const { isAuthenticated, user } = useAuth(auth);

  return (
    <div className={ props.className }>
      <AuthContext.Provider value={ { auth, isAuthenticated, user } }>
        { props.children }
      </AuthContext.Provider>
    </div>
  );
};

Security.propTypes = {
  auth: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};

export default withRouter(Security);
