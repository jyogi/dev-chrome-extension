import { createAction } from 'redux-actions';
import * as Constants from '../constants';


export const addVersion = createAction(Constants.ADD_VERSION);
export const setSetting = createAction(Constants.SET_SETTING);
