import {useTranslation} from 'react-i18next';

const useHelpSupport = () => {
  const {t} = useTranslation();

  const fAQData = [
    {
      id: 1,
      ques: t('customWords:bookVitaProQues'),
      ans: t('customWords:bookVitaProAns'),
    },
    {
      id: 2,
      ques: t('customWords:contactVitaProQues'),
      ans: t('customWords:bookVitaProAns'),
    },
    {
      id: 3,
      ques: t('customWords:modifyReservationQues'),
      ans: t('customWords:bookVitaProAns'),
    },
    {
      id: 4,
      ques: t('customWords:becomeProQues'),
      ans: t('customWords:bookVitaProAns'),
    },
  ];

  const contactData = [
    {
      id: 1,
      heading: t('customWords:customerService'),
      child: 'Contact@Boardvita.com',
    },
    {
      id: 2,
      heading: t('customWords:pressCommunication'),
      child: 'Media@Boardvita.com',
    },
  ];

  return {t, fAQData, contactData};
};

export default useHelpSupport;
