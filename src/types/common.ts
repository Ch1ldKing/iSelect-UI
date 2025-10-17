// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'processing';

export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T | string;
  key: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filters?: { text: string; value: string }[];
  width?: number | string;
}
