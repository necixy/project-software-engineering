import React from 'react';
import {StyleProp, Switch, TextStyle, View, ViewStyle} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';

interface TSwitchList {
  item: any;
  onPressHandle?: () => void;
  toggleSwitch?: () => void;
  isEnabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const SwitchListItem = ({
  item,
  onPressHandle,
  toggleSwitch,
  isEnabled,
  containerStyle,
  labelStyle,
}: TSwitchList) => {
  return (
    <CustomButton
      key={Number(item?.id) + 0.5}
      hitSlop={10}
      type="unstyled"
      onPress={onPressHandle}
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginHorizontal: 40,
          marginVertical: 10,
        },
        containerStyle,
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomText
          color="grey"
          fontSize={14}
          fontFamily="arial"
          style={[{lineHeight: 20}, labelStyle]}>
          {item?.name}
        </CustomText>
      </View>
      <Switch
        trackColor={{false: colors?.grey, true: colors.lightGrey}}
        thumbColor={isEnabled ? colors?.primary : colors?.secondary}
        ios_backgroundColor={colors?.grey}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </CustomButton>
  );
};

export default SwitchListItem;
