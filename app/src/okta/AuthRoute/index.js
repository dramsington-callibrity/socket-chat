import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AuthContext from '../AuthContext';
import SecureRoute from '../SecureRoute';
import UnsecureRoute from '../UnsecureRoute';

const AuthRoute = props => {
  const authProps = useContext(AuthContext);
  const { secure } = props;

  return secure ?
    <SecureRoute { ...props } { ...authProps } /> :
    <UnsecureRoute { ...props } { ...authProps } />;
};

AuthRoute.propTypes = {
  secure: PropTypes.bool
};

export default AuthRoute;
