import { useMutation } from "@tanstack/react-query";

import { createChannel, deleteChannel, updateChannel } from "./channel.api";
import { ChannelData } from "./channel.types";

export function useChannelMutations() {
  const { mutateAsync: create } = useMutation({
    mutationKey: ["create-channel"],
    mutationFn: (values: ChannelData) => createChannel(values),
  });

  const { mutateAsync: edit } = useMutation({
    mutationKey: ["edit-channel"],
    mutationFn: ({ id, ...values }: ChannelData & { id: number }) =>
      updateChannel(id, values),
  });

  const { mutateAsync: remove } = useMutation({
    mutationKey: ["remove-channel"],
    mutationFn: (id: number) => deleteChannel(id),
  });

  return { create, edit, remove };
}
