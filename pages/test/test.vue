<template>
  <div class="waterfall-wrapper">
    <h2 style="text-align: center;">Vue3 原生瀑布流 (JS计算 + 懒加载)</h2>
    
    <!-- 瀑布流主容器 -->
    <div class="waterfall-container" ref="containerRef" :style="{ height: containerHeight + 'px' }">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="waterfall-item"
        :ref="(el) => setItemRef(el, index)"
        :style="item.style"
      >
        <div class="card-content">
          <!-- 懒加载图片：data-src 存储真实地址 -->
          <img
            :data-src="item.url"
            class="lazy-img"
            @load="handleImgLoad"
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
            alt="item"
          />
          <div class="item-info">卡片 {{ index + 1 }}</div>
        </div>
      </div>

      <!-- 底部哨兵：监控是否滚动到底部 -->
      <div ref="sentinelRef" class="sentinel">
        <span v-if="loading">加载中... ⏳</span>
        <span v-else-if="noMore">没有更多了 🏁</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue';

// --- 1. 测试数据模拟部分 ---
const currentPage = ref(1);
const loading = ref(false);
const noMore = ref(false);

const fetchMockData = async (page) => {
  if (page > 5) return []; // 模拟总共只有5页数据
  await new Promise(resolve => setTimeout(resolve, 600)); // 模拟网络延迟
  
  // 生成随机高度的图片链接 (使用 picsum.photos)
  return Array.from({ length: 10 }, (_, i) => {
    const randomHeight = Math.floor(Math.random() * 200) + 200; // 200-400px
    return `https://picsum.photos{page * 10 + i}/300/${randomHeight}`;
  });
};

// --- 2. 瀑布流核心逻辑 ---
const items = ref([]);
const containerHeight = ref(0);
const containerRef = ref(null);
const sentinelRef = ref(null);
const itemRefs = [];

const COLUMN_COUNT = 2; // 可根据需要修改列数
const GUTTER = 15;     // 间距

const setItemRef = (el, index) => { if (el) itemRefs[index] = el; };

// 计算排版
const layout = () => {
  if (!containerRef.value) return;
  const columnHeights = new Array(COLUMN_COUNT).fill(0);
  const containerWidth = containerRef.value.offsetWidth;
  const itemWidth = (containerWidth - (COLUMN_COUNT - 1) * GUTTER) / COLUMN_COUNT;

  itemRefs.forEach((el, index) => {
    if (!el || !items.value[index]) return;
    
    // 算法：永远寻找当前高度最短的那一列
    const minHeight = Math.min(...columnHeights);
    const minIndex = columnHeights.indexOf(minHeight);

    items.value[index].style = {
      position: 'absolute',
      width: `${itemWidth}px`,
      transform: `translate3d(${minIndex * (itemWidth + GUTTER)}px, ${minHeight}px, 0)`,
      opacity: 1,
      visibility: 'visible'
    };
    
    columnHeights[minIndex] += el.offsetHeight + GUTTER;
  });
  
  containerHeight.value = Math.max(...columnHeights) + 50; // 更新容器总高
};

// 加载更多数据
const loadMore = async () => {
  if (loading.value || noMore.value) return;
  loading.value = true;

  const newList = await fetchMockData(currentPage.value);
  if (newList.length === 0) {
    noMore.value = true;
  } else {
    const formatted = newList.map(url => ({ url, style: { opacity: 0, visibility: 'hidden' } }));
    items.value.push(...formatted);
    currentPage.value++;
    
    // 必须在 DOM 更新后执行懒加载观察
    nextTick(() => initLazyLoad());
  }
  loading.value = false;
};

// 图片加载完成后重排（这是解决重叠的关键）
const handleImgLoad = () => {
  layout();
};

// --- 3. 监听器部分 ---
let lazyObserver;
let sentinelObserver;

const initLazyLoad = () => {
  if (lazyObserver) lazyObserver.disconnect();
  
  lazyObserver = new IntersectionObserver((entries) => {
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
};

onMounted(() => {
  // 监听触底
  sentinelObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMore();
  }, { rootMargin: '100px' });

  sentinelObserver.observe(sentinelRef.value);
  window.addEventListener('resize', layout);
});

onUnmounted(() => {
  window.removeEventListener('resize', layout);
  if (lazyObserver) lazyObserver.disconnect();
  if (sentinelObserver) sentinelObserver.disconnect();
});
</script>

<style scoped>
.waterfall-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.waterfall-container {
  position: relative;
  width: 100%;
  transition: height 0.3s;
}

.waterfall-item {
  box-sizing: border-box;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: opacity 0.5s ease;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.lazy-img {
  width: 100%;
  display: block;
  min-height: 150px; /* 预留占位高度 */
  background-color: #f0f0f0;
  border-bottom: 1px solid #eee;
}

.item-info {
  padding: 10px;
  font-size: 14px;
  color: #666;
}

.sentinel {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>
