import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio, Upload, Popconfirm } from 'antd';
import { Sortable } from "sortable";
const FormItem = Form.Item;
import LocalStorage from '../../../pub/LocalStorage';
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
class WechatNewCreatReplyConfig extends BaseContainer {
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
        this.addKeyWord = this.addKeyWord.bind(this);
        this.changeReplyMatchType = this.changeReplyMatchType.bind(this);
        this.deleteKeyWord = this.deleteKeyWord.bind(this);
        this.onChange = this.onChange.bind(this);
        let formReplyTextElements: FormElement[] = [
            { key: "Content", element: ElementEnum.Textarea, type: "string", label: "输入内容", message: "请输入内容", rules: { required: true, whitespace: true }, dataList: [] },


        ];
        this.state = {
            value: 1,
            Id: LocalStorage.get('Id'),
            WechatNewCreatReplyConfigContent: [],
            wechatKeyWordContent: [],
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
            var index = ArrayHelper.getItemIndex(currentList, _self.state.editId);
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
    getWeChatKeywordReplyInfoList() {
        var _self = this;
        WeChatSetInfoApi.getWeChatKeywordContentInfo({ Id: _self.state.Id }).then(function (data) {
            if (data.IsOK) {
                _self.setState({
                    WechatNewCreatReplyConfigContent: data.Value
                })

                return;

            } else {
                message.error(data.Message);
            }
        })
    }
    //模糊匹配完全匹配
    changeReplyMatchType(id) {
        var _self = this;
        var currentList = _self.state.wechatKeyWordContent;
        var index = ArrayHelper.getItemIndex(currentList, id);
        if (index > -1)
        {
            var obj = currentList[index];
            if (obj.ReplyMatchType == 1) {
                obj.ReplyMatchType = 2;
            }
            else {
                obj.ReplyMatchType = 1;
            }
            _self.setState({ wechatKeyWordContent: currentList });
        }
    }
    //删除
    deleteKeyWord(id){
        var _self = this;
        var currentList = _self.state.wechatKeyWordContent;
        ArrayHelper.deleteItem(currentList, id);
        _self.setState({ wechatKeyWordContent: currentList });
       
    }
    //保存
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
            obj.WeChatMessageContentInfoList = weChatReplyMessageContentList;
          

            var weChatReplyKeywordInfoList = [];
            _self.state.wechatKeyWordContent.map(function (item,i) {
                var wechatKeyWordContent = new Object();
                wechatKeyWordContent["Id"] = item.Id;
                wechatKeyWordContent["Name"] = obj["Name_" + item.Id];
                wechatKeyWordContent["ReplyMatchType"] = item.ReplyMatchType;
                weChatReplyKeywordInfoList.push(wechatKeyWordContent);
            });
            obj.WeChatReplyKeywordInfoList = weChatReplyKeywordInfoList;

           
            WeChatSetInfoApi.setWeChatKeywordContentInfo({ Id: _self.state.Id, RuleName: obj.RuleName, WeChatReplyKeywordInfoList: obj.WeChatReplyKeywordInfoList, WeChatMessageContentInfoList: obj.WeChatMessageContentInfoList, WeChatModuleType: 2, WeChatReplyMode: obj.WeChatReplyMode }).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '保存成功',
                        content: '关键字自动回复配置已保存',
                        onOk() {
                            _self.goBack();
                        },
                    });

                    return;

                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    addKeyWord() {
        var _self = this;
        var currentList = _self.state.wechatKeyWordContent;
        var wechatKeyWordContent = { Id: Math.floor(Math.random() * 1000), Name: '', ReplyMatchType: 1 };
        currentList.push(wechatKeyWordContent);
        _self.setState({ wechatKeyWordContent: currentList });
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

    goBack() {
        Tool.goPush('Manager/WeChatSetInfo/WechatKeyWordReplyConfigList');
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
            var index = _self.getReplyContentIndex(_self.state.editId);
            if (index > -1) {
                var currentObj = currentList[index];
                currentObj.Content = obj.Content;
                setObj["Content_" + currentObj.Id] = obj.Content;
            }
        }
        currentList = _self.sortOrderIndex(currentList);
        _self.state.weChatReplyMessageContent = currentList;
        _self.state.visibleTextForm = false;
        setFieldsValue(setObj);
        //_self.setState({ weChatReplyMessageContent: currentList, visibleTextForm: false });
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

   

    deleteReplyContent(id) {
        var _self = this;
        var currentList = _self.state.weChatReplyMessageContent;
        var index = _self.getReplyContentIndex(id);
        if (index > -1) {
            debugger;
            currentList.splice(index, 1);
            currentList = _self.sortOrderIndex(currentList);
            _self.setState({ weChatReplyMessageContent: currentList });
            console.log(_self.state.weChatReplyMessageContent);
        }
    }

    getReplyContentIndex(id) {
        var _self = this;
        var result = -1;
        var currentObj = _self.state.weChatReplyMessageContent;
        for (var i = 0; i < currentObj.length; i++) {
            if (currentObj[i].Id == id) {
                result = i;
                break;
            }
        }
        return result;
    }

    sortOrderIndex(replyContentList) {
        for (var i = 0; i < replyContentList.length; i++) {
            var replyContent = replyContentList[i];
            replyContentList[i].OrderIndex = i;
        }
        return replyContentList;
    }

    handleCancel(id) {
        var _self = this;
        _self.state["priviewVisible_" + id] = false;
        _self.setState(_self);
    }

    initWechatReplyList() {
        var _self = this;
        const { setFieldsValue } = _self.props.form;
        debugger;
        WeChatSetInfoApi.getWeChatKeywordContentInfo({ Id: _self.state.Id}).then(function (data) {
            if (data.IsOK) {
                var result = data.Value;

                var setObj = {};
                setObj["RuleName"] = result.RuleName;
                setObj["WeChatReplyMode"] = result.WeChatReplyMode == 0 ? "1" : String(result.WeChatReplyMode);
             

                if (result.WeChatReplyKeywordInfoList.length > 0)
                {
                    result.WeChatReplyKeywordInfoList.map(function (item) {
                        setObj["Name_"+item.Id] = item.Name;
                    });
                    _self.state.wechatKeyWordContent = result.WeChatReplyKeywordInfoList;
                }

                

              






                if (result.WeChatMessageContentInfoList.length > 0) {
                    result.WeChatMessageContentInfoList.map(function (item) {

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

                    _self.state.weChatReplyMessageContent = result.WeChatMessageContentInfoList;

                   

                }
                setFieldsValue(setObj);



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
            currentList = _self.sortOrderIndex(currentList);
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

    playVideo(id) {
        var thePlayer = jwplayer("videoContainer" + id);
        if (thePlayer.getState() != "PLAYING") {
            thePlayer.play();
        }
        else {
            thePlayer.pause();
        }

        alert(thePlayer.getDuration());
    }

    playVoice(id) {
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

    reUpload(id, type) {
        var _self = this;
        if (type == 3) {
            _self.state["uploadVideo_" + id] = true;
        }
        else if (type == 4) {
            _self.state["uploadVoice_" + id] = true;
        }
        _self.state["hasUpload" + id] = false
        _self.setState(_self);
    }


    onChange(e){
        var _self = this;
        const { setFieldsValue } = _self.props.form;
        setFieldsValue({ "WeChatReplyMode": e.target.value });

       
    }
    render() {
        var _self = this;
        const { getFieldProps, setFieldsValue } = _self.props.form;

        const weKeyWordContentDom = _self.state.wechatKeyWordContent.map(function (item, i) {
            let { setFieldsValue, getFieldValue } = _self.props.form;
            const WechatKeyWordProps = getFieldProps('Name_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请输入关键字' },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });
            return (
                <div className="border-btm1 clearfix" key={"div_keyword_" + item.Id}>
                    <div className="wechat-box-W2 pull-left">
                        <FormItem
                            hasFeedback
                            >
                            <Input {...WechatKeyWordProps} placeholder="请输入关键字" className="cp1 form-control" />
                        </FormItem>
                    </div>
                    <p className="pull-left margin-left15 color-blue wechat-fu-p" onClick={() => { _self.changeReplyMatchType(item.Id) } }>{item.ReplyMatchType == 1 ? '完全匹配' : '模糊匹配'}</p>
                    <a className="pull-right margin-right15 margin-top10"><i className="fa fa-trash color9" aria-hidden="true" onClick={() => { _self.deleteKeyWord(item.Id) } }></i></a>
                </div>
            )
        })





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


                    var thePlayer = jwplayer("voiceContainer" + item.Id).setup({
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
                    <p className="wechat-item">序号{item.OrderIndex + 1}</p>
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

                                                <div style={{ display: _self.state["hasUpload" + item.Id] ? "block" : "none" }}>
                                                    <video id={"videoContainer" + item.Id} className="video-js vjs-default-skin vjs-big-play-centered" ></video>
                                                    <p className="color-green reupdate reupdate-reset" onClick={() => { _self.reUpload(item.Id, 3) } }>删除</p>
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


        const WechatRuleNameProps = getFieldProps('RuleName', {
            validate: [{
                rules: [
                    { required: true, message: '请输入规则名称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        
        const WeChatReplyModeProps = getFieldProps('WeChatReplyMode', {
            validate: [{
                rules: [
                    { required: true, message: '请选择回复设置'},
                ], trigger: ['onBlur', 'onChange'],
            }]

        });

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetMenu/Index">公众号菜单</a>
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetInfo/Index">公众号配置</a>
                    <a className="main-content-word pull-left set-content-word-te" >自动回复</a>
                </div>
                <div className="wechat-hui clearfix">
                    <a href="/Manager/WeChatSetInfo/WechatReplyConfig" className="wechat-hui-1">被关注自动回复</a>
                    <a className="wechat-hui-1 wechat-hui-act margin-left10">关键词自动回复</a>
                </div>
                <div className="wechat-hui-box margin-top20">
                    <ul>
                        <li className="wechat-hui-li border-btm1">
                            <div className="margin-top20 margin-btm20 clearfix">
                                <p className="wechat-hui-li-p fa-pull-left">规则名称：</p>
                                <div className="wechat-box-W pull-left">
                                    <FormItem
                                        hasFeedback
                                        >
                                        <Input {...WechatRuleNameProps}  placeholder="请输入规则名称" className="cp1 form-control" />
                                    </FormItem>
                                </div>
                            </div>
                        </li>
                        <li className="wechat-hui-li border-btm1">
                            <div className="margin-top20 margin-btm20 clearfix">
                                <p className="wechat-hui-li-p fa-pull-left">关键词：</p>
                                <div style={{ display: _self.state.wechatKeyWordContent.length>0?"block":"none" }} className="wechat-fu pull-left margin-left15 margin-btm10">
                                    
                                    {weKeyWordContentDom}
                                </div>
                                <a className="color-blue wechat-fu-a" onClick={_self.addKeyWord}>+添加关键词</a>
                            </div>
                        </li>
                        <li className="wechat-hui-li border-btm1">
                            <div className="clearfix border-btm1">
                                <div className="margin-top20 margin-btm20  clearfix">
                                    <p className="wechat-hui-li-p fa-pull-left">自动回复内容：</p>
                                    <div className="wechat-hui-w pull-left clearfix">
                                        <p href="#myModal2" data-toggle="modal" className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p wechat-active" onClick={() => { this.addNewContent(1) } }>文字</p>
                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p" onClick={() => { this.addNewContent(2) } }>图片</p>
                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p" onClick={() => { this.addNewContent(3) } }>视频</p>
                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p" onClick={() => { this.addNewContent(4) } }>语音</p>
                                        
                                    </div>
                                </div>
                            </div>
                            {wechatReplyDom}
                 
                        </li>
                        <li className="wechat-hui-li border-btm1">
                            <div className="margin-top20 margin-btm20 clearfix">
                                <p className="wechat-hui-li-p fa-pull-left">回复设置：</p>

                                <RadioGroup {...WeChatReplyModeProps} onChange={this.onChange}  style={{ marginTop: 9, marginLeft:20 }}>
                                        <Radio value={"1"}>顺序回复</Radio>
                                        <Radio value={"2"} style={{ marginLeft: 20 }}>随机回复</Radio>
                                </RadioGroup>
                                
                            </div>
                        </li>
                        <li className="wechat-hui-li">
                            <div className="margin-top20 margin-btm20 clearfix">
                                <div className="width100 margin-left100  pull-left">
                                    <input className="btn btn-success btn-block" type="submit" value="保存" onClick={_self.saveAll} />
                                </div>
                                <div className="width100 margin-left20  pull-left">
                                    <input className="btn btn-default btn-block" type="submit" value="返回" onClick={_self.goBack} />
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

let WechatReplyConfigIndexPage = Form.create({})(WechatNewCreatReplyConfig);

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


