import {StyleSheet} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const renderPersonalInfo = StyleSheet.create({
  container: {paddingHorizontal: 20},
  profileImg: {
    width: 90,
    height: 90,
    marginBottom: 5,
    alignSelf: 'center',
    marginTop: 30,
  },
  title: {alignSelf: 'center', marginBottom: 30},
  inputContainer: {
    alignSelf: 'center',
    width: '98%',
    borderRadius: 0,
    borderColor: colors.primary,
    borderTopWidth: 0,
    borderStartWidth: 0,
    borderEndWidth: 0,
    borderWidth: 1,
    marginTop: 35,
    marginBottom: 5,
    zIndex: 1,
  },
  inputBox: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    fontSize: fontSizePixelRatio(15),
    color: '#808080',
  },
  termsView: {
    marginVertical: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 20,
  },
  checkBox: {
    alignSelf: 'center',
    marginEnd: 3,
  },
  termsTextView: {
    // width: '90%',
    marginTop: 5,
  },
  termsText: {
    marginStart: 5,
    fontFamily: fonts?.openSansRegular,
    fontSize: 14,
  },
  termsTextLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: fonts?.openSansRegular,
    fontSize: 14,
  },
  button: {width: '100%', marginVertical: 30},
  errorStyle: {paddingBottom: 0, marginStart: 12},
});

export default renderPersonalInfo;
