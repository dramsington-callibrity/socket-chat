import React from 'react';
import { withRouter } from 'react-router-dom';
import Intro from './Intro';

const HomePage = props =>
  <div className="home-page">
    <Intro { ...props } />
  </div>;

export default withRouter(HomePage);
