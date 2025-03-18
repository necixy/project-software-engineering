import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useState,
} from 'react';
import {
  ColorValue,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';

import {colors} from 'src/theme/colors';
import {Portal} from 'react-native-portalize';
import CustomButton from '../customButton/CustomButton';
import CustomText from '../customText/CustomText';
interface modalContainerType {
  isOpen?: boolean;
  children: ReactElement;
  modalProps?: ModalProps;
  actionElement?: ReactNode;
  onClose?: () => void;
  iconProps?: {
    style?: StyleProp<ViewStyle>;
    icon?: ReactNode;
  };
  actionElementContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: ColorValue;
  disabled?: boolean;
  actionElementOnPress?: () => void;
  modalContainer?: StyleProp<ViewStyle>;
}

const CustomModal = ({
  children,
  onClose,
  modalProps,
  iconProps,
  actionElement,
  isOpen,
  actionElementContainerStyle,
  backgroundColor = colors.secondary,
  disabled,
  actionElementOnPress,
  modalContainer,
}: modalContainerType) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);
  const onHandleOpen = () => {
    setIsVisible(true);
  };

  const onHandleClose = () => {
    setIsVisible(false);
  };
  return (
    <>
      {actionElement && (
        <Pressable
          onPress={actionElementOnPress ?? onHandleOpen}
          style={actionElementContainerStyle}
          disabled={disabled}>
          {actionElement}
        </Pressable>
      )}
      <Modal
        {...modalProps}
        isVisible={isVisible}
        onBackdropPress={onHandleClose}
        onModalHide={onClose}
        // coverScreen={false}
        // onDismiss={onClose}
      >
        <View
          style={[
            {
              backgroundColor: backgroundColor,
              borderRadius: 19,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 80,
            },
            modalContainer,
          ]}>
          {/* <CustomButton
            type="unstyled"
            onPress={onHandleClose}
            style={[styles.iconContainer, iconProps?.style]}>
            {iconProps?.icon ?? <CustomText>x</CustomText>}
          </CustomButton> */}
          {children &&
            cloneElement(children, {
              onHandleClose,
            })}
        </View>
      </Modal>
    </>
  );
};

export default CustomModal;
const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: colors?.primary,
    borderRadius: 15,
    height: 30,
    width: 30,
  },
});
