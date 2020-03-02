import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Main} from './src/navigators';
import {Provider} from 'react-redux';
import {CustomRoot} from './src/utils';
import {store} from './src/store';
// import Test from './src/test';

// App
export default () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <CustomRoot>
          <Main />
        </CustomRoot>
      </SafeAreaProvider>
    </Provider>
  );
};
