import React, {useRef, useState} from 'react';
import {FlatList, Linking, View} from 'react-native';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import Accordion from './component/Accordian';
import useHelpSupport from './useHelpSupport';

const HelpSupport = () => {
  const {t, fAQData, contactData} = useHelpSupport();
  let isOpen = useRef(false);

  return (
    <Container>
      <FlatList
        scrollEnabled={false}
        data={fAQData}
        contentContainerStyle={{
          paddingHorizontal: 20,
          marginBottom: 0,
        }}
        ListHeaderComponent={
          <CustomText
            fontSize={17}
            fontFamily="openSansBold"
            color="grey"
            style={{marginVertical: 30}}>
            {t('customWords:FAQ')}
          </CustomText>
        }
        renderItem={({item}) => (
          <Accordion
            isOpen={isOpen.current}
            children={item?.ans}
            heading={item?.ques}
          />
        )}
        ListFooterComponentStyle={{marginTop: 10}}
        ListFooterComponent={
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{paddingHorizontal: 20}}
            ListHeaderComponent={
              <CustomText
                fontSize={17}
                fontFamily="openSansBold"
                color="grey"
                style={{marginVertical: 10}}>
                {t('customWords:contact')}
              </CustomText>
            }
            data={contactData}
            renderItem={({item}) => {
              return (
                <View>
                  <CustomText
                    fontFamily="openSansBold"
                    fontSize={14}
                    style={{marginVertical: 20}}>
                    {item?.heading}
                  </CustomText>

                  <CustomText
                    // onPress={() =>
                    //   Linking.openURL(`mailto:${item?.child?.toLowerCase()}`)
                    // }
                    isSelectable={true}
                    fontFamily="openSansRegular"
                    fontSize={14}>
                    {item?.child}
                  </CustomText>
                </View>
              );
            }}
            // keyExtractor={item => item?.id}
          />
        }
        keyExtractor={item => item?.id}
      />
    </Container>
  );
};

export default HelpSupport;
