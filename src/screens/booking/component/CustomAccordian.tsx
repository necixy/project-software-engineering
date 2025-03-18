import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import CustomText from 'src/shared/components/customText/CustomText';
import renderAccordian from './CustomAccordian.style';
import {colors} from 'src/theme/colors';

interface Props {
  heading: string;
  amount: number | string;
  children?: JSX.Element | null;
  disable?: boolean;
  onPress?: () => void;
}

const CustomAccordion = ({
  heading,
  amount,
  children,
  disable,
  onPress,
}: Props) => {
  const [open, setOpen] = useState(false);
  const animatedHeightValue = useSharedValue(0);
  const bodyHeight = useSharedValue(0);

  const headerPressHandler = () => {
    if (children == null) {
      onPress && onPress();
    } else {
      toggleOpen();
      onPress && open && onPress();
    }
  };

  const toggleOpen = () => {
    toggleAnimationValue(!open);
    setOpen(!open);
  };

  const toggleAnimationValue = (isLocalOpen: boolean) => {
    isLocalOpen
      ? (animatedHeightValue.value = withTiming(1, {
          duration: 300,
        }))
      : (animatedHeightValue.value = withTiming(0, {
          duration: 300,
        }));
  };

  const animatedHeight = useAnimatedStyle(() => {
    const height = interpolate(
      animatedHeightValue.value,
      [0, 1],
      [0, bodyHeight.value],
    );

    return {
      height,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginTop: 0,
      marginBottom: 0,
    };
  });

  return (
    <Pressable
      style={({pressed}) => [
        // renderMenuSwipe.container,
        renderAccordian.tabContainer,
        {
          marginHorizontal: 10,
          zIndex: 999,
          transform: [{scale: pressed ? 0.98 : 1}],
        },
      ]}
      // style={renderAccordian.tabContainer}
      onPress={headerPressHandler}>
      <View
      // disabled={disable}
      // style={({pressed}) => [{backgroundColor: colors?.lightBlueContainer}]}
      // onPress={headerPressHandler}
      >
        <View
          style={[renderAccordian.header, open && renderAccordian.headerOpen]}>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <CustomText
              fontSize={12}
              style={[
                renderAccordian.tabData,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              {children && !open ? `${heading} ` : heading}
            </CustomText>
            {children && !open && (
              <CustomText
                style={{
                  color: colors?.grey,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginBottom: 5,
                }}>
                ...
              </CustomText>
            )}
          </View>
          <CustomText
            fontSize={12}
            style={[renderAccordian.tabData, {width: '18%'}]}>
            {amount}
          </CustomText>
        </View>
      </View>
      {children && (
        <Animated.View style={[renderAccordian.bodyContainer, animatedHeight]}>
          <View
            style={renderAccordian.body}
            onLayout={event => {
              bodyHeight.value = event.nativeEvent.layout.height;
            }}>
            {children}
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
};

export default CustomAccordion;
