/**
 * @format
 * @description load additional plugins to i18next for the multi language feature
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";
import { parseJSON } from "utils";
import { KEY_CONTEXT } from "themes/config";
const layout = parseJSON(localStorage.getItem(KEY_CONTEXT.MAIN) ?? '{}',{})

i18n.use(initReactI18next).init({
  // compatibilityJSON: "v3",
  resources,
  lng: layout.lang || 'en',
  //   lng: ELanguage.EN,
  fallbackLng: ["en", "vi"],
  //   fallbackLng: [ELanguage.VI, ELanguage.EN],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
