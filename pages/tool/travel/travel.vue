<template>
	<view class="travel">
		<view class="travel-main">
			<view class="travel-map">
				<ChinaMap />
			</view>
			<view class="travel-books">
				<Waterfall :list="dataList" :loading="isFetching" :finished="isEnd" @load-more="loadNextPage" />
			</view>
		</view>
		<view class="travel-add" @click="travelAddHandle()">
			<image :src="'/static/icons/add-one.svg'" style="width: 40px; height: 40px"></image>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';
import ChinaMap from '@/components/map/ChinaMap.vue';
import TravelBook from './TravelBook.vue';
import { travelList } from '@/api/travel.js';
import Waterfall from '@/pages/tool/travel/TravelBooks.vue'

const dataList = ref([]);
const isFetching = ref(false);
const isEnd = ref(false);
const page = ref(1);
const pageSize = ref(10);

const loadNextPage = async () => {
	isFetching.value = true;
	// 模拟 API 请求
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