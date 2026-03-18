<template>
	<view class="card">
		<view class="title">今日任务</view>
		<view class="line"></view>
		<view class="blank" v-if="tasks.length === 0" click="">今日任务还未制定</view>
		<scroll-view class="scroll-view" scroll-y="true" show-scrollbar="false">
			<u-checkbox-group @change="checkboxGroupChange" shape="circle" wrap="true">
				<u-checkbox @change="checkboxChange" v-model="task.checked" v-for="(task, index) in tasks" :key="index" :name="task.name">
					<text :class="{ 'task-complete': task.checked }">{{ task.name }}</text>
				</u-checkbox>
			</u-checkbox-group>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const tasks = ref([
	{ name: '学习', checked: true },
	{ name: '做饭', checked: false },
	{ name: '洗澡', checked: false },
	{ name: '喂鱼', checked: false },
	{ name: '外出', checked: false },
	{ name: '看电视', checked: false },
	{ name: '运动', checked: false }
]);
</script>

<style scoped lang="scss">
.card {
	height: 276rpx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	.title {
		height: 50rpx;
		text-align: center;
		font-size: $menger-font-size-16;
		color: $menger-font-color;
		line-height: 50rpx;
	}
	.line {
		height: 3rpx;
		background-color: #c7c9ce;
	}
	.blank {
		flex: 1;
		color: $menger-font-color;
		font-size: $menger-font-size-16;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.scroll-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: auto;
		.task-complete {
			text-decoration: line-through;
			color: $uni-secondary-color;
		}
	}
}
</style>
