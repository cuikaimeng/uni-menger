<template>
	<view class="icon">
		<image :src="icon" :style="{ width: width, height: height }"></image>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	width: String,
	height: String,
	icon: String
});

// const iconList = [
// 	''
// ]
</script>

<style scoped lang="scss">
.icon {
}
</style>
