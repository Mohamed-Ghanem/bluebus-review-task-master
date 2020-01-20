import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppLayout } from '@components';
import { GlobalStyles } from '@utilities';
import { TripComposer } from '@scenes';

class App extends Component {
  /** Initialize routes for the application.
   * To initialize route, specify route with path and component.
   * eg. <Route exact path component />
   */
  render() {
    return (
      <>
        <GlobalStyles />
        <AppLayout>
          <Switch>
            <Route path="/" component={TripComposer} />
          </Switch>
        </AppLayout>
      </>
    );
  }
}

export default App;
