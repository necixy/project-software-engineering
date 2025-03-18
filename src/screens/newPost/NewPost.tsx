// This is the new post component to select a new image for the post.
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {IS_IOS, SCREEN_WIDTH} from '../../constants/deviceInfo';
import {colors} from '../../theme/colors';
import Thumbnail from './components/Thumbnail';
import Icon from '../../assets/svg';
import CustomImageSelectorHeader from './components/CustomImageSelectorHeader';
import useCameraRoll from './hooks/UseCameraRoll';
import CustomText from '../../shared/components/customText/CustomText';
import FooterSpinner from './components/FooterSpinner';
import NewPostHeader from './components/NewPostHeader';
import {openSettings} from 'react-native-permissions';
import Empty from 'src/shared/components/placeholder/Empty';
import CustomImage from 'src/shared/components/customImage/CustomImage';
import Container from 'src/shared/components/container/Container';
import CustomHeader from 'src/shared/navigation/CustomHeader';
import Video from 'react-native-video';
import {useDrawerProgress, useDrawerStatus} from '@react-navigation/drawer';

//Functional component code for the New post screen (Handles fetching of images from the library and shows them on screen for further selection process).
const NewPost = () => {
  // The code below destructures functions and data from the custom hook useCameraRoll. It contains whole logic for the required functionality of this screen.
  const {
    handlePhotoFetch,
    selected,
    images,
    album,
    selectedAlbum,
    selectImage,
    handleAlbumChange,
    noMore,
    setSelected,
    onPress,
    onLongPress,
    hasPermission,
    t,
    playVideo,
    setPlayVideo,
    isDrawerOpen,
  } = useCameraRoll();

  return isDrawerOpen === 'closed' ? null : (
    <Container isScrollable={false} contentContainerStyle={{flex: 1}}>
      <NewPostHeader
        selected={selected}
        hasCancel={false}
        setSelected={setSelected}
        images={images}
      />

      {!hasPermission ? (
        <View
          style={[
            {
              marginTop: 0,
              width: SCREEN_WIDTH,
              aspectRatio: 1,
              marginBottom: 0,
              backgroundColor: colors?.lightGrey,
              justifyContent: 'center',
            },
          ]}>
          <CustomText
            color="grey"
            fontSize={25}
            style={{
              alignSelf: 'center',
              fontWeight: '700',
              textAlign: 'center',
              width: '70%',
              marginVertical: 10,
            }}>
            {t('customWords:postPhotoHeading')}
          </CustomText>
          <CustomText
            color="grey"
            fontSize={20}
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              width: '70%',
              marginVertical: 10,
            }}>
            {t('customWords:postPhotoText')}
          </CustomText>
          <TouchableOpacity
            onPress={() => {
              openSettings().catch(err =>
                console.warn('cannot open settings', err),
              );
            }}
            style={{alignSelf: 'center', width: '70%', marginVertical: 10}}>
            <CustomText
              fontSize={20}
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                width: '70%',
                marginVertical: 10,
              }}
              color="primary">
              {t('customWords:turnOn')}
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {images?.length > 0 && selected?.length !== 0 ? (
            selected[selected?.length - 1]?.node?.type?.includes('video') &&
            isDrawerOpen == 'open' ? (
              <TouchableOpacity
                onPress={() => {
                  setPlayVideo(!playVideo);
                }}>
                <Video
                  source={selected[selected?.length - 1]?.node?.image}
                  style={{
                    aspectRatio: 1,
                    width: SCREEN_WIDTH,
                  }}
                  paused={!playVideo}
                />
              </TouchableOpacity>
            ) : (
              <FastImage
                source={
                  selected.length !== 0
                    ? selected[selected?.length - 1]?.node?.image
                    : undefined
                }
                style={{
                  marginTop: 0,
                  width: '100%',
                  aspectRatio: 1,
                  marginBottom: 0,
                }}
                resizeMode="cover"
              />
            )
          ) : (
            <View
              style={[
                {
                  marginTop: 0,
                  width: SCREEN_WIDTH,
                  aspectRatio: 1,
                  marginBottom: 0,
                  backgroundColor: colors?.secondary,
                  justifyContent: 'center',
                },
              ]}>
              <Empty
                text={t('customWords:onImageSelected')}
                iconElement={
                  <CustomImage
                    source={require('src/assets/images/placeholder.png')}
                    style={{borderRadius: 0}}
                  />
                }
              />
            </View>
          )}
        </>
      )}

      <CustomImageSelectorHeader
        hasPermission={hasPermission}
        album={album}
        selectedAlbum={selectedAlbum}
        handleAlbumChange={handleAlbumChange}
      />
      {!hasPermission ? null : (
        <>
          {images.length > 0 ? (
            <FlatList
              data={images}
              numColumns={4}
              style={{flex: 1, backgroundColor: colors.secondary}}
              onEndReached={() => handlePhotoFetch()}
              onEndReachedThreshold={0.7}
              ListFooterComponent={<FooterSpinner noMore={noMore} />}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    delayLongPress={500}
                    onLongPress={() => onLongPress(item)}
                    onPress={() => onPress(item)}
                    activeOpacity={0.5}>
                    {selected?.includes(item) && (
                      <Icon
                        height={25}
                        width={25}
                        color={colors?.secondary}
                        style={{
                          position: 'absolute',
                          right: 5,
                          top: 5,
                          zIndex: 1,
                        }}
                        name="check"
                      />
                    )}
                    {IS_IOS ? (
                      <Thumbnail props={item} />
                    ) : (
                      <FastImage
                        key={index}
                        resizeMode="cover"
                        style={[
                          {aspectRatio: 1, height: SCREEN_WIDTH / 4, margin: 1},
                        ]}
                        source={{uri: item?.node?.image?.uri}}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Empty
                text={t('customWords:noImage')}
                iconElement={
                  <CustomImage
                    source={require('src/assets/images/placeholder.png')}
                    style={{borderRadius: 0}}
                  />
                }
              />

              {/* <CustomText style={{alignSelf: 'center'}}>
                {t('customWords:noImage')}
              </CustomText> */}
            </View>
          )}
        </>
      )}
    </Container>
  );
};

export default NewPost;
