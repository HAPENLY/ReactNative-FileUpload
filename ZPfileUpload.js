/**
 * Created by zhaopengsong on 2017/5/22.
 */
/**
 * Created by zhaopengsong on 2017/3/30.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    NativeModules,
    Navigator,
    TouchableHighlight,
} from 'react-native';
// 导入外部组件
var ImagePicker = NativeModules.ImageCropPicker;
//引入Dimensions
var Dimensions = require('Dimensions');
var {width, height}= Dimensions.get('window');
import Video from 'react-native-video';
var UPLoadfile = React.createClass({
    getDefaultProps(){
        return{
            // 回调函数
            popTopHome:null,
            title:''
        }
    },
    //初始化数据
    getInitialState(){
        return{
            image: null,
            images: null,
            paused:false,
            //获取到serverIP
            serverip:''
        }
    },
    render() {
        return (

            <View style={styles.container}>

        {/*设置导航栏*/}
        {this.renderNavBar()}

    <TouchableHighlight
        style={styles.CellRightSubexit}
        underlayColor="#d9d9d9"
        onPress={() => {
            console.log('文件选择');
            this.selectImages()
        }}>
    <Text style={styles.CellRightSubexittext}>
        文件选择
        </Text>
        </TouchableHighlight>
        <ScrollView
        showsVerticalScrollIndicator={false}
        >
        {this.state.image ? this.renderAsset(this.state.image) : null}
        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
    </ScrollView>
        </View>
    );
    },
    goVideoPlay(){
        // 继续执行回调函数
        this.props.popTopHome();
    },
    //返回导航栏
    renderNavBar(){
        return (
            <View style={styles.NavBarViewStyle}>
    <TouchableOpacity onPress={()=>{this.props.navigator.pop()}} style={styles.leftViewStyle}>
    <Image source={{uri: 'back'}} style={styles.navImageStyle}/>
    </TouchableOpacity>
        <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>本地文件</Text>

        <TouchableHighlight
        style={styles.NavRightBtnOneStyle}
        underlayColor="#d9d9d9"
        onPress={() => {
            console.log('确定上传');
            {/*this.getImageDataPop()*/}

            this.uploadImage(this.state.images)

        }}>
    <Text style={styles.CellRightSubexittext}>
        确定
        </Text>
        </TouchableHighlight>
        </View>
    )
    },
    getImageDataPop(){

        let img = this.state.images;
        this.props.getImg(img);
        this.props.navigator.pop()
    },
    // ******************图片选择*******************
    selectImages(){
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
        }).then(images => {

            this.setState({
            images: images.map(i => {
                console.log('received image', i);
        return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
    })

    });
        console.log('imagessss',images);
    }).catch(e => alert(e));
    },
    //*********选择视频资源播放*****
    renderVideo(video) {
        return (<View style={{height: width/16*9, width: width}}>
    <TouchableOpacity style={{height: width/16*9, width: width}} onPress={() => {this.setState({paused: !this.state.paused})}}>
    <Video source={{uri: video.uri, type: video.mime}}
        style={{position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }}
        rate={1}
        paused={this.state.paused}
        volume={1}
        muted={false}
        resizeMode={'contain'}
        onError={e => console.log(e)}
        onLoad={load => console.log(load)}
        repeat={true} />
            </TouchableOpacity>
            </View>);

    },
    renderImage(image) {

        return <Image style={{width: 300, height: 300,resizeMode: 'cover' }} source={image} />
    },

    renderAsset(image) {

        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    },
// *************图片选择*END**********

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
});
//**************图片上传END************
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e8e8',
    },
    NavBarViewStyle:{
        height: Platform.OS == 'ios' ? 64 : 44,
        backgroundColor:'rgba(255,255,255,1.0)',

        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 主轴方向居中
        justifyContent:'center'
    },
    navRightImageStyle:{
        width:25,
        height:25,
    },
    rightViewStyle:{
        // 绝对定位
        position:'absolute',
        right:10,
        bottom:Platform.OS == 'ios' ? 15:13
    },
    leftViewStyle:{
        // 绝对定位
        position:'absolute',
        left:10,
        bottom:Platform.OS == 'ios' ? 15:13
    },
    navImageStyle:{
        width:Platform.OS == 'ios' ? 28: 24,
        height:Platform.OS == 'ios' ? 28: 24,
    },



    CellRightSubexit: {
        width:60,
        height: 20,
        marginBottom:0,
        marginLeft:10,
        marginRight:10,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
    },
    CellRightSubexittext: {
        height: 20,
        fontSize: 12,
        marginTop:9
    },
    NavRightBtnOneStyle:{
        width: 40,
        height: 20,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        // 绝对定位
        position:'absolute',
        right:10,
        top:25
    },

});
// 输出组件类
module.exports = UPLoadfile;
