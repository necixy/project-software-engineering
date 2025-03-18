import {StyleSheet} from 'react-native';
import {IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';

const renderCheckout = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 45,
    width: SCREEN_WIDTH,
    // borderWidth: 1,
  },
  headerImg: {height: 60, width: 60, borderRadius: 60},
  headerTitle: {
    fontFamily: fonts.openSansBold,
    color: '#fff',
  },
  headerDescriptionBox: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  headerDescription: {
    fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
    color: '#fff',
  },
  mainBox: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    top: -5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  mainBoxHeading: {
    color: colors.defaultBlack,
    fontFamily: fonts.openSansBold,
    marginTop: 30,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    marginTop: 20,
  },
  iconText: {
    fontFamily: fonts.arialRegular,
    color: colors.defaultBlack,
  },
  iconEdit: {
    width: SCREEN_WIDTH * 0.8,
    fontFamily: fonts.arialRegular,
    color: '#000',
  },
  location: {
    width: SCREEN_WIDTH * 0.96,
    height: SCREEN_HEIGHT * 0.15,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  greyButton: {
    borderRadius: 20,
    marginTop: 25,
    height: 25,
    paddingBottom: 3,
  },
  greyText: {
    color: colors.defaultBlack,
    fontSize: fontSizePixelRatio(9),
    fontFamily: fonts.openSansRegular,
  },
  blueButton: {
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 30,
  },
  blueText: {
    // color: '#fff',
    fontSize: fontSizePixelRatio(17),
    fontFamily: fonts.openSansBold,
  },
  payment: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontFamily: fonts.openSansRegular,
  },
  applePay: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingEnd: 20,
  },
  applePayIcon: {
    // color: '#FFF',
    // tintColor: 'blue',
    // width: 50,
    // height: 35,
    // borderRadius: 0,
  },
  visa: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  visaIcon: {
    width: 28,
    height: 20,
    borderRadius: 0,
    left: 4,
  },
  card: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 27,
    height: 20,
    borderRadius: 0,
    left: 4,
  },
  rule: {
    borderColor: colors.inputGrey,
    borderWidth: 0.7,
    alignSelf: 'flex-end',
    marginTop: 15,
    width: '92%',
    height: 0,
    // backgroundColor: 'red',
    // left: 60,
  },
  visaRule: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginTop: 25,
    width: '87%',
    left: 60,
  },
});

export default renderCheckout;
