import {StyleSheet} from 'react-native';
import {fonts} from 'src/theme/fonts';

const onHoldStyle = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },

  userBoldDetails: {
    color: '#1a1a1a',
    fontFamily: fonts.openSansBold,
    marginVertical: 10,
  },
});

export default onHoldStyle;
