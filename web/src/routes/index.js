import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from 'config/constants';
import HomePage from 'pages/HomePage';
import NotFoundPage from 'pages/NotFoundPage';

class Router extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.HOME_PAGE} render={(props) => <HomePage {...props} />} />
        <Route render={(props) => <NotFoundPage {...props} />} />
      </Switch>
    );
  }
}

export default hot(module)(Router);
