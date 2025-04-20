import type React from "react";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "@/app/globals.css";
import { LanguageProvider } from "@/hooks/use-language";
import { getDictionary } from "@/dictionaries";
import { languageCodes, rtlLanguages } from "@/lib/languages";
import Analytics from "@/components/analytics";

// Use Noto Sans with all required subsets
const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  let { lang } = await params;
  // Validate language or default to 'en'
  const dictionary = getDictionary(lang);
  lang = dictionary.lang || "en";

  // Set RTL direction for Arabic
  const dir = rtlLanguages.includes(lang) ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta name="yandex-verification" content="624511c549e3c115" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className={notoSans.className}>
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return languageCodes.map((lang: string) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return {
    title: dictionary.title,
    description: dictionary.description,
    openGraph: {
      title: dictionary.title,
      description: dictionary.description,
      images: [
        {
          url: "/logo-bg.png",
          width: 1200,
          height: 630,
          alt: dictionary.title,
        },
      ],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.title,
      description: dictionary.description,
      images: ["/logo-bg.png"],
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || ""),
  };
}
