import {StyleSheet} from 'react-native';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const renderCustomCard = StyleSheet.create({
  userContainer: {
    borderWidth: 2,
    borderColor: '#999999',
    borderRadius: 15,
    paddingTop: 10,
    paddingHorizontal: 15,
    marginTop: 7,
  },

  userBoldDetails: {
    color: '#1a1a1a',
    fontFamily: fonts.openSansBold,
    flex: 1,
    paddingEnd: 10,
  },

  badge: {
    backgroundColor: '#fac711',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  badgeText: {color: '#1A1A1A', fontFamily: fonts.openSansRegular},

  userDetails: {
    color: '#1a1a1a',
    fontFamily: fonts.arialRegular,
    flex: 1,
  },
  userAddress: {
    textDecorationLine: 'underline',
    fontFamily: fonts.arialRoundedBold,
  },
  userImageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  userImage: {width: 50, height: 50, borderRadius: 50 / 2, marginRight: 15},

  iconBox: {flexDirection: 'row', alignItems: 'center', marginBottom: 17},
  iconBell: {marginRight: 20},
  iconDollar: {marginRight: 25},
  iconPin: {marginRight: 23},

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    flexWrap: 'wrap',
    height: 55,
  },

  rateProBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },

  bookingsBtn: {
    width: '40%',
    borderRadius: 5,
    marginTop: 20,
    height: 32.5,
  },

  btnText: {
    color: '#1a1a1a',
    fontSize: fontSizePixelRatio(15),
    fontFamily: fonts.arialRegular,
  },
});

export default renderCustomCard;
