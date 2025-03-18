import {Namespace, TFunction} from 'i18next';
import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';
import {IS_IOS} from 'src/constants/deviceInfo';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';
// permission for media files access
const handleMediaPermission = async () => {
  const AndVer = Platform.Version;
  const AndPhotoPermission =
    Number(AndVer) < 33
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
  const AndVideoPermission = PERMISSIONS.ANDROID.READ_MEDIA_VIDEO;
  const checkAndRequestPermission = async permission => {
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        const permissionResult = await request(permission);
        if (
          permissionResult === RESULTS.GRANTED ||
          permissionResult === RESULTS.UNAVAILABLE
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error(error, 'error');
      return false;
    }
  };
  if (IS_IOS) {
    return checkAndRequestPermission(PERMISSIONS.IOS.MEDIA_LIBRARY);
  } else {
    const photoPermissionGranted = await checkAndRequestPermission(
      AndPhotoPermission,
    );
    const videoPermissionGranted = await checkAndRequestPermission(
      AndVideoPermission,
    );
    return photoPermissionGranted && videoPermissionGranted;
  }
};

// permission for location access
const requestLocationPermission = async (
  t: TFunction<Namespace, undefined, Namespace>,
) => {
  try {
    const iosLocationAlways = PERMISSIONS.IOS.LOCATION_ALWAYS;
    const iosLocationWhenInUse = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const androidLocationFine = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const androidLocationCoarse = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
    const permission = IS_IOS ? iosLocationAlways : androidLocationFine;
    // Check the current permission status
    let currentStatusFine = await check(androidLocationFine);
    let currentStatusCoarse = await check(androidLocationCoarse);
    if (
      currentStatusFine === RESULTS.GRANTED ||
      currentStatusCoarse === RESULTS.GRANTED
    ) {
      return true;
    }
    // Request fine location permission first
    let requestStatusFine = await request(androidLocationFine);
    if (requestStatusFine === RESULTS.GRANTED) {
      return true;
    }
    // If fine location permission is not granted, request coarse location permission
    let requestStatusCoarse = await request(androidLocationCoarse);
    if (requestStatusCoarse === RESULTS.GRANTED) {
      return true;
    }

    // Handle iOS: if LOCATION_ALWAYS is not granted, check LOCATION_WHEN_IN_USE
    if (IS_IOS && permission === iosLocationAlways) {
      let currentStatusWhenInUse = await check(iosLocationWhenInUse);
      if (currentStatusWhenInUse === RESULTS.GRANTED) {
        return true;
      }
      let requestStatusWhenInUse = await request(iosLocationWhenInUse);
      if (requestStatusWhenInUse === RESULTS.GRANTED) {
        return true;
      }
    }

    // If permission is still not granted, prompt to open settings
    showModal({
      title: t('message:locationPermission'),
      message: t('message:enableLocationPermission'),
      successFn() {
        openSettings().catch(() => {
          console.error('Unable to open settings');
        });
      },
      successTitle: t('customWords:openSettings'),
      showCancelButton: true,
      type: 'info',
    });

    return false;
  } catch (error) {
    console.error('Error checking/requesting location permission:', error);
    return false;
  }
};
export {handleMediaPermission, requestLocationPermission};
