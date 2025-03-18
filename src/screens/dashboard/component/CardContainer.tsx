import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';

interface TCardContainer {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  title?: string;
  sideBtn?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  data?: any;
}

const CardContainer = ({
  children,
  containerStyle,
  title,
  sideBtn,
  titleStyle,
  titleContainerStyle,
  data,
}: TCardContainer) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {(title || sideBtn) && (
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              width: SCREEN_WIDTH * 0.54,
              alignSelf: 'flex-end',
              justifyContent: 'space-between',
            },
            titleContainerStyle,
          ]}>
          {title && (
            <CustomText
              fontSize={15}
              fontFamily={'openSansBold'}
              color={'lightGrey'}
              style={[titleStyle]}>
              {title}
            </CustomText>
          )}
          {sideBtn}
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors?.secondary,
    borderWidth: 1,
    borderColor: colors?.lightGrey,
    width: SCREEN_WIDTH * 0.94,
    padding: 20,
    zIndex: 999,
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default CardContainer;
