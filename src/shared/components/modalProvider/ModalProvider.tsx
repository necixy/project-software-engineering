import AnimatedLottieView from 'lottie-react-native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../customButton/CustomButton';
import CustomText from '../customText/CustomText';
import {
  IModalProvider,
  loadingModalProps,
  modalHandlerType,
} from './@types/ModalProviderType';
import {colors} from 'src/theme/colors';
import LoadingModal from '../modalProvider/LoadingModal';
import Icon from 'react-native-vector-icons/Ionicons';
import renderCancelModal from 'src/screens/booking/component/CancelBookingModal.style';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

const ModalProvider = ({children}: IModalProvider) => {
  const [handler, setHandler] = React.useState<modalHandlerType>({
    message: '',
    isVisible: false,
    type: undefined,
    successBtnStyle: {},
    successTitleSTyle: {},
    iconVisible: false,
    title: 'info',
    cancelTitle: '',
  });
  const [loadingHandler, setLoadingHandler] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  const getLottieType = () => {
    let lottieType;
    switch (handler?.type) {
      case 'error':
        lottieType = require('src/assets/lottie/error.json');
        break;
      case 'success':
        lottieType = require('src/assets/lottie/success.json');
        break;
      case 'info':
        lottieType = require('src/assets/lottie/info.json');
        break;
      case 'login':
        lottieType = require('src/assets/lottie/info.json');
        break;
      default:
        lottieType = require('src/assets/lottie/info.json');
    }
    return lottieType;
  };

  useEffect(() => {
    showModal = ({
      message = '',
      successFn,
      cancelFn,
      showCancelButton = false,
      successTitle = '',
      type = 'info',
      successBtnStyle,
      successTitleSTyle,
      title,
      cancelTitle,
      closeIconVisible = false,
      iconVisible = false,
      secondMessage,
      containerStyle,
    }) => {
      setLoadingHandler(prev => {
        return {
          ...prev,
          isLoading: false,
        };
      });
      setHandler({
        isVisible: true,
        message,
        title,
        showCancelButton,
        successTitle,
        type,
        closeIconVisible,
        cancelTitle,
        iconVisible,
        secondMessage,
        ...(successFn && {successFn}),
        ...(cancelFn && {cancelFn}),
        ...(successBtnStyle && {successBtnStyle}),
        ...(successTitleSTyle && {successTitleSTyle}),
      });
      return null;
    };

    showLoadingSpinner = ({loadingText = 'Loading'}) => {
      setHandler(prev => {
        return {
          ...prev,
          isVisible: false,
        };
      });
      setLoadingHandler(prev => {
        return {
          ...prev,
          isLoading: true,
          loadingText,
        };
      });
      return null;
    };

    hideModal = () => {
      setHandler({...handler, isVisible: false});
      return null;
    };
    hideLoadingSpinner = () => {
      setLoadingHandler(prev => {
        return {
          ...prev,
          isLoading: false,
        };
      });
      return null;
    };
  }, [handler, loadingHandler]);

  return (
    <>
      <Modal
        style={[
          {
            width: SCREEN_WIDTH * 0.64,
            alignSelf: 'center',
          },
          handler?.containerStyle,
        ]}
        isVisible={handler?.isVisible || loadingHandler?.isLoading}>
        <View
          style={[
            {backgroundColor: '#FFF', borderRadius: 10},
            {
              shadowOffset: {
                height: 4,
                width: 4,
              },
              shadowColor: colors.defaultBlack,
              shadowRadius: 8,
              shadowOpacity: 0.2,
            },
            // renderCancelModal.container,
          ]}>
          {loadingHandler?.isLoading ? <LoadingModal /> : null}
          {handler?.closeIconVisible && (
            <CustomButton
              type="unstyled"
              onPress={() =>
                setHandler(prev => {
                  return {
                    ...prev,
                    isVisible: false,
                  };
                })
              }
              style={[
                {
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 10,
                  borderRadius: 15,
                  height: 30,
                  width: 30,
                },
              ]}>
              {<Icon name="close-circle-outline" />}
            </CustomButton>
          )}
          {handler?.isVisible ? (
            <>
              <View
                style={{
                  marginVertical: 5,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* {handler?.type ? (
                <AnimatedLottieView
                  autoPlay
                  loop={false}
                  source={getLottieType()}
                  style={{
                    height: 60,
                    width: 60,
                    alignSelf: 'center',
                    ...(handler?.type === 'login' && {
                      height: 70,
                      width: 70,
                    }),
                    marginBottom: 10,
                  }}
                />
              ) : null} */}

                {handler?.title ? (
                  <CustomText
                    fontSize={16}
                    textAlign="center"
                    color={
                      handler?.type === 'success' ? 'primary' : 'defaultBlack'
                    }
                    fontFamily="openSansBold"
                    // style={{marginBottom: 5}}
                  >
                    {handler?.title}
                  </CustomText>
                ) : null}
                {handler?.message ? (
                  <CustomText
                    textAlign="center"
                    color={handler?.title ? 'grey' : 'defaultBlack'}
                    fontFamily="openSansRegular"
                    // marginBottom={5}
                    style={{paddingVertical: 20}}>
                    {handler?.message}
                  </CustomText>
                ) : null}
                {handler?.secondMessage ? (
                  <CustomText
                    textAlign="center"
                    color={handler?.title ? 'grey' : 'defaultBlack'}
                    marginBottom={5}
                    style={{paddingVertical: 20}}>
                    {handler?.secondMessage}
                  </CustomText>
                ) : null}
              </View>
              <View
                style={{
                  borderRadius: 10,

                  // flexDirection: 'row',
                  // justifyContent: 'space-evenly',
                }}>
                {handler?.showCancelButton && (
                  <CustomButton
                    fontSize={14}
                    type="white"
                    style={{
                      height: 35,
                      // borderRadius: 10,
                      borderTopWidth: 1.2,
                      borderTopColor: colors?.lightGrey,
                      width: '100%',
                      paddingVertical: 0,
                      marginBottom: 2,
                    }}
                    textProps={{style: {color: colors?.red}}}
                    onPress={() => {
                      if (handler?.cancelFn) {
                        handler?.cancelFn();
                      }
                      setHandler(prev => {
                        return {
                          ...prev,
                          isVisible: false,
                        };
                      });
                    }}
                    alignSelf="center">
                    {handler?.cancelTitle || 'Cancel'}
                  </CustomButton>
                )}

                {!handler?.iconVisible ? (
                  <CustomButton
                    type="white"
                    fontSize={14}
                    style={{
                      height: 35,
                      borderTopWidth: 1.2,
                      // borderRadius: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,

                      borderTopColor: colors?.lightGrey,
                      paddingVertical: 0,
                      width: '100%',
                      ...(!handler?.successTitle
                        ? {paddingHorizontal: 35}
                        : {}),
                    }}
                    textProps={{
                      style: {color: colors?.primary, marginVertical: 0},
                    }}
                    alignSelf="center"
                    onPress={() => {
                      if (handler?.successFn) {
                        handler?.successFn();
                      }
                      setHandler(prev => {
                        return {
                          ...prev,
                          isVisible: false,
                        };
                      });
                    }}>
                    {handler?.successTitle || 'OK'}
                  </CustomButton>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
      </Modal>
      {children}
    </>
  );
};

export default ModalProvider;

export let showModal = ({}: Omit<modalHandlerType, 'isVisible'>) => null;
export let hideModal = () => null;
export let hideLoadingSpinner = () => null;
export let showLoadingSpinner = ({}: Omit<loadingModalProps, 'isLoading'>) =>
  null;
