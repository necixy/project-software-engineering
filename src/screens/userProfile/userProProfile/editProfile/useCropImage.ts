import {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';

const useCropImage = () => {
  const [profileImg, setProfileImg] = useState('');
  const [frontImg, setFrontImg] = useState('');

  const handleProfilePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setProfileImg(image.path);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleFrontPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setFrontImg(image.path);
      })
      .catch(error => {
        console.error(error);
      });
  };
  return {handleProfilePicker, handleFrontPicker, profileImg, frontImg};
};

export default useCropImage;
