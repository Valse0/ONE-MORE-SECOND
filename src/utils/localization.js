const FALLBACK_LOCALE = 'en';
let dictionaries = {};

export async function loadLocales() {
  const locales = await Promise.all(['en', 'tr'].map(async (locale) => {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) throw new Error(`Unable to load ${locale} locale: ${response.status}`);
    return [locale, await response.json()];
  }));
  dictionaries = Object.fromEntries(locales);
}

export function getLocale() {
  return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : FALLBACK_LOCALE;
}

export function text(key, values = {}) {
  const locale = getLocale();
  const value = dictionaries[locale]?.[key] ?? dictionaries[FALLBACK_LOCALE]?.[key];
  if (typeof value !== 'string') {
    console.error(`Missing localization key: ${key}`);
    return key;
  }
  return value.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}
