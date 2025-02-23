"use client";

import { ActionIcon, Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useRef } from "react";

import { Table, TableReference } from "@/components/table";
import { Product } from "@/db/schema";
import { useProductMutations } from "@/modules/product/product.actions";
import { getProducts } from "@/modules/product/product.api";
import ProductForm from "@/modules/product/product.form";

const fetcher = async (parameters: URLSearchParams, signal: AbortSignal) =>
  getProducts(Object.fromEntries(parameters), signal);

export default () => {
  const reference = useRef<TableReference<Product>>(null);
  const { create, edit, remove } = useProductMutations();

  const columns: MRT_ColumnDef<Product>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Channel",
      accessorKey: "channel",
      accessorFn: (data) => data.channel.name,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      accessorFn: (data) => new Date(data.createdAt).toLocaleDateString(),
    },
  ];

  const onFormOpen = (id?: number) =>
    modals.open({
      title: id ? "Edit product" : "Add new product",
      children: (
        <ProductForm
          onSubmit={async (values) => {
            try {
              const request = {
                ...values,
                name: values.name.trim(),
              };

              await (id ? edit({ id, ...request }) : create(request));
              modals.closeAll();
              notifications.show({
                message: id
                  ? "Product updated successfully"
                  : "Product created successfully",
                color: "green",
              });
              await reference.current?.refetch();
            } catch {
              notifications.show({
                message: id
                  ? "Failed to update product"
                  : "Failed to create product",
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
    <Button onClick={() => onFormOpen()}>Add new product</Button>
  );

  const onRemove = (id: number) => {
    modals.openConfirmModal({
      title: "Delete product",
      children: "Are you sure you want to delete this product?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        try {
          await remove(id);
          notifications.show({
            message: "Product deleted successfully",
            color: "green",
          });
          await reference.current?.refetch();
        } catch {
          notifications.show({
            message: "Failed to delete product",
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
