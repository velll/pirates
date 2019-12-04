import i18next from 'i18next';

const en = {
  "key": "hello world",
  "nono": "not hello world",
  "status": {
    round: "Round"
  },
  "cell-tip": {
    "occupied-by": "Occupied by",
    "HP": "HP"
  }
};

i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: en
    }
  }
});

const t = i18next.t.bind(i18next);

export { i18next, t };
