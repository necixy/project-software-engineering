import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomText from 'src/shared/components/customText/CustomText';
import {colors} from 'src/theme/colors';
import useLanguagePicker from './LanguagePicker';
import SwitchListItem from './SwitchListItem';

interface TUserRenderItem {
  item: TItem;
  onPressHandle?: () => void;
  subList?: any;
  showSubList?: boolean;
  // setShowSubList?: Dispatch<SetStateAction<boolean>>;
  setShowSubList?: (prev: boolean) => void;
}
interface TItem {
  id?: number;
  icon?: ReactNode;
  name?: string;
  navigation?: ReactNode | null;
  subList?: any;
}

const UserRenderItem = ({
  item,
  onPressHandle,
  showSubList,
  setShowSubList,
}: TUserRenderItem) => {
  // const dispatch = useAppDispatch();
  // const getLang = async () => {
  //   let language = await AsyncStorage.getItem('user-language');
  //   if (language === 'fr') {
  //     dispatch(updateUserLanguage('fr'));
  //     setIsEnabled(true);
  //   } else {
  //     dispatch(updateUserLanguage('en'));
  //   }
  // };

  // useEffect(() => {
  //   getLang();
  // }, []);

  // const toggleSwitch = async () => {
  //   try {
  //     if (isEnabled) {
  //       await i18n.changeLanguage('en');
  //       dispatch(updateUserLanguage('en'))
  //       AsyncStorage.setItem('user-language', 'en');
  //       navigate(rootStackName.HOME_DRAWER)
  //     } else {
  //       await i18n.changeLanguage('fr');
  //       dispatch(updateUserLanguage('fr'))
  //       AsyncStorage.setItem('user-language', 'fr');
  //       navigate(rootStackName.HOME_DRAWER)
  //     }
  //     // setTimeout(() => RNRestart.Restart(), 0);
  //   } catch (error) {
  //     console.error('handleLanguageChange error', error);
  //   }
  // };
  const {t} = useTranslation();
  // const [showSubList, setShowSubList] = useState(false);

  const {navigate, toggleSwitch, isEnabled, setIsEnabled} = useLanguagePicker();

  return (
    <>
      <CustomButton
        key={item?.id}
        hitSlop={10}
        type="unstyled"
        onPress={() => {
          item?.subList && setShowSubList && setShowSubList(prev => !prev);
          onPressHandle && onPressHandle();
          if (item?.navigation) {
            navigate(item?.navigation);
          }
        }}
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginHorizontal: 20,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{marginEnd: 10}}>{item?.icon}</View>
          <CustomText
            fontSize={14}
            fontFamily="arial"
            style={{lineHeight: 20}}>
            {item?.name}
          </CustomText>
        </View>
        <Entypo
          name="chevron-thin-right"
          size={20}
          color={colors?.defaultBlack}
        />
      </CustomButton>

      {item?.subList &&
        showSubList &&
        item?.subList?.map((item: {id: number; name: string}) => {
          return (
            <SwitchListItem
              key={item?.id}
              item={item}
              onPressHandle={toggleSwitch}
              toggleSwitch={toggleSwitch}
              isEnabled={isEnabled}
              containerStyle={{paddingStart: 30}}
            />
          );
        })}
    </>
  );
};

export default UserRenderItem;
