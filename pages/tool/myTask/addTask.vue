<template>
	<view class="addTask">
		<view class="form-item first-form-item">
			<view class="item-label">任务标题</view>
			<input class="item-input" v-model="taskState.task_title" placeholder="请输入任务标题" />
		</view>
		<view class="form-item">
			<view class="item-label">任务内容</view>
			<textarea class="item-textarea" v-model="taskState.task_content" placeholder="请输入任务内容" />
		</view>
		<view class="form-item">
			<view class="item-label">背景颜色</view>
			<view class="item-input">
				<view class="tag-view" v-for="(item, index) in tagColorList">
					<uni-tag
						class="tag-color"
						:class="{ 'tag-color-selected': tagSelectedIndex === index }"
						:text="item.text"
						:custom-style="{
							backgroundColor: tagSelectedIndex === index ? item.selectedColor : item.color,
							borderColor: tagSelectedIndex === index ? item.selectedColor : item.color
						}"
						@click="tagSelectedHandle(index)"
					/>
				</view>
			</view>
		</view>
		<view class="form-btn">
			<button type="primary" @click="saveHandle()">保存</button>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { ref, reactive } from 'vue';
import { myTaskAdd, myTaskUpdate } from '@/api/myTask.api';

const action = ref('ADD');
const taskState = reactive({
	id: null,
	task_date: '',
	task_index: 1,
	task_title: '',
	task_content: '',
	task_color: '#d4e4ff'
});
const tagSelectedIndex = ref(0);
// 背景颜色
const tagColorList = [
	{ text: '蓝色', color: '#d4e4ff', selectedColor: '#2979ff' },
	{ text: '绿色', color: '#d1f2d7', selectedColor: '#18bc37' },
	{ text: '黄色', color: '#fdedd9', selectedColor: '#f3a73f' },
	{ text: '红色', color: '#fad8d6', selectedColor: '#e43d33' },
	{ text: '灰色', color: '#e9e9eb', selectedColor: '#8f939c' }
];
onLoad((option) => {
	action.value = option.action;
	if (option.action === 'ADD') {
		uni.setNavigationBarTitle({
			title: '新增任务'
		});
		taskState.task_date = option.taskDate;
		taskState.task_index = option.taskIndex;
	} else {
		uni.setNavigationBarTitle({
			title: '修改任务'
		});
		taskState.id = option.id;
		taskState.task_title = option.taskTitle;
		taskState.task_content = option.taskContent;
		taskState.task_color = option.taskColor;
		tagSelectedIndex.value = tagColorList.findIndex((item) => item.color === option.taskColor);
	}
});

onUnload(() => {
	taskState.id = null;
	taskState.task_date = '';
	taskState.task_index = 1;
	taskState.task_title = '';
	taskState.task_content = '';
	taskState.task_color = '#d4e4ff';
});

// 颜色标签选中
const tagSelectedHandle = (index) => {
	tagSelectedIndex.value = index;
	taskState.task_color = tagColorList[index].color;
};

// 保存任务数据
const saveHandle = async () => {
	if (taskState.task_title === '') {
		uni.showToast({
			title: '请输入任务标题！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	// if (taskState.task_content === '') {
	// 	uni.showToast({
	// 		title: '请输入任务内容！',
	// 		position: 'top',
	// 		icon: 'none'
	// 	});
	// 	return;
	// }
	if (action.value === 'ADD') {
		let param = {
			task_date: taskState.task_date,
			task_index: taskState.task_index,
			task_title: taskState.task_title,
			task_content: taskState.task_content,
			task_status: 0,
			task_color: taskState.task_color
		};
		await myTaskAdd(param);
	} else {
		let param = {
			task_title: taskState.task_title,
			task_content: taskState.task_content,
			task_color: taskState.task_color
		};
		await myTaskUpdate(taskState.id, param);
	}
	uni.navigateBack();
};
</script>

<style scoped lang="scss">
uni-page-body {
	height: 100%;
}
.addTask {
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #f8f8f8;
}
.first-form-item {
	padding-top: 12px;
}
.form-item {
	background-color: #ffffff;
	.item-label {
		height: 40px;
		line-height: 40px;
		background-color: #f8f8f8;
		padding: 0 12px;
		font-size: 16px;
	}
	.item-input {
		height: 40px;
		line-height: 40px;
		padding: 0 12px;
		font-size: 16px;
		display: flex;
	}
	.item-textarea {
		width: calc(100% - 24px);
		height: 120px;
		padding: 6px 12px;
		font-size: 16px;
	}
}
.form-btn {
	padding: 12px;
	background-color: #f8f8f8;
}
.tag-view {
	margin-right: 15px;
	.tag-color {
		color: #111111;
		font-size: 14px;
		font-weight: 400;
	}
	.tag-color-selected {
		color: #ffffff;
	}
}
</style>
