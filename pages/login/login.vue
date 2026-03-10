<template>
	<view class="wrap">
		<!-- <view class="title">萌二之家</view> -->
		<view class="logo">
			<image src="/static/logo2.png" style="width: 160px; height: 160px"></image>
		</view>
		<uni-segmented-control :current="current" :values="items" @clickItem="tabChangeHandle" styleType="button" activeColor="#2979ff"></uni-segmented-control>
		<view class="content">
			<view v-show="current === 0" class="content-item content-login">
				<view class="phone">
					<uni-icons type="person" color="#b9b9b9" size="35"></uni-icons>
					<input class="uni-input" placeholder="手机号" placeholder-style="color: #b9b9b9" @input="phoneInput" v-model="phone" />
					<uni-icons class="uni-icon-clear" v-if="showPhoneClearIcon" type="clear" size="30" color="#b9b9b9" @click="phoneClearHandle"></uni-icons>
				</view>
				<view class="password">
					<uni-icons type="locked" color="#b9b9b9" size="35"></uni-icons>
					<input class="uni-input" placeholder="密码" placeholder-style="color: #b9b9b9" :password="showPassword" v-model="password" />
					<uni-icons class="uni-icon-eye" type="eye-filled" size="30" :color="eyeColor" @click="showPasswordHandle"></uni-icons>
				</view>
				<view class="forget" @click="forgetHandle()">忘记密码</view>
				<button class="uni-btn" type="primary" @click="loginHandle()">登录</button>
			</view>
			<view v-show="current === 1" class="content-item content-register">
				<view class="phone">
					<uni-icons type="person" color="#b9b9b9" size="35"></uni-icons>
					<input class="uni-input" placeholder="手机号" placeholder-style="color: #b9b9b9" @input="registerPhoneInput" v-model="registerPhone" />
					<uni-icons class="uni-icon-clear" v-if="showRegisterPhoneClearIcon" type="clear" size="30" color="#b9b9b9" @click="registerPhoneClearHandle"></uni-icons>
				</view>
				<view class="password">
					<uni-icons type="locked" color="#b9b9b9" size="35"></uni-icons>
					<input class="uni-input" placeholder="密码" placeholder-style="color: #b9b9b9" password v-model="registerPassword" />
				</view>
				<view class="password">
					<uni-icons type="locked" color="#b9b9b9" size="35"></uni-icons>
					<input class="uni-input" placeholder="确认密码" placeholder-style="color: #b9b9b9" password v-model="registerPassword2" />
				</view>
				<button class="uni-btn" type="primary" @click="registerHandle()">注册</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { validatePhone } from '@/utils/validate.js';
import { register } from '@/api/login.api.js';
import { useUserStore } from '@/store/useUserStore.js';
import { encrypt } from '@/utils/crypto.js';

const userStore = useUserStore();

const items = ref(['登录', '注册']);
const current = ref(0);
const phone = ref('');
const password = ref('');
const showPhoneClearIcon = ref(false);
const showPassword = ref(true);
const eyeColor = ref('#b9b9b9');
const registerPhone = ref('');
const registerPassword = ref('');
const registerPassword2 = ref('');
const showRegisterPhoneClearIcon = ref(false);

// tab切换
const tabChangeHandle = (e) => {
	if (current.value != e.currentIndex) {
		current.value = e.currentIndex;
		resetInput();
	}
};

// 重置输入框
const resetInput = () => {
	phone.value = '';
	password.value = '';
	showPhoneClearIcon.value = false;
	showPassword.value = true;
	registerPhone.value = '';
	registerPassword.value = '';
	registerPassword2.value = '';
	showRegisterPhoneClearIcon.value = false;
};

// 手机号输入框输入事件
const phoneInput = (event) => {
	if (event.detail.value.length > 0) {
		showPhoneClearIcon.value = true;
	} else {
		showPhoneClearIcon.value = false;
	}
};

// 手机号输入框清空按钮点击事件
const phoneClearHandle = () => {
	phone.value = '';
	showPhoneClearIcon.value = false;
};

// 密码框显示密码
const showPasswordHandle = () => {
	eyeColor.value = showPassword.value ? '#2979ff' : '#b9b9b9';
	showPassword.value = !showPassword.value;
};

// 登录
const loginHandle = () => {
	if (phone.value === '') {
		uni.showToast({
			title: '请输入手机号！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (!validatePhone(phone.value)) {
		uni.showToast({
			title: '手机号格式不正确！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (password.value === '') {
		uni.showToast({
			title: '请输入密码！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	let params = {
		phone: phone.value,
		password: encrypt(password.value)
	};
	userStore.login(params);
};

// 忘记密码
const forgetHandle = () => {};

// 注册手机号输入框输入事件
const registerPhoneInput = (event) => {
	if (event.detail.value.length > 0) {
		showRegisterPhoneClearIcon.value = true;
	} else {
		showRegisterPhoneClearIcon.value = false;
	}
};

// 注册手机号输入框清空按钮点击事件
const registerPhoneClearHandle = () => {
	registerPhone.value = '';
	showRegisterPhoneClearIcon.value = false;
};

// 注册
const registerHandle = async () => {
	if (registerPhone.value === '') {
		uni.showToast({
			title: '请输入手机号！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (!validatePhone(registerPhone.value)) {
		uni.showToast({
			title: '手机号格式不正确！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (registerPassword.value === '') {
		uni.showToast({
			title: '请输入密码！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (registerPassword2.value != registerPassword.value) {
		uni.showToast({
			title: '两次密码输入不一致！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	let params = {
		phone: registerPhone.value,
		password: encrypt(registerPassword.value)
	};
	uni.showLoading({
		title: '注册中，请稍等...'
	});
	const res = await register(params);
	if (res.success) {
		uni.hideLoading();
		uni.showToast({
			title: '注册成功！',
			position: 'top',
			icon: 'success'
		});
		current.value = 0;
		resetInput();
	}
};
</script>

<style scoped lang="scss">
uni-page-body {
	height: 100%;
	overflow: hidden;
}
.wrap {
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding: 30% 10%;
	justify-content: start;
	.title {
		font-size: 60rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30px;
	}
	.logo {
		// font-size: 60rpx;
		// font-weight: bold;
		// text-align: center;
		display: flex;
		justify-content: center;
		margin-bottom: 30px;
	}
	.content {
		padding-top: 30px;
		.content-item {
			.phone {
				height: 70px;
				border: 1px solid #b9b9b9;
				border-radius: 35px;
				padding-right: 15px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-bottom: 30px;
				.uni-icons {
					width: 70px;
				}
				.uni-icon-clear {
					width: 30px;
				}
				.uni-input {
					flex: 1;
				}
			}
			.password {
				height: 70px;
				border: 1px solid #b9b9b9;
				border-radius: 35px;
				padding-right: 15px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-bottom: 30px;
				.uni-icons {
					width: 70px;
				}
				.uni-icon-eye {
					width: 30px;
				}
				.uni-input {
					flex: 1;
				}
			}
			.uni-btn {
				width: 100%;
				height: 70px;
				line-height: 70px;
				border-radius: 35px;
			}
		}
		.content-login {
			.forget {
				width: 100%;
				height: 30px;
				line-height: 30px;
				padding-right: 20px;
				margin-bottom: 30px;
				text-align: right;
				color: $uni-primary;
			}
		}
	}
}
</style>
