import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Router from './routes';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3D5156'
    },
    secondary: {
      main: '#525656'
    }
  }
});

const App = props =>
  <MuiThemeProvider theme={ theme }>
    <Router { ...props } />
  </MuiThemeProvider>;

export default App;
