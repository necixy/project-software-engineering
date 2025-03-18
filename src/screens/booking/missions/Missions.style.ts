import {StyleSheet} from 'react-native';
import {fonts} from 'src/theme/fonts';

const missionStyle = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  listHeader: {
    color: '#1a1a1a',
    fontFamily: fonts.openSansBold,
    paddingLeft: 10,
    paddingTop: 15,
  },

  userBoldDetails: {
    color: '#1a1a1a',
    fontFamily: fonts.robotoBold,
    flex: 1,
  },
});

export default missionStyle;
