"use client";

import {
  ActionIcon,
  AppShell,
  Box,
  Container,
  Group,
  Image,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";

import { Navbar } from "@/components/navbar";
import routes from "@/routes";

import classes from "./shell.module.scss";

export default ({ children }: PropsWithChildren) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 80,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Box component={Link} href="/" className={classes.title}>
            <Group>
              <Image src="/images/logo.png" alt="Logo" width={36} height={36} />
              <Title order={2} td="none">
                Telegram Products Monitor
              </Title>
            </Group>
          </Box>
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
            radius="md"
          >
            <IconSun
              className={clsx(classes.icon, classes.light)}
              stroke={1.5}
            />
            <IconMoon
              className={clsx(classes.icon, classes.dark)}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar links={routes} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container fluid py="md">{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};
