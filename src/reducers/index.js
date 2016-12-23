import { combineReducers } from 'redux';
import versions from './versions';
import settings from './settings';
import user from './user';

export default combineReducers({
  versions,
  settings,
  user
});
