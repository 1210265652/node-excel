/**
 * index控制器
 */
const tool = require('../util/tool')
const formidable = require('formidable')
const config = require('config-lite')({
    config_basedir: __dirname, //开始查找配置开始位置
    config_dir: 'config' //要找的目录
})


function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = "";
            ctx.req.addListener('data', (data) => {
                postdata += data
            })
            ctx.req.addListener("end", function () {
                let parseData = postdata
                resolve(parseData)
            })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    index: async (ctx, next) => {
        ctx.body = await tool.renderView(ctx, {
            template: 'index'
        })
    },
    importFile: async (ctx, next) => {
        let postData = await parsePostData(ctx)
        console.log('data = ', postData)
    }
}