import {Platform, StyleSheet} from 'react-native';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const renderRatings = StyleSheet.create({
  container: {padding: 20, backgroundColor: '#fff'},
  userImg: {alignSelf: 'center', width: 90, height: 90},
  userTitle: {
    fontFamily: fonts.openSansBold,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  userDescription: {
    fontFamily: fonts.arial,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 50,
  },
  starTitle: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    color: '#808080',
    // marginLeft: 0,
    marginBottom: 5,
  },
  star: {marginBottom: 50, alignSelf: 'center'},
  commentTitle: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    color: '#808080',
    marginBottom: 10,
  },
  btnText: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    fontSize: fontSizePixelRatio(18),
    marginHorizontal: SCREEN_WIDTH * 0.336,
  },
  inputText: {
    textAlignVertical: 'top',
    fontFamily: fonts.arial,
    fontSize: fontSizePixelRatio(14),
    color: '#808080',
  },
});

export default renderRatings;
