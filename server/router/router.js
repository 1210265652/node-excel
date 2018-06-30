/**
 * 路由入口
 * 动态加载路由
 */
const path = require('path')
const tool = require('../util/tool')



module.exports = function(app) {
	/**
	* 动态加载路由函数
	*/
	let routerPath = path.resolve(__dirname, '../router');
	tool.loadRouter(routerPath, app);

	return async function(ctx, next) {
		await next();
	}

}
