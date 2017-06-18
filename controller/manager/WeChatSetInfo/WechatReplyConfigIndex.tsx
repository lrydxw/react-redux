import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import { Icon, Modal, Form, Input, Tabs, Upload, Popconfirm, message, Button } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
//api
import WeChatSetInfoApi from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import ArrayHelper from '../../../pub/ArrayHelper';
const store = BaseStore({});
const confirm = Modal.confirm;
//表单验证模块

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class WechatReplyConfigIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initWechatReplyList = this.initWechatReplyList.bind(this);
        this.openTextForm = this.openTextForm.bind(this);
        this.closeTextSetForm = this.closeTextSetForm.bind(this);
        this.submitTextForm = this.submitTextForm.bind(this);
        this.openTestEditForm = this.openTestEditForm.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.moveItem = this.moveItem.bind(this);
        this.reUpload = this.reUpload.bind(this);

        let formReplyTextElements: FormElement[] = [
            { key: "Content", element: ElementEnum.Textarea, type: "string", label: "输入内容", message: "请输入内容", rules: { required: true, whitespace: true }, dataList: [] },


        ];

        this.state = {
            weChatReplyMessageContent: [],
            visibleTextForm: false,
            textSetDefaultValues: {},
            textSetData: formReplyTextElements,
            editId: -1,
            editNextId: -1,
            isInsert: false
        };
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        this.initWechatReplyList();
    }
    //更新DOM之前被执行
    componentWillUpdate() {
    }
    //更新DOM之后被执行
    componentDidUpdate() {

        var _self = this;
        if (_self.state.editId !== _self.state.editNextId && _self.state.visibleTextForm === true) {

            var currentList = _self.state.weChatReplyMessageContent;
            var index = ArrayHelper.getItemIndex(currentList,_self.state.editId);
            if (index > -1) {
                var obj = currentList[index];
                _self.setState({ textSetDefaultValues: obj, editId: obj.Id });
            }

            _self.state.editNextId = _self.state.editId;
        }

    }
    //移除DOM之前被执行
    componentWillUnmount() {
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {

    }

    //关闭添加文本窗口
    closeTextSetForm() {
        this.setState({ visibleTextForm: false });
    }

    openTestEditForm(record) {

        this.setState({ isInsert: false, visibleTextForm: true, editNextId: -1, editId: record.Id });
    }

    //打开添加文本窗口
    openTextForm() {
        this.setState({ isInsert: true, visibleTextForm: true, editId: -1, textSetDefaultValues: {} });
    }

    //提交添加文本表单
    submitTextForm(obj) {
        var _self = this;
        const { setFieldsValue, getFieldValue } = _self.props.form;
        var setObj = {};
        var currentList = _self.state.weChatReplyMessageContent;
        if (_self.state.isInsert) {
            var orderIndex = currentList.length;
            var weChatReplyMessageContent = { Id: Math.floor(Math.random() * 1000), WeChatContentType: 1, Content: obj.Content, OrderIndex: orderIndex, EditType: 1 }
            currentList.push(weChatReplyMessageContent);
            setObj["Content_" + weChatReplyMessageContent.Id] = obj.Content;
        }
        else {
            var index = ArrayHelper.getItemIndex(currentList, _self.state.editId);
            if (index > -1) {
                var currentObj = currentList[index];
                currentObj.Content = obj.Content;
                setObj["Content_" + currentObj.Id] = obj.Content;
            }
        }
        ArrayHelper.sortIndex(currentList);
        _self.state.weChatReplyMessageContent = currentList;
        _self.state.visibleTextForm = false;
        setFieldsValue(setObj);
    }

    deleteAll() {
        var _self = this;
        confirm({
            title: '温馨提醒',
            content: '确定要删除所有项吗？',
            onOk() {
                _self.setState({ weChatReplyMessageContent: [] });
            },
            onCancel() { },
        });
    }

    saveAll() {
        var _self = this;
        var form = _self.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var weChatReplyMessageContentList = [];
            var obj = form.getFieldsValue();

            _self.state.weChatReplyMessageContent.map(function (item, i) {
                var weChatReplyMessageContent = new Object();
                weChatReplyMessageContent["Id"] = item.Id;
                weChatReplyMessageContent["WeChatContentType"] = item.WeChatContentType;
                weChatReplyMessageContent["Content"] = item.WeChatContentType == 1 ? item.Content : obj["Content_" + item.Id];
                weChatReplyMessageContent["OrderIndex"] = i;
                weChatReplyMessageContent["EditType"] = item.EditType;
                weChatReplyMessageContentList.push(weChatReplyMessageContent);
            });

            console.log(weChatReplyMessageContentList);

            WeChatSetInfoApi.SetWeChatMessageContent({ WeChatModuleType: 1, WeChatMessageContentInfoList: weChatReplyMessageContentList }).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '保存成功',
                        content: '被关注自动回复配置已保存',
                    });

                    return;

                } else {
                    message.error(data.Message);
                }
            });
        });
    }

    deleteReplyContent(id) {
        var _self = this;
        var currentList = _self.state.weChatReplyMessageContent;
        var index = ArrayHelper.getItemIndex(currentList,id);
        if (index > -1) {
            debugger;
            currentList.splice(index, 1);
            ArrayHelper.sortIndex(currentList);
            _self.setState({ weChatReplyMessageContent: currentList });
            console.log(_self.state.weChatReplyMessageContent);
        }
    }



    handleCancel(id) {
        var _self = this;
        _self.state["priviewVisible_" + id] = false;
        _self.setState(_self);
    }

    initWechatReplyList() {
        var _self = this;
        const { setFieldsValue } = _self.props.form;
        WeChatSetInfoApi.GetWeChatMessageContentInfoList({ WeChatModuleType: 1 }).then(function (data) {
            if (data.IsOK) {

                var setObj = {};
                if (data.Value.length > 0) {
                    data.Value.map(function (item) {

                        setObj["Content_" + item.Id] = item.Content;

                        switch (item.WeChatContentType) {

                            case 2:
                                if (item.Content && item.Content.length > 0) {
                                    var urlFileList = [{
                                        uid: item.Id,
                                        name: item.Id,
                                        status: 'done',
                                        url: item.Content,
                                        thumbUrl: item.Content
                                    }];

                                    _self.state["ImageUrlFileList_" + item.Id] = urlFileList;
                                    _self.state["uploadImg_" + item.Id] = false;
                                }
                                else {
                                    _self.state["uploadImg_" + item.Id] = true;
                                }
                                break;
                            case 3:
                                if (item.Content && item.Content.length > 0) {
                                    var urlFileList = [{
                                        uid: item.Id,
                                        name: item.Id,
                                        status: 'done',
                                        url: item.Content,
                                        thumbUrl: item.Content
                                    }];

                                    _self.state["VoiceUrlFileList_" + item.Id] = urlFileList;
                                    _self.state["uploadVoice_" + item.Id] = false;
                                }
                                else {
                                    _self.state["uploadVoice_" + item.Id] = true;
                                }
                                break;
                            case 4:
                                if (item.Content && item.Content.length > 0) {
                                    var urlFileList = [{
                                        uid: item.Id,
                                        name: item.Id,
                                        status: 'done',
                                        url: item.Content,
                                        thumbUrl: item.Content
                                    }];

                                    _self.state["VideoUrlFileList_" + item.Id] = urlFileList;
                                    _self.state["uploadVideo_" + item.Id] = false;
                                }
                                else {
                                    _self.state["uploadVideo_" + item.Id] = true;
                                }
                                break;
                        }



                    });

                    _self.state.weChatReplyMessageContent = data.Value;

                    setFieldsValue(setObj);

                }




            } else {
                message.error(data.Message);
            }
        });
    }

    addNewContent(type) {
        var _self = this;
        if (type == 1) {
            _self.openTextForm();
        }
        else {
            var currentList = _self.state.weChatReplyMessageContent;
            var orderIndex = currentList.length;
            var weChatReplyMessageContent = { Id: Math.floor(Math.random() * 1000), WeChatContentType: type, Content: null, OrderIndex: orderIndex, EditType: 1 }
            currentList.push(weChatReplyMessageContent);
            ArrayHelper.sortIndex(currentList);
            _self.setState({ weChatReplyMessageContent: currentList });
        }

    }


    moveItem(isUp, id) {
        var _self = this;
        var arr = _self.state.weChatReplyMessageContent;

        var index = ArrayHelper.getItemIndex(arr, id);
        if (index > -1) {
            if (isUp) {
                ArrayHelper.moveUp(arr, index);

            }
            else {
                ArrayHelper.moveDown(arr, index);

            }
            ArrayHelper.sortIndex(arr);
            _self.setState({ weChatReplyMessageContent: arr });
        }
    }

    playVideo(id)
    {
        var thePlayer = jwplayer("videoContainer" + id);
        if (thePlayer.getState() != "PLAYING") {
            thePlayer.play();
        }
        else
        {
            thePlayer.pause();
        }

        alert(thePlayer.getDuration());
    }

    playVoice(id)
    {
        var thePlayer = jwplayer("voiceContainer" + id);
        if (thePlayer.getState() != "PLAYING") {
            $('#playVoiceBtn' + id).css('backgroundPositionY', '-20px')
            thePlayer.play();
        }
        else {
            $('#playVoiceBtn' + id).css('backgroundPositionY', '0px')
            thePlayer.pause();
        }
    }

    reUpload(id,type)
    {
        var _self = this;
        if (type == 3) {
            _self.state["uploadVideo_" + id] = true;
        }
        else if (type == 4)
        {
            _self.state["uploadVoice_" + id] = true;
        }
        _self.state["hasUpload" + id] = false
        _self.setState(_self);
    }


    render() {
        var _self = this;
        const { getFieldProps, setFieldsValue } = _self.props.form;


        const wechatReplyDom = _self.state.weChatReplyMessageContent.map(function (item, i) {
            let { setFieldsValue, getFieldValue } = _self.props.form;
            var typeName = "";
            if (item.WeChatContentType == 2) {
                typeName = "图片";
            }
            else if (item.WeChatContentType == 3) {
                typeName = "视频";
            }
            else if (item.WeChatContentType == 4) {
                typeName = "语音";
            }
            else {
                typeName = "文件";
            }

            let contentProps = getFieldProps('Content_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请上传' + typeName },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });



            let imageUploadProps = {

                multiple: false,
                fileList: _self.state["ImageUrlFileList_" + item.Id],
                action: "/UploadFile/UploadImage",
                beforeUpload(file) {
                    return Tool.WeChatImgBeforeUpload(file);
                },
                showUploadList: true,
                onChange: (info) => {
                    let fileList = info.fileList;
                    if (fileList.length > 1) {
                        fileList = [info.fileList[info.fileList.length - 1]];
                    }
                    // 1. 上传列表数量的限制
                    //    只显示最近上传的一个，旧的会被新的顶掉
                    fileList = fileList;
                    // 2. 读取远程路径并显示链接
                    fileList = fileList.map((file) => {
                        console.log("fileList：" + fileList.length);
                        if (file.response) {
                            // 组件会将 file.url 作为链接进行展示  
                            file.url = file.response.url;
                        }
                        return file;
                    });
                    // 3. 按照服务器返回信息筛选成功上传的文件
                    fileList = fileList.filter((file) => {
                        console.log("filter：" + fileList.length);
                        //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                        if (file.response) {
                            return file.response.status === 'success';
                        }
                        return true;
                    });
                    var key = "Content_" + item.Id;
                    var obj = {};
                    var val = "";
                    if (fileList.length > 0) {
                        fileList.map(function (file, i) {
                            if (i === 0) {
                                val += file.url;
                            }
                            else {
                                val += "," + file.url;
                            }
                        });
                    }
                    obj[key] = val;
                    _self.state["ImageUrlFileList_" + item.Id] = fileList;

                    _self.state["uploadImg_" + item.Id] = fileList && fileList.length > 0 ? false : true;
                    console.log(_self.state["ImageUrlFileList_" + item.Id])

                    setFieldsValue(obj);

                    //$(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
                },
                listType: "picture-card",
                onPreview: (file) => {

                    _self.state["priviewVisible_" + item.Id] = true;
                    _self.state["priviewImage_" + item.Id] = file.url;
                    _self.setState(_self);

                }

            };
            if (_self.state["uploadImg_" + item.Id] === undefined) {
                _self.state["uploadImg_" + item.Id] = true;
            }


            let voiceUploadProps = {

                multiple: false,
                fileList: _self.state["VoiceUrlFileList_" + item.Id],
                action: "/UploadFile/UploadFile",
                beforeUpload(file) {
                    return Tool.WeChatVoiceBeforeUpload(file);
                },
                showUploadList: true,
                onChange: (info) => {
                    _self.state["hasUpload" + item.Id] = false;
                    let fileList = info.fileList;
                    if (fileList.length > 1) {
                        fileList = [info.fileList[info.fileList.length - 1]];
                    }
                    // 1. 上传列表数量的限制
                    //    只显示最近上传的一个，旧的会被新的顶掉
                    fileList = fileList;
                    // 2. 读取远程路径并显示链接
                    fileList = fileList.map((file) => {
                        console.log("fileList：" + fileList.length);
                        if (file.response) {
                            // 组件会将 file.url 作为链接进行展示  
                            file.url = file.response.url;
                        }
                        return file;
                    });
                    // 3. 按照服务器返回信息筛选成功上传的文件
                    fileList = fileList.filter((file) => {
                        console.log("filter：" + fileList.length);
                        //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                        if (file.response) {
                            _self.state["hasUpload" + item.Id] = true;
                            return file.response.status === 'success';
                        }
                        return true;
                    });
                    var key = "Content_" + item.Id;
                    var obj = {};
                    var val = "";
                    var fileName = "";
                    if (fileList.length > 0) {
                        fileList.map(function (file, i) {
                            if (i === 0) {
                                val += file.url;
                                fileName = file.name;
                            }
                            else {
                                val += "," + file.url;
                            }
                        });
                    }
                    obj[key] = val;
                    _self.state["VoiceUrlFileList_" + item.Id] = fileList;

                    _self.state["uploadVoice_" + item.Id] = fileList && fileList.length > 0 ? false : true;


                   var thePlayer= jwplayer("voiceContainer" + item.Id).setup({
                        flashplayer: "/Content/js/jwplayer.flash.swf",
                        file: val,
                        width: 320,
                        height: 200,

                    });
                   _self.state["voiceFileName" + item.Id] = fileName;

                   $("#div_voice_" + item.Id).find(".ant-upload-list-item-info").css("display", "none");
                   setFieldsValue(obj);

                    //$(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
                },
               


            };
            if (_self.state["uploadVoice_" + item.Id] === undefined) {
                _self.state["uploadVoice_" + item.Id] = true;
            }

            let videoUploadProps = {
                
                multiple: false,
                fileList: _self.state["VideoUrlFileList_" + item.Id],
                action: "/UploadFile/UploadFile", 
                beforeUpload(file) {
                    return Tool.WeChatVideoBeforeUpload(file);
                },
                showUploadList: true,
                onChange: (info) => {
                    _self.state["hasUpload" + item.Id] = false;
                    let fileList = info.fileList;
                    if (fileList.length > 1) {
                        fileList = [info.fileList[info.fileList.length - 1]];
                    }
                    // 1. 上传列表数量的限制
                    //    只显示最近上传的一个，旧的会被新的顶掉
                    fileList = fileList;
                    // 2. 读取远程路径并显示链接
                    fileList = fileList.map((file) => {
                        console.log("fileList：" + fileList.length);
                        if (file.response) {
                            // 组件会将 file.url 作为链接进行展示  
                            file.url = file.response.url;
                        }
                        return file;
                    });
                    // 3. 按照服务器返回信息筛选成功上传的文件
                    fileList = fileList.filter((file) => {
                        console.log("filter：" + fileList.length);
                        //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                        if (file.response) {
                            _self.state["hasUpload" + item.Id] = true;
                            return file.response.status === 'success';
                        }
                        return true;
                    });
                    var key = "Content_" + item.Id;
                    var obj = {};
                    var val = "";
                   
                    if (fileList.length > 0) {
                        fileList.map(function (file, i) {
                            if (i === 0) {
                                val += file.url;
                            }
                            else {
                                val += "," + file.url;
                            }
                        });
                    }
                    obj[key] = val;
                    _self.state["VideoUrlFileList_" + item.Id] = fileList;

                    _self.state["uploadVideo_" + item.Id] = fileList && fileList.length > 0 ? false : true;

                    jwplayer("videoContainer" + item.Id).setup({
                        flashplayer: "/Content/js/jwplayer.flash.swf",
                        file: val,
                        width: 320,
                        height: 200,
                       
                    });


                    $("#div_video_" + item.Id).find(".ant-upload-list-item-info").css("display", "none");

                    setFieldsValue(obj);

                    //$(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
                },
               

            };
            if (_self.state["uploadVideo_" + item.Id] === undefined) {
                _self.state["uploadVideo_" + item.Id] = true;
            }


            return (
                <div className="wechat-pai wechat-pai-reset border-btm1" key={"reply_div_" + item.Id}>
                    <p className="wechat-item">序号{item.OrderIndex+1}</p>
                    <div className="margin-top15  margin-btm15 clearfix">

                        {item.WeChatContentType == 1 ? <p className="wechat-pai-p pull-left"> <Input type="hidden"  {...contentProps} />{item.Content}</p>

                            : item.WeChatContentType == 2 ?

                                <div className="wechat-pai-p pull-left">
                                    <FormItem>
                                        <Input type="hidden"  {...contentProps} />

                                        <div >
                                            <Upload {...imageUploadProps} name="upload" >

                                                {_self.state["uploadImg_" + item.Id] ? <div> <Icon type="plus" />
                                                    <div className="ant-upload-text" >图片</div></div> : null}

                                            </Upload>
                                            <Modal visible={_self.state["priviewVisible_" + item.Id]} footer={null} onCancel={() => { _self.handleCancel(item.Id) } }>
                                                <img style={{ width: "100%" }} alt="example" src={_self.state["priviewImage_" + item.Id]} />
                                            </Modal>
                                        </div>
                                    </FormItem>
                                </div>


                                :
                                item.WeChatContentType == 4 ?

                                    <div className="wechat-pai-p pull-left" id={"div_voice_" + item.Id}>
                                        <FormItem>
                                            <Input type="hidden"  {...contentProps} />

                                            <div >
                                                <Upload {...voiceUploadProps} name="upload" >
                                                    {_self.state["uploadVoice_" + item.Id] ? <Button type="ghost">
                                                        <Icon type="upload" /> 点击上传音频
                                    </Button> : null}
                                                </Upload>

                                            </div>

                                            <div className="wechat-audio" style={{ display: _self.state["hasUpload" + item.Id] ? "block" : "none" }}>
                                                <p className="audio-Title">{_self.state["voiceFileName" + item.Id]}</p>
                                               
                                                <div className="audio-button" onClick={() => { _self.playVoice(item.Id) } }><span id={"playVoiceBtn" + item.Id}></span>
                                                    <p className="color-green reupdate" onClick={() => { _self.reUpload(item.Id, 4) } }>删除</p>
                                                </div>
                                                
                                               
                                                <div style={{ display: "none" }}>
                                                    <video id={"voiceContainer" + item.Id} className="video-js vjs-default-skin vjs-big-play-centered" ></video>
                                                </div>
                                                
                                            </div>

                                          
                                        </FormItem>
                                    </div>
                                    :
                                    item.WeChatContentType == 3 ?

                                        <div className="wechat-pai-p pull-left" id={"div_video_" + item.Id}>
                                            <FormItem>
                                                <Input type="hidden"  {...contentProps} />

                                                <div>
                                                    <Upload {...videoUploadProps} name="upload" >
                                                        {_self.state["uploadVideo_" + item.Id] ? <Button type="ghost">
                                                            <Icon type="upload" /> 点击上传视频
                                    </Button> : null}
                                                    </Upload>

                                                </div>

                                                <div style={{ display: _self.state["hasUpload" + item.Id]?"block":"none"}}>
                                                    <video id={"videoContainer" + item.Id} className="video-js vjs-default-skin vjs-big-play-centered" ></video>
                                                    <p className="color-green reupdate reupdate-reset" onClick={() => { _self.reUpload(item.Id,3) } }>删除</p>
                                                </div>
                                                
                                            </FormItem>
                                        </div>
                                        :
                                        null}
                        <Popconfirm title="确定要删除吗？" onConfirm={() => { _self.deleteReplyContent(item.Id) } }>
                            <a title="删除" className="pull-right margin-right15"><i className="fa fa-trash color9" aria-hidden="true"></i></a>
                        </Popconfirm>
                        <a title="向下移动" className="pull-right margin-right15"><i className="fa fa-arrow-down color9" aria-hidden="true" onClick={() => { _self.moveItem(false, item.Id) } }></i></a>
                        <a title="向上移动" className="pull-right margin-right15"><i className="fa fa-arrow-up color9" aria-hidden="true" onClick={() => { _self.moveItem(true, item.Id) } }></i></a>
                        {item.WeChatContentType == 1 ? <a title="编辑" className="pull-right margin-right15"><i className="fa fa-pencil color9" aria-hidden="true" onClick={() => { _self.openTestEditForm(item) } }></i></a> : null}

                    </div>
                </div>





            );
        });

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetMenu/Index">公众号菜单</a>
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetInfo/Index">公众号配置</a>
                    <a className="main-content-word pull-left set-content-word-te" >自动回复</a>
                </div>

                <div className="wechat-hui clearfix">
                    <a className="wechat-hui-1 wechat-hui-act">被关注自动回复</a>
                    <a href="/Manager/WeChatSetInfo/WechatKeyWordReplyConfigList" className="wechat-hui-1 margin-left10">关键词自动回复</a>
                </div>
                <div className="wechat-hui-box margin-top20">
                    <ul>
                        <li className="wechat-hui-li">
                            <div className="clearfix border-btm1">
                                <div className="margin-top20 margin-btm20  clearfix">
                                    <p className="wechat-hui-li-p fa-pull-left">自动回复内容：</p>
                                    <div className="wechat-hui-w pull-left clearfix">
                                        <p data-toggle="modal" className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p wechat-active" onClick={() => { this.addNewContent(1) } }>文字</p>
                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p" onClick={() => { this.addNewContent(2) } }>图片</p>
                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p" onClick={() => { this.addNewContent(3) } }>视频</p>
                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p" onClick={() => { this.addNewContent(4) } }>语音</p>
                                    </div>
                                </div>
                            </div>

                            {wechatReplyDom}
                        </li>

                        <li className="wechat-hui-li">
                            <div className="margin-top20 margin-btm20 clearfix">
                                <div className="width100 margin-left100  pull-left">
                                    <input className="btn btn-success btn-block" type="submit" value="保存" onClick={this.saveAll} />
                                </div>
                                <div className="width100 margin-left20  pull-left">
                                    <input className="btn btn-default btn-block" type="submit" value="删除" onClick={this.deleteAll} />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <Modal title="编辑文字" visible={this.state.visibleTextForm} onCancel={this.closeTextSetForm} maskClosable={false} footer={[]} >
                    <FormTemplate formElements={this.state.textSetData} defaultValues={this.state.textSetDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitTextForm} onCancel={this.closeTextSetForm}></FormTemplate>
                </Modal>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let WechatReplyConfigIndexPage = Form.create({})(WechatReplyConfigIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(WechatReplyConfigIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

