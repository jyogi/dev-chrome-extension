import * as Constants from '../constants';

const versions = ((state = [], action) => {
  switch (action.type) {
    case Constants.SET_VERSIONS:
      return action.payload;
    case Constants.ADD_VERSION:
      return [
        ...state,
        action.payload
      ];
    default:
      return state;
  }
});

export default versions;
