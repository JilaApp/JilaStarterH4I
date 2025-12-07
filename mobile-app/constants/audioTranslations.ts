export const audioTranslations = {
  welcome_message: {
    english: require("../assets/audio/sample.mp3"),
    qanjobal: require("../assets/audio/sample.mp3"),
  },
};

export type TranslationKey = keyof typeof audioTranslations;
