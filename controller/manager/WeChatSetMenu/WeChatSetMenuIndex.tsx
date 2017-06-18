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
const FormItem = Form.Item;
import { Sortable } from "sortable";

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
import WeChatSetInfoApi from '../WeChatSetInfo/Api';
import ManagerWeChatSetMenuApi from './Api';
import SystemBasicInfoApi from '../../manager/SystemBasicInfo/Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import ArrayHelper from '../../../pub/ArrayHelper';
const store = BaseStore({});
//表单验证模块

//数据流向
//验证的表单配置
let Verifier_RoleInsert = {
    RoleName: {
        name: '角色名称',
        require: true
    },
};
/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class WeChatSetIndex extends BaseContainer {
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
        this.moveItem = this.moveItem.bind(this);
        this.reUpload = this.reUpload.bind(this);
        this.changeWechatPublicAccountType = this.changeWechatPublicAccountType.bind(this);

        let formReplyTextElements: FormElement[] = [
            { key: "Content", element: ElementEnum.Textarea, type: "string", label: "输入内容", message: "请输入内容", rules: { required: true, whitespace: true }, dataList: [] },


        ];

        this.state = {
            visibleAdd: false,
            menus: [],
            focusIndex: -1,
            focusChildIndex: -1,
            deleteMenuCaption: "",
            setMenuTitle: "",
            setNameTimer: null,
            setPathTimer: null,
            setOrderTimer: null,
            showSort: true,
            sortState: null,
            siteName: "",
            weChatReplyMessageContent: [],
            visibleTextForm: false,
            textSetDefaultValues: {},
            textSetData: formReplyTextElements,
            editId: -1,
            editNextId: -1,
            isInsert: false,
            wechatPublicAccountType:2
        };

    }
    //插入真实DOM之前被执行
    componentWillMount() {

    }


    //插入真实DOM之后被执行
    componentDidMount() {
        this.initMenus();
       

    }

    initMenus() {
        var _self = this;
        ManagerWeChatSetMenuApi.getList({ WechatPublicAccountType: _self.state.wechatPublicAccountType, Name: [{ Test: ["1", "2"] }, { Test: ["3", "4"] }] }).then(function (data) {
            if (data.IsOK) {
                _self.state.menus = data.Value;
                if (_self.state.menus.length > 0) {
                    _self.focusMenu(0);
                }
                else
                {
                    _self.setState({ focusIndex: -1, focusChildIndex: -1 });
                }
            }
        });
    }

    changeWechatPublicAccountType(type) {
        debugger;
        var _self = this;
        _self.state.wechatPublicAccountType = type;
        _self.initMenus();
       
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

    initWechatReplyList() {
        var _self = this;
        const { setFieldsValue } = _self.props.form;
        debugger;

        var id = _self.state.focusChildIndex > -1 ? _self.state.menus[_self.state.focusIndex].Children[_self.state.focusChildIndex].Id : _self.state.menus[_self.state.focusIndex].Id;

        WeChatSetInfoApi.GetWeChatMessageContentInfoList({ WeChatModuleType: 3, ModuleTypeId: id }).then(function (data) {
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
                else
                {
                    _self.setState({ weChatReplyMessageContent: [] });
                }
                



            } else {
                message.error(data.Message);
            }
        });
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

    deleteReplyContent(id) {
        var _self = this;
        var currentList = _self.state.weChatReplyMessageContent;
        var index = ArrayHelper.getItemIndex(currentList, id);
        
        if (index > -1) {
            debugger;
            var isDelete = currentList[index].EditType!=1;
            currentList.splice(index, 1);
            ArrayHelper.sortIndex(currentList);
            _self.setState({ weChatReplyMessageContent: currentList });

            if (isDelete) {
                WeChatSetInfoApi.deleteWeChatMessageContent({ Id: id }).then(function (data) {
                    if (data.IsOK) {
                        _self.initWechatReplyList();

                    } else {
                        message.error(data.Message);
                    }
                });
            }
        }
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
        var objList = [];
        var currentList = _self.state.weChatReplyMessageContent;
        if (_self.state.isInsert) {
            var orderIndex = currentList.length;
            var weChatReplyMessageContent = { Id: Math.floor(Math.random() * 1000), WeChatContentType: 1, Content: obj.Content, OrderIndex: orderIndex, EditType: 1 }
            currentList.push(weChatReplyMessageContent);
            objList.push(weChatReplyMessageContent);
        }
        else {
            var index = ArrayHelper.getItemIndex(currentList, _self.state.editId);
            if (index > -1) {
                var currentObj = currentList[index];
                currentObj.Content = obj.Content;
                objList.push(currentObj);
            }
        }
       
        var id = _self.state.focusChildIndex > -1 ? _self.state.menus[_self.state.focusIndex].Children[_self.state.focusChildIndex].Id : _self.state.menus[_self.state.focusIndex].Id;

        if (objList.length > 0) {
            WeChatSetInfoApi.SetWeChatMessageContent({ WeChatModuleType: 3, ModuleTypeId: id, WeChatMessageContentInfoList: objList }).then(function (data) {
                if (data.IsOK) {
                    ArrayHelper.sortIndex(currentList);
                    _self.setState({ weChatReplyMessageContent: currentList, visibleTextForm: false });
                    return;

                } else {
                    message.error(data.Message);
                }
            });
        }

        _self.initWechatReplyList();

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
            var orderIndex = arr[ArrayHelper.getItemIndex(arr, id)].OrderIndex;

            WeChatSetInfoApi.moveWeChatMessageContent({ Id: id, OrderIndex: orderIndex });

            _self.setState({ weChatReplyMessageContent: arr });
        }
    }

    handleCancel(id) {
        var _self = this;
        _self.state["priviewVisible_" + id] = false;
        _self.setState(_self);
    }

    focusMenu(index) {
        this.state.focusChildIndex = -1;
        this.state.deleteMenuCaption = "删除菜单";
        this.state.setMenuTitle = "菜单名称";
        this.state.currentMenuName = this.state.menus[index].Name;
        this.state.currentMenuBtnType = this.state.menus[index].WeChatBtnType;
        this.state.weChatReplyMessageContent = [];
        
        this.setState({ focusIndex: index }, () => { this.initWechatReplyList();});
    }

    focusSubMenu(index) {
        if (this.state.focusChildIndex != index) {
            this.state.deleteMenuCaption = "删除子菜单";
            this.state.setMenuTitle = "子菜单名称";
            this.state.currentMenuName = this.state.menus[this.state.focusIndex].Children[index].Name;
            this.state.currentMenuBtnType = this.state.menus[this.state.focusIndex].Children[index].WeChatBtnType;
            this.state.weChatReplyMessageContent = [];
            
            this.setState({ focusChildIndex: index }, () => { this.initWechatReplyList(); });
        }
    }

    createSubMenu(subMenu, indexParent) {
        var _this = this;
        return subMenu.map(function (item, index) {
            return (
                <li key={index} data-parentIndex={indexParent} data-index={index} onClick={() => _this.focusSubMenu(index)} className={_this.state.focusIndex == indexParent && _this.state.focusChildIndex == index ? "foot-sub-word foot-nav-active" : "foot-sub-word"}>
                    <span className="foot-sub-word-con">{item.Name}</span>
                </li>
            );
        });
    }
    changeMenuName(event) {
        clearTimeout(this.state.setNameTimer);
        this.state.currentMenuName = event.target.value;
        var menu = { Id: null, Name: this.state.currentMenuName };
        if (this.state.focusChildIndex > -1) {
            this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Name = this.state.currentMenuName;
            menu.Id = this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Id;
        } else {
            menu.Id = this.state.menus[this.state.focusIndex].Id;
            this.state.menus[this.state.focusIndex].Name = this.state.currentMenuName;
        }
        if (this.state.currentMenuName) {
            this.state.setNameTimer = setTimeout(function () {
                ManagerWeChatSetMenuApi.updateName(menu);
            }, 2000);
        }
        this.setState({ currentMenuName: event.target.value });
    }
    changeBtnType(event) {
        clearTimeout(this.state.setNameTimer);
        this.state.currentMenuBtnType = event.target.value;
        var menu = { Id: null, WeChatBtnType: this.state.currentMenuBtnType };
        if (this.state.focusChildIndex > -1) {
            this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].WeChatBtnType = this.state.currentMenuBtnType;
            menu.Id = this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Id;
        } else {
            menu.Id = this.state.menus[this.state.focusIndex].Id;
            this.state.menus[this.state.focusIndex].WeChatBtnType = this.state.currentMenuBtnType;
        }
        this.state.setNameTimer = setTimeout(function () {
            ManagerWeChatSetMenuApi.updateBtnType(menu);
        }, 2000);
        this.setState({ currentMenuBtnType: event.target.value });
    }

    changeMenuPath(event) {
        clearTimeout(this.state.setPathTimer);
        this.state.currentMenuPath = event.target.value;
        var menu = { Id: null, Path: this.state.currentMenuPath };
        if (this.state.focusChildIndex > -1) {
            this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Path = this.state.currentMenuPath;
            menu.Id = this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Id;
        } else {
            this.state.menus[this.state.focusIndex].Path = this.state.currentMenuPath;
            menu.Id = this.state.menus[this.state.focusIndex].Id;
        }
        if (this.state.currentMenuPath) {
            this.state.setPathTimer = setTimeout(function () {
                ManagerWeChatSetMenuApi.updatePath(menu);
            }, 2000);
        }
        this.setState({ currentMenuPath: event.target.value });
    }
    changeOrderIndex(id, newIndex, oldIndex) {
        clearTimeout(this.state.setOrderTimer);
        var menu = { Id: id, NewOrderIndex: newIndex, OldOrderIndex: oldIndex };
        this.state.setOrderTimer = setTimeout(function () {
            ManagerWeChatSetMenuApi.updateOrderIndex(menu);
        }, 2000);
    }

    createMenu() {
        var _this = this;
        this.state.visibleAdd = this.state.menus.length < 3;
        if (this.state.menus.length > 0) {
            var menus = this.state.menus.map(function (item, index) {
                return (
                    <li key={index} className={_this.state.focusChildIndex == -1 && _this.state.focusIndex == index ? "foot-nav-con foot-nav-active" : "foot-nav-con"}>
                        <span onClick={() => _this.focusMenu(index)}>{item.Name}</span>

                        <ul id={"sortmenu" + index} className="foot-nav-con-sub " style={{ display: _this.state.focusIndex == index ? "" : "none" }}>
                            <li style={{ display: _this.state.showSort ? "" : "none" }}><img className="sub-arrow" src="/content/images/editor-arrow1.png" /></li>
                            {item.Children.length > 0 ? _this.createSubMenu(item.Children, index) : null}
                            <li onClick={() => _this.addSubMenu()} className="foot-sub-word" style={{ display: item.Children.length == 5 && _this.state.showSort ? "none" : "" }}>
                                <span className="foot-sub-word-con"><img src="/content/images/add.png" width="20" height="20" /></span>
                            </li>
                        </ul>
                    </li>
                );
            });
            return menus;
        } else {
            return null;
        }
    }

    addMenu() {
        var _this = this;
        var menu = { Id: "", Name: "菜单名称", OrderIndex: _this.state.menus.length, WeChatBtnType: "Text", Children: [], WechatPublicAccountType: _this.state.wechatPublicAccountType };
        ManagerWeChatSetMenuApi.insert(menu).then(function (data) {
            if (data.IsOK) {
                menu.Id = data.Value;
                _this.state.deleteMenuCaption = "删除菜单";
                _this.state.setMenuTitle = "菜单名称";
                _this.state.menus.push(menu);
                _this.state.focusIndex = _this.state.menus.length - 1;
                _this.state.focusChildIndex = -1;
                _this.setState({ focusChildIndex: -1 });
            }
        });
    }

    addSubMenu() {
        var _this = this;
        var menu = { Id: "", Name: "子菜单名称", OrderIndex: _this.state.menus[_this.state.focusIndex].Children.length, WeChatBtnType: "Text", Children: [], ParentId: _this.state.menus[_this.state.focusIndex].Id, WechatPublicAccountType: _this.state.wechatPublicAccountType };
        ManagerWeChatSetMenuApi.insert(menu).then(function (data) {
            if (data.IsOK) {
                menu.Id = data.Value;
                _this.state.deleteMenuCaption = "删除子菜单";
                _this.state.setMenuTitle = "子菜单名称";
                _this.state.menus[_this.state.focusIndex].Children.push(menu);
                _this.state.focusChildIndex = _this.state.menus[_this.state.focusIndex].Children.length - 1;
                _this.setState({ focusChildIndex: _this.state.focusChildIndex });
            }
        });
    }

    deleteMenu() {
        var _this = this;
        if (_this.state.focusChildIndex > -1) {
            ManagerWeChatSetMenuApi.delete({ Id: _this.state.menus[_this.state.focusIndex].Children[_this.state.focusChildIndex].Id }).then(function () {
                _this.state.menus[_this.state.focusIndex].Children.splice(_this.state.focusChildIndex, 1);
                _this.focusMenu(_this.state.focusIndex);
                _this.setState(_this.state.menus);
            });
        } else {
            if (_this.state.focusIndex > -1) {
                ManagerWeChatSetMenuApi.delete({ Id: _this.state.menus[_this.state.focusIndex].Id }).then(function () {
                    _this.state.menus.splice(_this.state.focusIndex, 1);
                    _this.state.focusChildIndex = -1;
                    _this.state.focusIndex = -1;
                    _this.setState(_this.state.menus);
                });
            }
        }
    }

    saveAndPublish() {
        ManagerWeChatSetMenuApi.publish({}).then(function (data) {
            if (data.IsOK) {
                Modal.success({
                    title: '操作成功',
                    content: '公众号菜单设置已保存',
                });
            } else {
                message.error(data.Message);
            }
        });
    }

    SortMenu() {
        var _this = this;
        var sortmenu = document.getElementById('sortmenu');
        var sortmenu0 = document.getElementById('sortmenu0');
        var sortmenu1 = document.getElementById('sortmenu1');
        var sortmenu2 = document.getElementById('sortmenu2');
        if (this.state.sortState == null) {
            this.state.sortState = Sortable.create(sortmenu, {
                animation: 150,
                onEnd: function (evt) {
                    _this.changeOrderIndex("", evt.newIndex, evt.oldIndex);
                }
            });
            if (sortmenu0)
                this.state.sortState0 = Sortable.create(sortmenu0, {
                    animation: 150,
                    onEnd: function (evt) {
                        var id = this.state.menus[evt.parentIndex].Children[evt.index].Id;
                        _this.changeOrderIndex(id, evt.newIndex, evt.oldIndex);
                    }
                });
            if (sortmenu1)
                this.state.sortState1 = Sortable.create(sortmenu1, {
                    animation: 150,
                    onEnd: function (evt) {
                        var id = this.state.menus[evt.parentIndex].Children[evt.index].Id;
                        _this.changeOrderIndex(id, evt.newIndex, evt.oldIndex);
                    }
                });
            if (sortmenu2)
                this.state.sortState2 = Sortable.create(sortmenu2, {
                    animation: 150,
                    onEnd: function (evt) {
                        var id = this.state.menus[evt.parentIndex].Children[evt.index].Id;
                        _this.changeOrderIndex(id, evt.newIndex, evt.oldIndex);
                    }
                });
        } else {
            if (this.state.sortState) {
                this.state.sortState.destroy();
                this.state.sortState = null;
            }
            if (this.state.sortState0) {
                this.state.sortState0.destroy();
                this.state.sortState0 = null;
            }
            if (this.state.sortState1) {
                this.state.sortState1.destroy();
                this.state.sortState1 = null;
            }
            if (this.state.sortState2) {
                this.state.sortState2.destroy();
                this.state.sortState2 = null;
            }
        }
        this.setState({ showSort: !this.state.showSort });
    }

    loadSystemBasicInfo() {
        var _self = this;
        SystemBasicInfoApi.getAppBasciInfo().then(function (data) {
            if (data.IsOK) {
                _self.state.siteName = data.Value.SiteName;

            } else {
                message.error(data.Message);
            }
        });
    }

    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating } = _self.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

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
                    _self.state["ImageUrlFileList_" + item.Id] = fileList;

                    _self.state["uploadImg_" + item.Id] = fileList && fileList.length > 0 ? false : true;
                    console.log(_self.state["ImageUrlFileList_" + item.Id])
                    if (_self.state["hasUpload" + item.Id])
                    {
                        var objList = [];
                        var id = _self.state.focusChildIndex > -1 ? _self.state.menus[_self.state.focusIndex].Children[_self.state.focusChildIndex].Id : _self.state.menus[_self.state.focusIndex].Id;
                        item.Content = val;
                        objList.push(item);
                        if (objList.length > 0) {
                            WeChatSetInfoApi.SetWeChatMessageContent({ WeChatModuleType: 3, ModuleTypeId: id, WeChatMessageContentInfoList: objList });
                            _self.initWechatReplyList();
                        }
                    }
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

                    if (_self.state["hasUpload" + item.Id]) {
                        var objList = [];
                        var id = _self.state.focusChildIndex > -1 ? _self.state.menus[_self.state.focusIndex].Children[_self.state.focusChildIndex].Id : _self.state.menus[_self.state.focusIndex].Id;
                        item.Content = val;
                        objList.push(item);
                        if (objList.length > 0) {
                            WeChatSetInfoApi.SetWeChatMessageContent({ WeChatModuleType: 3, ModuleTypeId: id, WeChatMessageContentInfoList: objList });
                            _self.initWechatReplyList();
                        }
                    }


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


                    if (_self.state["hasUpload" + item.Id]) {
                        var objList = [];
                        var id = _self.state.focusChildIndex > -1 ? _self.state.menus[_self.state.focusIndex].Children[_self.state.focusChildIndex].Id : _self.state.menus[_self.state.focusIndex].Id;
                        item.Content = val;
                        objList.push(item);
                        if (objList.length > 0) {
                            WeChatSetInfoApi.SetWeChatMessageContent({ WeChatModuleType: 3, ModuleTypeId: id, WeChatMessageContentInfoList: objList });
                            _self.initWechatReplyList();
                        }
                    }
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

                        {item.WeChatContentType == 1 ? <p className="wechat-pai-p pull-left">{item.Content}</p>

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


        const WeChatBtnType = this.state.focusChildIndex > -1 ? this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].WeChatBtnType : (this.state.focusIndex > -1 ? this.state.menus[this.state.focusIndex].WeChatBtnType : "");
        const Path = this.state.focusChildIndex > -1 ? this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Path : (this.state.focusIndex > -1 ? this.state.menus[this.state.focusIndex].Path : "");
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">公众号菜单</a>
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetInfo/Index">公众号配置</a>
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetInfo/WechatReplyConfig" >自动回复</a>
                </div>

                <div className="wechat-hui clearfix">
                    <a className={_self.state.wechatPublicAccountType == 2 ? "wechat-hui-1 wechat-hui-act" : "wechat-hui-1"} onClick={() => { _self.changeWechatPublicAccountType(2) } }>服务号</a>
                    <a className={_self.state.wechatPublicAccountType == 1 ? "wechat-hui-1 wechat-hui-1 wechat-hui-act margin-left10" : "wechat-hui-1 wechat-hui-1 margin-left10"} onClick={() => { _self.changeWechatPublicAccountType(1) }}>订阅号</a>
                </div>
                <div className="editor-box55 editor-box55-reset  padding-top20 padding-btm20 clearfix ">
                    <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">{this.state.siteName}</p>
                        </div>
                        <div className="padding-left15 padding-right15 editor-left-main2">
                        </div>
                        <ul id="sortmenu" className="foot-nav margin-btm0 ">
                            <dd className="foot-nav-con foot-nav-keyboard" draggable={false} style={{ width: "0.1%", display: this.state.showSort ? "" : "none" }}><img src="/content/images/keyboard.jpg" /></dd>
                            {this.createMenu()}
                            <dd style={{ display: this.state.visibleAdd && this.state.showSort ? "" : "none" }} draggable={false} onClick={this.addMenu.bind(this)} className="foot-nav-con"><img src="/content/images/add.png" width="20" height="20" /></dd>
                        </ul>
                    </div>
                    <div className="pull-right editor-right editor-right2 editor-right-reset  padding20" style={{ visibility: this.state.showSort && (this.state.focusChildIndex > -1 || this.state.focusIndex > -1) ? "" : "hidden" }}>
                        <div className="editor-arrow editor-arrow2"><img src="/content/images/editor-arrow2.png" /></div>
                        <div className="clearfix editor-title margin-btm20">
                            <span className="pull-left">{this.state.setMenuTitle}</span>
                            <a href="javascript:void(0)" className="pull-right color-blue" onClick={this.deleteMenu.bind(this)}>{this.state.deleteMenuCaption}</a>
                        </div>
                        <form className="form-horizontal tasi-form" >
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-3 ">{this.state.setMenuTitle}：</label>
                                    <div className="col-xs-6">
                                        <Input type="text" value={this.state.focusChildIndex > -1 ? this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Name : (this.state.focusIndex > -1 ? this.state.menus[this.state.focusIndex].Name : "")} onChange={(e) => this.changeMenuName(e)} />
                                    </div>
                                    <div className="col-xs-3  color9 font12 margin-top5">
                                        一级菜单最多不超过5个字符二级菜单不超过7个字符
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: this.state.focusIndex > -1 && this.state.menus[this.state.focusIndex].Children.length > 0 && this.state.focusChildIndex < 0 ? "none" : "" }}>
                                <div className="row margin0">
                                    <label className="control-label col-xs-3">菜单内容：</label>
                                    <div className="col-xs-6">
                                        <RadioGroup onChange={(e) => this.changeBtnType(e)} value={WeChatBtnType}>
                                            <Radio key="a" value={"Text"}>发送消息</Radio>
                                            <Radio key="b" value={"Url"}>跳转网页</Radio>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: this.state.focusIndex > -1 && this.state.menus[this.state.focusIndex].Children.length > 0 && this.state.focusChildIndex < 0 ? "none" : "" }}>
                                <div className="row margin0">

                                    <div className="col-xs-10 text-web-width">
                                        {
                                            WeChatBtnType == "Url" ?
                                                <Input type="text" value={Path} onChange={(e) => this.changeMenuPath(e)} />
                                                :

                                                <div className="wechat-hui-box wechat-huibox-reset margin-top20">
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


                                                    </ul>
                                                </div>



                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="clearfix">
                        <div className="editor-left5 pull-left">
                            <div className="text-center padding-top20">
                                <Button size="large" type="ghost" onClick={this.SortMenu.bind(this)}>菜单排序</Button>
                            </div>
                        </div>
                        <div className="editor-right5 pull-right">
                            <div className="text-center padding-top20">
                                <Button size="large" type="primary" onClick={this.saveAndPublish.bind(this)}>保存并发布</Button>
                            </div>
                        </div>
                    </div>
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

let WeChatSetIndexPage = Form.create({})(WeChatSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(WeChatSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

