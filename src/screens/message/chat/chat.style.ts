import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';

const chatStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  image: {
    height: 25,
    width: 25,
    borderRadius: 15,
    resizeMode: 'contain',
    // borderWidth: 1,
    marginBottom: 2,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    // paddingBottom: 3,
  },

  actionContainer: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.09,
    zIndex: 20,
    height: '100%',
    top: 3,
    width: 35,
  },
  composer: {
    // backgroundColor: '#EDF1F7',
    // borderRadius: 15,
    color: 'black',
    paddingRight: 40,
  },
  imageStyle: {
    // width: 250,
    // height: '100%',
    resizeMode: 'cover',
  },
  imageContainerStyle: {
    height: 200,
    width: '50%',
  },
});
export default chatStyle;
