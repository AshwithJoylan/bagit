import store from '@react-native-firebase/firestore';

export const firestore = store();

export interface Action {
  type: string;
  payload: any;
}

export const Actions = {
  say: (type: string): Action => ({type, payload: null}),
  pass: (type: string, payload: any) => ({type, payload}),
};
