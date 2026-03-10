<template>
	<view class="charts-box">
		<qiun-data-charts type="map" canvas2d="" :chartData="chartData" :opts="opts" :pageScrollTop="100" @getIndex="getIndex" />
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import china from '/static/json/china.json';
import p110000 from '/static/json/110000.json';
import p120000 from '/static/json/120000.json';
import p130000 from '/static/json/130000.json';
import p140000 from '/static/json/140000.json';
import p150000 from '/static/json/150000.json';
import p210000 from '/static/json/210000.json';
import p220000 from '/static/json/220000.json';
import p230000 from '/static/json/230000.json';
import p310000 from '/static/json/310000.json';
import p320000 from '/static/json/320000.json';
import p330000 from '/static/json/330000.json';
import p340000 from '/static/json/340000.json';
import p350000 from '/static/json/350000.json';
import p360000 from '/static/json/360000.json';
import p370000 from '/static/json/370000.json';
import p410000 from '/static/json/410000.json';
import p420000 from '/static/json/420000.json';
import p430000 from '/static/json/430000.json';
import p440000 from '/static/json/440000.json';
import p450000 from '/static/json/450000.json';
import p460000 from '/static/json/460000.json';
import p500000 from '/static/json/500000.json';
import p510000 from '/static/json/510000.json';
import p520000 from '/static/json/520000.json';
import p530000 from '/static/json/530000.json';
import p540000 from '/static/json/540000.json';
import p610000 from '/static/json/610000.json';
import p620000 from '/static/json/620000.json';
import p630000 from '/static/json/630000.json';
import p640000 from '/static/json/640000.json';
import p650000 from '/static/json/650000.json';
import p810000 from '/static/json/810000.json';
import p820000 from '/static/json/820000.json';
import p710000 from '/static/json/710000.json';

const provinceGeoMap = new Map();
provinceGeoMap.set('110000', p110000);
provinceGeoMap.set('120000', p120000);
provinceGeoMap.set('130000', p130000);
provinceGeoMap.set('140000', p140000);
provinceGeoMap.set('150000', p150000);
provinceGeoMap.set('210000', p210000);
provinceGeoMap.set('220000', p220000);
provinceGeoMap.set('230000', p230000);
provinceGeoMap.set('310000', p310000);
provinceGeoMap.set('320000', p320000);
provinceGeoMap.set('330000', p330000);
provinceGeoMap.set('340000', p340000);
provinceGeoMap.set('350000', p350000);
provinceGeoMap.set('360000', p360000);
provinceGeoMap.set('370000', p370000);
provinceGeoMap.set('410000', p410000);
provinceGeoMap.set('420000', p420000);
provinceGeoMap.set('430000', p430000);
provinceGeoMap.set('440000', p440000);
provinceGeoMap.set('450000', p450000);
provinceGeoMap.set('460000', p460000);
provinceGeoMap.set('500000', p500000);
provinceGeoMap.set('510000', p510000);
provinceGeoMap.set('520000', p520000);
provinceGeoMap.set('530000', p530000);
provinceGeoMap.set('540000', p540000);
provinceGeoMap.set('610000', p610000);
provinceGeoMap.set('620000', p620000);
provinceGeoMap.set('630000', p630000);
provinceGeoMap.set('640000', p640000);
provinceGeoMap.set('650000', p650000);
provinceGeoMap.set('810000', p810000);
provinceGeoMap.set('820000', p820000);
provinceGeoMap.set('710000', p710000);
// 响应式数据定义
const opts = reactive({
	update: true,
	fontSize: 10,
	extra: {
		map: {
			mercator: true
		}
	}
});
const chartData = reactive({
	series: []
});
const layout = ref('china');

// 生命周期钩子
onMounted(() => {
	drawChina();
});

// 初始化中国地图数据方法定义
const drawChina = () => {
	setTimeout(() => {
		let series = china.features;
		// for (let i = 0; i < series.length; i++) {
		// 	series[i].value = Math.floor(Math.random() * 1000);
		// 	series[i].fillOpacity = series[i].value / 1000;
		// 	series[i].color = '#0D9FD8';
		// }
		chartData.series = series;
	}, 100);
};
// 初始化省份地图数据
const drawProvince = (properties) => {
	console.log('drawProvince', properties);
	if (properties.adcode && provinceGeoMap.has(properties.adcode.toString())) {
		setTimeout(() => {
			let series = provinceGeoMap.get(properties.adcode.toString()).features;
			// for (let i = 0; i < series.length; i++) {
			// 	series[i].value = Math.floor(Math.random() * 1000);
			// 	series[i].fillOpacity = series[i].value / 1000;
			// 	series[i].color = '#0D9FD8';
			// }
			chartData.series = series;
		}, 100);
	}
};

// 点击地图获取点击的索引
const getIndex = (e) => {
	console.log('getIndex', e);
	if (layout.value == 'china') {
		if (e.currentIndex > -1) {
			layout.value = 'province';
			drawProvince(china.features[e.currentIndex].properties);
		}
	} else {
		if (e.currentIndex == -1) {
			layout.value = 'china';
			drawChina();
		}
	}
};
</script>

<style scoped lang="scss">
.charts-box {
	width: 100%;
	height: 100%;
	position: relative;
}
</style>
