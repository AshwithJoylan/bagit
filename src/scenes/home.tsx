import React from 'react';
import Home from '../components/home';
import {bindActionCreators} from 'redux';
import {getHomeItemsAction} from '../actions/home';
import {useDispatch, useSelector} from 'react-redux';
import {StateProp} from '../props';

export default () => {
  const actions = bindActionCreators({getHomeItemsAction}, useDispatch());
  const getHomeItems = useSelector((state: StateProp) => state.getHomeItems);
  return <Home {...{actions, getHomeItems}} />;
};
