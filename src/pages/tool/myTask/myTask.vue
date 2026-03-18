<template>
	<view class="myTask">
		<view class="calendar">
			<view class="date-zh">{{ curDateZh }}</view>
			<l-date-strip
				:value="curTime"
				switchMode="week"
				:minDate="minDate"
				:maxDate="maxDate"
				:firstDayOfWeek="1"
				bgColor="#fdedd9"
				activeBgColor="#f3a73f"
				@change="dateChangeHandle"
			></l-date-strip>
		</view>
		<view class="list">
			<view class="no-task" v-if="taskList.length === 0">
				<table-report theme="outline" size="60" fill="#c7c7c7" />
				<view>暂无任务</view>
			</view>
			<scroll-view v-else scroll-y="true" class="scroll-Y">
				<uni-swipe-action class="uni-swipe-action" ref="swipeAction">
					<uni-swipe-action-item
						class="scroll-view-item"
						v-for="(task, index) in taskList"
						:right-options="actionOptions"
						:auto-close="false"
						:style="{ backgroundColor: task.task_color }"
						@click="deleteTaskHandle(task, index)"
					>
						<view class="content-box" @click="updateStatusHandle(index)" @longpress="updateTaskHandle(task)">
							<view class="circle">
								<image v-if="task.task_status === 1" :src="'/static/icons/check-one.svg'" style="width: 20px; height: 20px"></image>
								<image v-else :src="'/static/icons/round.svg'" style="width: 20px; height: 20px"></image>
							</view>
							<view class="content">
								<view class="content-title" :class="{ 'content-complete': task.task_status === 1 }">{{ task.task_title }}</view>
								<view class="content-content" :class="{ 'content-complete': task.task_status === 1 }">
									<text>{{ task.task_content }}</text>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</scroll-view>
		</view>
		<view class="footer">
			<button class="footer-btn" type="primary" @click="addTaskHandle()">＋ 新增任务</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';
import dayjs from 'dayjs';
import { myTaskList, myTaskDelete, myTaskUpdateStatus } from '@/api/myTask.api.js';
import { cloneDeep } from 'lodash-es';

const swipeAction = ref(null);
const actionOptions = ref([
	{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}
]);
const curTime = ref(dayjs().valueOf()); // 时间戳
const curDateZh = ref(dayjs(curTime.value).format('YYYY年M月D日')); //当前日期中文
const curDate = ref(dayjs(curTime.value).format('YYYYMMDD')); //当前日期
const minDate = computed(() => {
	return dayjs().subtract(7, 'day').valueOf();
});
const maxDate = computed(() => {
	return dayjs().add(7, 'day').valueOf();
});

const taskList = ref([]); // 任务列表数据
const rawTaskList = ref([]); // 任务列表（原始）

onShow(() => {
	// 页面显示时初始化列表
	init();
});

onHide(async () => {
	// 页面隐藏前更新任务状态
	updateStatus();
});

// 获取任务列表数据
const init = async () => {
	console.log('init');
	const res = await myTaskList({ task_date: curDate.value });
	console.log('res', res);
	taskList.value = res.data;
	rawTaskList.value = cloneDeep(taskList.value);
};

// 更新任务状态
const updateStatus = async () => {
	if (taskList.value.length != 0) {
		const pendingTasks = []; // 存放状态改为进行中的任务id
		const completeTasks = []; // 存放状态改为已完成的任务id
		for (let i = 0; i < taskList.value.length; i++) {
			if (taskList.value[i].task_status != rawTaskList.value[i].task_status) {
				if (taskList.value[i].task_status === 0) {
					pendingTasks.push(taskList.value[i].id);
				} else {
					completeTasks.push(taskList.value[i].id);
				}
			}
		}
		if (pendingTasks.length != 0 || completeTasks.length != 0) {
			let params = {
				pendingTasks: pendingTasks,
				completeTasks: completeTasks
			};
			await myTaskUpdateStatus(params);
		}
	}
};

// 日期改变
const dateChangeHandle = async (time) => {
	console.log('dateChangeHandle', time);
	await updateStatus();
	curTime.value = time;
	curDateZh.value = dayjs(time).format('YYYY年M月D日');
	curDate.value = dayjs(time).format('YYYYMMDD');
	await init();
};

// 任务点击事件，改变任务状态
const updateStatusHandle = (index) => {
	const status = taskList.value[index].task_status === 0 ? 1 : 0;
	taskList.value[index].task_status = status;
};

// 新增任务
const addTaskHandle = () => {
	const taskIndex = taskList.value.length + 1;
	uni.navigateTo({
		url: `/pages/tool/myTask/addTask?action=ADD&taskDate=${curDate.value}&taskIndex=${taskIndex}`
	});
};

// 编辑任务
const updateTaskHandle = (task) => {
	uni.navigateTo({
		url: `/pages/tool/myTask/addTask?action=UPDATE&id=${task.id}&taskTitle=${task.task_title}&taskContent=${task.task_content}&taskColor=${task.task_color}`
	});
};

// 删除任务
const deleteTaskHandle = async (task) => {
	await myTaskDelete(task.id);
	await init();
	swipeAction.value.closeAll();
};
</script>

<style scoped lang="scss">
uni-page-body {
	height: 100%;
}
.myTask {
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: $uni-bg-color;
}
.calendar {
	height: 120px;
	background-color: #fdedd9;
	.date-zh {
		height: 34px;
		padding: 0 20px;
		line-height: 34px;
		font-size: 18px;
		font-weight: bold;
		color: #3a3a3a;
	}
}

.list {
	flex: 1;
	margin: 10px;
	overflow: hidden;
}
.footer {
	height: 80px;
	padding: 10px 50px;
	.footer-btn {
		border-radius: 50px;
	}
}
.uni-swipe-action {
	width: 100%;
}
.no-task {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: #c7c7c7;
}
.scroll-Y {
	height: 100%;
	.scroll-view-item {
		display: flex;
		flex-direction: row;
		margin-bottom: 10px;
		border-radius: 10px;
		.content-box {
			display: flex;
			flex: 1;
			/* #ifdef APP-NVUE */
			justify-content: center;
			/* #endif */
			padding: 6px 15px;
			position: relative;
		}
		.circle {
			display: flex;
			align-items: center;
			margin-right: 15px;
		}
		.content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			.content-title {
				font-size: $menger-font-size-16;
				line-height: $menger-font-size-16;
				padding-bottom: 6px;
				color: #111111;
			}
			.content-complete {
				color: #6a6a6a;
				text-decoration-line: line-through;
			}
			.content-content {
				font-size: $menger-font-size-14;
				color: #6a6a6a;
			}
		}
	}
}
:deep(.uni-swipe_button) {
	border-radius: 24rpx;
}
:deep(.uni-swipe_box) {
	width: 100%;
}
</style>
