import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});

export default withStyles(styles)(
  ({ classes, children, ...props }) =>
    <Button variant="contained" { ...props }>
      { children }
    </Button>
);
