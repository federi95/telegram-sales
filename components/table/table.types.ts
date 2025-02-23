import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_RowData,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_TableOptions,
} from "mantine-react-table";
import { ReactNode } from "react";

import { IData } from "@/types/api";

export interface TableProperties<TData extends MRT_RowData>
  extends Omit<
    MRT_TableOptions<TData>,
    "data" | "columns" | "renderTopToolbarCustomActions"
  > {
  columns: MRT_ColumnDef<TData>[];
  fetcher: (
    parameters: URLSearchParams,
    signal: AbortSignal
  ) => Promise<IData<TData>>;
  queryKey: string;
  actions?: (properties: { table: MRT_TableInstance<TData> }) => ReactNode;
}

export interface TableReference<TData extends MRT_RowData>
  extends MRT_TableInstance<TData> {
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IData<TData>, Error>>;
  meta: {
    pagination: MRT_PaginationState;
    sorting: MRT_SortingState;
  };
}
