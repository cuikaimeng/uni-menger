<template>
	<view class="mime">
		<view class="custom-navbar">我的</view>
		<view class="banner">
			<view class="avatar">
				<image mode="aspectFill" :src="userStore.getAvatar" style="width: 100%; height: 100%"></image>
			</view>
			<view class="username">{{ userName }}</view>
		</view>
		<view class="list">
			<uni-list>
				<uni-list-item v-for="(item, index) in mimeList" :title="item.title" :showArrow="true" :clickable="true" :showExtraIcon="true" :extraIcon="item.extraIcon"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/useUserStore.js';
import { onPageShow } from '@dcloudio/uni-app';
import { BASE_URL } from '@/constant.js';

const userStore = useUserStore();
const userName = computed(() => {
	return userStore.name;
});
const mimeList = ref([
	{ title: '个人信息', extraIcon: { color: '#2979ff', size: '26', type: 'contact' } },
	{ title: '关于我们', extraIcon: { color: '#2979ff', size: '26', type: 'info' } },
	{ title: '版本更新', extraIcon: { color: '#2979ff', size: '26', type: 'wallet' } },
	{ title: '系统设置', extraIcon: { color: '#2979ff', size: '26', type: 'gear' } }
]);
</script>

<style scoped lang="scss">
uni-page-body {
	height: 100%;
}
.mime {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.custom-navbar {
	width: 100%;
	position: fixed;
	left: var(--window-left);
	right: var(--window-right);
	height: calc(44px + env(safe-area-inset-top));
	padding: 7px 3px;
	padding-top: calc(7px + env(safe-area-inset-top));
	justify-content: space-between;
	box-sizing: border-box;
	z-index: 998;
	transition-property: all;
	font-weight: bold;
	font-size: 16px;
	line-height: 30px;
	text-align: center;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.banner {
	height: 35%;
	background: linear-gradient(to right, rgba(79, 172, 254, 1), rgba(124, 195, 252, 0.5));
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.avatar {
		width: 250rpx;
		height: 250rpx;
		border-radius: 50%;
		margin-top: 80rpx;
		margin-bottom: 30rpx;
		background-color: aqua;
		overflow: hidden;
	}
	.username {
		width: 100%;
		height: 60rpx;
		text-align: center;
		font-size: 32rpx;
		line-height: 60rpx;
		font-weight: bold;
	}
}
.list {
	flex: 1;
	padding: $menger-page-padding 0;
}
:deep(.uni-list-item__content-title) {
	color: $menger-font-color;
}
:deep(.uni-list-item__icon) {
	display: flex;
}
</style>
