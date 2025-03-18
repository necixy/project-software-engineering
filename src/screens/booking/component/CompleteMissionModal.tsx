import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import CustomModal from 'src/shared/components/customModal/CustomModal';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import renderCancelModal from './CancelBookingModal.style';

const CompleteMissionModal = ({
  modalOpen,
  setModalOpen,
  successFn,
  disableCompleteBtn,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  successFn: any;
  disableCompleteBtn?: boolean;
}) => {
  const {t} = useTranslation();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  return (
    <CustomModal
      onClose={() => {
        setModalOpen(false);
      }}
      isOpen={modalOpen}
      modalContainer={[
        renderCancelModal.container,
        {width: SCREEN_WIDTH * 0.8, paddingVertical: 10},
      ]}>
      <>
        <View style={[renderCancelModal.box, {paddingHorizontal: 20}]}>
          <CustomText
            textAlign="center"
            fontFamily="arialRegular"
            fontSize={14}
            style={{margin: 25}}>
            {t('message:completeBookingMessage')}
          </CustomText>
          <CustomText
            textAlign="center"
            fontFamily="arialRegular"
            fontSize={14}
            marginHorizontal={10}
            color="grey"
            marginBottom={10}>
            {t('customWords:confirmServiceCompleted')}
          </CustomText>
        </View>
        <View style={{marginTop: 10, paddingTop: 2}}>
          <Pressable
            style={{
              borderTopWidth: 1.2,
              borderTopColor: colors?.lightGrey,
              width: SCREEN_WIDTH * 0.8,
              marginBottom: 10,
            }}
            // disabled={disableCompleteBtn}
            onPress={() => {
              setModalOpen(false);
              successFn();
              setDisableBtn(true);
            }}>
            <CustomText
              // hitSlop={10}
              // type="unstyled"
              marginTop={10}
              textAlign="center"
              style={{
                color: colors.primary,
                fontFamily: fonts.arialRegular,
              }}

              // textProps={{
              //   style: {color: colors.primary, fontFamily: fonts.arialRegular},
              // }}
              // style={renderCancelModal.cancelBox}
            >
              {t('customWords:completeTheMission')}
            </CustomText>
          </Pressable>
          <Pressable
            style={{
              borderTopWidth: 1.2,
              borderTopColor: colors?.lightGrey,
              width: SCREEN_WIDTH * 0.8,
            }}
            onPress={() => {
              setDisableBtn(true);
              setModalOpen(false);
              // setModalOpen(false);
            }}>
            <CustomText
              marginTop={10}
              textAlign="center"
              style={{
                color: colors.red,
                fontFamily: fonts.arialRegular,
              }}
              // hitSlop={10}
              // type="unstyled"
              // style={{color: colors.primary, fontFamily: fonts.arialRegular}}

              // textProps={{
              //   style: {color: colors.primary, fontFamily: fonts.arialRegular},
              // }}
              // style={renderCancelModal.cancelBox}
            >
              {t('common:back')}
            </CustomText>
          </Pressable>
          {/* <CustomButton
            hitSlop={10}
            type="unstyled"
            onPress={() => {
              setModalOpen(false);
            }}
            textProps={{
              style: {color: colors.red, fontFamily: fonts.arialRegular},
            }}
            style={renderCancelModal.backBox}>
            {t('common:back')}
          </CustomButton> */}
        </View>
      </>
    </CustomModal>
  );
};

export default CompleteMissionModal;
