import { request } from '@/utils/axios';
// import type { RouteRecordNormalized } from 'vue-router';
// import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  // return request.post<LoginRes>('/api/user/login', data);
  return request({
    url: '/login',
    method: 'post',
    data,
  });
}

export function logout() {
  // return axios.post<LoginRes>('/api/user/logout');
  return request({
    url: '/sys/logout',
    method: 'post',
  });
}

export function getUserInfo() {
  // return axios.post<UserState>('/api/user/info');
  return request({
    url: '/userinfo',
    method: 'get',
  });
}

export function getMenuList() {
  return request({
    url: '/system/adminMenu/tree',
    method: 'post',
  });
}

// export function getMenuList() {
//   return axios.post<RouteRecordNormalized[]>('/api/user/menu');
// }
