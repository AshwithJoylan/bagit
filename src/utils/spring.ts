import {spring as runSpring, timing as runTiming} from 'react-native-redash';
import Animated, {Easing} from 'react-native-reanimated';
const {Value, Clock, cond, eq, stopClock, set, clockRunning} = Animated;

export interface SpringValue {
  value: Animated.Value<number>;
  clock: Animated.Clock;
  hasSprung: Animated.Value<number>;
  hasSprungBack: Animated.Value<number>;
}

export const springConfig = () => ({
  toValue: new Value(0),
  damping: 25,
  mass: 0.4,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
});

export const createValue = (val: number): SpringValue => ({
  value: new Value(val),
  clock: new Clock(),
  hasSprung: new Value(0),
  hasSprungBack: new Value(0),
});

export const springBack = (
  v: SpringValue,
  from: number,
  to: number,
): Animated.Node<number>[] => [
  cond(eq(v.hasSprung, 0), [stopClock(v.clock), set(v.hasSprung, 1)]),
  spring(v, from, to, 'hasSprungBack'),
];

export const spring = (
  v: SpringValue,
  from: number,
  to: number,
  back: 'hasSprung' | 'hasSprungBack' = 'hasSprung',
): Animated.Node<any> =>
  cond(eq(v[back], 0), [
    set(
      v.value,
      runSpring({
        clock: v.clock,
        from,
        to,
        config: springConfig(),
      }),
    ),
    cond(eq(clockRunning(v.clock), 0), set(v[back], 1)),
  ]);

export const timingBack = (
  v: SpringValue,
  from: number,
  to: number,
): Animated.Node<number>[] => [
  cond(eq(v.hasSprung, 0), [stopClock(v.clock), set(v.hasSprung, 1)]),
  timing(v, from, to, 'hasSprungBack'),
];

export const timing = (
  v: SpringValue,
  from: number,
  to: number,
  back: 'hasSprung' | 'hasSprungBack' = 'hasSprung',
): Animated.Node<any> =>
  cond(eq(v[back], 0), [
    set(
      v.value,
      runTiming({
        clock: v.clock,
        from,
        to,
        duration: 200,
        easing: Easing.inOut(Easing.linear),
      }),
    ),
    cond(eq(clockRunning(v.clock), 0), set(v[back], 1)),
  ]);
