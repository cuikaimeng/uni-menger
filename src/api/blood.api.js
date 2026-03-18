// 血压数据接口
import {
	http
} from "@/utils/request.js";

const API = {
	blood_current: "/blood/current",
	blood_pressure: "/blood/pressure",
	blood_heart: "/blood/heart",
	blood_add: "/blood/add",
	blood_update: "/blood/update",
	blood_delete: "/blood/delete",
	blood_list: "/blood/list",
	blood_total: "/blood/total"
};

// 获取近期的血压数据（1条数据）
export const getBloodCurrent = () => http.get(API.blood_current);
// 获取近期的血压数据（7条数据）
export const getBloodPressure = () => http.get(API.blood_pressure);
// 获取近期的心率数据（7条数据）
export const getBloodHeart = () => http.get(API.blood_heart);
// 新增血压记录
export const bloodAdd = (params) => http.post(API.blood_add, params);
// 修改血压记录
export const bloodUpdate = (id, params) => http.post(API.blood_update + '/' + id, params);
// 删除血压记录
export const bloodDelete = (id) => http.delete(API.blood_delete + '/' + id);
// 血压数据列表
export const queryBloodList = (params) => http.post(API.blood_list, params);
// 血压数据总数
export const getBloodTotal = () => http.get(API.blood_total);