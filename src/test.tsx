import React from 'react';
import {StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {Header} from './utils';

const Test = () => {
  return (
    <SafeAreaView forceInset={{top: 'never'}} style={styles.container}>
      <Header
        centered
        barStyle="dark-content"
        renderLeft={color => (
          <Icon name="ios-arrow-back" size={20} {...{color}} />
        )}
        color={'#000'}
        bordered
        title="sas"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Test;
