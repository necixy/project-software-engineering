import {View, TouchableOpacity, Pressable, Keyboard} from 'react-native';
import React from 'react';
import {globalStyles} from 'src/constants/globalStyles.style';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import CustomText from 'src/shared/components/customText/CustomText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAppDispatch} from 'src/redux/reducer/reducer';
import {
  setApplyFilter,
  setInitial,
  updateAvailability,
  updateCategory,
  updateGrade,
  updateLocation,
  updatePrice,
  updateSortBy,
} from 'src/redux/reducer/searchFilterReducer';
import {t} from 'i18next';

const SearchFilterHeader = ({
  name,
  hasBack = false,
  hasBottomBorder = false,
  setAddressArray = undefined,
  setSearch = undefined,
  onBackPress,
  rightSideButton = true,
}: {
  name: string;
  hasBack?: boolean;
  hasBottomBorder?: boolean;
  setAddressArray?: any;
  setSearch?: any;
  rightIconName?: string;
  onBackPress?: any;
  rightSideButton?: boolean;
}) => {
  const {goBack} = useStackNavigation();
  const dispatch = useAppDispatch();
  return (
    <View
      style={[
        globalStyles.flexRow,
        {
          borderBottomWidth: hasBottomBorder ? 1 : 0,
          borderColor: colors.lightGrey,
          marginVertical: hasBottomBorder ? 0 : 10,
          paddingVertical: hasBottomBorder ? 10 : 0,
        },
      ]}>
      {hasBack ? (
        <TouchableOpacity
          style={[{left: 20, position: 'absolute'}]}
          onPress={() => {
            onBackPress && onBackPress();
            Keyboard.dismiss();
            goBack();
          }}>
          <CustomText color={'primary'} fontSize={12} fontFamily="openSansBold">
            {t('common:back')}
          </CustomText>
        </TouchableOpacity>
      ) : (
        <Pressable
          style={[{left: 20, position: 'absolute'}]}
          hitSlop={{left: 10, right: 10}}
          onPress={() => {
            goBack();
          }}>
          <FontAwesome5
            onPress={() => {
              goBack();
            }}
            color={colors.primary}
            size={15}
            name="chevron-left"
          />
        </Pressable>
      )}
      <CustomText color="defaultBlack" fontFamily="openSansBold">
        {name}
      </CustomText>

      {rightSideButton && (
        <TouchableOpacity
          onPress={() => {
            if (setAddressArray != undefined) {
              setAddressArray([]);
            }
            if (setSearch != undefined) {
              setSearch({
                term: '',
                fetchPredictions: false,
              });
            }
            if (name == 'Filter') {
              dispatch(setInitial());
              dispatch(setApplyFilter(false));
              goBack();
            } else if (name == 'Sort by') {
              dispatch(updateSortBy('Relevance'));
              goBack();
            } else if (name == 'Category') {
              dispatch(updateCategory(['All']));
              goBack();
            } else if (name == 'Location') {
              dispatch(updateLocation('All'));
              goBack();
            } else if (name == 'Grade') {
              dispatch(updateGrade('All'));
              goBack();
            } else if (name == 'Price') {
              dispatch(updatePrice('All'));
              goBack();
            } else if (name == 'Availability') {
              dispatch(updateAvailability('All'));
              goBack();
            }
          }}
          style={{position: 'absolute', right: 20}}>
          <CustomText color="primary" fontSize={14} fontFamily="openSansBold">
            {t('customWords:deleteAll')}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchFilterHeader;
