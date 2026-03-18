<template>
	<view class="card">
		<view class="title">事件提醒</view>
		<view class="line"></view>
		<view class="date">2025年8月31日</view>
		<view class="content">带田心去打疫苗</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style scoped lang="scss">
.card {
	height: 276rpx;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	.title {
		height: 50rpx;
		text-align: center;
		font-size: $menger-font-size-16;
		color: $menger-font-color;
		line-height: 50rpx;
	}
	.line {
		height: 3rpx;
		background-color: #c7c9ce;
	}
	.date {
		height: 50rpx;
		line-height: 50rpx;
		color: $menger-font-color;
		font-size: $menger-font-size-16;
	}
	.content {
		flex: 1;
		color: $menger-font-color;
		font-size: $menger-font-size-16;
	}
}
</style>
