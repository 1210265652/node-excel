/**
 * 工具函数库
 */
const fs = require('fs');
const path = require('path');
const IP2region = require('ip2region')
const queryip = new IP2region()

const config = require('config-lite')({
	config_basedir: __dirname, //开始查找配置开始位置
	config_dir: 'config' //要找的目录
});
const render = require('./render')
const timetamp = Date.now()

/**
 * 读取文件夹，挂载路由方法
    app 表示koa（） 对象
	pathfile 表示路径
 */
function loadRouter(pathfile, app) {

	function normalize(pathfile, file) {
		return path.normalize(pathfile + '/' + file);
	}

	fs.readdirSync(pathfile).forEach((file) => {
		if (file.indexOf('.js') > -1 && file !== 'router.js') {
		 	require(normalize(pathfile, file))(app)
		} else if (file !== 'router.js') {
		 	loadRouter(normalize(pathfile, file), app)
		}
	})
}

/**
 * 创建随机字符串
 */
function createRandomLetter(strLen) {
		strLen = strLen || 4;
		var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
		i, j, ramdomLetter = '';
	for (i = 0; i < strLen; i++) {
		j = Math.round(Math.random() * 25) + 0;
		ramdomLetter = ramdomLetter + letters[j];
	}

	return ramdomLetter;
}

/**
 * 创建随机数字
 */
function createRandomNumber(numLen) {
		numLen = numLen || 4;

	var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
		i, j, ramdomNumber = '';

	for (i = 0; i < numLen; i++) {
		j = Math.round(Math.random() * 9) + 0;
		ramdomNumber = ramdomNumber + numbers[j];
	}

	return ramdomNumber;
}

/**
 * 判断是否为mock环境
 */
function isMock() {
 	if (process.env.NODE_ENV && process.env.NODE_ENV.indexOf('dev') !== -1) {
 		if (config.mock.open) {
 			return true;
 		}
 	}
 	return false;
}

/**
 * 判断是否为dev环境
 */
function isDev() {
 	if (process.env.NODE_ENV && process.env.NODE_ENV.indexOf('dev') !== -1) {
 		return true;
 	}
 	return false;
}

/**
* 根据语言来渲染模板
*/
function renderView(ctx, data) {
	// console.log('-------', ctx)
	
	// if (ctx.session.lang === 'en') {
	// 	data.template += '_en'
	// }
	return render(data.template, {
		nav: data.nav,
		timetamp: timetamp,
		staticDomain: config.staticDomain
	})
}

/*
* 设置默认语言
*/
function lang() {
	return async function(ctx, next) {
		let ip = ctx.request.header['remote_addr'] || ctx.request.header['wl-proxy-client-ip'] || ctx.request.ip
		console.log('ip-------------->', ip, ctx.session.lang)
		// 如果没有语言设置，则查ip
		if (!ctx.session.lang && ip) {
			try {
				let res = queryip.search(ip)
				console.log('ip  info :', res)
				let chinaarry = ['中国', '香港', '澳门', '台湾', '内网ip']
				if (chinaarry.indexOf(res.country) === -1) {
					ctx.session.lang = 'en'
				} else {
					ctx.session.lang = 'zh'
				}
			} catch (e) {
				ctx.session.lang = 'zh'
			}
		}
		await next()
	}
}

module.exports = {
	loadRouter: loadRouter,
	createRandomLetter: createRandomLetter,
	createRandomNumber: createRandomNumber,
	isMock: isMock,
	isDev: isDev,
	renderView: renderView
}
// lang: lang