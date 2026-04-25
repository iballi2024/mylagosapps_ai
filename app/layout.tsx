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
import { manrope, montserrat, poppins } from "@/public/fonts";
import { theme } from "@/theming";
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
    <html lang="en" className={`${manrope.variable} ${montserrat.variable} ${poppins.variable}`}>
      <head>
        <ColorSchemeScript />
    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
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
