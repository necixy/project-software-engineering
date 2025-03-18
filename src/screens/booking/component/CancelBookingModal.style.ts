import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const renderCancelModal = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.55,
    alignSelf: 'center',
    flexWrap: 'wrap',
    borderRadius: 10,
    alignItems: 'center',
  },
  box: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  cancelBox: {
    borderTopWidth: 1,
    borderColor: colors.inputGrey,
    // elevation: 1,
    // shadowColor: colors?.grey,
    // shadowOffset: {
    //   width: 2,
    //   height: 1,
    // },
    // shadowOpacity: 2,
    // shadowRadius: 2,
    height: 35,
    marginBottom: 1,
    width: '100%',
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: fontSizePixelRatio(16),
    fontFamily: fonts?.arial,
    color: colors?.red,
  },
  backBox: {
    borderTopWidth: 1,
    borderColor: colors.inputGrey,
    // elevation: 1,
    // shadowColor: colors?.grey,
    // shadowOffset: {
    //   width: 2,
    //   height: 2,
    // },
    // shadowOpacity: 2,
    // shadowRadius: 2,
    height: 35,
    width: '100%',
    alignSelf: 'center',
  },
  backText: {
    fontFamily: fonts?.arial,
    color: colors?.primary,
    fontSize: fontSizePixelRatio(16),
  },
});

export default renderCancelModal;
