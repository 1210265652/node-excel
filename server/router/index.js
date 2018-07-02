/**
 * 路由
 */
const router = require('koa-router')()
// const compose = require('../../util/compose')
const controller = require('../controller/controller')()

module.exports = function(app) {
	//get请求
	router.get('/', controller('index')) //  compose.seletLang(),
	router.post('/postExcelFile', controller('importFile'))
	router.post('/uploadFile',controller('uploadFile'))
	app.use(router.routes()).use(router.allowedMethods())
}