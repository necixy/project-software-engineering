/* eslint-disable react/jsx-indent */
import React, {ReactNode, useCallback, useState} from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextLayoutEventData,
  TextProps,
  TextStyle,
  View,
  PixelRatio,
} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
interface TCustomText extends spacingStyle {
  color?: keyof typeof colors;
  fontSize?: number;
  fontFamily?: keyof typeof fonts;
  letterSpacing?: number;
  style?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  isLoadMoreEnable?: boolean;
  restProps?: TextProps;
  numberOfLines?: number;
  children: ReactNode;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  flex?: number;
  disabled?: boolean;
  allowFontScaling?: boolean;
  isSelectable?: boolean;
}

function CustomText({
  fontFamily = 'openSansRegular',
  color = 'defaultBlack',
  style,
  onPress,
  isLoadMoreEnable,
  restProps,
  numberOfLines,
  children,
  textAlign,
  fontSize = 14,
  flex,
  disabled,
  isSelectable = false,
  allowFontScaling = false,
  ...props
}: TCustomText) {
  const [loadMore, setLoadMore] = useState(false);
  const [numOfLines, setNumOfLines] = useState(0);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (numOfLines === 0) setNumOfLines(e.nativeEvent.lines.length);
    },
    [numOfLines],
  );

  const onLoadMoreToggle = () => {
    setLoadMore(!loadMore);
  };
  const handleNumberOfLines = () => {
    if (isLoadMoreEnable) {
      if (numOfLines === 0) {
        return undefined;
      }
      if (loadMore) {
        return numOfLines;
      }
      return numberOfLines;
    }
    return numberOfLines;
  };

  PixelRatio.get() < 2 ? 16 : 18;
  return (
    <>
      <Text
        // adjustsFontSizeToFit={false}
        // maxFontSizeMultiplier={1.3}
        // allowFontScaling={false}
        suppressHighlighting
        onPress={onPress}
        disabled={disabled}
        onTextLayout={onTextLayout}
        style={[
          {
            fontFamily: fonts[fontFamily],
            color: colors[color] ?? color,
            textAlign: textAlign ?? 'left',
            fontSize: fontSizePixelRatio(fontSize),
            flex,
          },
          style,
          props,
        ]}
        selectable={isSelectable}
        numberOfLines={handleNumberOfLines()}
        {...restProps}>
        {children}
      </Text>

      {isLoadMoreEnable
        ? numOfLines > (numberOfLines ?? 0) && (
            <View>
              <Pressable onPress={onLoadMoreToggle}>
                <Text
                  style={{
                    fontSize: fontSizePixelRatio(12),
                    color: colors.defaultBlack,
                    fontFamily: fonts.arialRegular,
                  }}>
                  {loadMore ? 'Load Less' : 'Load More'}
                </Text>
              </Pressable>
            </View>
          )
        : null}
    </>
  );
}

export default CustomText;
