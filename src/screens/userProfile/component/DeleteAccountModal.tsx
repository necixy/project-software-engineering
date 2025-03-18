import {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {useAppDispatch, useAppSelector} from 'src/redux/reducer/reducer';
import renderMenuSwipe from 'src/screens/booking/bookingMenu/component/MenuSwipeList.style';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomModal from 'src/shared/components/customModal/CustomModal';
import CustomText from 'src/shared/components/customText/CustomText';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import {databaseRef} from 'src/utils/useFirebase/useFirebase';

const DeleteAccountModal = ({
  title,
  message,
  modalOpen,
  setModalOpen,
  deleteFunction,
}: {
  message?: string;
  title?: string;
  modalOpen: boolean;
  setModalOpen: any;
  deleteFunction?: () => void;
}) => {
  const {t} = useTranslation();
  // const {navigate, reset} = useNavigation();
  const dispatch = useAppDispatch();
  const [deleteReason, setDeleteReason] = useState<string>('');

  // const deleteUserAccount = async () => {
  //   const userId = firebase.auth().currentUser?.uid;
  //   console.log({userId});
  //   try {
  //     // remove user from users table in databaseRef
  //     await databaseRef(`users/${userId}`)?.once('value', async snapshot => {
  //       const snap = snapshot.exists() ? snapshot.val() : null;
  //       console.log({snap}, snap?.uid);
  //       if (snap?.uid) {
  //         // add user to deleted users table in databaseRef
  //         await databaseRef(`deletedUsers/${userId}`).set(snap);
  //         await databaseRef(`users/${userId}`).remove();

  //         dispatch({type: 'LOGOUT'});
  //       }
  //     });
  //     setModalOpen(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const deleteUserAccount = async () => {
    const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP;

    const userId = firebase.auth().currentUser?.uid;
    try {
      await databaseRef(`users/${userId}`).update({
        isDeleted: {
          createdAt: firebaseTimestamp,
          reasonDescription: deleteReason,
          status: 'pending',
        },
      });
      setModalOpen(false);
      showModal({
        message: t('message:accountUnderDeletion'),
      });
      dispatch({type: 'LOGOUT'});
    } catch (error) {
      console.error({error});
    }
  };

  return (
    <CustomModal
      onClose={() => {
        setModalOpen(false);
      }}
      isOpen={modalOpen}
      modalContainer={{
        height: SCREEN_WIDTH * 0.5,
        width: '70%',
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
          }}>
          <CustomText
            textAlign="center"
            fontFamily="openSansBold"
            fontSize={18}
            style={{
              marginHorizontal: '10%',
              marginVertical: '3%',
              alignSelf: 'center',
              marginBottom: 12,
            }}>
            {title ?? `${t('customWords:deleteAccount')} ?`}
            {/* {t('customWords:logOutMessage')} */}
          </CustomText>
          {/* <CustomInput
            placeHolderText={t('customWords:enterDeleteReason')}
            maxLength={100}
            multiline
            value={deleteReason}
            onChangeText={text => setDeleteReason(text)}
            textInputProps={{
              placeholderTextColor: '#808080',
              style: {
                fontFamily: fonts.arial,
                fontSize: 17,
                width: '100%',
                paddingVertical: 0,
              },
            }}
            containerStyle={{
              width: '100%',
              // paddingTop: 10,
              justifyContent: 'center',
              marginVertical: 10,
            }}
            inputBoxStyle={[
              renderMenuSwipe.boldDetails,
              {
                justifyContent: 'center',
              },
            ]}
            inputContainer={[
              renderMenuSwipe.input,
              {
                borderWidth: 1,
                backgroundColor: 'transparent',
                // marginBottom: 10,
                width: '86%',
                alignSelf: 'center',
              },
            ]}
          /> */}
          <CustomText
            fontFamily="openSansRegular"
            color="grey"
            style={{marginHorizontal: 10, textAlign: 'center'}}>
            {message ?? t('message:deleteAccount')}
          </CustomText>
        </View>
        <View
          style={{
            width: '100%',
            elevation: 1,
          }}>
          <CustomButton
            // disabled={deleteReason.length == 0}
            hitSlop={10}
            type="white"
            onPress={() => {
              deleteUserAccount();
            }}
            textProps={{
              style: {
                fontSize: fontSizePixelRatio(16),
                fontFamily: fonts?.openSansBold,
                color: colors?.red,
              },
            }}
            style={{
              backgroundColor: colors?.secondary,
              borderWidth: 1,
              borderColor: 'transparent',
              elevation: 1,
              shadowColor: colors?.grey,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 2,
              shadowRadius: 1,
              height: 30,
              marginBottom: 3,
              width: '99%',
              alignSelf: 'center',
            }}>
            {t('customWords:delete')}
          </CustomButton>
          <CustomButton
            hitSlop={10}
            type="white"
            onPress={() => {
              setModalOpen(false);
            }}
            textProps={{
              style: {
                fontFamily: fonts?.openSansBold,
                color: colors?.defaultBlack,
                fontSize: fontSizePixelRatio(16),
                lineHeight: 18,
              },
            }}
            style={{
              backgroundColor: colors?.secondary,
              borderWidth: 1,
              borderColor: 'transparent',
              elevation: 1,
              shadowColor: colors?.grey,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 1,
              shadowRadius: 1,
              height: 30,
              width: '99%',
              alignSelf: 'center',
            }}>
            {t('customWords:cancel')}
          </CustomButton>
        </View>
      </View>
    </CustomModal>
  );
};

export default DeleteAccountModal;
