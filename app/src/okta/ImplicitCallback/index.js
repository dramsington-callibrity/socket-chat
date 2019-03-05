import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import AuthContext from '../AuthContext';

const ImplicitCallback = () => {
  const { auth } = useContext(AuthContext);
  const [ authenticated, setAuthenticated ] = useState(null);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    auth.handleAuthentication()
      .then(() => setAuthenticated(true))
      .catch(err => {
        setAuthenticated(false);
        setError(err.toString());
      });
  });

  if (authenticated === null) {
    return null;
  }

  const referrerKey = 'secureRouterReferrerPath';
  /* eslint-disable */
  const location = JSON.parse(localStorage.getItem(referrerKey) || '{ "pathname": "/" }');
  localStorage.removeItem(referrerKey);
  /* eslint-enable */

  return authenticated ?
    <Redirect to={ location } /> :
    <p>{ error }</p>;
};

export default ImplicitCallback;
