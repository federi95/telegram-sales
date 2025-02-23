"use client";

import {
  Button,
  Grid,
  Group,
  Input as MInput,
  InputWrapperProps,
  NumberInput,
  NumberInputProps,
  Select,
  SelectProps,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEffect, useMemo } from "react";
import { z } from "zod";

import { Input } from "@/components/grid-input";

import { getChannel } from "./channel.api";
import { ChannelData } from "./channel.types";

interface ChannelFormProperties {
  onSubmit: (values: ChannelData) => void;
  id?: number;
}

const schema = z.object({
  name: z.string().nonempty(),
  url: z.string().url(),
  cron_interval: z.number().int().positive(),
  cron_unit: z.enum(["s", "m", "h", "d", "w"]),
});

const UnitInput = ({
  NumberProps,
  SelectProps,
  ...rest
}: {
  NumberProps?: NumberInputProps;
  SelectProps?: SelectProps;
} & InputWrapperProps) => {
  const { key: numberKey, ...numberProperties } = NumberProps ?? {};
  const { key: selectKey, ...selectProperties } = SelectProps ?? {};

  return (
    <MInput.Wrapper {...rest}>
      <SimpleGrid cols={2} spacing="sm">
        <NumberInput key={numberKey} {...numberProperties} />
        <Select key={selectKey} {...selectProperties} />
      </SimpleGrid>
    </MInput.Wrapper>
  );
};

export default function ChannelForm({ onSubmit, id }: ChannelFormProperties) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      url: "",
      cron_interval: 10,
      cron_unit: "m",
    },
    validate: zodResolver(schema),
  });

  const {
    data: initials,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["get-channel", id],
    queryFn: async () => getChannel(id!),
    enabled: !!id,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!initials) return;

    const match = initials.cron.match(/\d+|\D+/g) || [];
    const [cron_interval, cron_unit] = match;
    const values = {
      name: initials.name,
      url: initials.url ?? "",
      cron_interval: +(cron_interval ?? "10"),
      cron_unit,
    };

    form.setValues(values);
    form.resetDirty(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initials]);

  const buttonLabel = useMemo(() => {
    if (id) return form.submitting ? "Updating..." : "Update";
    return form.submitting ? "Submitting..." : "Submit";
  }, [form.submitting, id]);

  const loading = id && (isLoading || isFetching);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        const { cron_interval, cron_unit, ...v } = values;

        return onSubmit({
          ...v,
          cron: `${cron_interval}${cron_unit}`,
        });
      })}
    >
      <Grid>
        <Input
          component={TextInput}
          span={12}
          label="Channel Name"
          placeholder="Enter channel name"
          withAsterisk
          key={form.key("name")}
          disabled={loading || form.submitting}
          {...form.getInputProps("name")}
        />
        <Input
          component={TextInput}
          span={12}
          label="Channel URL"
          placeholder="Enter channel URL"
          withAsterisk
          key={form.key("url")}
          disabled={loading || form.submitting}
          {...form.getInputProps("url")}
        />
        <Input
          component={UnitInput}
          span={7}
          label="Polling Interval"
          NumberProps={{
            key: form.key("cron_interval"),
            min: 1,
            allowNegative: false,
            disabled: loading || form.submitting,
            ...form.getInputProps("cron_interval"),
          }}
          SelectProps={{
            key: form.key("cron_unit"),
            data: [
              { value: "s", label: "Seconds" },
              { value: "m", label: "Minutes" },
              { value: "h", label: "Hours" },
              { value: "d", label: "Days" },
              { value: "w", label: "Weeks" },
            ],
            disabled: loading || form.submitting,
            ...form.getInputProps("cron_unit"),
          }}
        />
      </Grid>
      <Group justify="flex-end" mt="md">
        <Button type="submit" loading={loading || form.submitting}>
          {buttonLabel}
        </Button>
      </Group>
    </form>
  );
}
