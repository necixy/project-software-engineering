import {useTranslation} from 'react-i18next';

export const useAboutVita = () => {
  const {t} = useTranslation();

  const data = [
    {
      id: 1,
      title: t('common:aboutVita'),
      text: t('largeContent:aboutVitaPara'),
      type: 'section',
    },
    {
      id: 2,
      title: t('customWords:ourMission'),
      text: t('largeContent:ourMissionPara'),
      type: 'section',
    },
    {
      id: 3,
      title: t('customWords:whatSetUsApart'),
      //   type: 'title',
      type: 'section',
    },
    {
      id: 4,
      subtitle: t('customWords:qualityProfessionals'),
      text: t('largeContent:qualityProfessionalsPara'),
      type: 'subSections',
    },
    {
      id: 5,
      subtitle: t('customWords:userFriendlyMarketplace'),
      text: t('largeContent:userFriendlyMarketplacePara'),
      type: 'subSections',
    },
    {
      id: 6,
      subtitle: t('customWords:convenienceRedefined'),
      text: t('largeContent:convenienceRedefinedPara'),
      type: 'subSections',
    },
    {
      id: 7,
      title: t('customWords:howVitaWorks'),
      text: [
        t('largeContent:itWorksPara1'),
        t('largeContent:itWorksPara2'),
        t('largeContent:itWorksPara3'),
      ],
      type: 'bulletedSection',
    },
    {
      id: 8,
      title: t('customWords:JoinVitaToday'),
      text: [t('largeContent:ThankYouPara'), t('largeContent:DiscoverPara')],
      //   type: 'text',
      type: 'section',
    },
  ];

  return {data, t};
};
