import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.scss";
import "./index.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { PlatformProvider } from "@/context/PlatformContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext"
import { CurrentSubscriptionProvider } from "@/context/CurrentSubscriptionContext";
import { manrope, montserrat, poppins, syne } from "@/public/fonts";
import { theme } from "@/theming";
import ClientLoader from "@/components/ClientLoader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'LagosApps — One Account. Every Service.',
  description: 'Order food, rides, groceries, home services, logistics and healthcare across Lagos with one wallet.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${montserrat.variable} ${poppins.variable} ${syne.variable}`}>
      <head>
        <ColorSchemeScript />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Critical CSS for the pre-hydration loader — must live here so it's
            parsed before <body> renders, using plain class selectors (SCSS &
            nesting inside #id compiles to #id__element, not .id__element). */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes la-pulse-ring {
            0%   { transform: scale(0.6); opacity: 0.7; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          #page-loader {
            position: fixed; inset: 0; z-index: 9999;
            background: #F5F8F5;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 28px; transition: opacity 0.4s ease;
          }
          #page-loader.is-hiding { opacity: 0; pointer-events: none; }
          #page-loader.is-hidden  { display: none; }
          .page-loader__wordmark {
            font-size: 1.9rem; font-weight: 800;
            letter-spacing: -0.5px; line-height: 1;
            -webkit-user-select: none; user-select: none;
          }
          .page-loader__word-dark  { color: #1A1A2E; }
          .page-loader__word-green { color: #2E9E5B; }
          .page-loader__spinner-wrap {
            position: relative; width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
          }
          .page-loader__ring {
            position: absolute; inset: 0; border-radius: 50%;
            border: 2px solid #1A6B3C; opacity: 0;
            animation: la-pulse-ring 1.4s cubic-bezier(0.2,0.6,0.4,1) infinite;
          }
          .page-loader__ring:nth-child(2) { animation-delay: 0.45s; }
          .page-loader__dot {
            width: 12px; height: 12px; border-radius: 50%;
            background: #1A6B3C; position: relative; z-index: 1;
          }
        ` }} />
      </head>
      <body>
        {/* Full-page loader — visible from first HTML byte, removed once React hydrates */}
        <div id="page-loader" aria-hidden="true">
          <div className="page-loader__wordmark">
            <span className="page-loader__word-dark">Lagos</span>
            <span className="page-loader__word-green">Apps</span>
          </div>
          <div className="page-loader__spinner-wrap">
            <div className="page-loader__ring" />
            <div className="page-loader__ring" />
            <div className="page-loader__dot" />
          </div>
        </div>
        <ClientLoader />
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications />
          <AuthProvider>
            <CurrentSubscriptionProvider>
              <NotificationsProvider>
                <PlatformProvider>{children}</PlatformProvider>
              </NotificationsProvider>
            </CurrentSubscriptionProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
