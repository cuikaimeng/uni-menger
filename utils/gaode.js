// // 高德Web服务
// import AMapLoader from "@amap/amap-jsapi-loader";
// import { GAODE_WEB_KEY, GAODE_WEB_SECURITY_CODE } from "@/constant.js";

// /**
//  * 初始化高德地图实例，加载天气服务、城市查询插件
//  */
// export const initGaodeServer = async () => {
//   window._AMapSecurityConfig = {
//     securityJsCode: GAODE_WEB_SECURITY_CODE, // key对应的安全密钥
//   };
//   return new Promise((resolve) => {
//     AMapLoader.load({
//       key: GAODE_WEB_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
//       version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
//       plugins: ["AMap.Weather", "AMap.CitySearch"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
//     })
//       .then((AMap) => {
//         resolve(AMap);
//       })
//       .catch((err) => {
//         resolve(null);
//       });
//   });
// };
// /**
//  * 获取城市信息
//  * @param AMap: 高德地图实例
//  * @returns 城市信息
//  */
// export const queryCity = async (AMap) => {
//   return new Promise((resolve) => {
//     if (AMap) {
//       const citySearch = new AMap.CitySearch();
//       citySearch.getLocalCity((status, result) => {
//         if (status === "complete" && result.info === "OK") {
//           // 查询成功，result即为当前所在城市信息
//           resolve(result);
//         } else {
//           return null;
//         }
//       });
//     } else {
//       resolve(null);
//     }
//   });
// };
// /**
//  * 获取城市天气信息
//  * @param AMap: 高德地图实例
//  * @param city: 城市名称
//  * @returns 城市天气信息
//  */
// export const queryWeather = async (AMap, city) => {
//   return new Promise((resolve) => {
//     if (AMap) {
//       const weather = new AMap.Weather();
//       weather.getLive(city, function (err, data) {
//         if (!err) {
//           resolve(data);
//         } else {
//           resolve(null);
//         }
//       });
//     } else {
//       resolve(null);
//     }
//   });
// };