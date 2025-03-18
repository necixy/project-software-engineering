import {View} from 'react-native';
import React from 'react';
import CustomImage from 'src/shared/components/customImage/CustomImage';
import CustomText from 'src/shared/components/customText/CustomText';
import StarRating from 'src/shared/components/ratingComponent/src';
import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import renderRatings from './BookingRatings.style';
import useBookingRatings from './useBookingRatings';
import RatingComponent from 'src/shared/components/ratingComponent/RatingComponent';
import Container from 'src/shared/components/container/Container';
//make the static data below to come as props for this component
const useRatingProps: TBookingRatingsProps = {
  imageUri:
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  proId: 'Rq8CZpT2uybjXFkxkSuJvWGxoFC2',
};
const BookingRatings = ({route}: any) => {
  const {
    t,
    setRating,
    setReview,
    uploadReview,
    rating,
    review,
    ratingArray,
    isLoading,
  } = useBookingRatings(route?.params!);
  return (
    <Container
      isLoading={isLoading}
      contentContainerStyle={renderRatings.container}>
      {!isLoading && (
        <View>
          <CustomImage
            source={
              route?.params?.imageUrl
                ? {
                    uri: route?.params?.imageUrl,
                  }
                : undefined
            }
            style={renderRatings.userImg}
          />
          <CustomText fontSize={14} style={renderRatings.userTitle}>
            {route?.params?.name}
          </CustomText>
          <CustomText fontSize={13} style={renderRatings.userDescription}>
            {t('customWords:BookingRatingText')}
          </CustomText>
          <CustomText fontSize={12} style={renderRatings.starTitle}>
            {t('common:rateYourPro')}
          </CustomText>
          <StarRating
            onChange={rating => {
              setRating(rating);
            }}
            minRating={1}
            rating={rating}
            starSize={50}
            style={[renderRatings.star, {alignSelf: 'center'}]}
            starStyle={{marginRight: 14}}
          />
          <CustomText fontSize={12} style={renderRatings.commentTitle}>
            {t('common:leaveAComment')}
          </CustomText>
          <View style={{marginBottom: 60}}>
            <CustomInput
              multiline={true}
              containerStyle={{}}
              value={review}
              onChangeText={text => {
                setReview(text);
              }}
              inputBoxStyle={renderRatings.inputText}
              inputContainer={{height: 150}}
              placeHolderText={`${t('common:visibleComment')} ...`}
            />
            {review?.length > 120 ? (
              <CustomText
                color="red"
                fontFamily="openSansRegular"
                fontSize={14}>
                {t('customWords:ratingWordLimit')}
              </CustomText>
            ) : null}
            <CustomText
              textAlign="right"
              color="grey"
              fontFamily="openSansRegular"
              marginEnd={5}>{`${review?.length} / 120`}</CustomText>
          </View>
          <CustomButton
            onPress={uploadReview}
            style={{alignSelf: 'center', bottom: 20}}
            textProps={{
              style: renderRatings.btnText,
            }}>
            {t('common:send')}
          </CustomButton>
        </View>
      )}
    </Container>
  );
};

export default BookingRatings;
