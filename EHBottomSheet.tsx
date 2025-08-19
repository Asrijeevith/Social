/*
Reference: https://gorhom.github.io/react-native-bottom-sheet/
Documentation: '../../../_documentation/components/bottomsheet/EHBottomsheet.md'    // TO UPDATE AS PER CHANGES

USAGE:
1. <EHBottomsheet
     snapPoints={['50%', '90%']}
     enableDynamicSizing={true}
     maxheight={500}
     overDrag={true}
     onClose={() => console.log('BottomSheet closed')}
     handelType="Default">

     //chhildren
   </EHBottomsheet>


2. Open & Close functionalities.
  const ref = useRef<BottomSheetRef>(null);
  <EHBottomsheet ref={ref} />
  <Pressable onPress={() => ref.current?.expand()}/>
  <Pressable onPress={() => ref.current?.close()}/>

UNDERSTANDING TYPES AT renderHeaderComponents
1. type = 'default' : Default BottomSheet with default handle.

2. type = 'custom' : Custom BottomSheet with custom handle.
    handlerValues = {
      rightElement: <View>Right</View>,
      leftElement: <View>Left</View>,
      centerElement: <View>Center</View>,
    };
3. type = 'linearGradient' : BottomSheet with linear gradient background.
    linearGradient = {
      linearGradient: true,
      colors: ['#1A243A', '#000000'],
    };

4. handletype = null : No handle, only the content of the BottomSheet.


// UPDATE THE PROPS AS PER CHANGES AND NEW SWITCH CASES
PROPS: 
overDrag (boolean): Allows dragging beyond snap points.
enableDynamicSizing (boolean): Enables dynamic sizing of the BottomSheet.
maxheight (number): Sets the maximum height of the BottomSheet.
backgroundColor (string): Sets the background color of the BottomSheet.
onClose (function): Callback function when the BottomSheet is closed.
handelType (string): Type of handle to be used. Options: 'Default', 'None', 'Image', 'Custom'.
handlerValues (object): Values for the handle.
loading (object): Loading animation properties.
containerStyle (StyleProp): Custom styles for the container.
snapPoints (string[]): Snap points for the BottomSheet.
linearGradient (object): Linear gradient properties.
*/

import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  StyleSheet,
  ViewStyle,
  View,
  Dimensions,
  Animated as RNAnimated,
  Image,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useComponentColors } from '../../components/ComponentColors';
import { Portal } from '@gorhom/portal';
import { EHIcon } from '../../components';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  StyleProps,
} from 'react-native-reanimated';
import { TrioGrid } from '../../uiComponents';
import LinearGradient from 'react-native-linear-gradient';

export interface BottomSheetRef extends BottomSheetModal {
  close: () => void;
  expand: () => void;
}

interface HandlerProps {
  imageURL?: string;
  imageHeight?: number;
  rightElement?: ReactElement;
  leftElement?: ReactElement;
  centerElement?: ReactElement;
  styles?: ViewStyle;
}

interface LoadingProps {
  showAnimation: boolean;
  colors?: [string, string, string];
  duration?: number;
}

type EHBottomsheetTypes =
  | 'default'
  | 'none'
  | 'custom'
  | 'close'
  | 'image'
  | 'LinearGradient'
  | 'FullScreen';

type EHBottomsheetProps = {
  children: React.ReactNode;
  type?: EHBottomsheetTypes;
  snapPoints: string[];
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  maxheight?: number;
  backgroundColor?: string;
  overDrag?: boolean;
  containerStyle?: ViewStyle;
  onClose?: () => void;
  handelType?: 'Default' | 'None' | 'Image' | 'Custom';
  handlerValues?: HandlerProps;
  flatListEnabled?: boolean;
  linearGradient?: {
    linearGradient?: boolean;
    colors: string[];
  };
  loading?: LoadingProps;
  setPosition?: (val: number) => void;
};

const EHBottomSheet = forwardRef<BottomSheetRef, EHBottomsheetProps>(
  (props, ref) => {
    const colors = useComponentColors();
    const [index, setIndex] = useState(-1);

    const screenWidth = Dimensions.get('window').width;
    const animation = useRef(new RNAnimated.Value(-screenWidth)).current;
    const animationLoop = useRef<RNAnimated.CompositeAnimation | null>(null);
    const rotatestatus = useSharedValue(1);
    const animatedPosition = useSharedValue(0);

    //type='default' arrow icon animated rotation
    const animatedRotation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            rotate: rotatestatus.value === 1 ? '0deg' : '180deg',
          },
        ],
      };
    });

    //here default types props are set
    const defaultProps =
      ref && 'current' in ref && ref.current
        ? getDefaultProps(props, ref.current, animatedRotation)
        : getDefaultProps(props, {} as BottomSheetRef, animatedRotation);
    const {
      children,
      snapPoints,
      enableDynamicSizing = false,
      enablePanDownToClose = true,
      maxheight,
      backgroundColor,
      overDrag = false,
      onClose,
      containerStyle,
      handelType,
      handlerValues,
      flatListEnabled,
      linearGradient,
      loading,
      setPosition
    } = { ...defaultProps, ...props };

    useEffect(() => {
      if (setPosition) {
        setPosition(index)
      }
    }, [index, setPosition])

    // backHandler fucntion to close the bottom sheet
    const handleBackPress = useCallback(() => {
      if (index === -1) {
        return false;
      }
      if (ref && 'current' in ref && ref.current) {
        ref.current.close();
        return true;
      }
      return false;
    }, [index, ref]);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }, [handleBackPress]);

    useAnimatedReaction(
      () => animatedPosition.value,
      (curr, pre) => {
        if (pre) {
          rotatestatus.value = curr < pre ? 1 : 0;
        }
      },
    );

    const startAnimation = () => {
      animation.setValue(-screenWidth);
      animationLoop.current = RNAnimated.loop(
        RNAnimated.timing(animation, {
          toValue: screenWidth,
          duration: loading?.duration || 2000,
          useNativeDriver: true,
        }),
      );
      animationLoop.current.start();
    };

    const stopAnimation = () => {
      animationLoop.current?.stop();
      animation.setValue(-screenWidth);
    };

    useEffect(() => {
      if (loading?.showAnimation) {
        startAnimation();
      } else {
        stopAnimation();
      }
      return () => {
        stopAnimation();
      };
    }, [loading?.showAnimation]);

    // Interpolate the animated value to colors
    const animatedBackgroundColor = animation.interpolate({
      inputRange: [0, screenWidth / 2, screenWidth],
      outputRange: loading?.colors || ['gray', 'gray', 'white'],
    });

    //backdrop properties
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior={enablePanDownToClose ? 'close' : 'none'}
          opacity={0.7}
        />
      ),
      [enablePanDownToClose],
    );

    //returns the  Handler component for the bottom sheet
    const HandlerComponent = () => {
      switch (handelType) {
        case 'Default':
          return (
            <Animated.View style={[animatedRotation]}>
              <EHIcon name="arrow_up__1" />
            </Animated.View>
          );
        case 'None':
          return <View />;
        case 'Image':
          return (
            <View
              style={{
                width: '100%',
                height: handlerValues?.imageHeight || 500,
              }}>
              <Image
                source={{ uri: handlerValues?.imageURL }}
                onError={() =>
                  console.log('Failed to load bottom sheet image')
                }
                style={{
                  width: '100%',
                  height: '100%',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}
              />
            </View>
          );
        case 'Custom':
          return (
            <TrioGrid
              disabled
              type="left_custom_right_custom"
              rightCustomElement={handlerValues?.rightElement}
              leftCustomElement={handlerValues?.leftElement}
              centerCustomElement={
                handlerValues?.centerElement ? (
                  <View>{handlerValues?.centerElement}</View>
                ) : (
                  <Animated.View style={animatedRotation}>
                    <EHIcon name="arrow_up__1" />
                  </Animated.View>
                )
              }
              containerStyle={[
                {
                  position: 'absolute',
                  zIndex: 2,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingVertical: 10,
                },
                { ...handlerValues?.styles },
              ]}
            />
          );
      }
    };

    // Clear function to reset the index and call onClose
    const clearFunction = () => {
      if (children) {
        setIndex(-1);
        if (onClose) onClose();
      }
    };

    // Render the children of the BottomSheet it is specified for linear gradient background
    const renderChildren = useCallback(() => {
      if (linearGradient?.linearGradient) {
        return (
          <LinearGradient
            colors={linearGradient.colors || ['#ffffff', '#000000']}>
            {children}
          </LinearGradient>
        );
      }
      return children;
    }, [linearGradient, children]);

    return (
      <Portal>
        <BottomSheet
          ref={ref}
          snapPoints={snapPoints}
          index={-1}
          onChange={setIndex}
          enablePanDownToClose={enablePanDownToClose}
          enableOverDrag={overDrag}
          enableContentPanningGesture={enablePanDownToClose}
          backdropComponent={renderBackdrop}
          enableDynamicSizing={enableDynamicSizing}
          enableHandlePanningGesture
          onClose={clearFunction}
          maxDynamicContentSize={
            maxheight || Dimensions.get('window').height * 0.9
          }
          animatedPosition={animatedPosition}
          backgroundStyle={{
            backgroundColor: backgroundColor || colors.BOTTOMSHEET.background,
          }}
          containerStyle={containerStyle}
          handleComponent={() => <View style={{ height: 0.4 }} />}
        >
          <HandlerComponent />
          {loading?.showAnimation && (
            <View style={[styles.loaderWrapper]}>
              <RNAnimated.View
                style={[
                  styles.animatedBar,
                  {
                    transform: [{ translateX: animation }],
                    backgroundColor: animatedBackgroundColor,
                  },
                ]}
              />
            </View>
          )}

          {flatListEnabled ? (
            <BottomSheetView style={styles.content}>
              <View style={{ position: 'relative' }}>
                {renderChildren()}
                {loading?.showAnimation && <View style={styles.overlay} />}
              </View>
            </BottomSheetView>
          ) : (
            <BottomSheetScrollView
              contentContainerStyle={styles.content}
              nestedScrollEnabled>
              <View style={{ position: 'relative' }}>
                {renderChildren()}
                {loading?.showAnimation && <View style={styles.overlay} />}
              </View>
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </Portal>
    );
  },
);

EHBottomSheet.displayName = 'EHBottomSheet';

const styles = StyleSheet.create({
  content: {},
  loaderWrapper: {
    width: '95%',
    alignSelf: 'center',
    height: 5,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'absolute',
    top: 0,
    borderRadius: 50,
    zIndex: 10,
  },
  animatedBar: {
    height: 5,
    borderRadius: 100,
    width: '50%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradientStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default EHBottomSheet;

const getDefaultProps = (
  props: EHBottomsheetProps,
  ref: BottomSheetRef,
  animatedRotation: StyleProps,
) => {
  switch (props.type || 'default') {
    case 'default':
      return {
        handelType: 'Default',
      };
    case 'close':
      return {
        handelType: 'Custom',
        snapPoints: ['50%', '90%'],
        handlerValues: {
          rightElement: (
            <EHIcon name="close_circle" onPress={() => ref?.close()} />
          ),
          leftElement: (
            <></>
          ),
          centerElement: (
            <></>
          ),
        },
      };
    case 'custom':
      return {
        // snapPoints: ['50%', '90%'],
        handelType: 'Custom',
        handlerValues: {
          centerElement: <EHIcon name="arrow_up__1" />,
        },
      };
    case 'image':
      return {
        // snapPoints: ['50%', '90%'],
        handelType: 'Image',
        handlerValues: {
          imageURL:
            'https://hips.hearstapps.com/hmg-prod/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=1xw:0.84375xh;center,top&resize=1200:*',
          imageHeight: 200,
        },
      };
    case 'LinearGradient':
      return {
        enableDynamicSizing: true,
        handelType: 'Custom',
        handlerValues: {
          centerElement: (
            <Animated.View style={[{ alignSelf: 'center' }, animatedRotation]}>
              <EHIcon name="arrow_up__1" onPress={() => ref.close()} />
            </Animated.View>
          ),
          styles: {
            position: 'absolute',
            backgroundColor: 'transparent',
          } as ViewStyle,
        },
        linearGradient: {
          linearGradient: true,
          colors: ['#1A243A', '#000000'],
        },
      };
    case 'none':
      return {
        enableDynamicSizing: true,
        overDrag: true,
        handelType: 'None',
      };
    default:
      return {};
  }
};
