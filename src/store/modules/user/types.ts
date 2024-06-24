export type RoleType = '' | '*' | 'admin' | 'user';

export interface RoleData {
  permissionList: Array<string>;
}
export interface RolesData {
  roles: RoleData;
}
export interface UserState {
  name?: string;
  avatar?: string;
  phone?: string;
  token?: string;
  roles: Array<RolesData>;
  authorities: [];
  info?: Record<string, unknown>;
  role: RoleType;
}
