<template>
	<view class="table">
		<view class="table-main" :class="{ 'table-no-pagination': !isPagination }">
			<uni-table class="table-head" ref="tableHead" style="max-width: 100%" :loading="loading" :border="border" :stripe="stripe" emptyText="" @selection-change="selectionChange">
				<uni-tr class="table-tr">
					<uni-th class="table-th" :key="column.field" :width="column.width" :align="column.align" v-for="(column, index) in columns">{{ column.name }}</uni-th>
				</uni-tr>
			</uni-table>
			<uni-table
				class="table-body"
				ref="tableBody"
				style="max-width: 100%"
				:loading="loading"
				:border="border"
				:stripe="stripe"
				:type="type"
				emptyText=""
				@selection-change="selectionChange"
			>
				<uni-tr class="table-body-tr-first">
					<uni-th class="table-th" :key="column.field" :width="column.width" :align="column.align" v-for="(column, index) in columns">{{ column.name }}</uni-th>
				</uni-tr>
				<uni-tr class="table-tr" v-for="(item, index) in tableData" :key="index">
					<uni-td class="table-td" v-for="(column, columnIndex) in columns" :key="column.field + '-' + index" :align="column.cellAlign">
						<view class="table-cell table-cell-action" v-if="columnIndex === columns.length - 1 && column.field === 'action'">
							<view class="table-cell-action-icon" v-for="(action, actionIndex) in column.actions">
								<image :src="'/static/icons/' + action.icon + '.svg'" style="width: 20px; height: 20px" @click="tableActionClick(action.type, item)"></image>
							</view>
						</view>
						<view class="table-cell" v-else>{{ item[column.field] }}</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<view class="table-pagination" v-if="isPagination">
			<uni-pagination
				:prevText="pagination.prevText"
				:nextText="pagination.nextText"
				:value="pagination.value"
				:current="pagination.current"
				:total="pagination.total"
				:pageSize="pagination.pageSize"
				:showIcon="pagination.showIcon"
				@change="paginationChange"
			/>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	columns: {
		type: Array,
		default: []
	},
	tableData: {
		type: Array,
		default: []
	},
	loading: {
		type: Boolean,
		default: false
	},
	border: {
		type: Boolean,
		default: false
	},
	stripe: {
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		default: ''
	},
	emptyText: {
		type: String,
		default: '没有更多数据'
	},
	isPagination: {
		type: Boolean,
		default: false
	},
	pagination: {
		type: Object,
		default: {
			prevText: '上一页',
			nextText: '下一页',
			value: 1,
			current: 1,
			total: 0,
			pageSize: 20,
			showIcon: false
		}
	}
});
const emit = defineEmits(['paginationChange', 'update', 'delete']);
// 分页切换
const paginationChange = (e) => {
	emit('paginationChange', { pageSize: props.pagination.pageSize, current: e.current });
};
// 表格操作列点击事件
const tableActionClick = (actionType, record) => {
	console.log('tableActionClick', actionType, record.id);
	if (actionType === 'update') {
		emit('update', { record: record });
	}
	if (actionType === 'delete') {
		emit('delete', { id: record.id });
	}
};
</script>

<style scoped lang="scss">
.table {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.table-main {
		width: 100%;
		height: calc(100% - 40px);
		display: flex;
		flex-direction: column;
		.table-head {
			height: 40px;
			overflow: hidden;
			border: none;
			:deep(.uni-table-loading) {
				display: none;
			}
		}
		.table-body {
			width: 100%;
			height: calc(100% - 40px);
			.table-body-tr-first {
				visibility: collapse;
			}
		}
	}
	.table-pagination {
		height: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		// align-items: center;
	}
}
.table-no-pagination {
	height: 100%;
}
.table-tr {
	.table-th {
		background-color: #ededed;
		border-color: #ededed;
		font-size: $menger-font-size-16;
		padding: 8px 10px;
		border: none;
	}
	.table-td {
		font-size: $menger-font-size-16;
	}
}
.table-cell-action {
	display: flex;
	.table-cell-action-icon {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
