/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Typography, Colors, Spacing} from '../metrics';

const OS = Platform.OS;
const {height} = Dimensions.get('window');
const TOP =
  OS === 'android' ? StatusBar.currentHeight || 0 : height >= 812 ? 44 : 20;
const CENTERED = OS === 'ios' ? true : false;
const HEIGHT = (OS === 'android' ? 50 : 40) + TOP;

interface HeaderProps {
  /**
   * @description Header Title
   * @default TITLE Navigation State title
   * @type {string}
   * @memberof HeaderProps
   */
  title?: string;
  /**
   * @description Weather header is centered?
   * @type {boolean}
   * @memberof HeaderProps
   */
  centered?: boolean;
  /**
   * @default null
   * @description Header left component
   * @type {React.ReactNode}
   * @memberof HeaderProps
   */
  renderLeft?: (color: string, underlayColor: string) => React.ReactNode;
  /**
   * @default null
   * @description Header right component
   * @type {React.ReactNode}
   * @memberof HeaderProps
   */
  renderRight?: (color: string, underlayColor: string) => React.ReactElement;
  /**
   * @description Weather header has border
   * @default false
   * @type {boolean}
   * @memberof HeaderProps
   */
  bordered?: boolean;
  /**
   * @default white
   * @description Header background color
   * @type {string}
   * @memberof HeaderProps
   */
  backgroundColor?: string;
  /**
   * @description black
   * @description Title color, Icon color
   * @type {string}
   * @memberof HeaderProps
   */
  color?: string;
  /**
   * @description 'light grey'
   * @description Underlay Color
   * @type {string}
   * @memberof HeaderProps
   */
  underlayColor?: string;
  /**
   * @description border Color if border
   * @default black
   * @type {string}
   * @memberof HeaderProps
   */
  borderColor?: string;
  /**
   * @description Status bar style
   * @default default
   * @type {('default' | 'light-content' | 'dark-content')}
   * @memberof HeaderProps
   */
  barStyle?: 'default' | 'light-content' | 'dark-content';
}

export default ({
  backgroundColor = 'white',
  bordered = false,
  renderLeft,
  centered = CENTERED,
  renderRight,
  title,
  barStyle = 'default',
  borderColor = '#DEDEE0',
  color = '#000000',
  underlayColor = '#f2f2f2',
}: HeaderProps) => {
  return (
    <>
      <StatusBar
        {...{barStyle}}
        backgroundColor="rgba(0,,0,0,0.05)"
        translucent
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
            borderColor,
          },
        ]}>
        {renderLeft && (
          <View style={styles.headerButton}>
            {renderLeft(color, underlayColor)}
          </View>
        )}
        {!renderLeft && renderRight && <View style={styles.headerButton} />}

        <View style={styles.titleContainer}>
          {title && (
            <Text
              style={[styles.title, centered && styles.centerTitle, {color}]}>
              {title}
            </Text>
          )}
        </View>
        {renderRight && (
          <View style={styles.headerButton}>
            {renderRight(color, underlayColor)}
          </View>
        )}
        {renderLeft && !renderRight && <View style={styles.headerButton} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: TOP,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.FONT_SIZE_17,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
  centerTitle: {
    alignSelf: 'center',
  },
  headerButton: {
    width: OS === 'android' ? 50 : 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
