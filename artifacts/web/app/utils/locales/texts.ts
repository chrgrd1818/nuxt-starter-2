import en from "./en.json";
import fr from "./fr.json";
import type { SupportedLocale } from "../../types";

export interface LocaleTexts {
  nav: {
    home: string;
    signIn: string;
    signUp: string;
    signOut: string;
    profile: string;
    openMenu: string;
  };
  home: {
    welcomeBack: string;
    welcomeGuest: string;
    signedInAs: string;
  };
  auth: {
    signInTitle: string;
    signUpTitle: string;
    email: string;
    password: string;
    signInAction: string;
    signUpAction: string;
    noAccount: string;
    haveAccount: string;
    displayName: string;
    confirmTitle: string;
    confirmSuccess: string;
    confirmError: string;
  };
  profile: {
    title: string;
    displayName: string;
    email: string;
    memberSince: string;
  };
}

const dictionaries: Record<SupportedLocale, LocaleTexts> = {
  en,
  fr,
};

export function getTexts(locale: string): LocaleTexts {
  if (locale === "fr") {
    return dictionaries.fr;
  }

  return dictionaries.en;
}
