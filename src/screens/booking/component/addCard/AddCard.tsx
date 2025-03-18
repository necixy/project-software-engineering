import {CardForm, useConfirmSetupIntent} from '@stripe/stripe-react-native';
import {useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {Portal} from 'react-native-portalize';
import {
  createStripeSecretKey,
  getSavedCards,
} from 'src/api/stripe/stripeCustomerId/stripeCustomerId';
import Icon from 'src/assets/svg';

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {IS_IOS} from 'src/constants/deviceInfo';
import {useAppSelector} from 'src/redux/reducer/reducer';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {colors} from 'src/theme/colors';
import {fonts} from 'src/theme/fonts';
import {fontSizePixelRatio} from 'src/utils/developmentFunctions';
import renderCheckout from '../../bookingCheckout/BookingCheckout.style';

export default function AddCard({setSavedCards}: any) {
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const {confirmSetupIntent} = useConfirmSetupIntent();
  const {t} = useTranslation();

  const {uid} = useAppSelector((state: any) => state?.userReducer?.userDetails);
  const serverType = useAppSelector(
    state => state?.serverReducer?.baseUrl?.serverType,
  );

  const handlePress = async () => {
    try {
      Keyboard.dismiss();
      if (isCardComplete) {
        setLoading(true);

        const {clientSecret}: any = await createStripeSecretKey(
          uid,
          serverType,
        );

        const {error, setupIntent: setupIntentResult} =
          await confirmSetupIntent(clientSecret, {
            paymentMethodType: 'Card',
            paymentMethodData: {billingDetails: {name: ''}},
          });
        if (error) {
          setLoading(false);
          showModal({
            type: 'error',
            message: `Could not add card \n${error.message}`,
          });
          // setLoading(false);
        } else if (setupIntentResult) {
          // setLoading(false);

          showModal({
            type: 'success',
            message: t('message:cardAddedSuccessfully'),
            successFn: () => {},
          });
          const data = await getSavedCards(uid, serverType);
          setSavedCards(data);

          handleClosePress();
          // onClose();
          // goBack();
        } else {
          showModal({
            type: 'error',
            message: t('message:pleaseComplete'),
          });
        }
      }
    } catch (error) {
      console.error('Checking error in catch', error);
    } finally {
      setLoading(false);
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    Keyboard.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => {
          Keyboard.dismiss();
        }}
      />
    ),
    [],
  );
  const snapPoints = useMemo(() => ['60%'], []);

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  return (
    <>
      <CustomButton
        onPress={() => handleSnapPress(0)}
        type="grey"
        style={renderCheckout.greyButton}
        textProps={{
          style: renderCheckout.greyText,
        }}>
        {`+ ${t('customWords:addNewPaymentMethod')}`}
      </CustomButton>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}>
          <BottomSheetScrollView>
            <View style={{padding: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  marginVertical: 25,
                  alignItems: 'center',
                }}>
                <CustomText
                  style={{
                    color: colors.defaultBlack,
                    fontSize: fontSizePixelRatio(20),
                    fontFamily: !IS_IOS ? fonts?.arialBold : fonts.openSansBold,
                    flex: 1,
                  }}>
                  {t('customWords:addCard')}
                </CustomText>
                <CustomButton
                  type="unstyled"
                  onPress={handleClosePress}
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 13,
                    backgroundColor: colors.lightGrey,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                  }}>
                  <Icon name="cancel" height={20} width={20} />
                </CustomButton>
              </View>
              <CardForm
                placeholders={{
                  number: '16-Digit Number', // Placeholder for card number
                  expiration: 'MM/YY', // Placeholder for expiry date
                  cvc: 'CVC', // Placeholder for CVC
                  postalCode: 'Postal Code', // Optional: Placeholder for postal code
                }}
                // postalCodeEnabled={true}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                  borderColor: '#A9A9A9',
                  placeholderColor: '#A9A9A9',
                  borderRadius: 4,
                }}
                style={{
                  width: '100%',
                  height: 260,
                  marginVertical: 10,
                  backgroundColor: 'transparent',
                  borderColor: '#A9A9A9',
                  overflow: 'hidden',
                }}
                onFormComplete={cardDetails => {
                  setIsCardComplete(cardDetails?.complete);
                }}
              />

              <CustomButton
                alignSelf="center"
                isLoading={loading}
                type={isCardComplete ? 'blue' : 'grey'}
                style={{width: '100%', marginVertical: 20}}
                onPress={handlePress}>
                {t('common:save')}
              </CustomButton>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </Portal>
    </>
  );
}
