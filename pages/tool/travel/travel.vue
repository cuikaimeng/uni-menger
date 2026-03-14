<template>
	<view class="travel">
		<view class="travel-main">
			<view class="travel-map">
				<ChinaMap :mapData="mapData" @change="mapChange" />
			</view>
			<view class="travel-books">
				<Waterfall :list="dataList" :loading="isFetching" :finished="isEnd" @load-more="loadNextPage" />
			</view>
		</view>
		<view class="travel-add" @click="travelAddHandle">
			<image :src="'/static/icons/add-one.svg'" style="width: 40px; height: 40px"></image>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';
import ChinaMap from '@/components/map/ChinaMap.vue';
import TravelBook from './TravelBook.vue';
import { travelList, travelMap } from '@/api/travel.js';
import Waterfall from '@/pages/tool/travel/TravelBooks.vue';

const mapDataChina = ref([]); // 保存一份全国地图数据
const mapData = ref([]);
const dataList = ref([]);
const isFetching = ref(false);
const isEnd = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 地图改变，更新数据
const mapChange = async (data) => {
	if (data.code === 'china') {
		// 判断全国地图数据是否为空，为空则重新请求数据，不为空则直接附值
		if (mapDataChina.value.length === 0) {
			const res = await travelMap({code : data.code});
			let rawData = res.data;
			let codeList = [];
			rawData.forEach((item) => {
				codeList.push(item.travel_province_code)
			})
			mapData.value = codeList;
			mapDataChina.value = codeList;
		} else {
			mapData.value = mapDataChina.value
		}
	} else {
		const res = await travelMap({code : data.code});
		let rawData = res.data;
		let codeList = [];
		rawData.forEach((item) => {
			codeList.push(item.travel_city_code)
		})
		mapData.value = codeList;
	}
	console.log('地图数据更新', data.code, mapData.value)
}

// 懒加载路书数据
const loadNextPage = async () => {
	isFetching.value = true;
	const params = { 
		limit: pageSize.value,
		offset: (page.value - 1) * pageSize.value,
	}
	const res = await travelList(params);
	const newItems = await res.data;

	if (newItems.length === 0) {
		isEnd.value = true;
	} else {
		dataList.value.push(...newItems);
		page.value++;
	}
	isFetching.value = false;
};

// 新增数据
const travelAddHandle = () => {
	// TODO
}
</script>

<style scoped lang="scss">
.travel {
	display: flex;
	flex-direction: column;
	background-color: $uni-bg-color;
}

.travel-main {
	padding: $menger-page-padding;
}

.travel-add {
	position: fixed;
	bottom: 24px;
	right: 24px;
}

.travel-map {
	width: calc(100%);
	height: 256px;
	margin-bottom: 12px;
	// padding: 12px;
}

.travel-books {}
</style>