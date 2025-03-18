import {ActivityIndicator, View} from 'react-native';
import {colors} from 'src/theme/colors';
import CustomText from '../customText/CustomText';

function LoadingModal({text = 'Loading...'}: {text?: string}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
      }}>
      <ActivityIndicator color={colors.defaultBlack} />
      <CustomText
        color="defaultBlack"
        fontFamily="arial"
        style={{
          marginStart: 10,
          fontSize: 15,
        }}>
        {text}
      </CustomText>
    </View>
  );
}

export default LoadingModal;
