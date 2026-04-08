// 我的证件相关接口
import { http } from "@/utils/request.js";

const API = {
	card_list: "/idCard/list", // 证件列表
	card_add: "/idCard/add", // 证件新增
	card_update: "/idCard/update", // 证件修改
	card_delete: "/idCard/delete", // 证件删除
};

export const idCardList = (params) => http.get(API.card_list, params);
export const idCardAdd = (params) => http.post(API.card_add, params);
export const idCardUpdate = (id, params) => http.post(API.card_update + '/' + id, params);
export const idCardDelete = (id) => http.delete(API.card_delete + '/' + id);