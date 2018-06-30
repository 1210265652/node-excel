window.onload = function () {
    // 上传excel
    $('#importExcel').click(() => {
        const files = $('input[name="upfile"]').prop('files')
        if (files.length == 0) {
            alert('请先导入文件')
        } else {
            const fileName = files[0].name
            const fileType = fileName.split('.')[1]

            if (fileType !== 'xlsx' && fileType !== 'xls') {
                alert('请选择excel表格')
            } else {
                const formData = new FormData()
                $.each(files, (i, files) => {
                    formData.append('upload_file', files)
                })
                $.ajax({
                    type: "post",
                    url: "/postExcelFile",
                    data: formData,
                    enctype: "multipart/form-data",
                    dataType: 'JSON',
                    contentType: false,
                    processData: false,
                    success: (data) => {
                        console.log('data = ', data)
                        alert('上传成功')
                    },
                    error: (err) => {
                        console.log('error = ', err)
                    }
                })
            }
        }
    })
}