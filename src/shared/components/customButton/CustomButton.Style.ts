import {StyleSheet} from 'react-native';
import {colors} from '../../../theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const customButtonStyle = StyleSheet.create({
  container: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  blue: {
    backgroundColor: colors?.primary,
    borderRadius: 5,
  },
  white: {
    backgroundColor: colors?.secondary,
    borderRadius: 5,
  },
  grey: {
    backgroundColor: colors?.lightGrey,
    borderRadius: 5,
  },
  text: {
    fontSize: fontSizePixelRatio(16),
    fontFamily: fonts.arialRoundedBold,
    color: colors?.secondary,
  },
});
export default customButtonStyle;
