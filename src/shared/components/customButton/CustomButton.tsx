import {
  Text,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  View,
  Keyboard,
} from 'react-native';
import React, {useCallback} from 'react';
import {customButtonProps} from './customButtonType';
import customButtonStyle from './CustomButton.Style';

import {globalStyles} from '../../../constants/globalStyles.style';
import {colors} from '../../../theme/colors';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

function CustomButton({
  type = 'blue',
  children,
  textProps,
  spacing,
  style,
  isLoading,
  disabled,
  disabledWithoutOpacity,
  alignSelf = 'baseline',
  hitSlop = 10,
  fontSize = 14,
  ...props
}: customButtonProps) {
  const {container, white, blue, text, grey} = customButtonStyle;
  // Container style functions
  const containerStyle: (
    state: PressableStateCallbackType,
  ) => StyleProp<ViewStyle> = useCallback(
    ({pressed}) => {
      let containerType: ViewStyle = blue;
      if (type === 'white') {
        containerType = white;
      } else if (type === 'grey') {
        containerType = grey;
      } else if (type === 'unstyled') {
        containerType = {
          height: 'auto',
        };
      }

      let opacity = 1;
      if (disabled || isLoading) {
        opacity = 0.6;
      } else if (pressed) {
        opacity = 0.9;
      }

      return [
        {
          alignSelf,
          opacity,
          transform: [
            {
              scale: pressed ? 0.98 : 1,
            },
          ],
        },
        container,
        type === 'unstyled' && {paddingHorizontal: 0},
        containerType,
        spacing,
        style,
      ];
    },
    [
      disabledWithoutOpacity,
      disabled,
      isLoading,
      alignSelf,
      style,
      spacing,
      type,
    ],
  );
  // Container style functions end

  return (
    <Pressable
      onPress={event => {
        Keyboard.dismiss();
        props?.onPress && props?.onPress(event);
      }}
      hitSlop={hitSlop}
      disabled={disabled || disabledWithoutOpacity || isLoading}
      style={containerStyle}
      {...props}>
      {typeof children === 'string' ? (
        <View style={[globalStyles.rowCenter, globalStyles.flex]}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={
                type === 'white'
                  ? colors?.primary
                  : type === 'unstyled'
                  ? colors?.grey
                  : colors?.secondary
              }
              style={{
                marginEnd: 10,
              }}
            />
          ) : null}
          <Text
            {...textProps}
            style={[
              text,
              textProps?.style,
              {fontSize: fontSizePixelRatio(fontSize)},
            ]}>
            {children}
          </Text>
        </View>
      ) : (
        children
      )}
    </Pressable>
  );
}

export default CustomButton;
