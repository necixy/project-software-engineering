import {StyleSheet} from 'react-native';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';

const renderSwipeList = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    // marginBottom: 10,
    alignItems: 'center',
    // borderWidth: 1,
    paddingVertical: 5,
    height: 72,
  },
  userImg: {
    marginLeft: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  userTitle: {fontFamily: fonts.openSansBold},
  userDescription: {
    fontFamily: fonts.arial,
    color: '#808080',
  },
  border: {
    flex: 1,
    // borderBottomWidth: 1,
    // borderBottomColor: '#e6e6e6',
    justifyContent: 'flex-start',
    paddingTop: 4,
    paddingBottom: 15,
    alignItems: 'flex-start',
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // height: '100%',
    paddingBottom: 3,
    height: 72,
  },
  icon: {
    // flex: 1,
    width: 48,
    height: '100%',
    // paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default renderSwipeList;
