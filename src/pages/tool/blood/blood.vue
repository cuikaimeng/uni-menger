<template>
	<view class="blood">
		<view class="blood-tab blood-main" v-if="selectedIndex === 0">
			<view class="blood-card" @longpress="updateBloodHandle(bloodState)">
				<view class="blood-card-header">{{ bloodState.blood_date }}</view>
				<view class="blood-card-body">
					<view class="blood-card-boby-item">
						<view class="item-number" :style="{ color: highPColor }">{{ bloodState.blood_high_p }}</view>
						<view class="item-text" :style="{ color: highPColor }">高压</view>
					</view>
					<view class="blood-card-boby-item">
						<view class="item-number" :style="{ color: lowPColor }">{{ bloodState.blood_low_p }}</view>
						<view class="item-text" :style="{ color: lowPColor }">低压</view>
					</view>
					<view class="blood-card-boby-item">
						<view class="item-number" :style="{ color: heartColor }">{{ bloodState.blood_heart }}</view>
						<view class="item-text" :style="{ color: heartColor }">心率</view>
					</view>
				</view>
			</view>
			<view class="blood-chart">
				<BloodPressure :cardHeight="'calc(100% - 24px)'"></BloodPressure>
			</view>
			<view class="blood-chart">
				<HeartRate :cardHeight="'calc(100% - 24px)'"></HeartRate>
			</view>
		</view>
		<view class="blood-tab blood-add" v-else-if="selectedIndex === 1">
			<view class="form-item first-form-item">
				<view class="item-label">日期</view>
				<picker class="item-input" mode="date" :value="bloodAddState.blood_date" fields="day" @change="bindDateChange($event)">
					<view class="picker-placeholder" v-if="bloodAddState.blood_date === ''">请选择日期</view>
					<view v-else>{{ bloodAddState.blood_date }}</view>
				</picker>
			</view>
			<view class="form-item">
				<view class="item-label">高压</view>
				<input class="item-input" v-model="bloodAddState.blood_high_p" type="number" placeholder="请输入高压" />
			</view>
			<view class="form-item">
				<view class="item-label">低压</view>
				<input class="item-input" v-model="bloodAddState.blood_low_p" type="number" placeholder="请输入低压" />
			</view>
			<view class="form-item">
				<view class="item-label">心率</view>
				<input class="item-input" v-model="bloodAddState.blood_heart" type="number" placeholder="请输入心率" />
			</view>
			<view class="form-btn">
				<button type="primary" @click="saveHandle()">保存</button>
			</view>
		</view>
		<view class="blood-tab blood-table" v-else-if="selectedIndex === 2">
			<Table
				:columns="columns"
				:tableData="tableData"
				:border="true"
				:stripe="true"
				:isPagination="true"
				:pagination="pagination"
				@paginationChange="paginationChange"
				@update="tableUpdate"
				@delete="tableDelete"
			></Table>
		</view>
		<TabBar :tabBarData="tabBarData" :selectedIndex="selectedIndex" @change="tabBarChangeHandle"></TabBar>
	</view>
</template>

<script setup>
import { onShow, onUnload } from '@dcloudio/uni-app';
import { reactive, ref, watch, computed } from 'vue';
import Table from '@/components/common/Table.vue';
import BloodPressure from '@/components/home/BloodPressure.vue';
import HeartRate from '@/components/home/HeartRate.vue';
import TabBar from '@/components/common/TabBar.vue';
import { getBloodCurrent, bloodAdd, bloodUpdate, bloodDelete, queryBloodList, getBloodTotal } from '@/api/blood.api.js';
import dayjs from 'dayjs';

const selectedIndex = ref(0); // 当前选中tab页
const addCompleteBackIndex = ref(0); // 记录新增tab保存数据后，要返回的tab页
// tab数据
const tabBarData = reactive([
	{ text: '血压', icon: 'heart-rate' },
	{ text: '', icon: 'add-one' },
	{ text: '记录', icon: 'view-list' }
]);
// 血压tab blood数据
const bloodState = reactive({
	id: null,
	blood_date: '',
	blood_high_p: null,
	blood_low_p: null,
	blood_heart: null
});
const isBloodAdd = ref(true); // 新增标识
// 新增tab blood数据
const bloodAddState = reactive({
	id: null,
	blood_date: '',
	blood_high_p: null,
	blood_low_p: null,
	blood_heart: null
});
// 保存原始数据，用于与修改后的数据做比较
const originBloodAddData = {
	blood_date: '',
	blood_high_p: null,
	blood_low_p: null,
	blood_heart: null
};
// 表格列
const columns = reactive([
	{ field: 'blood_date', name: '日期', width: 100, align: 'center', cellAlign: 'center' },
	{ field: 'blood_high_p', name: '高压', width: 60, align: 'center', cellAlign: 'center' },
	{ field: 'blood_low_p', name: '低压', width: 60, align: 'center', cellAlign: 'center' },
	{ field: 'blood_heart', name: '心率', width: 60, align: 'center', cellAlign: 'center' },
	{
		field: 'action',
		name: '操作',
		width: 80,
		align: 'center',
		cellAlign: 'center',
		actions: [
			{ type: 'update', icon: 'edit' },
			{ type: 'delete', icon: 'delete' }
		]
	}
]);
// 表格数据
const tableData = reactive([]);
// 分页
const pagination = reactive({
	value: 1,
	current: 1,
	total: 0,
	pageSize: 20,
	showIcon: true
});

/* 血压tab START */
// 初始化数据
const initBlood = async () => {
	uni.setNavigationBarTitle({
		title: '血压报告'
	});
	const res = await getBloodCurrent();
	if (res.data.length) {
		bloodState.id = res.data[0].id;
		bloodState.blood_date = res.data[0].blood_date;
		bloodState.blood_high_p = res.data[0].blood_high_p;
		bloodState.blood_low_p = res.data[0].blood_low_p;
		bloodState.blood_heart = res.data[0].blood_heart;
	}
};

// 高压数据颜色
const highPColor = computed(() => {
	if (bloodState.blood_high_p < 80 || bloodState.blood_high_p >= 140) {
		return '#e43d33';
	} else if (bloodState.blood_high_p >= 120 && bloodState.blood_high_p < 140) {
		return '#f3a73f';
	} else {
		return '#3a3a3a';
	}
});
// 低压数据颜色
const lowPColor = computed(() => {
	if (bloodState.blood_low_p < 60 || bloodState.blood_low_p >= 90) {
		return '#e43d33';
	} else if (bloodState.blood_low_p > 80 && bloodState.blood_low_p < 90) {
		return '#f3a73f';
	} else {
		return '#3a3a3a';
	}
});
// 心率数据颜色
const heartColor = computed(() => {
	if (bloodState.blood_heart > 120) {
		return '#e43d33';
	} else if (bloodState.blood_heart < 60 || bloodState.blood_heart > 100) {
		return '#f3a73f';
	} else {
		return '#3a3a3a';
	}
});

// tab切换事件
const tabBarChangeHandle = (data) => {
	if (selectedIndex.value != data.index) {
		if (data.index === 1) {
			isBloodAdd.value = true;
		}
		selectedIndex.value = data.index;
	}
};

// 更新数据
const updateBloodHandle = (data) => {
	isBloodAdd.value = false;
	selectedIndex.value = 1;
	bloodAddState.id = data.id;
	bloodAddState.blood_date = data.blood_date;
	bloodAddState.blood_high_p = data.blood_high_p;
	bloodAddState.blood_low_p = data.blood_low_p;
	bloodAddState.blood_heart = data.blood_heart;
	originBloodAddData.blood_date = data.blood_date;
	originBloodAddData.blood_high_p = data.blood_high_p;
	originBloodAddData.blood_low_p = data.blood_low_p;
	originBloodAddData.blood_heart = data.blood_heart;
};
/* 血压tab END */

/* 新增tab START */
// 新增tab初始化
const initBloodAdd = (data) => {
	if (isBloodAdd.value) {
		uni.setNavigationBarTitle({
			title: '新增记录'
		});
		bloodAddState.id = null;
		bloodAddState.blood_date = '';
		bloodAddState.blood_high_p = null;
		bloodAddState.blood_low_p = null;
		bloodAddState.blood_heart = null;
	} else {
		uni.setNavigationBarTitle({
			title: '修改记录'
		});
	}
};

// 日期选择
const bindDateChange = (e) => {
	bloodAddState.blood_date = e.detail.value;
};

// 保存任务数据
const saveHandle = async () => {
	if (bloodAddState.blood_date === '' || bloodAddState.blood_date === null || bloodAddState.blood_date === undefined) {
		uni.showToast({
			title: '请选择日期！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (bloodAddState.blood_high_p === null || bloodAddState.blood_high_p < 60 || bloodAddState.blood_high_p > 200) {
		uni.showToast({
			title: '请输入正确的高压数据！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (bloodAddState.blood_low_p === null || bloodAddState.blood_low_p < 30 || bloodAddState.blood_low_p > 140) {
		uni.showToast({
			title: '请输入正确的低压数据！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (bloodAddState.blood_heart === null || bloodAddState.blood_heart < 40 || bloodAddState.blood_heart > 200) {
		uni.showToast({
			title: '请输入正确的心率数据！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (
		originBloodAddData.blood_date === bloodAddState.blood_date &&
		originBloodAddData.blood_high_p === bloodAddState.blood_high_p &&
		originBloodAddData.blood_low_p === bloodAddState.blood_low_p &&
		originBloodAddData.blood_heart === bloodAddState.blood_heart
	) {
		uni.showToast({
			title: '数据未修改，请修改后保存！',
			position: 'top',
			icon: 'none'
		});
		return;
	}
	if (isBloodAdd.value) {
		let param = {
			blood_date: bloodAddState.blood_date,
			blood_high_p: bloodAddState.blood_high_p,
			blood_low_p: bloodAddState.blood_low_p,
			blood_heart: bloodAddState.blood_heart,
			blood_update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
		};
		await bloodAdd(param);
	} else {
		let param = {
			blood_date: bloodAddState.blood_date,
			blood_high_p: bloodAddState.blood_high_p,
			blood_low_p: bloodAddState.blood_low_p,
			blood_heart: bloodAddState.blood_heart,
			blood_update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
		};
		await bloodUpdate(bloodAddState.id, param);
	}
	selectedIndex.value = addCompleteBackIndex.value;
};
/* 新增tab END */
/* 记录tab START */
const initBloodTable = async () => {
	uni.setNavigationBarTitle({
		title: '历史记录'
	});
	let pageSize = pagination.pageSize ? pagination.pageSize : 10;
	let current = pagination.current ? pagination.current : 1;
	const res = await getBloodTotal();
	pagination.total = res.data.total;
	await queryBloodListFn(pageSize, current);
};

// 查询列表数据
const queryBloodListFn = async (pageSize, current) => {
	let param = {
		limit: pageSize,
		offset: (current - 1) * pageSize
	};
	const res = await queryBloodList(param);
	tableData.splice(0, tableData.length, ...res.data);
};

// 表格分页切换
const paginationChange = (data) => {
	pagination.value = data.current;
	pagination.current = data.current;
	queryBloodListFn(data.pageSize, data.current);
};

// 更新操作
const tableUpdate = (data) => {
	updateBloodHandle(data.record);
};
// 删除操作
const tableDelete = (data) => {
	uni.showModal({
		title: '提示',
		content: '数据删除后不可找回，确定删除吗？',
		success: async function (res) {
			if (res.confirm) {
				if (data.id) {
					await bloodDelete(data.id);
					await initBloodTable();
				}
			}
		}
	});
};

/* 记录tab END */

// 监听tab切换
watch(
	selectedIndex,
	async (newIndex, oldIndex) => {
		if (newIndex === 0) {
			await initBlood();
		}
		if (newIndex === 1) {
			addCompleteBackIndex.value = oldIndex;
			initBloodAdd();
		}
		if (newIndex === 2) {
			await initBloodTable();
		}
	},
	{ immediate: true }
);
</script>

<style scoped lang="scss">
uni-page-body {
	height: 100%;
	overflow: hidden;
}
.blood {
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: $uni-bg-color;
}
.blood-tab {
	display: flex;
	flex-direction: column;
}
/* 血压tab START */
.blood-main {
	flex: 1;
	height: calc(100% - 50px - $menger-page-padding * 2);
	padding: $menger-page-padding;
}
.blood-add {
	flex: 1;
	padding: 0;
}
.blood-table {
	padding: 0;
	height: calc(100% - 50px);
}

.blood-card {
	height: 200px;
	border-radius: $menger-page-padding;
	background-color: $uni-white;
	display: flex;
	flex-direction: column;
	box-shadow: $uni-shadow-lg;
	.blood-card-header {
		height: 40px;
		border-radius: $menger-page-padding $menger-page-padding 0 0;
		background-color: $menger-tab-selectedColor;
		color: #ffffff;
		line-height: 40px;
		font-size: $menger-font-size-18;
		padding-left: $menger-page-padding;
		letter-spacing: 1px;
	}
	.blood-card-body {
		flex: 1;
		display: flex;
		flex-direction: row;
		.blood-card-boby-item {
			flex: 1;
			margin: 20px 0;
			display: flex;
			flex-direction: column;
			.item-number {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60%;
				font-size: 40px;
				font-weight: bold;
				color: $uni-error;
			}
			.item-text {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 40%;
				font-size: 20px;
				color: $uni-error;
			}
		}
	}
}
.blood-chart {
	height: calc((100% - 200px) / 2);
	margin-top: $menger-page-padding;
	border-radius: $menger-page-padding;
	background-color: $uni-white;
	box-shadow: $uni-shadow-lg;
}
/* 血压tab END */
/* 新增tab START */
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
}
.form-btn {
	padding: 12px;
	background-color: #f8f8f8;
}
.picker-placeholder {
	color: gray;
}
/* 新增tab END */
/* 记录tab START */
/* 记录tab END */
</style>
