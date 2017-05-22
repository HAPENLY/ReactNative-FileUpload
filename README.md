# ReactNative-FileUpload
已经实现文件上传功能。以下是关键代码,按照我的写法实现文件上传是没有问题的。有问题可以开个issues。给个Star，感谢！
```
//**************文件上传**************
    uploadImage(imgAry){
        console.log('imgAry', imgAry);
        let formData = new FormData();       //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
        for(var i = 0;i<imgAry.length;i++){
//截取获取文件名
            var a=imgAry[i].uri;
            var arr = a.split('/');
// 获取文件名end
//      判断文件的类型(视频-图片等)end
            let file = {uri: imgAry[i], type: imgAry[i].mime, name: arr[arr.length-1]};   //这里的key(uri和type和name)不能改变,
            formData.append("file", file);   //这里的files就是后台需要的key
            //这里的files就是后台需要的key
        }
        console.log('formData', formData);
        console.log('uri', imgAry[0].uri);
        var request = {
            imgAry,
        };
        console.log('request', request);
        fetch('http://'+yourServerIP+'/api/resources',{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
        // .then((response) => response.json())
            .then((responseData)=>{
            alert('文件上传成功!');
        console.log('responseData=',responseData);

    })
    .catch((error)=>{console.error('error=',error)});
    },
```
