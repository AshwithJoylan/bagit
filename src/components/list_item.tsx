import React, {createRef, useContext, createContext} from 'react';
import {useState, useMemo} from 'react';
import {View, Text, StyleSheet, Image, Platform, StatusBar} from 'react-native';
import Animated, {
  Easing,
  color,
  concat,
  multiply,
  event,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  bInterpolate,
  timing,
  onGestureEvent,
  interpolateColor,
  bInterpolateColor,
} from 'react-native-redash';
import {Item, Coupon} from '../props';
import {Sizes, Spacing, Typography, Colors} from '../metrics';
import {Highlight, Tap} from '../utils';
import {
  TapGestureHandler,
  State,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
const {
  Value,
  set,
  eq,
  block,
  createAnimatedComponent,
  cond,
  Clock,
  not,
  clockRunning,
  call,
  useCode,
} = Animated;

const AnimatedIcon = createAnimatedComponent(Icon);
const AnimatedImage = createAnimatedComponent(FastImage);

interface ListItemProps {
  item: Item;
  index: number;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ContextProps {
  modal: {
    item: Item;
    position: Position;
    imagePosition: Position;
    namePosition: Position;
  } | null;
  setModal: React.Dispatch<
    React.SetStateAction<{
      item: Item;
      position: Position;
      imagePosition: Position;
      namePosition: Position;
    } | null>
  >;
  activeValue: Animated.Value<number>;
}

export const ListItemContext = createContext<ContextProps>({
  modal: null,
  setModal: () => {},
  activeValue: new Value(-1),
});

const offset = (v: number) =>
  Platform.OS === 'android' ? v + (StatusBar.currentHeight || 0) : v;
const measure = async (
  ref?: View | Text | Image | ScrollView,
): Promise<Position> =>
  new Promise(resolve =>
    ref.measureInWindow((x, y, width, height) =>
      resolve({
        x,
        y: offset(y),
        width,
        height,
      }),
    ),
  );

const DURATION = 200;
const HEIGHT = Sizes.HEIGHT * 0.37 > 250 ? Sizes.HEIGHT * 0.37 : 250;
const WIDTH = Sizes.WIDTH * 0.5 - 20;

const coupon: Coupon = {
  title: 'A Spring Surprise',
  percentage: 40,
  code: 'FOODSPRING',
  description: 'Use The Code Above For Spring Collection Purchase',
};

/**
 * Component
 */
export default ({item, index}: ListItemProps) => {
  const even = index % 2 === 0;
  console.log(Sizes.HEIGHT * 0.37);

  const [disabled, setDisabled] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const {setModal, activeValue, modal} = useContext(ListItemContext);
  const position: Position = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
  // Animated Values
  const {value, state, clock, pressed} = useMemo(
    () => ({
      value: new Value(0),
      clock: new Clock(),
      state: new Value(State.UNDETERMINED),
      pressed: new Value(0),
      width: new Value(0),
      height: new Value(0),
    }),
    [],
  );

  const onEvent = onGestureEvent({state});
  const view = createRef<Animated.View>();
  const image = createRef<Animated.Image>();
  const name = createRef<Animated.View>();

  const startTransition = async () => {
    const position = await measure(view.current?.getNode());
    const imagePosition = await measure(image.current?.getNode());
    const namePosition = await measure(name.current?.getNode());
    activeValue.setValue(item.id);
    setModal({item, position, imagePosition, namePosition});
  };

  // Adding Animation
  useCode(
    () =>
      block([
        cond(
          eq(state, State.END),
          cond(
            eq(pressed, 0),
            [
              set(
                value,
                timing({
                  from: value,
                  to: 1,
                  duration: DURATION,
                  easing: Easing.linear,
                  clock,
                }),
              ),
              cond(not(clockRunning(clock)), [
                set(pressed, 1),
                call([], () => setDisabled(true)),
              ]),
            ],
            [
              set(
                value,
                timing({
                  from: value,
                  to: 0,
                  duration: DURATION,
                  easing: Easing.linear,
                  clock,
                }),
              ),
              cond(not(clockRunning(clock)), [
                set(pressed, 0),
                call([], () => setDisabled(false)),
              ]),
            ],
          ),
        ),
      ]),
    [],
  );

  // const opacity = bInterpolate(value, 1, 0);

  // Animation interpolates
  const opacity = bInterpolate(value, 1, 0);
  const rotate = concat(bInterpolate(value, 0, 45), 'deg');

  // functions
  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const removeQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={{width: '50%'}}>
      {/* {index == 1 ? (
        <View style={styles.coupon}>
          <Text style={styles.couponTitle}>{coupon.title}</Text>
          <Text style={styles.couponPercentage}>{coupon.percentage}% OFF</Text>
          <View style={styles.couponCode}>
            <Text style={styles.couponCodeText}>{coupon.code}</Text>
          </View>
          <Text style={styles.couponDescription}>{coupon.description}</Text>
        </View>
      ) : (
        <View />
      )} */}
      <View
        style={[
          styles.container,
          even
            ? {
                paddingRight: Spacing.SCALE_6,
              }
            : {
                paddingLeft: Spacing.SCALE_6,
              },
        ]}>
        <Animated.View
          ref={view}
          style={[
            styles.subContainer,
            {
              backgroundColor: item.color,
            },
          ]}>
          <TouchableWithoutFeedback
            disabled={disabled || modal ? true : false}
            containerStyle={{flex: 1, alignSelf: 'stretch'}}
            style={{flex: 1, alignItems: 'center', alignSelf: 'stretch'}}
            onPress={startTransition}>
            <View style={styles.imageContainer}>
              <AnimatedImage
                ref={image}
                resizeMode="contain"
                source={{
                  uri: item.image,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.descriptionContainer}>
              <Animated.View ref={name}>
                <Text style={styles.name}>{item.name}</Text>
              </Animated.View>
              <Text style={styles.from}>{item.from}</Text>
              <View style={styles.priceContainer}>
                <View style={styles.priceSub}>
                  <View style={styles.priceNumber}>
                    <Text style={styles.price}>{`₹ ${item.price}`}</Text>
                    <Text style={styles.pricePer}>per Quintal</Text>
                  </View>
                  <View style={styles.pricesContainer}>
                    <Text style={styles.prices}>View Prices</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Animated.View
            pointerEvents={disabled ? 'auto' : 'none'}
            style={[
              styles.addToCartView,
              {
                backgroundColor: item.color,
                opacity: value,
              },
            ]}>
            <View style={styles.subAddToCartView}>
              <View style={styles.addRemoveContainer}>
                <Highlight onPress={addQuantity} style={styles.buttons}>
                  <Icon name="ios-add" style={styles.addRemoveIcon} />
                </Highlight>
                <Text style={styles.quantity}>{quantity}</Text>
                <Highlight onPress={removeQuantity} style={styles.buttons}>
                  <Icon name="ios-remove" style={styles.addRemoveIcon} />
                </Highlight>
              </View>
              <Tap
                containerStyle={styles.bagButtonContainer}
                style={styles.bagButton}>
                <Text style={styles.bagIt}>Bag It</Text>
              </Tap>
            </View>
          </Animated.View>
          <TapGestureHandler {...onEvent}>
            <Animated.View style={[styles.addButton]}>
              <Animated.View style={[styles.subButtonView, {opacity}]} />
              <AnimatedIcon
                name="ios-add"
                style={[styles.plus, {transform: [{rotate}]}]}
              />
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: HEIGHT,
    overflow: 'hidden',
    paddingHorizontal: Spacing.SCALE_12,
    paddingTop: Spacing.SCALE_12,
  },
  subContainer: {
    flex: 1,
    borderRadius: Spacing.SCALE_18,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: WIDTH * 0.5,
    height: WIDTH * 0.5,
  },
  descriptionContainer: {
    flex: 0.8,
    paddingHorizontal: Spacing.SCALE_18,
    paddingBottom: Spacing.SCALE_18,
  },
  name: {
    fontSize: Typography.FONT_SIZE_20,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
  from: {
    fontSize: Typography.FONT_SIZE_12,
    color: Colors.LIGHT_TEXT,
    fontWeight: Typography.FONT_WEIGHT_600,
    width: WIDTH - Spacing.SCALE_40,
    marginTop: Spacing.SCALE_6,
  },
  priceContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
  },
  priceSub: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  priceNumber: {
    flex: 1,
    justifyContent: 'center',
  },
  price: {
    fontSize: Typography.FONT_SIZE_20,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
  pricePer: {
    color: Colors.LIGHT_TEXT,
    fontSize: Typography.FONT_SIZE_10,
  },
  pricesContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  prices: {
    fontSize: Typography.FONT_SIZE_10,
    color: Colors.BLACK,
  },
  addButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: Spacing.SCALE_55,
    height: Spacing.SCALE_55,
    borderColor: Colors.TRANSPARENT,
    borderBottomLeftRadius: Spacing.SCALE_18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  plus: {fontSize: Typography.FONT_SIZE_26, fontWeight: '200'},
  addToCartView: {
    position: 'absolute',
    borderRadius: Spacing.SCALE_18,
    top: 0,
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 0,
  },
  subButtonView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    right: 0,
    backgroundColor: Colors.LIGHT_WHITE,
  },
  addRemoveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagButtonContainer: {
    alignSelf: 'stretch',
    height: WIDTH * 0.26,
    backgroundColor: Colors.WHITE,
    borderRadius: 30,
  },
  bagButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagIt: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_600,
    color: Colors.DARK_TEXT,
  },
  buttons: {
    width: WIDTH * 0.26,
    height: WIDTH * 0.26,
    borderRadius: (WIDTH * 0.26) / 2,
    borderWidth: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.DARK_GREEN,
  },
  addRemoveIcon: {
    fontSize: Typography.FONT_SIZE_30,
    color: Colors.DARK_GREEN,
    fontWeight: '300',
  },
  quantity: {
    paddingVertical: Spacing.SCALE_8,
    fontSize: Typography.FONT_SIZE_20,
    color: Colors.DARK_GREEN,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
  },
  subAddToCartView: {
    height: '100%',
    width: '100%',
    padding: Spacing.SCALE_12,
    alignItems: 'center',
    backgroundColor: 'rgba(254, 254, 254, 0.4)',
  },
  coupon: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCALE_16,
    height: HEIGHT * 0.6,
    justifyContent: 'center',
    marginRight: Spacing.SCALE_12,
    borderRadius: Spacing.SCALE_18,
    marginTop: Spacing.SCALE_12,
    marginLeft: Spacing.SCALE_6,
    backgroundColor: '#EAEEF1',
  },
  couponCode: {
    alignSelf: 'stretch',
    height: Spacing.SCALE_40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.SCALE_16,
    marginBottom: Spacing.SCALE_12,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
    borderRadius: Spacing.SCALE_6,
    backgroundColor: Colors.WHITE,
  },
  couponTitle: {
    color: Colors.LIGHT_BLACK,
    fontSize: Typography.FONT_SIZE_10,
  },
  couponPercentage: {
    color: Colors.BLACK,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    fontSize: Typography.FONT_SIZE_22,
    marginTop: Spacing.SCALE_6,
  },
  couponDescription: {
    width: '80%',
    textAlign: 'center',
    fontSize: Spacing.SCALE_8,
    color: Colors.LIGHT_TEXT,
  },
  couponCodeText: {
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.DARK_GREEN,
    fontWeight: Typography.FONT_WEIGHT_600,
  },
});
