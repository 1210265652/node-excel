/**
 * index控制器
 */
const tool = require('../util/tool')
const formidable = require('formidable')
const fs = require('fs')
const xlsx = require('node-xlsx')
const path = require('path')
const filePath = path.resolve(__dirname, '../../public')
console.log('--------', filePath)
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
        fs.exists(filePath, (exists) => {
            if (!exists) {
                fs.mkdir(filePath, (err) => {
                    if (err) throw err
                })
            }
        })
        let message = '';
        let form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';        //设置编辑
        form.uploadDir = filePath + 'upload/';     //设置上传目录
        form.keepExtensions = true;     //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小


        form.parse(ctx.req, (err, fields, files) => {
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


            // 读xlsx
            // var obj = xlsx.parse("./" + "resut.xls");
            // console.log(JSON.stringify(obj));
            let sheets = xlsx.parse('public/upload/2018年开发记-update20180625994.xlsx')
            let dataArr = []
            sheets.forEach((sheet) => {
                console.log('sheet = ', sheet);
                dataArr.push(sheet.toString())
                // for (let rowId in sheet['data']) {
                //     console.log('rowId = ', rowId)
                //     let row = sheet['data'][rowId]
                //     console.log('row = ', row, 'type = ', typeof row)
                //     dataArr.push(row)
                // }
            })
            // console.log('--------- ---', dataArr)

            /**
         * filename, 必选参数，文件名
         * data, 写入的数据，可以字符或一个Buffer对象
         * [options],flag,mode(权限),encoding
         * callback 读取文件后的回调函数，参数默认第一个err,第二个data 数据
         */
            // console.log('----', w_data)
            // console.log('*****', JSON.stringify(w_data))
            var w_data = dataArr.toString()
            console.log('*******', w_data)

            fs.writeFile('public/js/data.js', w_data, { flag: 'a' }, 'utf-8', (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('写入成功')
                }
            })
        })
        ctx.body = 'ok'
    },
    uploadFile: async (ctx, next) => {
        ctx.body = 'upload'
        fs.exists(filePath + '/download', (exists) => {
            if (exists) {

            } else {
                fs.mkdir(filePath + '/download', (err) => {
                    if (err) throw err
                    console.log('生成文件夹')
                })
            }
            // 写xlsx
            const data = [
                { name: 'sheet1', data: [['ID', 'Name', 'Score'], ['1', 'Michael', '99'], ['2', 'Jordan', '98']] },
                { name: 'sheet2', data: [['AA', 'BB'], ['23', '24']] }
            ]
            let buffer = xlsx.build(data)
            fs.writeFile(filePath + '/download/result.xlsx', buffer, (err) => {
                if (err) throw err
                console.log('excel 生成成功')
            })
        })
    }
}