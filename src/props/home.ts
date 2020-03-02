import {Dispatch} from 'redux';
import {Item} from './item';

// State
export interface GetHomeItemsState {
  isLoading: boolean;
  hasData: boolean;
  hasError: boolean;
  data: {title: string}[];
  error: any;
}

// Actions
export type GetHomeItemsAction = () => (dispatch: Dispatch) => void;
