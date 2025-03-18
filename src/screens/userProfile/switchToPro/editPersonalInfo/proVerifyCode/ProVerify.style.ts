import {StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {colors} from 'src/theme/colors';

export const otpStyle = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpInputContainer: {
    borderWidth: 2,
    marginEnd: 15,
    borderRadius: 6,
    borderColor: colors.lightGrey,
  },
  otpInput: {
    color: colors.defaultBlack,
    width: SCREEN_WIDTH / 6 - 30,
    textAlign: 'center',
    height: 50,
  },
});
