import {View} from 'react-native';
import React from 'react';
import renderCheckout from '../../bookingCheckout/BookingCheckout.style';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from 'src/shared/components/customText/CustomText';
import CustomButton from 'src/shared/components/customButton/CustomButton';
// import {PaymentIcon} from 'react-native-payment-icons';

type TSavedCards = {
  index: number;
  item: any;
  brandIcons: string;
  length: number;
  isSelected: boolean;
  handleSelectedCard: any;
};
export default function SavedCardsList({
  index,
  item,
  brandIcons,
  length,
  isSelected,
  handleSelectedCard,
}: TSavedCards) {
  return (
    <View key={index}>
      <CustomButton
        type="unstyled"
        style={renderCheckout.applePay}
        onPress={handleSelectedCard}>
        {/* <Icon
          name={brandIcons?.[item?.card?.brand] ?? 'credit-card'}
          // style={renderCheckout.applePayIcon}
          size={20}
        /> */}
        {/* <PaymentIcon type={item?.card?.brand} /> */}
        <CustomText
          fontSize={16}
          flex={1}
          style={[renderCheckout.paymentText, {marginStart: 10}]}>
          {item?.card?.brand} ***** {item?.card?.last4}
        </CustomText>
        {isSelected && <Icon name="check" color={'lightgrey'} size={20} />}
      </CustomButton>
      {length != index && <View style={renderCheckout.rule} />}
    </View>
  );
}
