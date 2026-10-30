import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import PortfolioEffects from "../components/PortfolioEffects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hans Filart — Developer & BSIT Student",
  description:
    "Hans Filart is a full-stack developer and BSIT student building digital products with purpose.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="portfolio-home-prepaint" strategy="beforeInteractive">
          {`document.documentElement.dataset.portfolioJs = "true";
const navigationEntry = performance.getEntriesByType("navigation")[0];
if (window.location.pathname === "/Home" && navigationEntry?.type === "reload") {
  window.history.scrollRestoration = "manual";
  window.addEventListener("pageshow", () => {
    window.scrollTo(0, 0);
  }, { once: true });
}`}
        </Script>
        <PortfolioEffects>{children}</PortfolioEffects>
      </body>
    </html>
  );
}
