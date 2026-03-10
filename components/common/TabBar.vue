<template>
	<view class="tabBar" ref="tabBar">
		<view class="tabBar-border"></view>
		<view class="tabBar-main">
			<view class="tabBar-item" v-for="(item, index) in tabBarData" @click="tabBarChangeHandle(index)">
				<view class="tabBar-item-icon">
					<image :src="'/static/icons/' + item.icon + '.svg'" style="width: 24px; height: 24px"></image>
				</view>
				<view class="tabBar-item-text" :class="{ 'tabBar-item-selected': selectedIndex === index }">{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	tabBarData: {
		type: Array,
		default: []
	},
	selectedIndex: {
		type: Number,
		default: 0
	}
});
const emit = defineEmits(['change']);

const tabBarChangeHandle = (index) => {
	emit('change', { index: index });
};
</script>

<style scoped lang="scss">
.tabBar {
	height: 50px;
	display: flex;
	flex-direction: column;
	.tabBar-border {
		width: 100%;
		height: 1px;
		transform: scaleY(0.5);
		background-color: rgba(0, 0, 0, 0.33);
	}
	.tabBar-main {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
}
.tabBar-item {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex: 1;
	font-size: 0;
	text-align: center;
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	.tabBar-item-icon {
	}
	.tabBar-item-text {
		color: $menger-tab-color;
		font-size: $menger-font-size-12;
		line-height: normal;
		margin-top: 3px;
		text-align: center;
	}
	.tabBar-item-selected {
		color: $menger-tab-selectedColor;
	}
}
</style>
