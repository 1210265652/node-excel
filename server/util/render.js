/**
 * 渲染页面
 */
const view = require('co-views');
const config = require('config-lite')({
	config_basedir: __dirname, //开始查找配置开始位置
	config_dir: 'config' //要找的目录
});

const render = view(config.view, {
	map: {
		html: 'ejs'
	},
	cache: config.viewCache
});

module.exports = render;