<template>
	<view class="wrap">
		<uni-row :gutter="24">
			<uni-col :span="12" v-for="(comp, index) in compAList">
				<view class="item item1">
					<Clock v-if="comp === 'clock'"></Clock>
					<Weather v-if="comp === 'weather'"></Weather>
					<MyTask v-if="comp === 'myTask'"></MyTask>
					<EventReminder v-if="comp === 'eventReminder'"></EventReminder>
				</view>
			</uni-col>
			<uni-col :span="24" v-for="(comp, index) in compBList">
				<view :class="['item', 'item2', index === compBList.length - 1 ? 'lastItem' : '']">
					<BloodPressure v-if="comp === 'bloodPressure'" :cardHeight="'calc(100% - 24px)'"></BloodPressure>
					<HeartRate v-if="comp === 'heartRate'" :cardHeight="'calc(100% - 24px)'"></HeartRate>
					<Photo v-if="comp === 'photo'"></Photo>
					<Sport v-if="comp === 'sport'"></Sport>
					<Travel v-if="comp === 'travel'"></Travel>
				</view>
			</uni-col>
		</uni-row>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import BloodPressure from '@/components/home/BloodPressure.vue';
import Clock from '@/components/home/Clock.vue';
import EventReminder from '@/components/home/EventReminder.vue';
import Photo from '@/components/home/Photo.vue';
import Sport from '@/components/home/Sport.vue';
import Travel from '@/components/home/Travel.vue';
import Weather from '@/components/home/Weather.vue';
import MyTask from '@/components/home/MyTask.vue';
import HeartRate from '@/components/home/HeartRate.vue';
import { useUserStore } from '@/store/useUserStore.js';

const userStore = useUserStore();

const compAList = userStore.getCompa;
const compBList = userStore.getCompb;
</script>

<style scoped lang="scss">
.wrap {
	padding: $menger-page-padding;
}
.item {
	margin-bottom: $menger-page-padding;
	border-radius: $menger-page-padding;
	background-color: $uni-white;
	box-shadow: $uni-shadow-lg;
}
.item1 {
	height: 320rpx;
}
.item2 {
	height: 410rpx;
}
.lastItem {
	margin-bottom: 0;
}
</style>
