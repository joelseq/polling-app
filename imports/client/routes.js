import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/core/components/App';
import Main from './modules/main/components/Main';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
  </Route>
);
