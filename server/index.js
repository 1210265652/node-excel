/**
 * server 入口文件
 */
const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const router = require('./router/router')
const static = require('koa-static')
const config = require('config-lite')({
	config_basedir: __dirname,
	config_dir: 'config'
});
const logger = require('./util/logger');

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = '../static'

app.use(static(
	path.join(__dirname, staticPath)
))

app.use(async function (ctx, next) {
	try {
		await next();
	} catch (e) {
		logger.error(e, ctx.request.url, ctx.request.body);
	}
})


app.use(bodyParser())

app.use(router(app))

app.listen(config.port, '0.0.0.0')
logger.info(`the server is running at port ${config.port}`)


module.exports = {
	server: app,
	config: config
};

