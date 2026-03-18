<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { verify } from '@/api/login.api.js';
import { useUserStore } from '@/store/useUserStore.js';

const userStore = useUserStore();

onLaunch(async () => {
	console.log('App Launch');
	const res = await verify();
	if (res.success) {
		userStore.initUserInfo();
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/home/home'
			});
		}, 2000);
	} else {
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}, 2000);
	}
});
onShow(() => {
	console.log('App Show');
});
onHide(() => {
	console.log('App Hide');
});
</script>

<style lang="scss">
@import url('./static/iconfont/iconfont.css');
uni-page-wrapper {
	background-color: $menger-page-background;
}
</style>
