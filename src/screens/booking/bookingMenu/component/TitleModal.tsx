import CustomButton from 'src/shared/components/customButton/CustomButton';
import CustomInput from 'src/shared/components/customInput/CustomInput';
import CustomModal from 'src/shared/components/customModal/CustomModal';
import CustomText from 'src/shared/components/customText/CustomText';
import renderMenuSwipe from './MenuSwipeList.style';
import useMenuList from './useMenuList';

const TitleModal = ({
  modalOpen,
  setModalOpen,
  onPress,
}: {
  modalOpen: boolean;
  setModalOpen: any;
  onPress?: () => void;
}) => {
  const {
    t,
    formik: {
      values: {title},
      errors,
      handleChange,
      resetForm,
      handleSubmit,
    },
    errHandling,
    loading,
    getMenuData,
    tempMenu,
    setTempMenu,
    setMenuData,
    menuData,
  } = useMenuList();

  return (
    <CustomModal
      onClose={() => {
        setModalOpen(false);
        resetForm();
      }}
      isOpen={modalOpen}
      modalContainer={{
        // height: SCREEN_WIDTH * 0.4,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 20,
      }}>
      <>
        <CustomText
          style={{alignSelf: 'flex-start'}}
          fontFamily="openSansBold"
          color="grey">
          {t('common:addSection')}
        </CustomText>
        <CustomInput
          value={title}
          error={errHandling('title')}
          errorStyle={{marginTop: 20}}
          onChangeText={handleChange('title')}
          textInputProps={{placeholderTextColor: '#808080'}}
          containerStyle={{width: '100%', paddingTop: 10}}
          inputBoxStyle={[
            renderMenuSwipe.boldDetails,
            {
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              justifyContent: 'center',
            },
          ]}
          inputContainer={[
            renderMenuSwipe.input,
            {
              backgroundColor: 'transparent',
              marginBottom: 10,
            },
          ]}
        />
        <CustomButton
          isLoading={loading}
          onPress={onPress}
          fontSize={18}
          style={{
            marginTop: 20,
            alignSelf: 'center',
            width: '100%',
          }}>
          {t('common:save')}
        </CustomButton>
      </>
    </CustomModal>
  );
};

export default TitleModal;
