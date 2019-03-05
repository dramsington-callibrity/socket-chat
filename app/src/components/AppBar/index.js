import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const ButtonAppBar = props => {
  const { children } = props;

  return <AppBar position="static" { ...props } style={ { position: 'fixed', color: 'white', backgroundColor: '#4A5654' } }>
    <Toolbar>{ children }</Toolbar>
  </AppBar>;
};

ButtonAppBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
