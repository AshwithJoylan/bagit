import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from '../scenes';

const {Navigator, Screen} = createStackNavigator();

interface ScreenProp {
  name: string;
  component: () => JSX.Element;
}

const screens: ScreenProp[] = [
  {
    name: 'Home',
    component: Home,
  },
];

export default () => (
  <NavigationContainer>
    <Navigator headerMode="none">
      {screens.map(({name, component}) => (
        <Screen key={name} {...{name, component}} />
      ))}
    </Navigator>
  </NavigationContainer>
);
