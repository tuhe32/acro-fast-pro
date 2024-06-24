import { Ref } from 'vue';

export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export type TimeRanger = [string, string];

export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export interface FetchParam {
  url: string;
  method: 'post' | 'get';
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface FetchResult {
  loading: Ref;
  results: any;
  hasErrors: Ref;
}

export interface Result {
  msg: string;
  data: any;
  code: number;
  success: boolean;
}
