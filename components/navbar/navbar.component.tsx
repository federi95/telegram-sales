"use client";

import { Box, Stack, Tooltip } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import classes from "./navbar.module.scss";
import { NavbarLinkProperties, NavbarProperties } from "./navbar.types";

const NavbarLink = ({
  icon: Icon,
  href,
  label,
  className,
  ...rest
}: NavbarLinkProperties) => (
  <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
    <Box
      {...rest}
      component={Link}
      className={clsx(classes.link, className)}
      href={href}
    >
      <Icon size={20} className="nav_link__icon" />
    </Box>
  </Tooltip>
);

export default ({ links }: NavbarProperties) => {
  const pathname = usePathname();

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap="xs">
          {links.map((link, index) => (
            <NavbarLink
              key={`navbar_link-${index}`}
              data-active={pathname === link.href}
              {...link}
            />
          ))}
        </Stack>
      </div>
    </nav>
  );
};
