import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw =
  // 权限管理
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/auth/adminUserList',
    component: DEFAULT_LAYOUT,
    meta: {
      locale: '权限管理',
      requiresAuth: false,
      icon: 'icon-dashboard',
      permission: ['dashboard'],
      order: 1,
    },
    children: [
      // {
      //   path: '/auth/roleList',
      //   name: 'RoleList',
      //   component: () => import('@/views/auth/RoleList.vue'),
      //   meta: { title: '角色列表', keepAlive: true, permission: ['dashboard'] },
      // },
      // {
      //   path: '/auth/roleDetail',
      //   name: 'RoleDetail',
      //   component: () => import('@/views/auth/RoleDetail.vue'),
      //   meta: { title: '角色详情', hideInMenu: true, permission: ['dashboard'] },
      // },
      // {
      //   path: '/auth/adminMenuList',
      //   name: 'AdminMenuList',
      //   component: () => import('@/views/auth/Menulist.vue'),
      //   meta: { title: '菜单列表', keepAlive: true, permission: ['dashboard'] },
      // },
      {
        path: '/auth/adminUserList',
        name: 'AdminUserList',
        component: () => import('@/views/auth/AdminUserList.vue'),
        meta: { locale: '用户列表', requiresAuth: false, roles: ['*'] },
      },
      {
        path: '/auth/adminUserDetail',
        name: 'AdminUserDetail',
        component: () => import('@/views/auth/AdminUserDetail.vue'),
        meta: { locale: '用户详情', requiresAuth: false, keepAlive: false, roles: ['*'] },
      },
      // {
      //   path: '/auth/adminDeptList',
      //   component: () => import('@/views/auth/Deptlist.vue'),
      //   name: 'AdminDeptList',
      //   meta: { title: '部门列表', keepAlive: true, permission: ['dashboard'] },
      // },
    ],
  };

export default DASHBOARD;
