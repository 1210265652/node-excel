/**
 * logger方法
 * 开发的时候全部 走 console.log
 * 部署到服务器，走console.log(方便部署后 pm2 logs) 与 log4js (用于日志罗盘)
 */

const log4js = require('log4js');
const tool = require('./tool.js');

const config = require('config-lite')({
    config_basedir: __dirname, //开始查找配置开始位置
    config_dir: 'config' //要找的目录
});

//log4js加载配置
log4js.configure(config.logger);

const accessLogger = log4js.getLogger('access');
const errorLogger = log4js.getLogger('error');
const loggerFunc = function(type) {
    if (tool.isDev()) {
        switch (type) {
            case 'info':
                return function(...arg) {
                    console.log(...arg)
                }
                break;
            case 'warn':
                return function(...arg) {
                    console.warn(...arg)
                }
                break;
            case 'error':
                return function(...arg) {
                    console.error(...arg)
                }
                break;
        }
    } else {
        switch (type) {
            case 'info':
                return function(...arg) {
                    accessLogger.info(...arg)
                    console.log(...arg)
                }
                break;
            case 'warn':
                return function(...arg) {
                    accessLogger.warn(...arg)
                    console.warn(...arg)
                }
                break;
            case 'error':
                return function(...arg) {
                    errorLogger.info(...arg)
                    console.error(...arg)
                }
                break;
        }
    }
}

module.exports = {
    info: loggerFunc('info'),
    warn: loggerFunc('warn'),
    error: loggerFunc('error')
}