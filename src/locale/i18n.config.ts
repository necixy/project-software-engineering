import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './translations/en.json';
import fr from './translations/fr.json';

const resources = {
  en,
  fr,
};
export const languages = [
  {label: 'English', value: 'en'},
  {label: 'French', value: 'fr'},

  // Add more languages as needed
];

const LANGUAGE_DETECTOR: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      if (err || !language) {
        if (err)
          console.error('Error fetching Languages from async storage ', err);
        else console.error('No language is set, choosing English as fallback');

        callback(language || 'en');
        return;
      }
      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: async (language: 'en' | 'fr') => {
    await AsyncStorage.setItem('user-language', language);
  },
};
i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    defaultNS: 'en',
  });

export default i18n;
