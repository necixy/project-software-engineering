import React from 'react';
import {View} from 'react-native';
import {globalStyles} from 'src/constants/globalStyles.style';
import {colors} from 'src/theme/colors';
import ProLocationSearch from './component/ProLocationSearch/ProLocationSearch';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {fonts} from 'src/theme/fonts';
import Container from 'src/shared/components/container/Container';

const EditProLocation = () => {
  return (
    <Container>
      <CustomHeader
        back
        leftIconColor="blue"
        fontFamily={fonts?.arialBold}
        fontSize={18}
        title="Location"
        titleStyle={{
          color: colors.defaultBlack,
        }}
        headerContainer={{
          backgroundColor: colors?.secondary,
          alignItems: 'center',
        }}
        rightIcon
      />

      <View style={[globalStyles.mt1, globalStyles.mb2]}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ProLocationSearch />
        </View>
      </View>
    </Container>
  );
};

export default EditProLocation;
