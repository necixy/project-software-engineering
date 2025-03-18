import {RouteProp} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AuthStackParam} from './params/AuthStackParam';

export type AuthScreenProps<RouteName extends keyof AuthStackParam> =
  NativeStackScreenProps<AuthStackParam, RouteName>;
export type AuthUseNavigationProps = NativeStackNavigationProp<AuthStackParam>;
