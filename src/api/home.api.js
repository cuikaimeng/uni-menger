// 血压数据接口
import { http } from "@/utils/request.js";

const API = {
	home_comp: "/home/comp",
};

//获取高德天气信息
export const getWeatherInfo = (data) => {
	return uni.request({
		url: "https://restapi.amap.com/v3/weather/weatherInfo",
		data: data,
	});
};

// 获取近期的血压数据
export const getBloodCurrents = () => http.get(API.blood_current);