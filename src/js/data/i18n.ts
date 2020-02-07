import i18next from 'i18next';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { config } from './config';

i18next.init({
  lng: config.locale,
  debug: config.i18n_debug,
  resources: {
    en: {
      translation: en
    },
    ru: {
      translation: ru
    }
  }
});

const t = i18next.t.bind(i18next);

export { i18next, t };
