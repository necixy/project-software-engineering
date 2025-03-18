import React, {Dispatch} from 'react';
import CustomText from 'src/shared/components/customText/CustomText';
import {useTranslation} from 'react-i18next';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {colors} from 'src/theme/colors';
import useDeleteModal from './useDeleteModal';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {View} from 'react-native';
import DeleteAccountModal from 'src/screens/userProfile/component/DeleteAccountModal';
import CustomModalComponent from 'src/shared/components/customModalComponent/CustomModalComponent';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import Entypo from 'react-native-vector-icons/Entypo';

const DeleteModalComponent = ({
  screen,
  setDeleteModalVisible,
  currentUser,
  createdBy,
  postId,
  media,
  navigation,
}: {
  screen: 'home' | 'viewPost';
  setDeleteModalVisible: Dispatch<React.SetStateAction<boolean>>;
  currentUser: String;
  createdBy: String;
  postId: String;
  media: {type: string; uri: string}[];
  navigation: any;
}) => {
  const height = useSharedValue(0);
  const {
    deletePost,
    isLoading,
    reportPost,
    reportPressed,
    setReportPressed,
    reportReason,
    setReportReason,
    deleteModal,
    setDeleteModal,
    reportModal,
    setReportModal,
    reportSuccessModal,
    setReportSuccessModal,
  } = useDeleteModal({
    screen,
    navigation,
    currentUser,
    postId,
    createdBy,
    setDeleteModalVisible,
    media,
  });
  const {t} = useTranslation();
  if (currentUser == createdBy) {
    return (
      <>
        <CustomButton
          isLoading={isLoading}
          onPress={() => {
            // setDeleteModalVisible(false);
            setDeleteModal(true);
          }}
          type="unstyled"
          style={{
            alignItems: 'flex-start',
            paddingVertical: 12,
            backgroundColor: colors.inputBorder,
            width: SCREEN_WIDTH - 50,
            alignSelf: 'center',
            borderRadius: 10,
            marginVertical: 5,
            paddingHorizontal: 10,
            marginBottom: 24,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <FontAwesome
              name="trash"
              color={colors?.red}
              style={{marginEnd: 5, marginStart: 3}}
              size={21}
            />
            <CustomText fontFamily="openSansRegular" fontSize={17} color="red">
              {t('customWords:deletePost')}
            </CustomText>
          </View>
        </CustomButton>
        {deleteModal ? (
          <CustomModalComponent
            title={`${t('customWords:deletePost')}?`}
            message={t('message:deletePost')}
            setModalOpen={setDeleteModal}
            modalOpen={deleteModal}
            onPress={deletePost}
          />
        ) : reportSuccessModal ? (
          <>
            <CustomModalComponent
              title={`${t('customWords:deletedSuccessfully')}!`}
              message={t('message:deleteSuccess')}
              setModalOpen={setReportSuccessModal}
              modalOpen={reportSuccessModal}
              successBtnTitle={t('customWords:ok')}
              onPress={() => {
                setReportSuccessModal(false);
                setDeleteModalVisible(false);
              }}
              showCancelBtn={false}
              successBtnColor={colors?.primary}
            />
          </>
        ) : null}
      </>
    );
  } else {
    return (
      <>
        <Animated.View style={{height, marginTop: 15}}>
          {reportPressed ? (
            <Animated.View style={{height}}>
              <CustomText>{t('customWords:reportReasons')}</CustomText>
              <CustomInput
                value={reportReason}
                onChangeText={text => setReportReason(text)}
                multiline
                inputContainer={{height: 200, marginTop: 10}}
              />
            </Animated.View>
          ) : null}
        </Animated.View>
        <CustomButton
          isLoading={isLoading}
          onPress={() => {
            // setDeleteModalVisible(false);
            setReportModal(true);
            // if (!reportPressed) {
            //   // setReportPressed(true);
            //   // height.value = withSpring(200);
            // } else {
            //   // reportPost();
            // }
          }}
          type="unstyled"
          style={{
            // alignItems: 'center',
            height: 50,
            // backgroundColor: colors.lightGrey,
            width: SCREEN_WIDTH - 50,
            alignSelf: 'center',
            // borderRadius: 15,
            // marginVertical: 5,
            //
            alignItems: 'flex-start',
            paddingVertical: 12,
            backgroundColor: colors.inputBorder,
            // alignSelf: 'center',
            borderRadius: 10,
            // marginVertical: 5,
            paddingHorizontal: 10,
            marginBottom: 30,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <Entypo
              name="clipboard"
              color={colors?.red}
              style={{marginEnd: 5, marginStart: 3}}
              size={21}
            />
            <CustomText fontFamily="openSansRegular" fontSize={17} color="red">
              {t('customWords:reportPost')}
            </CustomText>
          </View>
        </CustomButton>
        {reportModal ? (
          <CustomModalComponent
            title={`${t('customWords:reportPost')}?`}
            message={t('message:reportPostMsg')}
            setModalOpen={setReportModal}
            modalOpen={reportModal}
            successBtnTitle={t('customWords:report')}
            onPress={reportPost}
          />
        ) : reportSuccessModal ? (
          <CustomModalComponent
            title={`${t('customWords:thankyou')}!`}
            message={t('message:reportSuccess')}
            setModalOpen={setReportSuccessModal}
            modalOpen={reportSuccessModal}
            successBtnTitle={t('customWords:ok')}
            onPress={() => {
              setReportSuccessModal(false);
              setDeleteModalVisible(false);
            }}
            showCancelBtn={false}
            successBtnColor={colors?.primary}
          />
        ) : null}
      </>
    );
  }
};

export default DeleteModalComponent;
