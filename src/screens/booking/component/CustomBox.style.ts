import {Platform, StyleSheet} from 'react-native';
import {IS_IOS} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const customBoxStyle = StyleSheet.create({
  requestContainer: {
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flex: 1,
  },

  imageBox: {
    alignItems: 'center',
  },

  userImage: {
    height: 80,
    width: 80,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },

  userTitle: {
    color: '#1a1a1a',
    fontFamily: fonts.openSansBold,
    marginTop: 7,
    alignSelf: 'center',
    textAlign: 'center',
  },

  detailsBox: {
    borderColor: '#808080',
    borderWidth: 2,
    borderRadius: 15,
    marginTop: 25,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  detailHeading: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    marginBottom: 30,
    alignSelf: 'center',
  },

  descriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  iconDate: {marginRight: 20},
  iconBell: {marginRight: 20},
  iconDollar: {marginRight: 25},
  iconPin: {marginRight: 23},
  iconEdit: {marginRight: 21},

  description: {
    color: '#494c51',
    flex: 1,
    fontFamily: fonts.arialRegular,
  },

  userAddress: {
    textDecorationLine: 'underline',
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    // marginBottom: 5,
    paddingHorizontal: 10,
    width: '100%',
    flexWrap: 'wrap',
    height: 55,
  },

  bookingBtn: {
    width: '40%',
    // paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
    height: 32.5,
  },

  btnText: {
    color: '#1a1a1a',
    fontSize: fontSizePixelRatio(15),
    fontFamily: fonts.arialRegular,
  },

  bookingCancel: {
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: 'transparent',
  },

  cancelText: {
    color: colors?.red,
    fontFamily: fonts.arialRegular,
    fontSize: fontSizePixelRatio(16),
  },
});

export default customBoxStyle;
