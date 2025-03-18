import {Platform, StyleSheet} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';

const mapStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    backgroundColor: colors.secondary,
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? SCREEN_HEIGHT * 0.3 : SCREEN_HEIGHT * 0.24,
    right: SCREEN_WIDTH * 0.05,
    height: 45,
    width: 45,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtons: {
    backgroundColor: colors.secondary,
    bottom: Platform.OS == 'ios' ? SCREEN_HEIGHT * 0.88 : SCREEN_HEIGHT * 0.84,
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default mapStyle;
