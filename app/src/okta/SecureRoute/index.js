import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import AuthContext from '../AuthContext';

const RenderWrapper = ({
  authenticated,
  component,
  login,
  render,
  renderProps
}) => {
  useEffect(() => {
    checkAuthentication();
  });

  const checkAuthentication = () => {
    if (authenticated === false) {
      login();
    }
  };

  if (!authenticated) return null;

  const C = component;
  
  return render ?
    render(renderProps) :
    <C { ...renderProps } />;
};

RenderWrapper.propTypes = {
  authenticated: PropTypes.bool,
  component: PropTypes.any,
  login: PropTypes.func,
  render: PropTypes.func,
  renderProps: PropTypes.object
};

const SecureRoute = ({
  component,
  exact,
  path,
  render,
  sensitive,
  strict
}) => {
  const authProps = useContext(AuthContext);
  const { auth, isAuthenticated, user } = authProps;

  const createRenderWrapper = renderProps => {
    return (
      <RenderWrapper
        authenticated={ isAuthenticated }
        user={ user }
        login={ auth.login }
        component={ component }
        render={ render }
        renderProps={ { ...renderProps, ...authProps } }
      />
    );
  };

  return (
    <Route
      path={ path }
      exact={ exact }
      strict={ strict }
      sensitive={ sensitive }
      render={ createRenderWrapper }
    />
  );
};

SecureRoute.propTypes = {
  component: PropTypes.any,
  exact: PropTypes.bool,
  path: PropTypes.string,
  render: PropTypes.func,
  sensitive: PropTypes.bool,
  strict: PropTypes.bool
};

export default withRouter(SecureRoute);
