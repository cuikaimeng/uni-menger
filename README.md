## 萌二之家

- 作者: menger
- 邮箱: m15735104241@163.com

## 项目介绍

- Vite + Vue3 + Uni-App + uview-pro
- 本项目采用 cli 方式创建项目，意在摆脱对于 HBuilder X 的依赖，方便离线打包（主要是 vscode 用习惯了）。
- 使用 pnpm 进行依赖管理，方便省心。

## 项目启动

- 启用 pnpm（未安装 pnpm 时）
  corepack enable && corepack prepare pnpm@10.12.4 --activate
- 安装依赖
  pnpm install
- 源码目录
  src/
- 运行项目（H5）
  pnpm run dev:h5
- 编译（H5）
  pnpm run build:h5
- 运行项目（微信小程序）
  pnpm run dev:mp-weixin
- 编译（微信小程序）
  pnpm run build:mp-weixin
- 发布（微信小程序，需配置环境变量）
  pnpm run publish:mp-weixin
- 发布环境变量参考
  .env.example

## 核心第三方插件

- uview-pro: [https://uview-pro.netlify.app/components/intro.html]
- Pinia: [https://pinia.vuejs.org/zh/]

## Android 平台离线打包记录

- 生成 Android 平台签名证书[https://ask.dcloud.net.cn/article/35777]
  1、配置 jdk 环境变量：终端输入 java、javac，可正常执行说明配置完成
  2、生成签名证书：使用 keytool -genkey 命令
  keytool -genkey -alias mengeralias -keyalg RSA -keysize 2048 -validity 36500 -keystore menger.keystore

  - mengeralias 是证书别名，可修改为自己想设置的字符，建议使用英文字母和数字
  - menger.keystore 是证书文件名称，可修改为自己想设置的文件名称，也可以指定完整文件路径
  - 36500 是证书的有效期，表示 100 年有效期，单位天，建议时间设置长一点，避免证书过期
  - 密钥：123456，CN=menger, OU=menger, O=menger, L=taiyuan, ST=shanxi, C=CN
  3、查看证书信息：keytool -list -v -keystore menger.keystore
    密钥库类型: jks
    密钥库提供方: SUN

    您的密钥库包含 1 个条目

    别名: mengeralias
    创建日期: 2025-8-26
    条目类型: PrivateKeyEntry
    证书链长度: 1
    证书[1]:
    所有者: CN=menger, OU=menger, O=menger, L=taiyuan, ST=shanxi, C=CN
    发布者: CN=menger, OU=menger, O=menger, L=taiyuan, ST=shanxi, C=CN
    序列号: 34be4bef
    有效期为 Tue Aug 26 18:29:38 CST 2025 至 Thu Aug 02 18:29:38 CST 2125
    证书指纹:
    MD5: 44:79:E8:05:A9:BC:98:0D:44:54:FC:AA:24:AB:57:BC
    SHA1: F3:35:AA:CD:3F:61:62:87:15:06:EA:6E:D5:AC:35:1D:8E:FC:5D:95
    SHA256: 63:94:46:92:E1:49:65:4B:8F:D7:DC:11:38:7F:0B:7D:1C:23:81:08:66:8E:61:8B:88:D0:7F:DB:12:F8:CE:72
    签名算法名称: SHA256withRSA
    主体公共密钥算法: 2048 位 RSA 密钥
    版本: 3



## 遇到的问题（记录问题，少走弯路）
 - 高德地图组件使用 AMap 是 Web 端的方案，在h5中显示正常，在 android 下编译报错

		暂时搁置，使用AMap目前只是用作获取定位，然后获取天气信息，考虑后续在高德API中寻找解决办法

 - IconPark 图标在 android 真机运行不显示问题
		
		原先使用动态加载图标组件方式，h5显示正常，android图标不显示 
		<component :is="item.icon" theme="outline" :size="30" :fill="item.color" />
		
		解决方式：将图标的svg文件直接放在静态资源目录下，通过Image标签引入使用
		<image :src="'/static/icons/' + item.icon + '.svg'" style="width: 30px; height: 30px"></image>


## 设计思路
  - 我的相册
    准确的说不应该叫我的相册，应该叫萌二的足印，或者是萌二小事件
    我希望是以一个时间线为主，通过时间线的方式，记录我们去过的地方，我们经历的事情，不仅仅是旅游的照片，可以是任何一个值得纪念的小事件
    事件要有一个时间、事件的描述、以及一张主图，主图点进去是所有照片
    越想越觉得有点像旅游路书了，哈哈
  - 证件夹
    证件类型：
      身份证、户口本、护照、出生证明（蓝色）
      驾驶证、行车证（绿色）
      银行卡、信用卡（紫色）
      结婚证、房产证（红色）
      毕业证、学位证（黄色）
      其他（灰色）