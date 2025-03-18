import React from 'react';
import {FlatList, View} from 'react-native';
import Container from 'src/shared/components/container/Container';
import CustomText from 'src/shared/components/customText/CustomText';
import {useAboutVita} from './useAboutVita';

const AboutVita = () => {
  const {data, t} = useAboutVita();

  const renderAboutVitaItem = ({
    item,
  }: {
    item: {
      id: number;
      subtitle: string;
      title: string;
      text: string | string[];
      type: string;
    };
  }) => {
    return (
      <View>
        {item?.type == 'section' || item?.type == 'bulletedSection' ? (
          <>
            {item?.title && (
              <CustomText
                fontFamily="openSansBold"
                fontSize={16}
                style={{marginVertical: 10}}>
                {item?.title}
              </CustomText>
            )}
            {typeof item?.text == 'string' ? (
              <CustomText
                fontFamily="openSansRegular"
                fontSize={15}
                style={{marginVertical: 10}}>
                {item?.text}
              </CustomText>
            ) : typeof item?.text?.[0] == 'string' ? (
              item?.text?.map(val => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginVertical: 5,
                    }}>
                    <CustomText
                      style={{marginVertical: 2.5, fontWeight: '900'}}>
                      {item?.type == 'bulletedSection' && ` \u2022  `}
                    </CustomText>
                    <CustomText fontFamily="openSansRegular" fontSize={15}>
                      {val}
                    </CustomText>
                  </View>
                );
              })
            ) : null}
          </>
        ) : item?.type == 'subSections' ? (
          <CustomText
            fontSize={15}
            fontFamily="openSansRegular"
            color="defaultBlack"
            style={{marginVertical: 5}}>
            <CustomText fontFamily="openSansBold">{`${item?.subtitle}  `}</CustomText>
            {item?.text}
          </CustomText>
        ) : (
          <></>
        )}
      </View>
    );
  };
  return (
    <Container
      isScrollable={false}
      contentContainerStyle={{paddingHorizontal: 20}}>
      <FlatList
        data={data}
        ListHeaderComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CustomText fontFamily="fredokaBold" fontSize={100} color="primary">
              {t('common:vita')}
            </CustomText>
            <CustomText fontFamily="arialBold" fontSize={15} color="grey">
              {t('common:vitaInc')}
            </CustomText>
          </View>
        }
        contentContainerStyle={{paddingHorizontal: 20}}
        ListFooterComponent={
          <View style={{height: 130, backgroundColor: 'transparent'}} />
        }
        renderItem={renderAboutVitaItem}
        keyExtractor={item => item?.id}
      />
    </Container>
  );
};

export default AboutVita;
