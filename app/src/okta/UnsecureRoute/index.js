import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import AuthContext from '../AuthContext';

const RenderWrapper = ({
  component: C,
  render,
  renderProps
}) =>
  render ?
    render(renderProps) :
    <C { ...renderProps } />;

RenderWrapper.propTypes = {
  component: PropTypes.any,
  render: PropTypes.function,
  renderProps: PropTypes.object
};

const UnsecureRoute = ({
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

UnsecureRoute.propTypes = {
  component: PropTypes.any,
  exact: PropTypes.bool,
  path: PropTypes.string,
  render: PropTypes.func,
  sensitive: PropTypes.bool,
  strict: PropTypes.bool
};

export default UnsecureRoute;
