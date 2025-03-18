import {Platform, StyleSheet} from 'react-native';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
    // alignItems: 'center',
    // paddingHorizontal: 20,
  },
  leftIcon: {
    // width: '20%',
    alignItems: 'flex-start',
    marginStart: 10,
    // backgroundColor: '#fffff',
    alignSelf: 'center',
    // marginEnd: 25,
  },
  rightIcon: {
    alignItems: 'flex-end',
    backgroundColor: '#fffff',
  },
  titleText: {
    alignSelf: 'center',
    // marginEnd: 10,
    // fontSize: fontSizePixelRatio(40),
    // fontFamily: fonts?.fredokaSemiBold,
    // color: colors?.primary,
    // width: '50%',
    // lineHeight: fontSizePixelRatio(50),
  },
});
