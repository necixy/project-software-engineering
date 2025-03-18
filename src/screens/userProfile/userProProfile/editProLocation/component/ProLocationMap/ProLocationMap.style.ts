import {StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';

const proMapStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top: 60,
  },
  pin: {
    backgroundColor: colors.secondary,
    bottom: SCREEN_HEIGHT * 0.1,
    left: SCREEN_WIDTH * 0.4,
    height: 45,
    width: 45,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default proMapStyle;
