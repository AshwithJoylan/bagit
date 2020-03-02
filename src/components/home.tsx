/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  View,
  FlatList,
  Image,
  Text,
  Dimensions,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import {Value} from 'react-native-reanimated';
import HomeTransition from './home_transition';
import styles from '../styles/home';
import ListItem, {Position, ListItemContext} from './list_item';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Item, GetHomeItemsAction, GetHomeItemsState} from '../props';
import {Colors, Spacing} from '../metrics';
import SearchBar from './search_bar';
import {Highlight} from '../utils';
import HomeTab from './home_tab';

const {Navigator, Screen} = createMaterialTopTabNavigator();
export interface HomeActions {
  getHomeItemsAction: GetHomeItemsAction;
}

interface Props {
  actions: HomeActions;
  getHomeItems: GetHomeItemsState;
}

/**
 * Component
 */
export default ({actions, getHomeItems}: Props) => {
  const activeValue = new Value(-1);
  const [modal, setModal] = useState<{
    item: Item;
    position: Position;
    imagePosition: Position;
    namePosition: Position;
  } | null>(null);

  useEffect(() => {
    actions.getHomeItemsAction();
  }, []);

  return (
    <ListItemContext.Provider value={{modal, setModal, activeValue}}>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'never'}}
        style={styles.container}>
        <View style={styles.header}>
          <View />
          <Highlight underlayColor={Colors.TRANSPARENT} style={styles.bag}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={require('../assets/bag.png')}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>12</Text>
            </View>
          </Highlight>
        </View>
        <SearchBar />
        {getHomeItems.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Colors.PRIMARY} />
          </View>
        ) : (
          <Navigator
            lazy
            tabBarOptions={{
              scrollEnabled: true,
              labelStyle: styles.tabTitle,
              indicatorStyle: {
                height: Spacing.SCALE_2,
                backgroundColor: Colors.PRIMARY,
              },
              style: {
                backgroundColor: 'white',
                marginTop: Spacing.SCALE_8,
              },
            }}>
            {getHomeItems.data.map((item, index) => (
              <Screen
                key={index.toString()}
                name={item.title}
                component={HomeTab}
              />
            ))}
          </Navigator>
        )}
        {modal !== null && <HomeTransition />}
      </SafeAreaView>
    </ListItemContext.Provider>
  );
};
