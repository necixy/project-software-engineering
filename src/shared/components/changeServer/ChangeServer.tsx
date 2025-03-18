import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'src/redux/reducer/reducer';
import {setBaseUrl} from 'src/redux/reducer/serverReducer';
import CustomButton from '../customButton/CustomButton';
import BottomSheetPicker from '../customPicker/BottomSheetPicker';
import CustomText from '../customText/CustomText';
interface IBaseUrlType {
  label: serverType;
  value: serverType;
  id: number;
}
const baseUrlType: IBaseUrlType[] = [
  {
    label: 'LIVE',
    value: 'LIVE',
    id: 1,
  },
  {
    label: 'STAGING',
    value: 'STAGING',
    id: 2,
  },
  {
    label: 'DEVELOPMENT',
    value: 'DEVELOPMENT',
    id: 3,
  },
];
const ChangeServer = () => {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const baseUrl = useAppSelector(state => state?.serverReducer?.baseUrl);
  const [selectedUrl, setSelectedUrl] = useState<{
    label: serverType;
    value: string;
  }>({
    label: baseUrl?.serverType,
    value: baseUrl?.serverType,
  });

  return (
    <>
      <CustomButton
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          opacity: 0,
          backgroundColor: 'blue',
        }}
        onPress={() => setCount(prev => prev + 1)}>
        Change Server
      </CustomButton>
      <BottomSheetPicker
        onClose={() => setCount(0)}
        pressableStyle={{
          height: 50,
          width: '20%',
          alignSelf: 'flex-end',
          top: 10,
          backgroundColor: 'black',
        }}
        isOpen={count === 5}>
        <View
          style={{
            flexDirection: 'column',
            marginBottom: 20,
          }}>
          <CustomText color="defaultBlack" fontFamily="arialRoundedBold">
            Login as
          </CustomText>
          <View
            style={{
              marginBottom: 3,
            }}>
            {baseUrlType?.map(item => {
              return (
                <View
                  key={item?.id?.toString()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginEnd: 20,
                    paddingVertical: 12,
                  }}>
                  <CustomButton
                    onPress={() => {
                      setSelectedUrl(item);
                      dispatch(
                        setBaseUrl({
                          serverType: item?.value,
                        }),
                      );
                    }}
                    type={
                      selectedUrl.value === item?.value ? 'blue' : 'unstyled'
                    }
                    alignSelf="stretch"
                    style={{width: '100%'}}>
                    <CustomText
                      color={'defaultBlack'}
                      fontFamily="arialRoundedBold"
                      fontSize={14}>
                      {item?.label}
                    </CustomText>
                  </CustomButton>
                </View>
              );
            })}
          </View>
        </View>
      </BottomSheetPicker>
    </>
  );
};

export default ChangeServer;
