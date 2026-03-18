<template>
	<view class="card">
		<view class="item time">{{ currentTime }}</view>
		<view class="item date">{{ currentDate }}</view>
		<view class="item lunar">{{ currentLunar }}</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import { WEEK_LIST_ZH } from '@/constant.js';

const day = ref(dayjs());

const currentTime = computed(() => {
	return day.value.format('HH:mm');
});
const currentDate = computed(() => {
	const date = day.value.format('MM月DD日');
	const week = WEEK_LIST_ZH[Number(day.value.format('d'))];
	return date + '  ' + week;
});
const currentLunar = computed(() => {
	// return day.value.format('LMLD');
	return '';
});
</script>

<style scoped lang="scss">
.card {
	height: 276rpx;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: start;
	.item {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.time {
		height: 45%;
		font-size: 64rpx;
		font-weight: bold;
	}
	.date {
		height: 20%;
		font-size: $menger-font-size-16;
		color: $menger-font-color;
	}
	.lunar {
		height: 35%;
		font-size: $menger-font-size-16;
		color: $menger-font-color;
	}
}
</style>
