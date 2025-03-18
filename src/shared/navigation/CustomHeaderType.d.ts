import {fonts} from 'src/theme/fonts';
import {colors} from 'src/theme/colors';
import {ReactNode} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

export interface ICustomHeader {
  title?: string;
  headerContainer?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle> | StyleProp<ViewStyle>;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  translateY?: any;
  textAlignTitle?: 'center' | 'left' | 'right';
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIconStyle?: StyleProp<ViewStyle>;
  navigation?: any;
  route?: any;
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: keyof typeof fonts | fonts;
  color?: keyof typeof colors;
  back?: boolean;
  leftIconColor?: 'blue' | 'black' | 'white';
  titleColor?: 'blue' | 'black' | 'white';
  titleWidth?: string;
  titleType?: 'text' | 'custom';
  titleComp?: any;
  children?: any;
  leftIconContainer?: StyleProp<ViewStyle>;
  handleRight?: () => void;
}
