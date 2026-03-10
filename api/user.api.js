// 登录相关接口
import {
	http
} from "@/utils/request.js";

const API = {
	user_info: "/user/info", // 用户信息
	user_list: "/user/list" // 用户列表
};

// 获取用户信息
export const getUserInfo = (params) => http.post(API.user_info, params);
// 获取用户列表
export const getUserList = () => http.get(API.user_list);