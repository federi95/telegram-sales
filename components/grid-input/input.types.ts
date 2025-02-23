import { GridColProps } from "@mantine/core";
import { ComponentProps, ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridInputProperties<Properties extends ComponentProps<any>> = Properties & {
  component: ComponentType<Properties>;
  span?: GridColProps["span"];
  GridColProps?: Omit<GridColProps, "span">;
};
