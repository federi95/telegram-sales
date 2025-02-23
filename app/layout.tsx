import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { PropsWithChildren } from "react";

import { Shell } from "@/components/shell";
import ReactQueryProvider from "@/lib/query-client";
import { theme } from "@/theme";

export const metadata = {
  title: "Offer Monitor",
  description: "Telegram channel and product monitor",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <ReactQueryProvider>
          <MantineProvider
            theme={theme}
            withCssVariables
            withGlobalClasses
            withStaticClasses
            classNamesPrefix="ofm"
          >
            <Notifications
              position="top-right"
              zIndex={1000}
              limit={5}
              autoClose={6000}
            />
            <ModalsProvider>
              <Shell>{children}</Shell>
            </ModalsProvider>
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
