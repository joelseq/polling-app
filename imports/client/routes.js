import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/core/components/App';
import Main from './modules/main/components/Main';
import CreatePoll from './modules/create-poll/components/CreatePoll';
import EditPoll from './modules/edit-poll/components/EditPoll';
import ViewPoll from './modules/view-poll/components/ViewPoll';
import ErrorPage from './modules/error-page/components/ErrorPage';
import PollResults from './modules/poll-results/components/PollResults';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="create" component={CreatePoll} />
    <Route path="polls/">
      <Route path=":pollId" component={ViewPoll} />
      <Route path=":pollId/results" component={PollResults} />
      <Route path=":pollId/edit" component={EditPoll} />
    </Route>
  </Route>
);
