import { defineStore } from 'pinia';
import { login as userLogin, logout as userLogout, getUserInfo, LoginData } from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { Result } from '@/types/global';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    token: '',
    roles: [],
    authorities: [],
    info: {},
    phone: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): Partial<UserState> {
      return state.info || { ...state };
    },
  },

  actions: {
    // switchRoles() {
    //   return new Promise((resolve) => {
    //     this.role = this.role === 'user' ? 'admin' : 'user';
    //     resolve(this.role);
    //   });
    // },
    // // Set user's information
    // setInfo(partial: Partial<UserState>) {
    //   this.$patch(partial);
    // },

    // // Reset user's information
    // resetInfo() {
    //   this.$reset();
    // },

    // Get user's information
    info() {
      return new Promise<Result>((resolve, reject) => {
        getUserInfo()
          .then((response) => {
            const result = response.data;
            if (response.code === 1 || response.code === -1) {
              return reject(new Error(response.msg));
            }
            this.authorities = result.authorities;
            const { adminUser } = result;
            this.info = adminUser;
            this.name = adminUser.name;
            this.avatar = '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png';
            // this.shopId = adminUser.shopId
            // this.shopName = adminUser.shopName
            // this.unionId = adminUser.unionId

            resolve(response);
            return response;
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // Login
    login(loginForm: LoginData) {
      // try {
      //   const res = await userLogin(loginForm);
      //   setToken(res.data.token);
      // } catch (err) {
      //   clearToken();
      //   throw err;
      // }
      return new Promise<void>((resolve, reject) => {
        userLogin(loginForm)
          .then((response) => {
            if (response.code === 1) return reject(new Error(response.msg));
            const result = response.data;
            // const token = result.token_type + ' ' + result.access_token
            const token = `Bearer ${result}`;

            setToken(token);
            // storage.set(REFRESH_TOKEN, result.refresh_token)
            // commit('SET_TOKEN', token);
            this.token = token;
            resolve();
            return token;
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // logoutCallBack() {
    //   const appStore = useAppStore();
    //   this.resetInfo();
    //   clearToken();
    //   removeRouteListener();
    //   appStore.clearServerMenu();
    // },
    // Logout
    logout() {
      // try {
      //   await userLogout();
      // } finally {
      //   this.logoutCallBack();
      // }
      return new Promise<void>((resolve) => {
        userLogout()
          .then(() => {
            // commit('SET_TOKEN', '')
            // commit('SET_ROLES', [])
            // storage.remove(ACCESS_TOKEN)
            resolve();
          })
          .catch(() => {
            resolve();
          })
          .finally(() => {
            this.token = '';
            this.authorities = [];
            clearToken();
            resolve();
          });
      });
    },
  },
});

export default useUserStore;
