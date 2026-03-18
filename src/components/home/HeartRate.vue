<template>
	<view class="card" :style="{ height: cardHeight }">
		<view class="title">心率图</view>
		<view class="chart">
			<qiun-data-charts :canvas2d="true" type="column" :opts="opts" :chartData="chartData" />
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { CHART_COLORS } from '@/constant.js';
import { getBloodHeart } from '@/api/blood.api.js';

const props = defineProps({
	cardHeight: String
});

const chartData = ref(null);
const opts = ref({
	color: CHART_COLORS,
	padding: [15, 15, 0, 5],
	enableScroll: false,
	legend: {},
	xAxis: {
		disableGrid: true
	},
	yAxis: {
		data: [
			{
				min: 0
			}
		]
	},
	extra: {
		column: {
			type: 'group',
			width: 30,
			activeBgColor: '#000000',
			activeBgOpacity: 0.08
		}
	}
});

onShow(async () => {
	const res = await getBloodHeart();
	initData(res);
});

// 初始化数据，将接口返回的数据转换为图表需要的数据格式
const initData = (res) => {
	if (res.success && res.data) {
		let categories = [];
		let seriesHeart = [];

		res.data.forEach((item) => {
			categories.push(item.blood_date.slice(5));
			seriesHeart.push(item.blood_heart);
		});
		const data = {
			categories: categories.slice().reverse(),
			series: [{ name: '心率', data: seriesHeart.slice().reverse() }]
		};
		chartData.value = JSON.parse(JSON.stringify(data));
	}
};
</script>

<style scoped lang="scss">
.card {
	height: 362rpx;
	padding: $menger-page-padding;
	display: flex;
	flex-direction: column;
	.title {
		width: 100%;
		height: 12%;
		text-align: center;
		color: $menger-font-color;
		font-size: $menger-font-size-16;
		line-height: $menger-font-size-16;
	}
	.chart {
		width: 100%;
		height: 88%;
	}
}
</style>
