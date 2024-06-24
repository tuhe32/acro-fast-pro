export interface QueryParam {
  key?: string;
  [key: string]: any;
}

export interface BasicPageParams extends QueryParam {
  pageNo: number;
  pageSize: number;
}

export interface DetailParam {
  id: number;
  isEnable?: number;
}

export interface DetailSaveParam<T> {
  entity: T;
}

// export interface BasicFetchResult<T extends any> {
//   items: T
//   total: number
// }

export interface BaseModel {
  id?: number;
  deleted?: number;
  createAt?: Date;
  creatorId?: number;
  modifyAt?: Date;
  modifierId?: number;
}

export interface Option {
  key: number;
  value: string;
  children?: Option[];
  parentId?: number;
  [key: string]: any;
}
export interface OptionInfo {
  value: string;
  parentId: number;
}
