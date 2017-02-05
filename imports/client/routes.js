import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/core/components/App';
import Main from './modules/main/components/Main';
import CreatePoll from './modules/createPoll/components/createPoll';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="/create" component={App}>
      <IndexRoute component={CreatePoll} />
    </Route>
  </Route>

);
