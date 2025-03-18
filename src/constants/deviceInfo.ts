import {Dimensions, Platform} from 'react-native';

export const SCREEN_WIDTH = Dimensions?.get('screen')?.width;
export const SCREEN_HEIGHT = Dimensions?.get('screen')?.height;
export const IS_IOS = Platform?.OS === 'ios';
