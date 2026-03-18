<template>
	<view class="travel-book">
		<view class="book-img">
			<image 
				mode="widthFix" 
				:src="BASE_URL + '/images/travel/' + bookData.travel_image" 
				style="width: 100%; height: 100%; border-radius: 4px 4px 0 0" 
				@load="$emit('load')"
			></image>
		</view>
		<view class="book-title">{{ bookData.travel_title }}</view>
		<view class="book-foot">
			<view class="book-attraction">{{ travelCityName + '•' + bookData.travel_attraction }}</view>
			<view class="book-user">
				<image mode="aspectFill" :src="BASE_URL + '/images/avatar/' + bookData.travel_user_avatar + '.jpg'" style="width: 100%; height: 100%"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { BASE_URL } from '@/constant.js';
import { useUserStore } from '@/store/useUserStore.js';

const props = defineProps({
	bookData: {
		type: Object,
		default: () => ({
			travel_title: '',
			travel_city_name: '',
			travel_attraction: '',
			travel_image: '',
			travel_user_avatar: ''
		})
	},
	bookIndex: {
		type: Number,
		default: 0
	}
});
defineEmits(['load']);
const travelImage = ref('travel1');
const userStore = useUserStore();
const travelCityName = computed(() => {
	return props.bookData.travel_city_name.replace(/市$/, '');
});
</script>

<style scoped lang="scss">
.travel-book {
	break-inside: avoid;
	margin-bottom: 12px;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	background-color: $uni-white;
}
.book-img {
	width: 100%;
	height: auto;
	flex: 1;
	border-radius: 4px 4px 0 0;
}
.book-title {
	width: calc(100% - 8px); /* 1. 必须设置宽度 (或者 max-width) */
	display: -webkit-box; /* 2. 设置为弹性盒子 */
	-webkit-box-orient: vertical; /* 3. 盒子排列方向为垂直 */
	-webkit-line-clamp: 2; /* 4. 限制显示的行数 (2行) */
	overflow: hidden; /* 5. 溢出隐藏 */
	text-overflow: ellipsis; /* 6. 文本溢出显示省略号 */
	white-space: normal; /* 7. 禁止内容自动换行 (配合 -webkit-box 使用) */
	font-size: 14px;
	font-weight: bolder;
	color: #333;
	line-height: 1.5; /* 建议设置行高，便于计算高度 */
	padding: 0 4px 0 4px;
}
.book-foot {
	height: 24px;
	font-size: 14px;
	border-radius: 0 0 4px 4px;
	padding: 0 4px 0 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.book-attraction {
		flex: 1;
		height: 24px;
		line-height: 24px;
		color: $uni-secondary-color;
	}
	.book-user {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		overflow: hidden;
	}
}
</style>
