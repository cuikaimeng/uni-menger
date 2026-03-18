// 旅游路书相关接口
import {
	http
} from "@/utils/request.js";

const API = {
	travel_list: "/travel/list", // 路书列表
	travel_detail: "/travel/detail", // 路书详情
	travel_add: "/travel/add", // 路书新增
	travel_update: "/travel/update", // 路书修改
	travel_delete: "/travel/delete", // 路书删除
	travel_map: "/travel/map", // 路数地图数据
};

export const travelList = (params) => http.post(API.travel_list, params);
export const travelDetail = (params) => http.post(API.travel_detail, params);
export const travelAdd = (params) => http.post(API.travel_add, params);
export const travelUpdate = (id, params) => http.post(API.travel_update + '/' + id, params);
export const travelDelete = (id) => http.delete(API.travel_delete + '/' + id);
export const travelMap = (params) => http.post(API.travel_map, params);