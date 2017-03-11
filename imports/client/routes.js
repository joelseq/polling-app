import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/core/components/App';
import Main from './modules/main/components/Main';
import CreatePoll from './modules/create-poll/components/CreatePoll';
import ViewPoll from './modules/view-poll/components/ViewPoll';
import ErrorPage from './modules/error-page/components/ErrorPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="create" component={CreatePoll} />
    <Route path="404Error" component={ErrorPage} />
    <Route path="polls/:pollId" component={ViewPoll} />
  </Route>
);
