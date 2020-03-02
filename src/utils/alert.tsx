import React from 'react';
// import Animated from 'react-native-reanimated';
// import {Easing} from 'react-native-reanimated';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from 'react-native';
import Highlight from './highlight';
import Animated, {Easing} from 'react-native-reanimated';

const AnimatedSafe = Animated.createAnimatedComponent(SafeAreaView);
const {height, width} = Dimensions.get('window');

/***
 ** Props **
  type: 'alert' | 'indicator';
  title: Title
  description: Description or Sub title
  confirmText: Confirm button text default @OK
  cancelText: Cancel button Text default @Cancel
  cancelable: Weather alert is cancelable or not default @true
  visible: Visibility of alert
  onBack: Back function
  onConfirm: Confirm function
  backgroundBackEnabled: Weather alert can be closed on backdrop press default @true
***/

const borderWidth = 0.4,
  borderColor = 'rgba(0,0,0,0.4)';

const {spring, set, block, timing} = Animated;

export interface AlertProps {
  title?: string; // Title
  description?: string; // Description or Sub title
  confirmText?: string; // Confirm button text
  cancelText?: string; // Cancel button Text
  cancelable?: boolean; // Weather alert is cancelable or not
  onConfirm?: () => void;
  backgroundBackEnabled?: boolean;
}

let onConfirm = () => {};
class Alert extends React.Component {
  val = new Animated.Value(0);
  scale = new Animated.Value(1.1);

  state = {
    type: 'alert',
    visible: false,
    modalVisible: false,
    cancelable: true,
    confirmText: 'OK',
    description: null,
    cancelText: 'Cancel',
    title: 'Alert',
    backgroundBackEnabled: true,
  };

  show = (props: AlertProps) => {
    if (props.onConfirm) {
      onConfirm = props.onConfirm;
    } else {
      onConfirm = () => {};
    }
    this.setState({
      ...props,
      visible: true,
      modalVisible: true,
    });
  };

  componentDidUpdate() {
    // stopClock(clock);
    this.val.setValue(0);
    this.scale.setValue(1.1);
    if (this.state.visible) {
      block([
        timing(this.val, {
          toValue: 1,
          duration: 100,
          easing: Easing.inOut(Easing.ease),
        }).start(),
        spring(this.scale, {
          toValue: 1,
          damping: 14,
          mass: 0.6,
          stiffness: 150.6,
          overshootClamping: false,
          restSpeedThreshold: 0.1001,
          restDisplacementThreshold: 0.001,
        }).start(),
      ]);
    } else {
      block([
        timing(this.val, {
          toValue: 0,
          duration: 0,
          easing: Easing.inOut(Easing.ease),
        }).start(),
        spring(this.scale, {
          toValue: 1.1,
          damping: 12,
          mass: 0.6,
          stiffness: 150.6,
          overshootClamping: false,
          restSpeedThreshold: 0.001,
          restDisplacementThreshold: 0.001,
        }).start(),
      ]);
    }
  }

  componentDidMount() {
    set(this.val, 0);
    set(this.scale, 0);
  }

  clearState = () => {
    this.setState({
      type: 'alert',
      visible: false,
      modalVisible: false,
      cancelable: true,
      confirmText: 'OK',
      description: null,
      cancelText: 'Cancel',
      title: 'Alert',
      backgroundBackEnabled: true,
    });
  }

  render() {
    const {
      type,
      visible,
      cancelable,
      confirmText,
      description,
      cancelText,
      title,
      modalVisible,
      backgroundBackEnabled,
    } = this.state;
    const {val, scale} = this;

    return (
      <Modal
        visible={visible}
        onRequestClose={this.clearState}
        animated
        animationType="fade"
        transparent>
        <SafeAreaView
          style={{
            flex: 1,
            zIndex: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (backgroundBackEnabled) this.setState({visible: false});
            }}>
            <Animated.View
              style={{
                opacity: val,
                transform: [
                  {
                    scale,
                  },
                ],
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              {
                position: 'absolute',
                opacity: val,
                transform: [
                  {
                    scale,
                  },
                ],
              },
              styles.container,
            ]}>
            <View style={type === 'alert' ? {flex: 1} : {}}>
              {type === 'alert' ? (
                <View style={{width: '100%'}}>
                  <View
                    style={[
                      styles.titleContainer,
                      {paddingBottom: !description ? 15 : 5},
                    ]}>
                    <Text style={styles.title}>{title}</Text>
                  </View>
                  {description && (
                    <View style={styles.subTitleContainer}>
                      <Text style={styles.description}>{description}</Text>
                    </View>
                  )}
                  <View style={styles.footerContainer}>
                    {cancelable && (
                      <Highlight
                        onPress={this.clearState}
                        style={styles.cancel}>
                        <Text style={{color: 'black'}}>{cancelText}</Text>
                      </Highlight>
                    )}
                    <Highlight
                      onPress={() => {
                        this.clearState();
                        onConfirm();
                      }}
                      style={styles.confirm}>
                      <Text style={{color: 'black'}}>{confirmText}</Text>
                    </Highlight>
                  </View>
                </View>
              ) : (
                <View />
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default Alert;

const styles = StyleSheet.create({
  container: {
    width: 270,
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  titleContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomWidth: borderWidth,
    // borderBottomColor: borderColor,
  },
  subTitleContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerContainer: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    borderTopColor: borderColor,
    borderTopWidth: borderWidth,
  },
  cancel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: borderWidth,
    borderRightColor: borderColor,
  },
  confirm: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {
    fontSize: height * 0.23 < 150 ? 16 : 18,
    color: 'black',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.7)',
    fontSize: height * 0.23 < 150 ? 12 : 14,
  },
});
