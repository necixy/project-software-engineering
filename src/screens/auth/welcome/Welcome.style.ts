import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const welcomeStyles = StyleSheet.create({
  heading: {
    fontSize: fontSizePixelRatio(66),
    fontFamily: fonts?.fredokaSemiBold,
    color: colors?.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subHeading: {
    marginBottom: SCREEN_HEIGHT * 0.05,
    fontFamily: fonts?.openSansBold,
    fontSize: fontSizePixelRatio(16),
  },
  logInButton: {
    // backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
    width: '70%',
    marginBottom: 10,
    height: 50,
    borderRadius: 12,
  },
  logInText: {
    color: colors.secondary,
    fontSize: fontSizePixelRatio(20),
    fontFamily: fonts?.openSansBold,
  },
});

export default welcomeStyles;
