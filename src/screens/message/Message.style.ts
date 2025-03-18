import {Platform, StyleSheet} from 'react-native';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';

const renderMessage = StyleSheet.create({
  container: {backgroundColor: '#fff'},
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    // borderWidth: 1,
  },
  icon: {color: 'black'},
  title: {
    fontFamily: fonts.arial,
    flex: 1,
    marginLeft: 5,
    marginTop: Platform.OS == 'ios' ? 2 : 5,
    color: colors.defaultBlack,
  },
  titleCount: {fontFamily: fonts.arial, fontSize: 15},
});

export default renderMessage;
