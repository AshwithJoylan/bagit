import React, {useContext, useMemo} from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import {red, onGestureEvent, bInterpolate} from 'react-native-redash';
import {
  createValue,
  spring,
  springBack,
  SpringValue,
  timing,
  timingBack,
  Highlight,
} from '../utils';
import Animated, {Extrapolate} from 'react-native-reanimated';
import {Spacing, Sizes, Typography, Colors} from '../metrics';
import {Position, ListItemContext} from './list_item';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FastImage from 'react-native-fast-image';
import SafeAreaView from 'react-native-safe-area-view';

const {
  cond,
  block,
  useCode,
  eq,
  set,
  Value,
  createAnimatedComponent,
  not,
  interpolate,
  clockRunning,
  call,
} = Animated;

const BUTTON_SIZE = Sizes.WIDTH * 0.15 > 60 ? 60 : Sizes.WIDTH * 0.15;

const AnimatedImage = createAnimatedComponent(FastImage);

const HEIGHT = Sizes.HEIGHT * 0.56;
const CONTENT_HEIGHT = Sizes.HEIGHT - HEIGHT + 40;

// data
const percentage = 15,
  date = 'Friday';
const Transition = () => {
  const {modal, setModal} = useContext(ListItemContext);
  const {color, image, name, weight_per_piece, price, description} =
    modal?.item || {};
  const [quantity, setQuantity] = useState(1);

  const position = modal?.position || {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
  const textPosition = modal?.namePosition || {width: 0, height: 0, x: 0, y: 0};
  const imagePosition = modal?.imagePosition || {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  const {state, shouldClose, value, pointerEvents} = useMemo(
    () => ({
      pointerEvents: new Value<'none' | 'auto'>('none'),
      shouldClose: new Value(0),
      value: createValue(0),
      state: new Value(State.UNDETERMINED),
    }),
    [],
  );

  const onEvent = onGestureEvent({state});

  useCode(
    () =>
      block([
        cond(eq(state, State.END), set(shouldClose, 1)),
        cond(
          shouldClose,
          [
            timingBack(value, 1, 0),
            cond(
              not(clockRunning(value.clock)),
              call([], () => {
                setModal(null);
              }),
            ),
          ],
          [timing(value, 0, 1)],
        ),
      ]),
    [],
  );

  const width = bInterpolate(value.value, position.width, Sizes.WIDTH);
  const height = bInterpolate(value.value, position.height, HEIGHT);
  const x = bInterpolate(value.value, position.x, 0);
  const y = bInterpolate(value.value, position.y, 0);
  const borderRadius = bInterpolate(value.value, Spacing.SCALE_18, 0);
  const translateY = bInterpolate(value.value, CONTENT_HEIGHT, 0);
  const opacity = interpolate(value.value, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const backgroundOpacity = interpolate(value.value, {
    inputRange: [0, 0.02, 1],
    outputRange: [0, 1, 1],
    extrapolate: Extrapolate.EXTEND,
  });

  // Functions
  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const removeQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <Animated.View
        {...{pointerEvents}}
        style={[
          {
            backgroundColor: color,
            width,
            height,
            left: x,
            top: y,
            borderRadius,
            opacity: backgroundOpacity,
          },
          styles.item,
        ]}></Animated.View>
      <Thumbnail source={{uri: image}} {...{imagePosition, value}} />
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{translateY}],
          },
        ]}>
        <Text style={styles.name}>{name}</Text>
        <Text
          style={styles.weightPerPiece}>{`1 pc (${weight_per_piece})`}</Text>
        <Text style={styles.description}>{description}</Text>
        <SafeAreaView forceInset={{bottom: 'always'}} style={styles.priceView}>
          <View style={styles.top}>
            <View style={styles.left}>
              <Highlight onPress={addQuantity} style={styles.buttons}>
                <Icon name="ios-add" style={styles.addRemoveIcon} />
              </Highlight>
              <Text style={styles.quantity}>{quantity}</Text>
              <Highlight onPress={removeQuantity} style={styles.buttons}>
                <Icon name="ios-remove" style={styles.addRemoveIcon} />
              </Highlight>
            </View>
            <Text style={styles.price}>{`₹ ${price && (quantity * price)}`}</Text>
          </View>
          <View style={styles.middle}>
            <Text style={styles.deliveryDate}>Standard: {date} Evening</Text>
            <Text style={styles.percentage}>You Save: {percentage}%</Text>
          </View>
          <View style={styles.bottom}>
            <Animated.View style={{opacity, transform: [{scale: opacity}]}}>
              <Highlight style={styles.favorite}>
                <SimpleLineIcons name="heart" style={styles.heart} />
              </Highlight>
            </Animated.View>
            <Animated.View
              style={[styles.con, {opacity, transform: [{scale: opacity}]}]}>
              <Highlight style={styles.bagItButton}>
                <Text style={styles.bagItText}>Bag It</Text>
              </Highlight>
            </Animated.View>
          </View>
        </SafeAreaView>
      </Animated.View>
      <TapGestureHandler {...onEvent}>
        <Animated.View
          style={[styles.back, {opacity, transform: [{scale: opacity}]}]}>
          <Icon name="ios-arrow-back" size={Spacing.SCALE_24} />
        </Animated.View>
      </TapGestureHandler>
    </>
  );
};

const IMAGE_WIDTH = Sizes.IS_BIG ? Sizes.WIDTH * 0.6 : Sizes.WIDTH * 0.4;
const IMAGE_HEIGHT = IMAGE_WIDTH;

const Thumbnail = ({
  source,
  imagePosition: position,
  value,
}: {
  source: ImageSourcePropType;
  imagePosition: Position;
  value: SpringValue;
}) => {
  const width = bInterpolate(value.value, position.width, IMAGE_WIDTH);
  const height = bInterpolate(value.value, position.height, IMAGE_HEIGHT);
  const x = bInterpolate(
    value.value,
    position.x,
    Sizes.WIDTH / 2 - IMAGE_WIDTH / 2,
  );
  const y = bInterpolate(
    value.value,
    position.y,
    HEIGHT / 2 - IMAGE_HEIGHT / 2 - 20,
  );

  return (
    <AnimatedImage
      style={[
        styles.image,
        {
          width,
          height,
          left: x,
          top: y,
        },
      ]}
      {...{source}}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.SCALE_20,
    paddingTop: Spacing.SCALE_24,
    borderTopLeftRadius: Spacing.SCALE_24,
    borderTopRightRadius: Spacing.SCALE_24,
    backgroundColor: 'white',
    height: CONTENT_HEIGHT,
  },
  name: {
    fontSize: Typography.FONT_SIZE_26,
    color: Colors.DARK_TEXT,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
  },
  back: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    top: Sizes.TOP,
    left: 0,
  },
  weightPerPiece: {
    fontSize: Typography.FONT_SIZE_20,
    color: Colors.DARK_GREEN,
    fontWeight: Typography.FONT_WEIGHT_500,
    marginTop: Spacing.SCALE_8,
  },
  description: {
    paddingTop: Spacing.SCALE_24,
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.LIGHT_TEXT,
    fontWeight: Typography.FONT_WEIGHT_500,
  },
  priceView: {
    paddingBottom: Spacing.SCALE_6,
    flex: 1,
    paddingTop: Spacing.SCALE_24,
  },
  buttons: {
    width: Spacing.SCALE_40,
    height: Spacing.SCALE_40,
    borderRadius: 22.5,
    borderWidth: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.LIGHT_BLACK,
  },
  addRemoveIcon: {
    fontSize: Typography.FONT_SIZE_30,
    color: Colors.LIGHT_BLACK,
    fontWeight: '300',
  },
  top: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  middle: {
    alignSelf: 'stretch',
    paddingTop: Spacing.SCALE_8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottom: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: Typography.FONT_SIZE_20,
    margin: Spacing.SCALE_18,
    fontWeight: Typography.FONT_WEIGHT_600,
    color: Colors.LIGHT_BLACK,
  },
  price: {
    fontSize: Typography.FONT_SIZE_26,
    color: Colors.DARK_TEXT,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
  },
  deliveryDate: {
    fontWeight: Typography.FONT_WEIGHT_500,
    color: Colors.LIGHT_TEXT,
  },
  percentage: {
    fontWeight: Typography.FONT_WEIGHT_500,
    color: Colors.DARK_GREEN,
  },
  favorite: {
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.SCALE_12,
    borderWidth: 1,
    borderColor: Colors.DARK_GREEN,
  },
  bagItButton: {
    alignSelf: 'stretch',
    height: BUTTON_SIZE,
    borderRadius: Spacing.SCALE_12,
    backgroundColor: Colors.DARK_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    fontSize: Typography.FONT_SIZE_18,
    color: Colors.DARK_GREEN,
  },
  bagItText: {
    fontSize: Typography.FONT_SIZE_18,
    color: Colors.WHITE,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
  },
  con: {
    width: '80%',
  },
});

export default Transition;
