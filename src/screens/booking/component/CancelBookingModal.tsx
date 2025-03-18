import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomModal from 'src/shared/components/customModal/CustomModal';
import CustomText from 'src/shared/components/customText/CustomText';
import renderCancelModal from './CancelBookingModal.style';

const CancelBookingModal = ({
  modalOpen,
  setModalOpen,
  onCancelPress,
  disableCancelBtn,
}: {
  modalOpen: boolean;
  disableCancelBtn?: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancelPress: () => void;
}) => {
  const {t} = useTranslation();
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  return (
    <CustomModal
      onClose={() => {
        setModalOpen(false);
      }}
      isOpen={modalOpen}
      modalContainer={renderCancelModal.container}>
      <View style={renderCancelModal.box}>
        <CustomText
          textAlign="center"
          fontFamily={'openSansBold'}
          fontSize={14}
          style={{margin: 30}}>
          {t('message:cancelBooking')}
        </CustomText>
        <View>
          <CustomButton
            disabled={disableCancelBtn}
            hitSlop={10}
            type="white"
            onPress={() => {
              setDisableBtn(true);
              onCancelPress && onCancelPress();
              // setModalOpen(false);
            }}
            textProps={{
              style: renderCancelModal.cancelText,
            }}
            style={renderCancelModal.cancelBox}>
            {t('common:cancelBooking')}
          </CustomButton>
          <CustomButton
            hitSlop={10}
            type="white"
            onPress={() => {
              setDisableBtn(true);
              setModalOpen(false);
            }}
            textProps={{
              style: renderCancelModal.backText,
            }}
            style={renderCancelModal.backBox}>
            {t('common:back')}
          </CustomButton>
        </View>
      </View>
    </CustomModal>
  );
};

export default CancelBookingModal;
