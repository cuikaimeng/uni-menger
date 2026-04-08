// 我的任务相关接口
import { http } from "@/utils/request.js";

const API = {
	task_list: "/myTask/list", // 任务列表
	task_add: "/myTask/add", // 任务新增
	task_update: "/myTask/update", // 任务修改
	task_delete: "/myTask/delete", // 任务删除
	task_update_status: "/myTask/update/status", // 任务状态更新
};

export const myTaskList = (params) => http.get(API.task_list, params);
export const myTaskAdd = (params) => http.post(API.task_add, params);
export const myTaskUpdate = (id, params) => http.post(API.task_update + '/' + id, params);
export const myTaskDelete = (id) => http.delete(API.task_delete + '/' + id);
export const myTaskUpdateStatus = (params) => http.post(API.task_update_status, params);