"use client";


import { Box, Text } from "@mantine/core";
import {
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize2,
  IconBaselineDensityLarge,
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconColumns,
  IconProps,
  IconSortAscending,
  IconSortDescending,
  IconSwitchVertical,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_RowData,
  MRT_SortingState,
  useMantineReactTable,
} from "mantine-react-table";
import { useSearchParams } from "next/navigation";
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import classes from "./table.module.scss";
import { TableProperties, TableReference } from "./table.types";

function Table<T extends MRT_RowData>(
  { fetcher, columns, queryKey, actions, ...rest }: TableProperties<T>,
  reference: ForwardedRef<TableReference<T>>
) {
  const searchParameters = useSearchParams();
  const [_enabled, _setEnabled] = useState(false);

  const updateParameters = (parameters: Record<string, string | null> = {}) => {
    const current = new URLSearchParams([...searchParameters.entries()]);

    if (parameters.page) current.set("page", parameters.page);
    else if (!parameters.page && !current.has("page")) current.set("page", "1");

    if (parameters.limit) current.set("limit", parameters.limit);
    else if (!parameters.limit && !current.has("limit"))
      current.set("limit", "10");

    if (parameters.sort) current.set("sort", parameters.sort);
    else if (!parameters.sort && current.has("sort")) current.delete("sort");

    const search = current.toString();
    globalThis.history.replaceState(null, "", `?${search.toString()}`);
  };

  useLayoutEffect(() => {
    updateParameters();
    _setEnabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta = useMemo(() => {
    const page = +(searchParameters.get("page") ?? 1);
    const limit = +(searchParameters.get("limit") ?? 10);
    const pagination = { pageSize: limit, pageIndex: page - 1 };

    const sort = searchParameters.get("sort");
    const sorting: MRT_SortingState = [];

    if (sort) {
      try {
        const _sorting: Record<string, "asc" | "desc"> = JSON.parse(sort);
        for (const [sortKey, order] of Object.entries(_sorting)) {
          sorting.push({
            id: sortKey,
            desc: order === "desc",
          });
        }
      } catch (error) {
        console.error("Failed to parse sorting", error);
      }
    }

    return { pagination, sorting };
  }, [searchParameters]);

  const {
    refetch,
    data: result,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "table",
      queryKey,
      meta.pagination.pageIndex,
      meta.pagination.pageSize,
      ...meta.sorting,
    ],
    queryFn: ({ signal }) => fetcher(searchParameters, signal),
    enabled: _enabled,
  });

  const table = useMantineReactTable({
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableGlobalFilter: false,
    enableToolbarInternalActions: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: true,
    enableColumnDragging: true,
    enableColumnOrdering: true,
    sortDescFirst: true,
    isMultiSortEvent: () => true,
    renderEmptyRowsFallback: () => (
      <Box className={classes.empty_rows__cell}>
        <Text fz="md">No data available</Text>
      </Box>
    ),
    ...rest,
    data: result?.data ?? [],
    columns,
    onSortingChange: (state) => {
      const newState =
        typeof state === "function" ? state(meta.sorting) : state;

      const sort = newState.reduce(
        (accumulator, { id, desc }) => {
          accumulator[id] = desc ? "desc" : "asc";
          return accumulator;
        },
        {} as Record<string, string>
      );

      const length = Object.keys(sort).length;

      updateParameters({
        sort: length ? JSON.stringify(sort) : null,
      });
    },
    onPaginationChange: (state) => {
      const newState =
        typeof state === "function" ? state(meta.pagination) : state;

      updateParameters({
        page: (newState.pageIndex + 1).toString(),
        limit: newState.pageSize.toString(),
      });
    },
    state: {
      showSkeletons: isFetching,
      isLoading,
      pagination: meta.pagination,
      sorting: meta.sorting,
      ...rest.state,
    },
    initialState: { showColumnFilters: false },
    rowCount: result?.total ?? 0,
    pageCount: result?.pages ? result.pages + 1 : -1,
    icons: {
      IconMaximize: (iconProperties: IconProps) => (
        <IconArrowsDiagonal size={16} {...iconProperties} />
      ),
      IconMinimize: (iconProperties: IconProps) => (
        <IconArrowsDiagonalMinimize2 size={16} {...iconProperties} />
      ),
      IconColumns: (iconProperties: IconProps) => (
        <IconColumns size={24} stroke={1.5} {...iconProperties} />
      ),
      IconBaselineDensityLarge: (iconProperties: IconProps) => (
        <IconBaselineDensityLarge size={18} {...iconProperties} />
      ),
      IconBaselineDensityMedium: (iconProperties: IconProps) => (
        <IconBaselineDensityMedium size={18} {...iconProperties} />
      ),
      IconBaselineDensitySmall: (iconProperties: IconProps) => (
        <IconBaselineDensitySmall size={18} {...iconProperties} />
      ),
      IconArrowsSort: (iconProperties: IconProps) => (
        <IconSwitchVertical size={16} {...iconProperties} />
      ),
      IconSortAscending: (iconProperties: IconProps) => (
        <IconSortAscending size={16} {...iconProperties} />
      ),
      IconSortDescending: (iconProperties: IconProps) => (
        <IconSortDescending size={16} {...iconProperties} />
      ),
    },
    renderTopToolbarCustomActions: actions
      ? (properties) => <Box style={{ order: 1 }}>{actions(properties)}</Box>
      : undefined,
    paginationDisplayMode: "pages",
    mantinePaperProps: {
      radius: "md",
      ...rest.mantinePaperProps,
    },
    mantineTableHeadCellProps: {
      classNames: {
        th: classes.table_head__cell,
      },
      ...rest.mantineTableHeadCellProps,
    },
    mantineTableContainerProps: {
      pos: "relative",
      ...rest.mantineTableContainerProps,
    },
    mantineBottomToolbarProps: {
      className: classes.bottom_toolbar,
      ...rest.mantineBottomToolbarProps,
    },
    mantineTopToolbarProps: {
      className: classes.top_toolbar,
      ...rest.mantineTopToolbarProps,
    },
    mantinePaginationProps: {
      showRowsPerPage: true,
      rowsPerPageOptions: ["5", "10", "15"],
      hideWithOnePage: true,
      ...rest.mantinePaginationProps,
    },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : rest.mantineToolbarAlertBannerProps,
  });

  useImperativeHandle(
    reference,
    () => ({
      ...table,
      refetch,
      meta: {
        pagination: meta.pagination,
        sorting: meta.sorting,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, table]
  );

  if (!_enabled) return null;

  return <MantineReactTable table={table} />;
}

export default forwardRef(Table) as <T extends MRT_RowData>(
  properties: TableProperties<T> & { ref?: ForwardedRef<TableReference<T>> }
) => ReturnType<typeof Table>;
