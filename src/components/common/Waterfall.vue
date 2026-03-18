<template>
	<div class="waterfall-wrapper">
		<!-- 瀑布流容器 -->
		<div class="waterfall-container" ref="containerRef" :style="{ height: containerHeight + 'px' }">
			<div v-for="(item, index) in list" :key="index" class="waterfall-item" :ref="(el) => setItemRef(el, index)"
				:style="itemStyles[index]">
				<div class="card-content">
					<!-- 图片：增加懒加载和加载回调 -->
					<img :src="placeholderImg" :data-src="item.url" class="lazy-img" @load="onImageLoaded" />
					<!-- 固定两行文字描述 -->
					<div class="text-area">
						<div class="title">{{ item.title || '暂无标题' }}</div>
						<div class="address">{{ item.address || '暂无地址' }}</div>
					</div>
				</div>
			</div>

			<!-- 底部哨兵 -->
			<div ref="sentinelRef" class="sentinel">
				<slot name="footer">
					<span v-if="loading">加载中...</span>
					<span v-else-if="finished">没有更多了</span>
				</slot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onUnmounted, watch } from 'vue';

const props = defineProps({
	list: {
		type: Array,
		required: true
	}, // 数据列表
	loading: {
		type: Boolean,
		default: false
	}, // 加载状态
	finished: {
		type: Boolean,
		default: false
	}, // 是否加载完毕
	columnCount: {
		type: Number,
		default: 2
	}, // 列数
	gutter: {
		type: Number,
		default: 10
	} // 间距
});

const emit = defineEmits(['load-more']);

const containerRef = ref(null);
const sentinelRef = ref(null);
const containerHeight = ref(0);
const itemStyles = reactive([]);
const itemRefs = [];

const setItemRef = (el, index) => {
	if (el) itemRefs[index] = el;
};

// 核心布局计算
const layout = () => {
	if (!containerRef.value || props.list.length === 0) return;
	const columnHeights = new Array(props.columnCount).fill(0);
	const containerWidth = containerRef.value.offsetWidth;
	const itemWidth = (containerWidth - (props.columnCount - 1) * props.gutter) / props.columnCount;

	itemRefs.forEach((el, index) => {
		if (!el) return;
		const minHeight = Math.min(...columnHeights);
		const minIndex = columnHeights.indexOf(minHeight);

		itemStyles[index] = {
			position: 'absolute',
			width: `${itemWidth}px`,
			transform: `translate3d(${minIndex * (itemWidth + props.gutter)}px, ${minHeight}px, 0)`,
			opacity: 1,
			transition: 'all 0.3s'
		};
		columnHeights[minIndex] += el.offsetHeight + props.gutter;
	});
	containerHeight.value = Math.max(...columnHeights) + 20;
};

// 图片加载回调
const handleImgLoad = () => layout();

// 监听 list 变化，重置样式数组并重新初始化懒加载
watch(() => props.list.length, () => {
	nextTick(() => {
		initLazyLoad();
		layout();
	});
});

// 懒加载与触底逻辑
let observers = [];
const initLazyLoad = () => {
	const lazyObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
					lazyObserver.unobserve(img);
				}
			}
		});
	});
	const imgs = containerRef.value.querySelectorAll('.lazy-img[data-src]');
	imgs.forEach(img => lazyObserver.observe(img));
	observers.push(lazyObserver);
};

onMounted(() => {
	const sentinelObserver = new IntersectionObserver(([entry]) => {
		if (entry.isIntersecting && !props.loading && !props.finished) {
			emit('load-more');
		}
	}, {
		rootMargin: '200px'
	});

	sentinelObserver.observe(sentinelRef.value);
	observers.push(sentinelObserver);
	window.addEventListener('resize', layout);
});

onUnmounted(() => {
	window.removeEventListener('resize', layout);
	observers.forEach(o => o.disconnect());
});
</script>

<style scoped>
.waterfall-container {
	position: relative;
	width: 100%;
}

.waterfall-item {
	background: #fff;
	border-radius: 8px;
	overflow: hidden;
	opacity: 0;
}

.lazy-img {
	width: 100%;
	display: block;
	background: #f5f5f5;
	min-height: 100px;
}

.sentinel {
	position: absolute;
	bottom: 0;
	width: 100%;
	text-align: center;
	padding: 10px;
}
</style>