import {Dimensions, StatusBar, Platform} from 'react-native';

export const {width: WIDTH, height} = Dimensions.get('window');
export const HEIGHT =
  Platform.OS === 'android'
    ? height + 50 + (StatusBar.currentHeight || 0)
    : height;
export const BORDER_WIDTH = 0.4;
export const BUTTON_HEIGHT = 50;
export const HEADER_HEIGHT = 50;
export const IS_BIG = height > 812;
export const TOP =
  Platform.OS === 'android'
    ? StatusBar.currentHeight || 0
    : HEIGHT >= 812
    ? 44
    : 20;