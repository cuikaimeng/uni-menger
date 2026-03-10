<template>
	<view class="card" :style="{ height: cardHeight }">
		<view class="title">血压图</view>
		<view class="chart">
			<qiun-data-charts :canvas2d="true" type="line" :opts="opts" :chartData="chartData" enableMarkLine="true" />
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { CHART_COLORS } from '@/constant.js';
import { getBloodPressure } from '@/api/blood.api.js';

const props = defineProps({
	cardHeight: String
});

const chartData = ref(null);
// 折线图配置
const opts = ref({
	color: CHART_COLORS,
	padding: [15, 10, 0, 15],
	enableScroll: false,
	legend: {},
	xAxis: {
		disableGrid: true
	},
	yAxis: {
		disableGrid: true,
		data: [{ min: 40, max: 180 }]
	},
	extra: {
		markLine: {
			type: 'dash',
			data: [
				{
					value: 140,
					lineColor: '#ff9900'
				}
			]
		},
		line: {
			type: 'straight',
			width: 2,
			activeType: 'hollow'
		}
	}
});

onShow(async () => {
	const res = await getBloodPressure();
	initData(res);
});

// 初始化数据，将接口返回的数据转换为图表需要的数据格式
const initData = (res) => {
	if (res.success && res.data) {
		let categories = [];
		let seriesHighP = [];
		let seriesLowP = [];

		res.data.forEach((item) => {
			categories.push(item.blood_date.slice(5));
			seriesHighP.push(item.blood_high_p);
			seriesLowP.push(item.blood_low_p);
		});
		const data = {
			categories: categories.slice().reverse(),
			series: [
				{ name: '高压', data: seriesHighP.slice().reverse() },
				{ name: '低压', data: seriesLowP.slice().reverse() }
			]
		};
		chartData.value = JSON.parse(JSON.stringify(data));
	}
};
</script>

<style scoped lang="scss">
.card {
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
