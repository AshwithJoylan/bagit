import {Actions, firestore} from './index';
import {GetHomeItemsAction} from './../props';
import * as Types from '../constants/home';


export const getHomeItemsAction: GetHomeItemsAction = () => async dispatch => {
  dispatch(Actions.say(Types.GET_HOME_ITEMS_LOADING));
  firestore
    .collection('tabs')
    .get()
    .then(res => {
      const data = res.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(Actions.pass(Types.GET_HOME_ITEMS_SUCCESS, data));
    })
    .catch(err => {
      dispatch(Actions.pass(Types.GET_HOME_ITEMS_ERROR, err));
    });
};

const ref = firestore.collection('tabs');
// ref.add({title: 'Dairy'})
const g = "Vegetables"



