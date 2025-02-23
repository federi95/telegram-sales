import { useMutation } from "@tanstack/react-query";

import { createProduct, deleteProduct, updateProduct } from "./product.api";
import { ProductData } from "./product.types";

export function useProductMutations() {
  const { mutateAsync: create } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (values: ProductData) => createProduct(values),
  });

  const { mutateAsync: edit } = useMutation({
    mutationKey: ["edit-product"],
    mutationFn: ({ id, ...values }: ProductData & { id: number }) =>
      updateProduct(id, values),
  });

  const { mutateAsync: remove } = useMutation({
    mutationKey: ["remove-product"],
    mutationFn: (id: number) => deleteProduct(id),
  });

  return { create, edit, remove };
}
