"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { MRT_ColumnDef } from "mantine-react-table";
import { useRef } from "react";

import { Table, TableReference } from "@/components/table";
import { Session } from "@/db/schema";
import { deleteSession, getSessions } from "@/modules/session/session.api";

const fetcher = async (parameters: URLSearchParams, signal: AbortSignal) =>
  getSessions(Object.fromEntries(parameters), signal);

export default () => {
  const reference = useRef<TableReference<Session>>(null);
  const { mutateAsync: remove } = useMutation({
    mutationKey: ["remove-session"],
    mutationFn: (id: number) => deleteSession(id),
  });

  const columns: MRT_ColumnDef<Session>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      accessorFn: (data) => new Date(data.createdAt).toLocaleDateString(),
    },
  ];

  const onRemove = (id: number) => {
    modals.openConfirmModal({
      title: "Delete session",
      children: (
        <Text>
          Are you sure you want to delete this session?
          <br />
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        try {
          await remove(id);
          notifications.show({
            message: "Session deleted successfully",
            color: "green",
          });
          await reference.current?.refetch();
        } catch {
          notifications.show({
            message: "Failed to delete session",
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
      queryKey="list-products"
      fetcher={fetcher}
      columns={columns}
      positionActionsColumn="last"
      renderRowActions={({ row }) => (
        <Group>
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
