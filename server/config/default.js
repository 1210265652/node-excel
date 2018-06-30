/**
 * 默认server配置
 */

module.exports = {
    domain: '',
    port: 3000,
    staticDomain: '',
    view: 'views',
    viewCache: false, //是否缓存页面
    static: 'static',
    logger: {
        appenders: [
            {
                type: 'console',
                category: 'console'
            },
            {
                type: 'dateFile',
                filename: './log/gmpc-access',
                pattern: '-yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                category: 'access',
            },
            {
                type: 'file',
                filename: './log/gmpc-error.log',
                category: 'error',
            }
        ],
        replaceConsole: true,
        levels: {
            access: 'INFO',
            error: 'ERROR'
        }
    }
}
