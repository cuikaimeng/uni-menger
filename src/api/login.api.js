// 登录相关接口
import {
	http
} from "@/utils/request.js";

const API = {
	login: "/login", // 登录
	logout: "/logout", // 退出登录
	register: "/register", // 注册
	verify: "/verify", // 验证token
};

// 用户登录
export const login = (params) => http.post(API.login, params);
// 用户退出登陆
export const logout = (params) => http.delete(API.logout, params);
// 注册
export const register = (params) => http.post(API.register, {
	role: 'normal',
	name: '用户_' + params.phone,
	phone: params.phone,
	weixin: '',
	password: params.password,
	email: '',
	sex: 0,
	avatar: 'avatar_default',
	compa: 'clock,eventReminder',
	compb: 'photo,bloodPressure,heartRate',
	theme: 'light'
});
// 验证token
export const verify = () => http.post(API.verify);