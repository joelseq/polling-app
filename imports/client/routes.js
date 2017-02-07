import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/core/components/App';
import Main from './modules/main/components/Main';
import CreatePoll from './modules/create-poll/components/CreatePoll';
import Poll from './modules/poll/components/PollView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="create" component={CreatePoll} />
    <Route path="polls/:pollId" component={Poll} />
  </Route>

);
