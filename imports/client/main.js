import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import _ from 'lodash';

import reducers from './reducers';
import routes from './routes';
// Import App Styles
import './style.scss';


// Redux enhancers
let composeEnhancers = compose;

if (Meteor.settings.public.env === 'DEVELOPMENT') {
  // Integrate Redux devToolsExtension only if it is installed in client.
  if (window.devToolsExtension && _.isUndefined(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)) {
    /* eslint-disable no-console */
    console.warn('Redux DevTools Chrome Extension outdated! Update it to the latest version. ' +
      'See https://github.com/zalmoxisus/redux-devtools-extension');
    /* eslint-enable no-console */
  } else {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }
}

const middleware = applyMiddleware(
  /* Middleware goes here */
);

const store = createStore(
  reducers,
  composeEnhancers(middleware),
);

const enhancedBrowserHistory = syncHistoryWithStore(browserHistory, store);

Meteor.startup(() => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={enhancedBrowserHistory} routes={routes} />
    </Provider>
  , document.getElementById('react-root'));
});
