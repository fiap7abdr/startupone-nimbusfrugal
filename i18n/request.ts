import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { locales, defaultLocale, type Locale } from "./config";

function resolveLocale(cookieValue: string | undefined, acceptLanguage: string | null): Locale {
  if (cookieValue && locales.includes(cookieValue as Locale)) {
    return cookieValue as Locale;
  }
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale) || acceptLanguage.includes(locale.split("-")[0])) {
        return locale;
      }
    }
  }
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieValue = cookieStore.get("NEXT_LOCALE")?.value;
  const acceptLanguage = headerStore.get("accept-language");
  const locale = resolveLocale(cookieValue, acceptLanguage);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
