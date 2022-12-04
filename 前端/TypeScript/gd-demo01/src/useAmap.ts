import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, ref, Ref, shallowRef, watchEffect } from 'vue';
// 加载地图API
function loadAMap() {
	const aMapLoaded = ref<boolean>(false);
	// 从环境变量读取AMAP KEY
	const key = '569ca3d63ebcafa7d38f83cdc794d35b';
	if (key) {
		onMounted(() => {
			AMapLoader.load({
				key,
				version: '2.0',
				plugins: []
			}).then(() => {
				aMapLoaded.value = true;
			});
		});
	} else {
		throw new Error('地图加载失败，API Key缺失.');
	}
	return aMapLoaded;
}

// 初始化地图 ，传入作为容器的元素节点
export function useAMap(
	mapContainerRef: Ref<HTMLDivElement | undefined>,
	options?: any
): Ref<AMap.Map | undefined> {
	const mapRef = shallowRef<AMap.Map>();
	const aMapLoaded = loadAMap();
	watchEffect(() => {
		if (aMapLoaded.value && mapContainerRef.value) {
			mapRef.value = new AMap.Map(mapContainerRef.value, options);
		}
	});
	return mapRef;
}
