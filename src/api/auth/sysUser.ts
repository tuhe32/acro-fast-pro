import { request } from '@/utils/axios';
import { BaseModel, BasicPageParams, DetailParam } from '../model/baseModel';
// import { AdminUser, AdminUserDetailSaveParam, AdminUserModifyPasswordParam } from './model/UserModel'

export interface AdminUser extends BaseModel {
  isEnable?: number;
  deptId?: number;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  remark?: string;
  userType?: string;
  /**
   * 员工职务类型：职员、物流、财务等
   * NORMAL,//普通职员
   *     LOGISTICS ,//物流
   *     ACCOUNTANT, //财务人员
   *     purchaser, // 采购人员
   *     SALESMAN, // 业务员
   *     VAN_SALESMAN //车销人员
   */
  jobType?: string;
  mallId?: number;
  roleIds?: [];
}

export interface AdminUserDetailSaveParam {
  adminUser: AdminUser;
  password?: string;
  roleIds?: number[];
}

export function getAdminUserList(params: BasicPageParams) {
  return request({
    url: '/adminUser/findList',
    params,
    method: 'GET',
  });
}

export function enableUser(data: DetailParam) {
  return request({
    url: '/adminUser/isEnableRole',
    method: 'post',
    data,
  });
}

export function deleteUser(data: DetailParam) {
  return request({
    url: '/adminUser/deleteUser',
    method: 'post',
    data,
  });
}

export function getWebUserDetail(data: DetailParam) {
  return request({
    url: '/adminUser/findDetail',
    method: 'post',
    data,
  });
}

export function saveWebUser(data: AdminUserDetailSaveParam) {
  return request({
    url: '/adminUser/saveUser',
    method: 'post',
    data,
  });
}

// export function savePassword(data: AdminUserModifyPasswordParam) {
//   return request({
//     url: '/adminUser/savePassword',
//     method: 'post',
//     data: data,
//   })
// }

// export function generatePassword(data: DetailParam) {
//   return request({
//     url: '/adminUser/generatePassword',
//     method: 'post',
//     data: data,
//   })
// }

// export function changeUserStatus(data: AdminUser) {
//   return request({
//     url: '/adminUser/changeUserStatus',
//     method: 'post',
//     data: { entity: data },
//   })
// }

// export function isEnable(data: AdminUser) {
//   return request({
//     url: '/adminUser/isEnableRole',
//     method: 'post',
//     data: { id: data.id, isEnable: data.isEnable },
//   })
// }

// export function findShopClerk(params: BasicPageParams) {
//   return request({
//     url: '/adminUser/findShopClerk',
//     params: params,
//     method: 'GET',
//   })
// }

// export function findMenuList() {
//   return request({
//     url: '/system/adminMenu/findMenuList',
//     method: 'GET',
//   })
// }
