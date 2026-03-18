<template>
	<view class="card">
		<view class="item time">
			<text>{{ weatherState.city }}</text>
			<uni-icons type="location-filled" size="24" color="#b9b9b9"></uni-icons>
		</view>
		<view class="item date">{{ weatherState.temperature + '°' }}</view>
		<view class="item lunar">{{ weatherState.weather }}</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue';
// import { initGaodeServer, queryCity, queryWeather } from '@/utils/gaode';
import { onPageShow } from '@dcloudio/uni-app';

const weatherState = reactive({
	city: '',
	temperature: NaN,
	weather: ''
});

onPageShow(async () => {
	// const AMap = await initGaodeServer();
	// const cityInfo = await queryCity(AMap);
	// const weatherInfo = await queryWeather(AMap, cityInfo.city);
	// weatherState.city = weatherInfo.city;
	// weatherState.temperature = weatherInfo.temperature;
	// weatherState.weather = weatherInfo.weather;
});
</script>

<style scoped lang="scss">
.card {
	height: 276rpx;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	.item {
		display: flex;
		justify-content: start;
		align-items: center;
	}
	.time {
		height: 25%;
		font-size: $uni-font-size-lg;
		color: $menger-font-color;
	}
	.date {
		height: 50%;
		font-size: 64rpx;
		font-weight: bold;
		align-items: start;
	}
	.lunar {
		height: 25%;
		font-size: $uni-font-size-lg;
		color: $menger-font-color;
	}
}
</style>
