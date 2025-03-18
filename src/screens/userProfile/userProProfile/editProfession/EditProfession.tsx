import React from 'react';
import {FlatList, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {globalStyles} from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import LoadingSpinner from 'src/shared/components/placeholder/LoadingSpinner';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import useEditProfession from './useEditProfession';

const EditProfession = (professionVal: any) => {
  const professionValue = professionVal?.route?.params?.professionVal;

  const {professions, triggerEvent, isProfessionLoading} = useEditProfession();

  const {goBack} = useStackNavigation();

  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{backgroundColor: colors.secondary}}>
      <CustomHeader
        back
        leftIconColor="blue"
        leftIconStyle={{width: '10%'}}
        fontFamily={fonts?.arialBold}
        fontSize={18}
        lineHeight={25}
        title="Category"
        titleStyle={{
          color: colors.defaultBlack,
        }}
        rightIcon
        headerContainer={{
          alignItems: 'center',
        }}
      />

      {isProfessionLoading ? (
        <LoadingSpinner textDisable={true} />
      ) : (
        <FlatList
          data={professions}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={[
                  globalStyles.mv2,
                  {borderBottomWidth: 2, borderColor: colors.lightGrey},
                ]}
              />
            );
          }}
          style={{flex: 0.9}}
          contentContainerStyle={{
            paddingVertical: 20,
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: colors.lightGrey,
          }}
          renderItem={({item}) => {
            return (
              <CustomButton
                type="unstyled"
                onPress={() => {
                  goBack();
                  triggerEvent(item);
                }}
                style={[
                  globalStyles.flexRow,
                  globalStyles.ph2,
                  globalStyles.alignCenter,
                ]}>
                <CustomText
                  fontFamily="openSansRegular"
                  fontSize={11}
                  style={[globalStyles.flex]}
                  color={professionValue === item?'primary':'defaultBlack'}>
                  {item}
                </CustomText>
                {/* {professionValue === item && (
                  <Entypo name="check" size={20} color={colors.primary} />
                )} */}
              </CustomButton>
            );
          }}
        />
      )}
    </Container>
  );
};

export default EditProfession;
