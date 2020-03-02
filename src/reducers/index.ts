import {combineReducers} from 'redux';
import * as Home from './home';

export default combineReducers({
  getHomeItems: Home.getHomeItems,
});
