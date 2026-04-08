// 字典表相关接口
import { http } from "@/utils/request.js";

const API = {
	dict_type_list: "/dict/type", // 字典类型列表
	dict_data_list: "/dict/data", // 字典数据列表
};

/**
 * 分页获取字典类型列表
 * 
 * @param {Object} params - 请求参数
 * @param {number} params.limit - 每页显示的条数 (条数)
 * @param {number} params.offset - 数据起始偏移量 (偏移量)
 * 
 * @returns {Promise<Object>} 返回一个 Promise 对象
 * @returns {number} res.code - 状态码 (如: 200 成功)
 * @returns {Object} res.data - 结果集
 * @returns {Array} res.data.list - 字典类型数组 [{dict_id, dict_name, dict_type, ...}]
 * @returns {number} res.data.total - 总记录数，用于前端分页器计算
 */
export const dictTypeList = (params) => http.post(API.dict_type_list, params);
export const dictDataList = (params) => http.post(API.dict_data_list, params);