<template>
	<view class="wrap">
		<uni-section title="我的工具" type="line" padding titleFontSize="16px">
			<uni-grid :column="3" :show-border="false" :square="false">
				<uni-grid-item v-for="(item, index) in toolList" :index="index" :key="index">
					<view class="grid-item-box" @click="gridHandle(item)">
						<image :src="'/static/icons/' + item.icon + '.svg'" style="width: 30px; height: 30px"></image>
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</uni-section>
		<uni-section title="小游戏" type="line" padding titleFontSize="16px">
			<uni-grid :column="3" :show-border="false" :square="false">
				<uni-grid-item v-for="(item, index) in gameList" :index="index" :key="index">
					<view class="grid-item-box" @click="gridHandle(item)">
						<image :src="'/static/icons/' + item.icon + '.svg'" style="width: 30px; height: 30px"></image>
						<text class="text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</uni-section>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const toolList = [
	{
		icon: 'list',
		text: '今日任务',
		path: '/pages/tool/myTask/myTask'
	},
	{
		icon: 'remind',
		text: '事件提醒',
		path: ''
	},
	{
		icon: 'notebook-one',
		text: '学习笔记',
		path: ''
	},
	{
		icon: 'treadmill-one',
		text: '运动健康',
		path: ''
	},
	{
		icon: 'heart-rate',
		text: '血压记录',
		path: '/pages/tool/blood/blood'
	},
	{
		icon: 'map-draw',
		text: '旅游路书',
		path: '/pages/tool/travel/travel'
	},
	{
		icon: 'picture-album',
		text: '我的相册',
		path: ''
	},
	{
		icon: 'id-card',
		text: '证件夹',
		path: ''
	}
];
const gameList = [
	{
		icon: 'snake-zodiac',
		text: '贪吃蛇',
		color: '#2979ff',
		path: ''
	},
	{
		icon: 'grid-nine',
		text: '数独',
		color: '#2979ff',
		path: ''
	},
	{
		icon: 'eight-key',
		text: '2048',
		color: '#2979ff',
		path: ''
	}
];

const gridHandle = (item) => {
	uni.navigateTo({
		url: item.path
	});
};
</script>

<style scoped lang="scss">
.wrap {
	padding: $menger-page-padding;
}
.uni-section {
	background-color: $menger-page-background;
}
.grid-item-box {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 0;
	.text {
		color: $menger-font-color;
		font-size: 14px;
		margin-top: 5px;
	}
}
</style>
