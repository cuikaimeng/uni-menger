import {
	defineStore
} from 'pinia';
import {
	login,
	logout
} from '@/api/login.api.js';
import {
	getUserInfo
} from '@/api/user.api.js';
import {
	BASE_URL
} from '@/constant.js'

export const useUserStore = defineStore({
	id: 'useUserStore',
	state: () => {
		return {
			id: null, // 用户id
			role: '', // 角色
			name: '', // 名称
			phone: '', // 手机号
			weixin: '', // 微信
			email: '', // 邮箱
			sex: 0, // 性别 0男 1女
			avatar: '', // 头像，注册时给默认头像
			theme: '', // 主题模式 light(默认): 浅色模式 | dark: 暗黑模式
			compa: '', // 首页组件（顶部小组件，最大数量两个）
			compb: '', // 首页组件（大组件，最大数量三个）
		}
	},
	getters: {
		getSex: (state) => {
			return state.sex === 0 ? '男' : '女';
		},
		getAvatar: (state) => {
			return BASE_URL + '/images/avatar/' + state.avatar + '.jpg';
		},
		getTheme: (state) => {
			return state.theme;
		},
		getCompa: (state) => {
			return state.compa.split(',');
		},
		getCompb: (state) => {
			return state.compb.split(',');
		},
	},
	actions: {
		setUser(user) {
			this.role = user.role
			this.name = user.name
			this.phone = user.phone
			this.weixin = user.weixin
			this.email = user.email
			this.sex = user.sex
			this.avatar = user.avatar
			this.theme = user.theme
			this.compa = user.compa
			this.compb = user.compb
		},
		async login(params) {
			uni.showLoading({
				title: '登录中...'
			});
			// 调用接口验证登录参数
			const res = await login(params);
			// 获取token，用户信息
			const token = res.token;
			uni.setStorageSync('token', token);
			const user = res.data;
			uni.setStorageSync('userid', user.id);
			this.setUser(user);
			uni.hideLoading();
			// 跳转到tab首页
			uni.reLaunch({
				url: '/pages/home/home'
			});
		},
		logout(user) {
			// 退出登陆，清除缓存并跳转到登录页
			uni.removeStorageSync('token');
			uni.removeStorageSync('userid');
			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		async initUserInfo() {
			const id = uni.getStorageSync('userid')
			if (id) {
				const res = await getUserInfo({
					id: id
				})
				const user = res.data;
				this.setUser(user);
			}
		}
	}
})