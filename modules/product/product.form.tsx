"use client";

import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEffect, useMemo } from "react";
import { z } from "zod";

import { Input } from "@/components/grid-input";
import { getChannels } from "@/modules/channel/channel.api";

import { getProduct } from "./product.api";
import { ProductData } from "./product.types";

interface ProductFormProperties {
  onSubmit: (values: ProductData) => void | Promise<void>;
  id?: number;
}

const schema = z.object({
  name: z.string().nonempty(),
  channelId: z
    .string()
    .transform((value) => Number.parseInt(value, 10))
    .pipe(z.number().int().positive()),
});

export default function ProductForm({ onSubmit, id }: ProductFormProperties) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      channelId: "",
    },
    validate: zodResolver(schema),
  });

  const {
    data: initials,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["get-product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    refetchOnMount: true,
  });

  const {
    data: channels,
    isLoading: isChannelLoading,
    isFetching: isChannelFetching,
  } = useQuery({
    queryKey: ["get-channel"],
    queryFn: () => getChannels(),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!initials) return;

    const values = {
      name: initials.name,
      channelId: initials.channelId.toString(),
    };

    form.setValues(values);
    form.resetDirty(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initials]);

  const buttonLabel = useMemo(() => {
    if (id) return form.submitting ? "Updating..." : "Update";
    return form.submitting ? "Submitting..." : "Submit";
  }, [form.submitting, id]);

  const loading =
    (id && (isLoading || isFetching)) || isChannelLoading || isChannelFetching;

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        onSubmit({
          ...values,
          channelId: Number.parseInt(values.channelId, 10),
        })
      )}
    >
      <Grid>
        <Input
          component={TextInput}
          span={12}
          label="Product Name"
          placeholder="Enter product name"
          withAsterisk
          key={form.key("name")}
          disabled={loading || form.submitting}
          {...form.getInputProps("name")}
        />
        <Input
          component={Select}
          span={12}
          label="Channel"
          placeholder="Select channel"
          withAsterisk
          key={form.key("channelId")}
          disabled={loading || form.submitting}
          rightSection={loading ? <Loader size="sm" /> : null}
          data={
            channels?.data?.map((channel) => ({
              label: channel.name,
              value: channel.id.toString(),
            })) ?? []
          }
          {...form.getInputProps("channelId")}
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
