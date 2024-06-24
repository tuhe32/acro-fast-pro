/* eslint-disable no-restricted-properties */
/* eslint-disable prefer-exponentiation-operator */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
/* eslint-disable radix */
export function anyRequire(message: string, trigger = 'blur') {
  return { required: true, message, trigger };
}
export function dateRequire(message: string, trigger = 'change') {
  return { type: 'date', required: true, message, trigger };
}
export function arrayRequire(message: string, trigger = 'change') {
  return { type: 'array', required: true, message, trigger };
}
export function numberRequire(message: string, trigger = 'change') {
  return { type: 'number', required: true, message, trigger };
}
export function email(message: string, trigger = 'blur') {
  return { type: 'email', message, trigger };
}
export function number(message: string, trigger = 'blur') {
  const transform = (value?: any) => {
    if (value) return value - 0;
    return 0;
  };
  return { type: 'number', transform, message, trigger };
}
export function pattern(patternStr: string, message: string, trigger = 'blur') {
  return { type: 'string', pattern: patternStr, message, trigger };
}
export function validateConfirm(rule: any, value: string, data: string, messages: string[]) {
  if (value === '') return Promise.reject(messages[0]);
  if (value !== data) return Promise.reject(messages[1]);
  return Promise.resolve();
}
export function validateTime(rule: any, value: Date, data: Date, messages: string[]) {
  if (!value) return Promise.reject(messages[0]);
  if (value <= data) return Promise.reject(messages[1]);
  return Promise.resolve();
}
export function validateIdCard(rule: any, value: string) {
  if (value === '') return Promise.reject(new Error('请填写身份证号'));
  const aCity: Record<number, string> = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };
  let iSum = 0;
  if (!/^\d{17}(\d|x)$/i.test(value)) return Promise.reject(new Error('你输入的身份证长度或格式错误'));
  value = value.replace(/x$/i, 'a');
  if (aCity[parseInt(value.substr(0, 2))] == null) return Promise.reject(new Error('你的身份证地区非法'));
  const sBirthday = value.substr(6, 4) + '-' + Number(value.substr(10, 2)) + '-' + Number(value.substr(12, 2));
  const d = new Date(sBirthday.replace(/-/g, '/'));
  if (sBirthday !== d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
    return Promise.reject(new Error('身份证上的出生日期非法'));
  for (let i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
  if (iSum % 11 !== 1) return Promise.reject(new Error('你输入的身份证号非法'));
  return Promise.resolve();
}
/**
 * 动态校验工具方法，根据一个布尔值，动态确定是否进行校验
 * 将已有的校验方法作为参数，进而进行统一的封装
 * @param {*} isValid
 * @param {*} func
 */
export const validDynamic = (isValid: boolean, func: () => void) => {
  return isValid ? func() : {};
};
