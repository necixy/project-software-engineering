import React, { ReactNode, cloneElement, useEffect } from 'react';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';
import { Modalize, ModalizeProps, useModalize } from 'react-native-modalize';
import CustomButton from '../customButton/CustomButton';
import {Portal,Host} from 'react-native-portalize'
export type menuItemType = {
  id: number;
  value: string | number;
  label: string;
};
interface IProps extends ModalizeProps {
  isOpen?: boolean;
  onClose?: () => void;
  actionElement?: ReactNode;
  pressableStyle?: StyleProp<ViewStyle>;
  children?: any;
  onPress?:()=>void;
}

const BottomSheetPicker = ({
  actionElement,
  isOpen,
  onClose,
  pressableStyle,
  children,
  onPress,
  ...props
}: IProps) => {
  const { close, open, ref } = useModalize();

  useEffect(() => {
    isOpen ? open() : close();
  }, [isOpen]);

  return (
    <>
      {actionElement ? (
        <CustomButton
          hitSlop={30}
          type='unstyled'
          onPress={() => {
            if(onPress){
              onPress()
            }else{
            open();
            Keyboard.dismiss();
            }
          }}
          style={[{ zIndex: 99 }, pressableStyle]}>
          {actionElement}
        </CustomButton>
      ) : null}

      <Portal>
        <Modalize
          disableScrollIfPossible={false}
          onClose={onClose}
          ref={ref}
          adjustToContentHeight
          handlePosition='inside'
          useNativeDriver={true}
          avoidKeyboardLikeIOS
          rootStyle={{
            backgroundColor: 'rgba(0, 46, 107, 0.3)',
          }}
          modalStyle={{
            padding: 20,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
            {...props}
          modalTopOffset={50}>
          {children &&
            cloneElement(children, {
              close: close,
            })}
        </Modalize>
      </Portal>
    </>
  );
};

export default BottomSheetPicker;