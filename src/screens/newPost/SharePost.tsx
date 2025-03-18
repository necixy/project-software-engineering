//This code renders the share post screen in the application
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import PaginationDot from 'react-native-insta-pagination-dots';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import Video from 'react-native-video';
import {SCREEN_WIDTH} from 'src/constants/deviceInfo';
import {globalStyles} from 'src/constants/globalStyles.style';
import Container from 'src/shared/components/container/Container';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import {colors} from 'src/theme/colors';
import useStackNavigation from 'src/utils/useStackNavigation/useStackNavigation';
import {TRoute} from './@types/newPostTypes';
import NewPostHeader from './components/NewPostHeader';
import usePost from './hooks/usePost';
import {useTranslation} from 'react-i18next';
import {fonts} from 'src/theme/fonts';
//This code below renders the image selected  by user on the new post screen and sharing logic for that image.
const SharePost = ({route}: {route: TRoute}) => {
  const {selected, setSelected, images} = route.params;
  const {goBack, dispatch} = useStackNavigation();
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const {handlePost, caption, setCaption, isLoading} = usePost(selected);
  const [playVideo, setPlayVideo] = useState(true);
  // const isFocused = useDrawerStatus()
  const {t} = useTranslation();
  return (
    <Container
      isScrollable
      contentContainerStyle={[
        globalStyles.flex,
        {backgroundColor: colors.secondary},
      ]}>
      <NewPostHeader back hasCancel hasNext={false} />
      <ScrollView style={[globalStyles.flex]}>
        <View>
          <Carousel
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            loop={false}
            vertical={false}
            onProgressChange={(_, absoluteProgress) => {
              setCurrentPage(Math.round(absoluteProgress));
            }}
            // pagingEnabled
            width={SCREEN_WIDTH}
            height={SCREEN_WIDTH}
            data={selected}
            scrollAnimationDuration={300}
            style={{
              backgroundColor: '#efefef',
              flex: 1,
            }}
            renderItem={({item, index}) => {
              return (
                <View style={{flex: 1}}>
                  <LinearGradient
                    colors={[
                      'rgba(45, 155, 240, 0.5)',
                      'rgba(255, 255, 255, 0.5)',
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                      ...StyleSheet.absoluteFillObject,
                    }}
                  />
                  {item?.node?.type?.includes('video') ? (
                    <TouchableOpacity
                      onPress={() => {
                        setPlayVideo(!playVideo);
                      }}>
                      <Video
                        source={item?.node?.image}
                        style={{
                          aspectRatio: 1,
                          width: SCREEN_WIDTH,
                        }}
                        paused={!playVideo}
                      />
                    </TouchableOpacity>
                  ) : (
                    <FastImage
                      key={index}
                      resizeMode="cover"
                      source={
                        item
                          ? {uri: item?.node?.image?.uri}
                          : require('../../assets/images/userProfile.png')
                      }
                      style={{
                        width: SCREEN_WIDTH,
                        aspectRatio: 1,
                        alignSelf: 'center',
                      }}
                    />
                  )}
                </View>
              );
            }}
          />

          {selected.length > 1 && (
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
                position: 'absolute',
                bottom: -20,
                alignSelf: 'center',
              }}>
              <PaginationDot
                curPage={currentPage}
                maxPage={selected.length}
                activeDotColor={colors.primary}
                sizeRatio={1.1}
              />
            </View>
          )}
        </View>
        <CustomInput
          textInputProps={{textAlignVertical: 'top'}}
          value={caption}
          maxLength={100}
          onChangeText={txt => {
            setCaption(txt);
          }}
          inputContainer={{
            borderWidth: 0,
            borderTopWidth: 1,
            marginTop: 20,
            borderRadius: 0,
            height: 150,
            borderBottomWidth: 1,
            marginBottom: 50,
          }}
          multiline
          placeHolderText="Write a caption..."
        />
        <CustomButton
          isLoading={isLoading}
          onPress={() => {
            handlePost();
            // console.log(selected,'im')
            // setSelected([images[0].node.image])
            // goBack();
            // dispatch(DrawerActions.closeDrawer());
          }}
          textProps={{style: {fontFamily: fonts?.openSansBold, fontSize: 17}}}
          style={{
            alignSelf: 'center',
            width: '70%',
            height: 40,
            borderRadius: 10,
            marginBottom: 10,
          }}>
          {t('customWords:share')}
        </CustomButton>
      </ScrollView>
    </Container>
  );
};

export default SharePost;
