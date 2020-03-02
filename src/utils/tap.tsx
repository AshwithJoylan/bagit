import React, {useMemo} from 'react';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import {
  onGestureEvent,
  timing,
  bInterpolate,
  contains,
  delay,
  spring,
} from 'react-native-redash';
import {StyleProp, ViewStyle, View} from 'react-native';
import Animated, {
  Value,
  useCode,
  block,
  cond,
  Easing,
  set,
  eq,
  and,
  neq,
  not,
  onChange,
  call,
  Clock,
  clockRunning,
} from 'react-native-reanimated';

const springConfig = () => ({
  toValue: new Value(0),
  damping: 25,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
});

const {UNDETERMINED, END, BEGAN, CANCELLED, FAILED} = State;

interface TapProps {
  /**
   * @description State
   * @default new Value(UNDETERMINED)
   * @type {Animated.Value<number>}
   * @memberof TapProps
   */
  state?: Animated.Value<number>;
  /**
   * @description Animated Value
   * @default new Value(0)
   * @type {Animated.Value<number>}
   * @memberof TapProps
   */
  value?: Animated.Value<number>;
  /**
   * @description children
   * @type {React.ReactNode}
   * @memberof TapProps
   */
  children: React.ReactNode;
  /**
   * @description Container style
   * @type {StyleProp<ViewStyle>}
   * @memberof TapProps
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * @description style for the children
   * @type {StyleProp<ViewStyle>}
   * @memberof TapProps
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @description Function call when button pressed
   * @memberof TapProps
   */
  onPress?: () => void;
}

// Duration fo timing animation
const DURATION = 200;
const SCALE = 0.9;

export default ({
  state: tapState,
  value: tapValue,
  children,
  containerStyle = {},
  style = {},
  onPress = () => {},
}: TapProps) => {
  const {state, value, shouldAnimate, clock} = useMemo(
    () => ({
      state: tapState || new Value(UNDETERMINED),
      value: tapValue || new Value(0),
      shouldAnimate: new Value(0),
      clock: new Clock(),
    }),
    [tapState, tapValue],
  );

  const onEvent = onGestureEvent({state});

  useCode(
    () =>
      block([
        cond(eq(state, BEGAN), set(shouldAnimate, 1)),
        cond(contains([FAILED, CANCELLED], state), set(shouldAnimate, 0)),
        onChange(state, cond(eq(state, END), call([], onPress))),
        cond(eq(state, END), [delay(set(shouldAnimate, 0), DURATION)]),
        cond(and(shouldAnimate, neq(value, 1)), [
          set(
            value,
            timing({
              clock,
              from: 1,
              to: 0.95,
              duration: DURATION,
              easing: Easing.linear,
            }),
          ),
        ]),
        cond(
          and(not(shouldAnimate), neq(value, 0)),
          set(
            value,
            timing({
              clock,
              from: 0.95,
              to: 1,
              duration: DURATION,
              easing: Easing.linear,
            }),
          ),
        ),
      ]),
    [state, value, shouldAnimate],
  );

  // Interpolations
  const scale = bInterpolate(value, 1, SCALE);

  return (
    <TapGestureHandler {...onEvent}>
      <Animated.View
        style={[
          containerStyle,
          {
            transform: [{scale}],
          },
        ]}>
        <View {...{style}}>{children}</View>
      </Animated.View>
    </TapGestureHandler>
  );
};
