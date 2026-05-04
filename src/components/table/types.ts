import type React from "react";

export enum ActionButton {
  Show = "show",
  Review = "review",
  Edit = "edit",
  Delete = "delete",
  Copy = "copy",
  Create = "create",
  Export = "export",
  Import = "import",
  Custom = "custom",
}

export type ActionButtonHandlerMap<T> = {
  [ActionButton.Create]: (rows: T[]) => Promise<void>;
  [ActionButton.Edit]: (item: T) => Promise<void>;
  [ActionButton.Show]: (item: T) => Promise<void>;
  [ActionButton.Delete]: (item: T) => Promise<void>;
  [ActionButton.Review]: (item: T) => Promise<void>;
  [ActionButton.Copy]: (item: T) => Promise<void>;
  [ActionButton.Export]: (rows: T[]) => Promise<void>;
  [ActionButton.Import]: (rows: T[]) => Promise<void>;
  [ActionButton.Custom]: (item: T, rows: T[]) => Promise<void>;
};

export interface ColumnTable<T> {
  key: string;
  title: string;
  align?: "start" | "center" | "end";
  allowsSorting?: boolean;
  hideHeader?: boolean;
  isRowHeader?: boolean;
  maxWidth?: number;
  minWidth?: number;
  width?: number;
  render?: (item: T) => React.ReactNode;
  valueGetter?: (item: T) => React.ReactNode;
}

export interface CustomActionButton {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
  onPress?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  render?: React.ReactNode;
}

export interface CustomRowActionMenuItem<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onPress?: (item: T) => void | Promise<void>;
  isDisabled?: boolean;
}

export interface CustomRowActionButton<T> {
  key: string;
  /**
   * When true, renders as a vertical dots dropdown trigger and uses `menuItems`.
   * When false (default), renders as a standalone icon button next to Edit/Show/Delete.
   */
  isVertical?: boolean;
  label?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
  onPress?: (item: T) => void | Promise<void>;
  menuItems?: CustomRowActionMenuItem<T>[];
  isVisible?: (item: T) => boolean;
  isDisabled?: (item: T) => boolean;
}

export interface CustomFilterOption {
  label: string;
  value: string | boolean;
}

export interface CustomFilter<T> {
  key: string;
  label: string;
  placeholder?: string;
  type: "single" | "multiple";
  defaultOption?: string;
  options: CustomFilterOption[];
  filterFn?: (item: T, values: Set<string | boolean>) => boolean;
}

export interface PaginationModel {
  page: number;
  pageSize: number;
  total: number;
}
