import {StyleSheet} from 'react-native';
import {fonts} from 'src/theme/fonts';

const renderMenu = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  heading: {
    fontFamily: fonts.openSansBold,
    color: '#808080',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
});

export default renderMenu;
