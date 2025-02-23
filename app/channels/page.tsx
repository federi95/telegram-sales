"use client";

import { ActionIcon, Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useRef } from "react";

import { Table, TableReference } from "@/components/table";
import { Channel } from "@/db/schema";
import { useChannelMutations } from "@/modules/channel/channel.actions";
import { getChannels } from "@/modules/channel/channel.api";
import ChannelForm from "@/modules/channel/channel.form";
import { formatUnitTime, parseUnitTime } from "@/utils/time";

const fetcher = async (parameters: URLSearchParams, signal: AbortSignal) =>
  getChannels(Object.fromEntries(parameters), signal);

export default () => {
  const reference = useRef<TableReference<Channel>>(null);
  const { create, edit, remove } = useChannelMutations();

  const columns: MRT_ColumnDef<Channel>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "URL",
      accessorKey: "url",
    },
    {
      header: "Polling interval",
      accessorKey: "cron",
      accessorFn: (data) => {
        console.log(parseUnitTime(data.cron));
        return formatUnitTime(data.cron);
      },
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      accessorFn: (data) => new Date(data.createdAt).toLocaleDateString(),
    },
  ];

  const onFormOpen = (id?: number) =>
    modals.open({
      title: id ? "Edit channel" : "Add new channel",
      children: (
        <ChannelForm
          onSubmit={async (values) => {
            try {
              const request = {
                ...values,
                name: values.name.trim(),
                url: values.url.trim(),
              };

              await (id ? edit({ id, ...request }) : create(request));
              modals.closeAll();
              notifications.show({
                message: id
                  ? "Channel updated successfully"
                  : "Channel created successfully",
                color: "green",
              });
              await reference.current?.refetch();
            } catch {
              notifications.show({
                message: id
                  ? "Failed to update channel"
                  : "Failed to create channel",
                color: "red",
              });
            }
          }}
          id={id}
        />
      ),
      centered: true,
    });

  const actions = () => (
    <Button onClick={() => onFormOpen()}>Add new channel</Button>
  );

  const onRemove = (id: number) => {
    modals.openConfirmModal({
      title: "Delete channel",
      children: "Are you sure you want to delete this channel?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        try {
          await remove(id);
          notifications.show({
            message: "Channel deleted successfully",
            color: "green",
          });
          await reference.current?.refetch();
        } catch {
          notifications.show({
            message: "Failed to delete channel",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Table
      ref={reference}
      enableRowActions
      queryKey="list-channels"
      fetcher={fetcher}
      columns={columns}
      actions={actions}
      positionActionsColumn="last"
      renderRowActions={({ row }) => (
        <Group>
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => onFormOpen(row.original.id)}
          >
            <IconEdit size="1rem" />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => onRemove(row.original.id)}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      )}
    />
  );
};
