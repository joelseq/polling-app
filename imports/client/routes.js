import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/core/components/App';
import Main from './modules/main/components/Main';
import CreatePoll from './modules/create-poll/components/CreatePoll';
import PollPage from './modules/edit-poll/components/PollView';
import EditPoll from './modules/edit-poll/components/EditPoll';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="create" component={CreatePoll} />
    <Route path="polls">
      <Route path=":pollId" component={PollPage} />
      <Route path=":pollId/edit" component={EditPoll} />
    </Route>
  </Route>

);
