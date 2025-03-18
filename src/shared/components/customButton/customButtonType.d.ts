import {
  FlexAlignType,
  PressableProps,
  StyleProp,
  TextProps,
  ViewStyle,
} from 'react-native';

interface customButtonProps extends PressableProps {
  type?: 'blue' | 'white' | 'grey' | 'unstyled';
  textProps?: TextProps | StyleProp<TextProps>;
  spacing?: spacingStyle;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  disabled?: boolean;
  disabledWithoutOpacity?: boolean;
  alignSelf?: FlexAlignType;
  hitSlop?: number;
  fontSize?: number;
  onPress?: () => void;
}
