<template>
	<view class="card">
		<swiper class="u-swiper" autoplay="true" interval="5000" circular="ture">
			<swiper-item v-for="(item, index) in list">
				<image mode="aspectFill" :src="item.src" style="width: 100%; height: 100%"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { BASE_URL } from '@/constant.js';

const list = ref([
	{ src: BASE_URL + '/images/photo/home_1.jpg' },
	{ src: BASE_URL + '/images/photo/home_2.jpg' },
	{ src: BASE_URL + '/images/photo/home_3.jpg' },
	{ src: BASE_URL + '/images/photo/home_4.jpg' },
	{ src: BASE_URL + '/images/photo/home_5.jpg' }
]);
</script>

<style scoped lang="scss">
.card {
	height: 410rpx;
	padding: 0;
	border-radius: 24rpx;
	overflow: hidden;
	transform: translateY(0);
	uni-swiper {
		height: 100%;
		width: 100%;
	}
}
</style>
