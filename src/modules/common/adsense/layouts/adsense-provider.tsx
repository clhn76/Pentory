import Script from "next/script";

interface AdsenseProviderProps {
  children: React.ReactNode;
}

export const AdsenseProvider = ({ children }: AdsenseProviderProps) => {
  return (
    <div>
      {process.env.NODE_ENV !== "development" && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8222693996695565"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      {children}
    </div>
  );
};
