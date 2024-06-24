import storage from 'store';
// const TOKEN_KEY = 'token';
export const ACCESS_TOKEN = 'Access-Token';

const isLogin = () => {
  return !!storage.get(ACCESS_TOKEN);
};

const getToken = () => {
  return storage.get(ACCESS_TOKEN);
};

const setToken = (token: string) => {
  storage.set(ACCESS_TOKEN, token);
};

const clearToken = () => {
  storage.remove(ACCESS_TOKEN);
};

export { isLogin, getToken, setToken, clearToken };
