import { Grid } from "@mantine/core";
import { ComponentProps, ComponentType, createElement } from "react";

import { GridInputProperties } from "./input.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GridInput<Properties extends ComponentProps<any>>({
  component: Component,
  span,
  GridColProps,
  ...rest
}: GridInputProperties<Properties>) {
  return (
    <Grid.Col span={span} {...GridColProps}>
      {createElement(Component as ComponentType, rest)}
    </Grid.Col>
  );
}
