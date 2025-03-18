import {StyleSheet} from 'react-native';
import {fonts} from 'src/theme/fonts';

const requestStyle = StyleSheet.create({
  mainContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  userBoldDetails: {
    color: '#1a1a1a',
    fontFamily: fonts.openSansBold,
    flex: 1,
  },
});

export default requestStyle;
