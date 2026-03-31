import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['en', 'tr'];

export default getRequestConfig(async (params) => {
  let locale = params.requestLocale || params.locale;
  // if requestLocale is a promise:
  if (locale && typeof locale.then === 'function') {
    locale = await locale;
  }

  if (!locale || !locales.includes(locale)) notFound();

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return { messages, locale };
  } catch (error) {
    console.error("FAILED TO LOAD MESSAGES", error);
    notFound();
  }
});
