import {ReactNode} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

interface IModalProvider {
  children?: ReactNode;
}

interface modalHandlerType {
  message?: string | null;
  title?: string;
  isVisible?: boolean;
  successFn?: () => void;
  showCancelButton?: boolean;
  successTitle?: string;
  type?: 'error' | 'success' | 'info' | 'login' | undefined;
  successBtnStyle?: StyleProp<ViewStyle>;
  successTitleSTyle?: StyleProp<TextStyle>;
  cancelTitle?: string;
  closeIconVisible?: boolean;
  cancelFn?: () => void;
  iconVisible?: boolean;
  secondMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface loadingModalProps {
  loadingText?: string;
}
