import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from '../modules/core/reducers/user';

const rootReducer = combineReducers({
  user: userReducer,
  routing: routerReducer,
});

export default rootReducer;
