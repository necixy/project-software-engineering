//This code selects the library album to fetch images from.
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import BottomSheetPicker from '../../../shared/components/customPicker/BottomSheetPicker';
import CustomText from '../../../shared/components/customText/CustomText';
import {colors} from '../../../theme/colors';
import Icon from '../../../assets/svg';
import {globalStyles} from '../../../constants/globalStyles.style';
import {TCustomImageSelectorHeaderProps} from '../@types/newPostTypes';
import {useTranslation} from 'react-i18next';

const CustomImageSelectorHeader = ({
  album,
  selectedAlbum,
  handleAlbumChange,
  hasPermission,
}: TCustomImageSelectorHeaderProps) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();
  return (
    <View style={{margin: 5}}>
      <BottomSheetPicker
        onPress={() => {
          hasPermission ? setOpen(!open) : null;
        }}
        adjustToContentHeight
        flatListProps={{
          data: album!,
          showsVerticalScrollIndicator: false,
          renderItem: ({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  handleAlbumChange(item);
                  setOpen(false);
                }}
                key={index}
                style={{
                  height: 40,
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  padding: 10,
                  alignItems: 'center',
                  margin: 5,
                }}>
                <CustomText fontFamily="arial" style={[globalStyles.flex]}>
                  {item.title}
                </CustomText>
                <Icon name="right" color={colors?.defaultBlack} />
              </TouchableOpacity>
            );
          },
        }}
        isOpen={open}
        actionElement={
          <View
            style={{
              height: 40,
              backgroundColor: colors?.secondary,
              flexDirection: 'row',
              padding: 5,
              alignItems: 'center',
            }}>
            <CustomText
              fontSize={20}
              fontFamily="arialRegular"
              color="defaultBlack">
              {selectedAlbum!?.title
                ? selectedAlbum?.title
                : t('common:recent')}
            </CustomText>
            <Icon
              name="down"
              color={colors?.defaultBlack}
              style={[globalStyles.flex, {marginLeft: 10}]}
            />
          </View>
        }></BottomSheetPicker>
    </View>
  );
};

export default CustomImageSelectorHeader;
