/**
 * index控制器
 */
const tool = require('../util/tool')
const formidable = require('formidable')
const fs = require('fs')
const xlsx = require('node-xlsx')
const path = require('path')
const config = require('config-lite')({
    config_basedir: __dirname, //开始查找配置开始位置
    config_dir: 'config' //要找的目录
})




module.exports = {
    index: async (ctx, next) => {
        ctx.body = await tool.renderView(ctx, {
            template: 'index'
        })
    },
    importFile: async (ctx, next) => {
        // ctx.body = ctx
        // console.log(ctx.request)

        // var form = new formidable.IncomingForm();
        // await form.parse(ctx.req, function(err,fields,files){
        // 	if(err){throw err; return;}
        //     console.log(fields); 
        //     
        //     console.log('form = ', fields, files)
        // });
        // ctx.body = "end"

        let message = '';
        let form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';        //设置编辑
        form.uploadDir = 'public/upload/';     //设置上传目录
        form.keepExtensions = true;     //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小


        await form.parse(ctx.req, function (err, fields, files) {
            if (err) {
                console.log('err = ', err);
            }
            let filename = files.upload_file.name
            // 对文件名进行处理，以应对上传同名文件的情况
            let nameArray = filename.split('.');
            let type = nameArray[nameArray.length - 1];
            let name = '';
            for (let i = 0; i < nameArray.length - 1; i++) {
                name = name + nameArray[i];
            }
            let rand = Math.random() * 100 + 900;
            let num = parseInt(rand, 10);

            let avatarName = name + num + '.' + type;

            let newPath = form.uploadDir + avatarName;
            fs.renameSync(files.upload_file.path, newPath);  //重命名
        })
        let sheets = xlsx.parse('public/upload/2018年开发记-update20180625952.xlsx');
        let dataArr = []
        sheets.forEach(function (sheet) {
            // console.log('sheet = ', sheet['name']);
            for (let rowId in sheet['data']) {
                // console.log('rowId = ', rowId)
                let row = sheet['data'][rowId]
                // console.log('row = ', row, 'type = ', typeof row)
                dataArr.push(row)
            }
        })
        ctx.body = 'ok'

        var w_data = dataArr
        // var w_data = new Buffer(w_data);

        /**
         * filename, 必选参数，文件名
         * data, 写入的数据，可以字符或一个Buffer对象
         * [options],flag,mode(权限),encoding
         * callback 读取文件后的回调函数，参数默认第一个err,第二个data 数据
         */
        console.log('----', w_data)
        console.log('*****', JSON.stringify(w_data))
        
        
        fs.writeFile('public/js/data.js', w_data, {flag: 'a'}, function (err) {
        if(err) {
            console.log(err);
            } else {
            console.log('写入成功')
            }
        })

    }
}