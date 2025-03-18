import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'src/assets/svg';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';

interface TAccordion {
  isOpen?: boolean;
  heading: string;
  children: ReactNode;
  isDivisionLine?: boolean;
  onPress?: () => void;
}
const Accordion = ({isOpen, children, heading, onPress}: TAccordion) => {
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
  }));

  const [upsideArrow, setUpsideArrow] = useState(false);
  const toggleButton = () => {
    setUpsideArrow(prev => !prev);

    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
      offset.value = withTiming('180deg', {duration: 550});
    } else {
      shareValue.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
      offset.value = withTiming('0deg', {duration: 550});
    }
  };

  //.......Animation for arrow
  const offset = useSharedValue('0deg');

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{rotate: offset.value}],
  }));

  //.......Animation for arrow

  return (
    <View style={{marginVertical: 10}}>
      <CustomButton
        style={{marginVertical: 10}}
        type="unstyled"
        onPress={() => {
          onPress && onPress();
          toggleButton();
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomText
            fontSize={14}
            textAlign="left"
            flex={1}
            fontFamily="openSansBold">
            {heading}
          </CustomText>
          <Animated.View
            style={{
              ...animatedStyles,
              //   transform: [{rotate: upsideArrow ? '180deg' : '0deg'}],
            }}>
            <Icon name="down" color={colors?.primary} />
          </Animated.View>
        </View>
      </CustomButton>

      <Animated.View style={[{overflow: 'hidden'}, bodyHeight]}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
          onLayout={event => {
            // console.log({bodySectionHeight});
            setBodySectionHeight(event.nativeEvent.layout.height);
          }}>
          <CustomText fontFamily="openSansRegular" fontSize={14}>
            {children}
          </CustomText>
        </View>
      </Animated.View>
    </View>
  );
};

export default Accordion;
