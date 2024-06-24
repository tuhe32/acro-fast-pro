import axios, { AxiosRequestConfig } from 'axios';
// import { useUserStore } from '@/store';
// import { Message, Modal } from '@arco-design/web-vue';
// import { notification } from 'ant-design-vue'
// import { VueAxios } from './axios'
// import { getToken } from '@/utils/auth';
import { Result } from '@/types/global';
// import { getServiceEnvConfig } from '../../.env-config'

// import config from '@/config/defaultSettings'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // api base_url
  timeout: 30000, // 请求超时时间
});

// const installer = {
//   vm: {},
//   install(Vue: any) {
//     Vue.use(VueAxios, service);
//   }
// };

// function useFetch(fetchParam: FetchParam): FetchResult {
//   let results: any = null
//   const loading = ref(false)
//   const hasErrors = ref(null)

//   loading.value = true
//   service(fetchParam)
//     .then((resp) => {
//       console.log(resp)
//       results = resp.data
//     })
//     .catch((err) => {
//       hasErrors.value = err.message
//     })
//     .finally(() => {
//       loading.value = false
//     })

//   return {
//     loading,
//     results,
//     hasErrors,
//   }
// }

function request(config: AxiosRequestConfig) {
  return service.request<any, Result>(config);
}
// export default request

export { service, request };
