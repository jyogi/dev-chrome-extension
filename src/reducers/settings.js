import * as Constants from '../constants';

const settings = (state = {}, action) => {
  switch (action.type) {
    case Constants.SET_SETTING:
      return Object.assign({}, state, action.payload);
    case Constants.SET_SETTINGS:
      return action.payload || {};
    default:
      return state;
  }
};

export default settings;

