import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from 'src/redux/reducer/reducer';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import Avatar from 'src/shared/components/imageComponent/Avatar';
import {comingSoonAlert} from 'src/utils/developmentFunctions';
import renderSwitchToPro from './SwitchPro.style';
import useSwitchPro from './useSwitchPro';
import {screenStackName} from 'src/navigation/constant/screenStackName';
import {rootStackName} from 'src/navigation/constant/rootStackName';
import {tabStackRouteName} from 'src/navigation/constant/tabNavRouteName';

const SwitchPro = ({route: {params}}: any) => {
  const {handleSwitch, navigation} = useSwitchPro();

  const userData = useAppSelector(state => state?.userReducer?.userDetails);
  const {type} = params;
  // const {userData} = useUserData();

  const {t} = useTranslation();

  return (
    <Container
      contentContainerStyle={{alignItems: 'center', paddingHorizontal: 20}}>
      <Avatar
        style={renderSwitchToPro.profileImg}
        source={
          userData.photoURL
            ? {
                uri: userData.photoURL,
              }
            : undefined
        }
      />
      <CustomText
        fontFamily="openSansBold"
        fontSize={18}
        style={renderSwitchToPro.heading}>
        {type == 'otpVerified'
          ? 'Congratulations ! You are now a Vita pro'
          : t('common:switchProAccount')}
      </CustomText>
      <CustomText
        fontFamily="arialRegular"
        fontSize={12}
        style={renderSwitchToPro.description}>
        {type == 'otpVerified'
          ? 'You have now a professional account, you have access to pro functionality and can accept payment'
          : t('common:switchProAccountInfo')}
      </CustomText>
      {type == 'otpVerified' && (
        <AnimatedLottieView
          autoPlay
          loop={true}
          source={require('src/assets/lottie/success.json')}
          style={{
            height: 150,
            width: 150,
            alignSelf: 'center',

            marginVertical: 40,
          }}
        />
      )}
      <CustomButton
        onPress={() =>
          type == 'otpVerified'
            ? navigation?.pop()
            : //  navigation?.navigate(rootStackName.BOTTOM_TABS, {
              //     screen: tabStackRouteName.HOME_STACK,
              //   })
              handleSwitch()
        }
        style={renderSwitchToPro.button}>
        {t('customWords:continue')}
      </CustomButton>
    </Container>
  );
};

export default SwitchPro;
