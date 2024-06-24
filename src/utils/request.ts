// import axios, { AxiosRequestConfig } from 'axios';
import { useUserStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
// import { notification } from 'ant-design-vue'
// import { VueAxios } from './axios'
import { getToken } from '@/utils/auth';
// import { Result } from '@/types/global';
import { service } from './axios';
// import { getServiceEnvConfig } from '../../.env-config'

// import config from '@/config/defaultSettings'

const err = (error: any) => {
  console.log('err', error);
  if (error.response) {
    const { data } = error.response;
    // const token = getToken();
    if (error.response.status === 403) {
      Message.error({
        content: data.errMessage || '没有权限',
        duration: 3 * 1000,
      });
    }
    if (error.response.status === 400) {
      Message.error({
        content: data || '登录失败',
        duration: 3 * 1000,
      });
    }
    if (error.response.status === 401) {
      // console.log('[401]', error)
      Modal.error({
        title: '确认退出',
        content: '未授权，请重新登陆',
        okText: '重新登陆',
        async onOk() {
          const userStore = useUserStore();

          await userStore.logout();
          window.location.reload();
        },
      });
    }
    if (error.response.status === 500) {
      Message.error({
        content: '出错了',
        duration: 3 * 1000,
      });
    }
    if (error.response.status === 502) {
      Message.error({
        content: '禁止',
        duration: 3 * 1000,
      });
    }
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config) => {
  const token = getToken();
  console.log('[token]', token);
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config;
}, err);

// response interceptor
service.interceptors.response.use((response) => {
  const resp = response.data;
  console.log('[resp]', response);
  if (response.status !== 200) {
    Message.error({
      content: resp.errMessage || '服务器出了点小差，请稍后再试',
      duration: 3 * 1000,
    });
    return Promise.reject(new Error('error'));
  }
  //  else {
  if (resp.errCode === '1') {
    // 统一处理异常提示
    Message.error({
      content: resp.errMessage || '出现问题了',
      duration: 3 * 1000,
    });
  }
  if (!response.config.responseType || response.config.responseType !== 'blob') return resp;
  return response;
  // }
}, err);

// export default service;

// export default { request }
