import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import {getCurrencySymbol} from 'src/utils/getCurrencySymbol';

function TransactionRow({item}: any) {
  const {t} = useTranslation();
  console.log(JSON.stringify(item, 2, null));

  return (
    <View
      // type="unstyled"
      style={{
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: colors?.inputGrey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: SCREEN_WIDTH * 0.56,
        }}>
        <View
          style={{
            alignItems: 'center',
            marginEnd: 20,
            width: SCREEN_WIDTH * 0.1,
          }}>
          <CustomText
            fontFamily={'openSansBold'}
            fontSize={17}
            style={{paddingBottom: 0, marginBottom: 0, lineHeight: 18}}
            color={
              item?.object === 'payout'
                ? 'green'
                : item?.amount_refunded
                ? 'grey'
                : 'primary'
            }>
            {item?.lastUpdateAt
              ? moment.unix(item?.lastUpdateAt).utc().format('DD')
              : 'NA'}
          </CustomText>
          <CustomText
            fontFamily="openSansRegular"
            fontSize={14}
            style={{paddingBottom: 0, marginBottom: 0, lineHeight: 16}}
            color={
              item?.object === 'payout'
                ? 'green'
                : item?.amount_refunded
                ? 'grey'
                : 'primary'
            }>
            {item?.lastUpdateAt
              ? moment.unix(item?.lastUpdateAt).utc().format('ddd')
              : 'NA'}
          </CustomText>
        </View>

        <CustomText
          color={
            item?.object === 'payout'
              ? 'green'
              : item?.amount_refunded
              ? 'grey'
              : 'primary'
          }
          numberOfLines={2}
          style={{
            width: SCREEN_WIDTH * 0.4,
          }}>
          {item?.object === 'payout'
            ? `Transfer To Bank ${
                item?.status === 'in_transit' ? '(In Progress)' : ''
              }`
            : item?.paymentUserName}
        </CustomText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginEnd: 2,
          paddingHorizontal: 2,
        }}>
        {item?.refunded && (
          <CustomText
            style={{marginEnd: 5, color: '#ae0c00'}}
            fontSize={14}
            fontFamily="openSansRegular">
            {t('common:canceled')}
          </CustomText>
        )}

        <CustomText
          fontSize={17}
          fontFamily="openSansRegular"
          style={{
            textDecorationLine: item?.amount_refunded ? 'line-through' : 'none',
            width: SCREEN_WIDTH * 0.17,
          }}
          color={
            item?.object === 'payout'
              ? 'green'
              : item?.refunded
              ? 'grey'
              : 'primary'
          }>
          {`${'+'} ${getCurrencySymbol(item?.currency)}${
            item?.refunded
              ? item?.application_fee_amount
                ? (item?.amount_refunded - item?.application_fee_amount) / 100
                : item?.amount_refunded / 100
              : item?.application_fee_amount
              ? (item?.amount - item?.application_fee_amount) / 100
              : item?.amount / 100
          }`}
        </CustomText>
      </View>
    </View>
  );
}

export default TransactionRow;
