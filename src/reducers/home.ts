import {Reducer} from './../props';
import * as Types from '../constants/home';

const INIT_STATE = {
  isLoading: true,
  data: [],
  hasData: false,
  error: null,
  hasError: false,
};

export const getHomeItems: Reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case Types.GET_HOME_ITEMS_LOADING:
      return Object.assign({}, state, {
        isLoading: true,
        data: [],
        hasData: false,
        error: null,
        hasError: null,
      });
    case Types.GET_HOME_ITEMS_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        data: action.payload,
        hasData: true,
      });
    case Types.GET_HOME_ITEMS_ERROR:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.payload,
        hasError: true,
      });
    case Types.CLEAR_HOME_ITEMS:
      return INIT_STATE;
    default:
      return state;
  }
};
