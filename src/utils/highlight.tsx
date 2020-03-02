/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useState, ReactNode} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleSheet,
  StyleProp,
  GestureResponderEvent,
  ViewProps,
} from 'react-native';
// import {Colors} from '../metrics';

export interface Props {
  style: StyleProp<ViewStyle>;
  underlayColor: string;
  onPress: (event: GestureResponderEvent) => void;
  children: ReactNode;
  containerStyle: StyleProp<ViewProps>;
  disabled: boolean;
}

const Highlight = (props: Props) => {
  const [opacity, setOpacity] = useState(0);
  // Animating Opacity
  const onPressIn = () => {
    setOpacity(1);
  };

  const onPressOut = () => {
    setOpacity(0);
  };

  return (
    <TouchableWithoutFeedback
      disabled={props.disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={props.onPress}>
      <View style={[{overflow: 'hidden'}, props.style]}>
        {props.children}
        <View
          style={{
            ...styles.overlay,
            opacity,
            backgroundColor: props.underlayColor,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

Highlight.defaultProps = {
  underlayColor: 'rgba(0,0,0,0.05)',
  onPress: () => {},
  children: null,
  containerStyle: {},
  disabled: false,
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
export default Highlight;
