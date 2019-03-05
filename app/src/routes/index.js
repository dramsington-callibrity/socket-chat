import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { oktaConfig } from '../config';
import Layout from '../components/Layout';
import { AuthRoute, ImplicitCallback, Security } from '../okta';
import { HomePage, LobbyPage, ChatPage } from '../pages';
import SocketContainer from '../containers/SocketContainer';

const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    path: '/lobby',
    component: LobbyPage,
    secure: true
  },
  {
    path: '/chat',
    component: ChatPage,
    secure: true
  }
];

const renderLayout = props =>
  <Layout { ...props } >
    {
      routes.map((props, index) =>
        <AuthRoute key={ `route-${index}` } { ...props } />
      )
    }
    <Route path="/implicit/callback" component={ ImplicitCallback } />
  </Layout>;

const AppRouter = props => (
  <Router>
    <Security { ...oktaConfig } >
      <SocketContainer { ...props } render={ renderLayout } />
    </Security>
  </Router>
);

export default AppRouter;
