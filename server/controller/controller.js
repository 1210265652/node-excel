/**
 * 控制器默认方法与挂载方法
 */
const path = require('path');
const fs = require('fs');
let controller = {};

let controllerPath = path.resolve(__dirname, '../controller');

function normalize(pathfile, file) {
	return path.normalize(pathfile + '/' + file);
}

//加载所有的方法到 controller
function loaderController(pathfile) {
	fs.readdirSync(pathfile).forEach((file) => {
		if (file.indexOf('.js') > -1 && file !== 'controller.js') {
		 	controller = Object.assign(controller, require(normalize(pathfile, file)))
		} else if (file !== 'controller.js') {
		 	loaderController(normalize(pathfile, file))
		}
	})
}
loaderController(controllerPath);

//默认的控制器
async function deaultController(ctx, next) {
	ctx.body = ctx.response.temData[0];
}

module.exports = function() {

	return function(name) {
		if (name && name in controller) {
			return controller[name];
		} else {
			return deaultController
		}
	}

}