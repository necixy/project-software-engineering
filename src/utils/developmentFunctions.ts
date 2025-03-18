import {Dimensions, PixelRatio} from 'react-native';
import i18n from 'src/locale/i18n.config';
import {showModal} from 'src/shared/components/modalProvider/ModalProvider';

function capitalizeString(str: string | undefined) {
  if (str && str !== undefined)
    return String(str)?.charAt(0)?.toUpperCase() + String(str)?.slice(1);
  else 'N/A';
}

const comingSoonAlert = () => {
  showModal({
    message: i18n.t('customWords:comingSoon'),
  });
};
const fontSizePixelRatio = (px: number) => {
  return (
    (PixelRatio.getPixelSizeForLayoutSize(px) ?? 14) /
    (PixelRatio.getFontScale() * PixelRatio.get())
  );
};

export {comingSoonAlert, capitalizeString, fontSizePixelRatio};

// CHANGES

// import {Dimensions, PixelRatio} from 'react-native';
// import i18n from 'src/locale/i18n.config';
// import {showMessage} from 'src/shared/components/messageModal/MessageModal';
// function capitalizeString(str: string | undefined) {
//   if (str) return str.charAt(0).toUpperCase() + str.slice(1);
//   else 'N/A';
// }
// const comingSoonAlert = () => {
//   showMessage({
//     message: i18n.t('customWords:comingSoon'),
//   });
// };
// const fontSizePixelRatio = (px: number, multiplier = PixelRatio.get()) => {
//   const {width, height} = Dimensions.get('window');
//   const scale = (width / height) * multiplier;
//   const newSize = px * scale;
//   return Math.round(PixelRatio.roundToNearestPixel(newSize + multiplier));
//   // return ((px ?? 14) + 24) / (PixelRatio.getFontScale() * PixelRatio.get());
// };
// export {comingSoonAlert, capitalizeString, fontSizePixelRatio};
