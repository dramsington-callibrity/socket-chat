import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import Progress from '../Progress';
import Section from '../Section';
import AuthContext from '../../okta/AuthContext';

const Layout = (props = {}) => {
  const authProps = useContext(AuthContext);

  const childProps = {
    ...props,
    ...authProps
  };

  const { children, isAuthenticated, user } = childProps;

  return <div className="core-layout">
    <Header { ...props } { ...authProps } />
    <div style={ { paddingTop: 56 } }>
      {
        isAuthenticated && user === null ?
          <Section>
            <Progress message="Loading your information..." />
          </Section> :
          children
      }
    </div>
  </div>;
};

export {
  Header
};

export default withRouter(Layout);
