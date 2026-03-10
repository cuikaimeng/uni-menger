// 封装 uni.request 方法
import {
	BASE_URL_API
} from '@/constant.js';
// 请求队列（防重复提交）
const pendingRequests = new Map();

// 白名单
const WRITE_LIST = ['/verify']

// 请求拦截器
uni.addInterceptor("request", {
	invoke(options) {
		// 自动补全URL
		if (!options.url.startsWith("http")) {
			options.url = BASE_URL_API + options.url;
		}
		let url = options.url.split('?')[0] // 去除GET请求参数部分
		const requestKey = options.method + "-" + options.url;
		if (pendingRequests.has(requestKey)) {
			return false; // 阻止重复请求
		}
		pendingRequests.set(requestKey, true);

		// 自动添加Token
		const token = uni.getStorageSync("token");
		options.header = {
			"Content-Type": "application/json",
			...(token && {
				Authorization: `Bearer ${token}`
			}),
			...options.header,
		};

		// 默认超时10秒
		options.timeout = options.timeout || 10000;
	},
	complete(res, options) {
		let url = options.url.split('?')[0] // 去除GET请求参数部分
		const requestKey = options.method + "-" + url;
		pendingRequests.delete(requestKey);
	}
});

// 核心请求方法
export const request = (options) => {
	console.log('request', options)
	return new Promise((resolve, reject) => {
		uni.request({
			...options,
			success: (res) => {
				if (WRITE_LIST.includes(options.url)) {
					resolve(res.data);
				} else {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						if (res.data.success) {
							resolve(res.data);
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.data.message,
								icon: "none",
							});
							reject(res.data)
						}
					} else {
						// 统一错误处理
						const errorMap = {
							400: "请求参数错误",
							401: "请重新登录",
							403: "权限不足",
							404: "资源不存在",
							500: "服务器错误",
							502: "网关错误",
						};
						uni.hideLoading();
						uni.showToast({
							title: errorMap[res.statusCode] || `请求失败: ${res.statusCode}`,
							icon: "none",
						});
						reject(res);
					}
				}
			},
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({
					title: "网络连接失败",
					icon: "none"
				});
				reject(err);
			},
		});
	});
};

// 快捷方法封装
export const http = {
	get(url, params) {
		return request({
			url: url,
			method: "GET",
			data: params
		});
	},
	post(url, data) {
		return request({
			url: url,
			method: "POST",
			data
		});
	},
	put(url, data) {
		return request({
			url: url,
			method: "PUT",
			data
		});
	},
	delete(url, params) {
		return request({
			url: url,
			method: "DELETE",
			data: params
		});
	},
	upload(filePath, formData) {
		return uni.uploadFile({
			url: BASE_URL_API + "/upload",
			filePath,
			name: "file",
			formData,
			header: {
				Authorization: uni.getStorageSync("token"),
			},
		});
	},
};