import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {GetAppsResponse, getApps} from 'react-native-map-link';
import {Modalize, useModalize} from 'react-native-modalize';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';

import {Portal} from 'react-native-portalize';
import Icon from 'src/assets/svg';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {useTranslation} from 'react-i18next';

type TLocation = {
  isVisible: boolean;
  onClose: () => void;
  latitude: string | undefined;
  longitude: string | undefined;
};
export default function LocationMapOptions({
  isVisible,
  onClose,
  latitude,
  longitude,
}: TLocation) {
  const {t} = useTranslation();
  const [maps, setMaps] = useState<GetAppsResponse[]>([]);

  useEffect(() => {
    getApps({
      latitude: latitude,
      longitude: longitude,
    }).then(res => {
      setMaps(res);
    });
  }, []);
  const {close, open, ref} = useModalize();
  useEffect(() => {
    isVisible ? open() : close();
  }, [isVisible]);

  return (
    <Portal>
      <Modalize
        ref={ref}
        overlayStyle={{backgroundColor: 'transparent'}}
        adjustToContentHeight
        onClose={onClose}
        handlePosition="inside"
        modalStyle={{
          paddingBottom: 30,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#F2F1F6',
        }}>
        <View style={{padding: 20}}>
          <View
            style={{
              flexDirection: 'row',
              // backgroundColor: 'red',
              marginBottom: 15,
            }}>
            <CustomText
              textAlign="center"
              style={{flex: 1}}
              fontSize={fontSizePixelRatio(15)}>
              {t('customWords:chooseYourApplication')}
            </CustomText>
            <Pressable
              onPress={() => close()}
              style={{
                backgroundColor: colors.inputGrey,
                height: 25,
                width: 25,
                borderRadius: 25 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="cancel" height={20} width={22} fill={colors.grey} />
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: colors.secondary,
              paddingStart: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}>
            {maps?.map((item, index) => (
              <View key={item?.id} style={{paddingVertical: 10}}>
                <CustomText
                  onPress={item?.open}
                  // paddingBottom={10}
                  fontSize={fontSizePixelRatio(14)}
                  fontFamily="arialRegular">
                  {item?.name}
                </CustomText>
                {index !== maps?.length - 1 && (
                  <View
                    style={{
                      borderWidth: 0.8,
                      borderColor: colors.lightGrey,
                      marginTop: 16,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </Modalize>
    </Portal>
  );
}

// import {View, Text} from 'react-native';
// import React from 'react';

// const LocationMapOptions = () => {
//   return (
//     <View>
//       <Text>LocationMapOptions</Text>
//     </View>
//   );
// };

// export default LocationMapOptions;
