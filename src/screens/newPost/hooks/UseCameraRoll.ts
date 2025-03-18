// This code is the function to be used as custom hook for handling logics related to fetching images and there albums and there selection for uploading as new post.
import {
  Album,
  CameraRoll,
  GetPhotosParams,
} from '@react-native-camera-roll/camera-roll';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll/src/CameraRoll';
import {useDrawerStatus} from '@react-navigation/drawer';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
import {handleMediaPermission} from './UsePermission';
const useCameraRoll = () => {
  const {t} = useTranslation();
  const [selected, setSelected] = useState<PhotoIdentifier[]>([]);
  const [endCursor, setEndCursor] = useState<undefined | string>();
  const [images, setImages] = useState<PhotoIdentifier[]>([]);
  const [album, setAlbum] = useState<Album[] | undefined>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | undefined>();
  const [noMore, setNoMore] = useState<boolean>(false);
  const [hasOnceSelected, setHasOnceSelected] = useState<boolean>(false);
  const [hasPermission, setHasPremission] = useState<boolean>(false);
  const [playVideo, setPlayVideo] = useState<boolean>(true);
  const isDrawerOpen = useDrawerStatus();
  //The code below checks if the app has permission for using images
  async function savePicture() {
    let permit: boolean = await handleMediaPermission();
    setHasPremission(permit);
    if (Platform.OS === 'android' && !permit) {
      return;
    }
    handleAlbums();
  }
  //The code below  gets all albums and saves them in the album state
  const handleAlbums = () => {
    CameraRoll.getAlbums({assetType: 'All', albumType: 'Album'}).then(data => {
      setNoMore(false);
      setImages([]);
      let recent: Album = {count: 0, title: t('common:recent'), type: 'Album'};
      setAlbum(data.concat([recent]));
      setSelectedAlbum(recent);
    });
  };
  //The code below handles getting photos from a selected album
  const handlePhotoFetch = async () => {
    let Defaultparams: GetPhotosParams =
      selectedAlbum?.title == 'recent'
        ? {
            first: 20,
            after: endCursor ? endCursor : undefined,
            include: ['playableDuration', 'fileSize'],
            assetType: 'All',
          }
        : {
            first: 20,
            after: endCursor ? endCursor : undefined,
            assetType: 'All',
            groupTypes: 'Album',
            groupName: selectedAlbum?.title,
            include: ['playableDuration', 'fileSize'],
          };

    let result = await CameraRoll.getPhotos({
      ...Defaultparams,
    });
    result?.edges?.map(obj => {
      // obj.type!="image/png"&& obj.type!="image/jpeg" &&
    });
    try {
      if (!noMore) {
        setEndCursor(result?.page_info?.end_cursor);
        setImages(images.concat(result.edges));
        selected?.length == 0 &&
        !hasOnceSelected &&
        images[0]?.node?.image?.fileSize < 30000000 &&
        (images[0]?.node?.image?.playableDuration < 60 ||
          images[0]?.node?.image?.playableDuration == null)
          ? setSelected(
              selected?.concat([
                images?.length > 0 ? images[0] : result?.edges[0],
              ]),
            )
          : null;
        if (!result?.page_info?.has_next_page) {
          setNoMore(true);
        }
      }
      setHasOnceSelected(true);
    } catch {
      () => {
        //Error Loading Images
      };
    }
  };
  //The code below handles selection of single photo from a selected album
  const onPress = (item: PhotoIdentifier) => {
    if (
      item?.node?.image?.fileSize < 30000000 &&
      (item?.node?.image?.playableDuration < 60 ||
        item?.node?.image?.playableDuration == null)
    ) {
      if (selected?.includes(item)) {
        setSelected(selected?.filter(i => i !== item));
      } else {
        selected?.splice(0, selected?.length);
        selectImage(item);
      }
    } else {
      if (item?.node?.image?.fileSize > 30000000)
        showModal({type: 'info', message: t('message:sizeExceedWarning')});
      else showModal({type: 'info', message: t('message:timeExceedWarning')});
    }
  };
  //The code below handles selection of multiple photos from a selected album
  const onLongPress = (item: PhotoIdentifier) => {
    if (
      item?.node?.image?.fileSize < 30000000 &&
      (item?.node?.image?.playableDuration < 60 ||
        item?.node?.image?.playableDuration == null)
    ) {
      if (selected.length < 10) {
        if (selected.includes(item)) {
          setSelected(selected?.filter(i => i !== item));
        } else {
          selectImage(item);
        }
      } else {
        null;
      }
    } else {
      if (item?.node?.image?.fileSize > 30000000)
        showModal({type: 'info', message: t('message:sizeExceedWarning')});
      else showModal({type: 'info', message: t('message:timeExceedWarning')});
    }
  };
  // useFocusEffect(
  //     useCallback(
  //       () => {
  //         setIsFocused(true)
  //         return()=>{
  //             console.log('false')
  //             setIsFocused(false)
  //         }
  //       },[is])
  // )
  useEffect(() => {
    selected.splice(0, selected.length);
    setEndCursor(undefined);
    setHasOnceSelected(false);
    hasPermission && selectedAlbum ? handlePhotoFetch() : null;
  }, [selectedAlbum]);
  useEffect(() => {
    savePicture();
  }, [hasPermission]);
  const checkSize = (item: PhotoIdentifier) => {
    if (
      item?.node?.image?.fileSize < 30000000 &&
      (item?.node?.image?.playableDuration < 60 ||
        item.node.image?.playableDuration == null)
    ) {
      selectImage(item);
    } else {
      // if (item?.node?.image?.fileSize > 30000000)
      //     showModal({ type: 'info', message: t('message:sizeExceedWarning') })
      // else
      //     showModal({ type: 'info', message: t('message:timeExceedWarning') })
      null;
    }
  };
  useEffect(() => {
    if (selected?.length == 0 && !hasOnceSelected) {
      images?.length != 0 ? checkSize(images[0]) : null;
    }
  }, [images]);
  //The code below selects the images
  const selectImage = (media: PhotoIdentifier) => {
    setSelected(selected?.concat([media]));
  };
  const handleAlbumChange = (item: Album) => {
    setNoMore(false);
    setImages([]);
    setSelectedAlbum(item);
  };

  return {
    savePicture,
    handleAlbums,
    handlePhotoFetch,
    selected,
    images,
    album,
    selectedAlbum,
    selectImage,
    setSelectedAlbum,
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
  };
};
export default useCameraRoll;
