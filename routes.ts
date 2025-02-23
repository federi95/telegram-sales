import {
  IconDevicesSearch,
  IconHourglass,
  IconMessage,
} from "@tabler/icons-react";

import { NavbarLinkProperties } from "@/components/navbar";

export default [
  {
    href: "/channels",
    label: "Channels",
    icon: IconMessage,
  },
  {
    href: "/products",
    label: "Products",
    icon: IconDevicesSearch,
  },
  {
    href: "/sessions",
    label: "Sessions",
    icon: IconHourglass,
  },
] as NavbarLinkProperties[];
