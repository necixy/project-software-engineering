import {Platform, StyleSheet} from 'react-native';
import {IS_IOS, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const renderMenuSwipe = StyleSheet.create({
  hiddenContainer: {
    width: SCREEN_WIDTH * 0.5,
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingEnd: 22,
  },

  container: {
    // width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
  },

  includes: {color: '#808080', fontFamily: fonts.openSansRegular},

  services: {
    fontFamily: fonts.openSansBold,
    marginHorizontal: 15,
    marginBottom: 10,
  },

  multipleServices: {
    marginLeft: 10,
    color: '#808080',
    fontFamily: fonts.openSansRegular,
  },
  emptyContainer: {
    backgroundColor: '#D7ECFD',
    borderRadius: 7,
    marginBottom: 15,
    paddingVertical: 5,
    // paddingLeft: 1,
  },
  boldDetails: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    fontSize: fontSizePixelRatio(14),
    color: '#808080',
  },
  description: {
    textAlignVertical: 'top',
    fontFamily: fonts.arial,
    fontSize: fontSizePixelRatio(13),
    color: '#808080',
    height: 100,
  },
  input: {borderWidth: 0, backgroundColor: '#D7ECFD'},
});

export default renderMenuSwipe;
