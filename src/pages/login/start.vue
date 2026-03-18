<template>
	<view class="start">
		<view class="start-img">
			<image style="width: 300px; height: 225px" src="/static/images/start.png"></image>
		</view>
		<view class="start-text">
			<view class="start-title">萌二之家</view>
			<view class="start-content">记录生活 享受美好</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style scoped lang="scss">
uni-page-body {
	height: 100%;
	overflow: hidden;
}
.start {
	height: 70%;
	display: flex;
	flex-direction: column;
	padding: 30% 0;
	justify-content: space-around;
	.start-img {
		height: 80%;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
	}
	.start-text {
		flex: 1;
		.start-title {
			width: 100%;
			color: $menger-font-color;
			font-size: 24px;
			font-weight: bold;
			text-align: center;
			margin-bottom: 10px;
		}
		.start-content {
			width: 100%;
			color: $uni-base-color;
			font-size: 16px;
			text-align: center;
		}
	}
}
</style>
