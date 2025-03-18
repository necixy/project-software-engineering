import 'react-i18next';
import {en, fr} from '../locale/translations';
// import en from './en.json';
// import fr from './fr.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof en;
  }
}
