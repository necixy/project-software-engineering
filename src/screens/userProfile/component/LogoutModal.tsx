import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {getDeviceId} from 'react-native-device-info';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {useAppDispatch} from 'src/redux/reducer/reducer';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomModal from 'src/shared/components/customModal/CustomModal';
import CustomText from 'src/shared/components/customText/CustomText';
import {
  hideLoadingSpinner,
  showLoadingSpinner,
  showModal,
} from 'src/shared/components/modalProvider/ModalProvider';

import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const LogoutModal = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: any;
}) => {
  const {t} = useTranslation();
  const {navigate, reset} = useNavigation();
  const dispatch = useAppDispatch();
  return (
    <CustomModal
      onClose={() => {
        setModalOpen(false);
      }}
      isOpen={modalOpen}
      modalContainer={{
        height: SCREEN_WIDTH * 0.38,
        width: '60%',
        alignSelf: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          justifyContent: 'space-between',
          borderRadius: 20,
          paddingVertical: 2,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <CustomText
            textAlign="center"
            fontFamily="arialBold"
            fontSize={14}
            style={{marginHorizontal: '10%', marginTop: '2%'}}>
            {t('customWords:logOutMessage')}
          </CustomText>
        </View>
        <View
          style={{
            width: '100%',
            elevation: 1,
          }}>
          <CustomButton
            hitSlop={10}
            type="unstyled"
            onPress={async () => {
              try {
                const deviceId = getDeviceId();
                deviceId &&
                  (await databaseRef(
                    `/fcmTokens/${auth()?.currentUser?.uid}/${deviceId}`,
                  ).remove());
                deviceId &&
                  (await databaseRef(`/deviceIndex/${deviceId}`).remove());

                await auth()
                  .signOut()
                  .then(async () => {
                    // if (modalOpen) {
                    //   setTimeout(() => setModalOpen(false), 100);
                    // }
                    setModalOpen(false);
                    setTimeout(() => dispatch({type: 'LOGOUT'}), 100);
                  })
                  .catch((err: any) => {
                    setModalOpen(false);
                    // if (modalOpen) {
                    //   setTimeout(() => setModalOpen(false), 100);
                    // }
                    console.log({err});
                    // if (err.code === 'auth/no-current-user') {
                    //   showModal({message: err.code, type: 'error'});
                    // }
                  });
              } catch (error) {
                console.error({error});
              }
            }}
            textProps={{
              style: {
                fontSize: fontSizePixelRatio(16),
                fontFamily: fonts?.arial,
                color: colors?.red,
              },
            }}
            style={{
              backgroundColor: colors?.secondary,
              // borderWidth: 1,
              // borderColor: 'transparent',
              borderTopWidth: 1,
              borderColor: colors?.inputGrey,
              // elevation: 1,
              // shadowColor: colors?.grey,
              // shadowOffset: {
              //   width: 0,
              //   height: 0,
              // },
              // shadowOpacity: 2,
              // shadowRadius: 1,
              height: 30,
              marginBottom: 3,
              // width: '99%',
              width: '100%',
              alignSelf: 'center',
            }}>
            {t('common:logOut')}
          </CustomButton>
          <CustomButton
            hitSlop={10}
            type="unstyled"
            onPress={() => {
              setModalOpen(false);
            }}
            textProps={{
              style: {
                fontFamily: fonts?.arial,
                color: colors?.primary,
                fontSize: fontSizePixelRatio(16),
                lineHeight: 18,
              },
            }}
            style={{
              backgroundColor: colors?.secondary,
              borderWidth: 1,
              borderColor: colors.inputGrey,
              // borderWidth: 1,
              // borderColor: 'transparent',
              // elevation: 1,
              // shadowColor: colors?.grey,
              // shadowOffset: {
              //   width: 1,
              //   height: 1,
              // },
              // shadowOpacity: 1,
              // shadowRadius: 1,
              width: '100%',
              height: 30,
              alignSelf: 'center',
            }}>
            {t('customWords:cancel')}
          </CustomButton>
        </View>
      </View>
    </CustomModal>
  );
};

export default LogoutModal;
