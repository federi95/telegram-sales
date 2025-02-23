import { UnstyledButtonProps } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";
import { LinkProps } from "next/link";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export interface NavbarLinkProperties extends UnstyledButtonProps, LinkProps {
  label: ReactNode;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

export interface NavbarProperties {
  links: NavbarLinkProperties[];
}
