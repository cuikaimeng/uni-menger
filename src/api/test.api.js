// 血压数据接口
import { http } from "@/utils/request.js";

const API = {
	test_add: "/test/add",
};

// 测试新增后获取自增 id
export const testAdd = (params) => http.post(API.test_add, params);