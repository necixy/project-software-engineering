import firebase from '@react-native-firebase/app';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { IS_IOS } from 'src/constants/deviceInfo';
import CustomText from 'src/shared/components/customText/CustomText';
import { colors } from 'src/theme/colors';
import { fonts } from 'src/theme/fonts';
import { fontSizePixelRatio } from 'src/utils/developmentFunctions';

const CountryPicker = ({
  value,
  error,
  errorStyle,
  onChangeText,
  onChange,
}: any) => {
  const [query, setQuery] = useState(value);
  const [filteredCountry, setFilteredCountry] = useState([]);
  const [country, setCountry] = useState<any>([]);
  const { t } = useTranslation();
  useEffect(() => {
    // Fetch data from Firebase
    const fetchData = async () => {
      const snapshot = await firebase
        .database()
        .ref('CountryCode/')
        .once('value');
      const items = snapshot.val();
      const countryList = Object.values(items);
      setCountry(countryList);
    };

    fetchData();
  }, []);

  const findCountry = (query: any) => {
    if (query) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      setFilteredCountry(
        country.filter((country: any) => country.name.search(regex) >= 0),
      );
    } else {
      setFilteredCountry([]);
    }
  };
  return (
    <View style={styles.container}>
      <Autocomplete
        inputContainerStyle={{
          borderWidth: 1,
          borderTopWidth: 0,
          borderEndWidth: 0,
          borderStartWidth: 0,
          borderColor: colors.primary,
          backgroundColor: '#fff',
          paddingStart: Platform.OS === 'ios' ? 10 : 5,
        }}
        data={filteredCountry}
        defaultValue={query}
        placeholderTextColor={colors.grey}
        placeholder={t('customWords:country')}
        onChangeText={text => {
          setQuery(text);
          findCountry(text);
        }}
        renderTextInput={props => (
          <TextInput
            {...props}
            style={{
              marginBottom: Platform.OS == 'ios' ? 8 : -8,
              fontFamily: !IS_IOS ? fonts.openSansBold : fonts.openSansBold,
              fontSize: fontSizePixelRatio(15),
              color: '#808080',
            }} // Change this to your desired color
          />
        )}
        flatListProps={{
          keyExtractor: (item: any, idx) => item?.code?.toString(),
          // renderSeparator: () => <View style={styles.separator} />,
          renderItem: ({ item, index }: any) => {
            return (
              <Pressable
                key={index}
                // type="unstyled"
                style={{}}
                onPress={() => {
                  onChangeText(item?.code);
                  setQuery(item?.name);
                  setFilteredCountry([]);
                }}>
                <CustomText style={[styles.itemText]}>{item?.name}</CustomText>
              </Pressable>
            );
          },
        }}
      />
      <CustomText
        numberOfLines={2}
        fontFamily="openSansRegular"
        fontSize={12}
        style={[
          {
            // paddingBottom: 12,
            marginTop: 5,
            marginStart: 5,
            color: colors.red,
            // lineHeight: 15,
          },
        ]}>
        {error}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    // borderWidth: 2,
    marginTop: 25,
    backgroundColor: '#fff',
    zIndex: 9,
  },
  itemText: {
    fontSize: 14,
    margin: 5,
    color: 'black',
    paddingVertical: 2,
  },
  separator: {
    height: 2,
    backgroundColor: '#ccc',
  },
});

export default CountryPicker;
