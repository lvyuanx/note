<template>
	<div id="container"></div>
	<div class="info">
		纬度: <input type="text" :value="lat" /> <br /><br />
		经度: <input type="text" :value="lng" /> <br /><br />
		地址: <textarea :rows="2" type="text" :value="address" /> <br /><br />
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs, reactive } from 'vue';

let { address, lat, lng, current_lat, current_lng, current_address } = toRefs(
	reactive({
		address: '',
		lat: 0, // 纬度
		lng: 0, // 经度
		current_lat: 0, // 纬度
		current_lng: 0, // 经度
		current_address: ''
	})
);

onMounted(() => {
	initPage();
});

let map = reactive<any>(null);
const initPage = async () => {
	map = createMap(AMap);
	addMapGeolocationPlugin(map, AMap);
	markingPoint(map);
};

const createMap = (AMap: any) => {
	return new AMap.Map('container', {
		viewMode: '3D',
		zoom: 20, //初始化地图级别
		resizeEnable: true
	});
};

const addMapGeolocationPlugin = (map: any, AMap: any) => {
	AMap.plugin('AMap.Geolocation', function () {
		var geolocation = new AMap.Geolocation({
			showMarker: false,
			showCircle: false,
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：5s
			position: 'RB', //定位按钮的停靠位置
			offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
			zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
		});
		// 地图中添加定位控件
		map.addControl(geolocation);
		// 获取当前位置
		geolocation.getCurrentPosition(function (status: any, result: any) {
			if (status == 'complete') {
				onComplete(result); // 解析地址
			} else {
				onError(result); // 发生异常
			}
		});
	});
};

function onComplete(result: any) {
	let { position, formattedAddress } = result;
	if (lat.value == 0) {
		current_lat.value = position.Q;
		current_lng.value = position.R;
		current_address.value = formattedAddress;

		if (lat.value == 0) {
			lat.value = position.Q;
			lng.value = position.R;
			address.value = formattedAddress;
			let point = {
				Q: lat.value,
				R: lng.value,
				lat: lat.value.toFixed(6),
				lng: lng.value.toFixed(6)
			};
			regeoCode(map, point);
		}
	}
}

function onError(result: any) {
	console.error('地图加载发生异常：', result);
}

// 在点击地图的时候给地图添加定位点
function markingPoint(map: any) {
	map.on('click', function (e: any) {
		let lnglat = e.lnglat;
		regeoCode(map, lnglat);
	});
}
// 地理编码器插件
let geocoder = reactive<any>(null);
// 标记插件
let marker = reactive<any>(null);
function createGeocoder() {
	if (!geocoder) {
		geocoder = new AMap.Geocoder();
	}
}

function createMarker(map: any) {
	if (!marker) {
		marker = new AMap.Marker();
		map.add(marker);
	}
}

// 标点
function regeoCode(map: any, lnglat: any) {
	createGeocoder();
	createMarker(map);
	marker.setPosition(lnglat); //设置标记的位置
	// 获取地址信息
	geocoder.getAddress(lnglat, function (status: any, result: any) {
		if (status === 'complete' && result.regeocode) {
			address.value = result.regeocode.formattedAddress;
			console.log('addr:', address);
			debugger;
			lng.value = lnglat.R;
			lat.value = lnglat.Q;
		}
	});
}
</script>

<style lang="scss" scoped>
#container {
	width: 100%;
	height: 100%;
	background-color: #eee;
}
.info {
	padding: 10px;
	position: fixed;
	top: 10px;
	right: 10px;
	width: 300px;
	height: 300px;
	background-color: rgba($color: #b2cefe, $alpha: 0.5);
	font-weight: 800;
	font-size: 20px;
}
</style>
