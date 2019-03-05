import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

const Progress = ({ message }) =>
  <div className="flex-row">
    <div className="flex-item">
      <Spinner name="double-bounce" color="#91C6E3" />
    </div>
    <div className="flex-item" style={ { margin: '9px 0 0 9px' } }>
      <h5>{ message }</h5>
    </div>
  </div>;

Progress.defaultProps = {
  message: 'Loading...'
};

Progress.propTypes = {
  message: PropTypes.string
};

export default Progress;
