import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio } from 'antd';
const FormItem = Form.Item;
import { Sortable } from "sortable";

import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
//api
import ManagerWeChatSetMenuApi from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
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
class WeChatMenuConfigIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
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
            sortState: null
        };

    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        var _this = this;
        ManagerWeChatSetMenuApi.getList({ Name: [{ Test: ["1", "2"] }, { Test: ["3", "4"] }] }).then(function (data) {
            if (data.IsOK) {
                _this.state.menus = data.Value;
                if (_this.state.menus.length > 0)
                    _this.focusMenu(0);
            }
        });
    }


    //更新DOM之前被执行
    componentWillUpdate() {
    }

    //更新DOM之后被执行
    componentDidUpdate() {
    }
    //移除DOM之前被执行
    componentWillUnmount() {
    }

    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
    }

    focusMenu(index) {
        this.state.focusChildIndex = -1;
        this.state.deleteMenuCaption = "删除菜单";
        this.state.setMenuTitle = "菜单名称";
        this.state.currentMenuName = this.state.menus[index].Name;
        this.state.currentMenuBtnType = this.state.menus[index].WeChatBtnType;
        this.setState({ focusIndex: index });
    }

    focusSubMenu(index) {
        if (this.state.focusChildIndex != index) {
            this.state.deleteMenuCaption = "删除子菜单";
            this.state.setMenuTitle = "子菜单名称";
            this.state.currentMenuName = this.state.menus[this.state.focusIndex].Children[index].Name;
            this.state.currentMenuBtnType = this.state.menus[this.state.focusIndex].Children[index].WeChatBtnType;
            this.setState({ focusChildIndex: index });
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
        var menu = { Id: "", Name: "菜单名称", OrderIndex: this.state.menus.length, WeChatBtnType: "Text", Children: [] };
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
        var menu = { Id: "", Name: "子菜单名称", OrderIndex: _this.state.menus[_this.state.focusIndex].Children.length, WeChatBtnType: "Text", Children: [], ParentId: _this.state.menus[_this.state.focusIndex].Id };
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

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const WeChatBtnType = this.state.focusChildIndex > -1 ? this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].WeChatBtnType : (this.state.focusIndex > -1 ? this.state.menus[this.state.focusIndex].WeChatBtnType : "");
        const Path = this.state.focusChildIndex > -1 ? this.state.menus[this.state.focusIndex].Children[this.state.focusChildIndex].Path : (this.state.focusIndex > -1 ? this.state.menus[this.state.focusIndex].Path : "");
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te" href="#">自定义菜单</a>
                </div>
            
          <div className="wechat-hui clearfix">
                    <a href="#" className="wechat-hui-1 wechat-hui-1">订阅号</a>
                    <a href="#" className="wechat-hui-1 wechat-hui-act margin-left10">服务号</a>
                </div>
                <div className="editor-box55  padding-top20 padding-btm20 clearfix ">
                  
              <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">微领袖商学院</p>
                        </div>
                        <div className="padding-left15 padding-right15 editor-left-main2">
                            <p>这里是样板区域</p>
                            <p>这里是样板区域</p>
                            <p>这里是样板区域</p>
                        </div>
                        <dl className="foot-nav margin-btm0 ">
                            <dd className="foot-nav-con foot-nav-keyboard" style={{width: "0.1%"}}><img src="images/keyboard.jpg" /></dd>
                            <dd className="foot-nav-con">
                                <span className="foot-nav-con-word">菜单名称</span>
                                <ul className="foot-nav-con-sub">
                                    <li><img className="sub-arrow" src="images/editor-arrow1.png" /></li>
                                    <li className="foot-sub-word foot-nav-active">
                                        <span className="foot-sub-word-con">子菜单名称</span>
                                    </li>
                                    <li className="foot-sub-word">
                                        <span className="foot-sub-word-con">子菜单名称</span>
                                    </li>
                                    <li className="foot-sub-word">
                                        <span className="foot-sub-word-con"><img src="images/add.png" width="20" height="20" /></span>
                                    </li>
                                </ul>
                            </dd>
                            <dd className="foot-nav-con">
                                <span className="foot-nav-con-word">菜单名称</span>
                                <ul className="foot-nav-con-sub" style={{ display: "none"}}>
                                    <li><img className="sub-arrow" src="images/editor-arrow1.png" /></li>
                                    <li className="foot-sub-word foot-nav-active">
                                        <span className="foot-sub-word-con">子菜单名称</span>
                                    </li>
                                    <li className="foot-sub-word">
                                        <span className="foot-sub-word-con">子菜单名称</span>
                                    </li>
                                    <li className="foot-sub-word">
                                        <span className="foot-sub-word-con"><img src="images/add.png" width="20" height="20" /></span>
                                    </li>
                                </ul>
                            </dd>
                            <dd className="foot-nav-con foot-nav-active"><img src="images/add.png" width="20" height="20" /></dd>
                        </dl>
                    </div>

                    <div className="pull-right editor-right editor-right2  padding20">
                        <div className="editor-arrow editor-arrow2"><img src="images/editor-arrow2.png" /></div>
                        <div className="clearfix editor-title margin-btm20">
                            <span className="pull-left">商户版</span>
                            <a className="pull-right color-blue" href="#">删除子菜单</a>
                        </div>
                        <div className="form-horizontal tasi-form" >
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2 ">菜单名称：</label>
                                    <div className="col-xs-7">
                                        <input type="text" value="" className="cp1 form-control" />
                                </div>
                                        <div className="col-xs-7 col-xs-offset-2  color9 font12 margin-top5">
                                            字符不超过4个汉字或8个字母
                                    <span className="color-red">字符超过限制</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2">菜单内容：</label>
                                        <div className="col-xs-7">
                                            <div className="row radios">
                                                <div className="col-xs-5">
                                                    <label className="label_radio" for="radio-01">
                                                        <span className="font12">发送消息</span>
                                                    </label>
                                                </div>
                                                <div className="col-xs-5">
                                                    <label className="label_radio" for="radio-02">
                                                        <span className="font12">网页跳转</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-xs-10 border1 bg-colorFF margin-top15 margin-left15 wechat-meu padding0">
                                            <div className="border-btm1 clearfix">
                                                <div className=" margin-top15 ">
                                                    <div className="wechat-hui-w clearfix">
                                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p wechat-active">文字</p>
                                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p">图片</p>
                                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p">视频</p>
                                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p">语音</p>
                                                        <p className="wechat-hui-w-tu1-p pull-left margin-left5 wechat-hui-w-tu1-p">图文</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="wechat-meu-box" href="#myModal2" data-toggle="modal">
                                                <img className="margin-top60" src="images/wechat80.png" />
                                                    <p className="margin-top10 font12 color9">新建文字信息</p>
                                    </div>
                                            </div>
                                  
                              <div className=" col-xs-10 border1 bg-colorFF margin-top15 margin-left15 wechat-meu9 padding0">
                                                <div className="wechat-box clearfix margin-top30">
                                                    <p className="wechat-box-p9 pull-left">页面地址：</p>
                                                    <div className="wechat-box-W9 pull-left">
                                                        <input type="text" value="" className="cp1 form-control" />
                                                            <a href="" className="font12 color-blue margin-top10">从公众号图文消息中选择</a>
                                        </div>
                                                    </div>
                                                </div>
                            </div>
                                        </div>
                  </div>
                                </div>
                                <div className="clearfix">
                                    <div className="editor-left5 pull-left">
                                        <div className=" padding-top20">
                                            <input className="btn-success2 btn" type="submit" value="菜单排序" />
                                        </div>
                                    </div>
                                    <div className="editor-right5 pull-right">
                                        <div className="margin-top10">
                                            <input type="checkbox" />
                                                <span>一键同步到订阅号</span>
                        </div>
                                            <div className="padding-top10">
                                                <input className="btn-success btn" type="submit" value="保存并发布" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let WeChatMenuConfigIndexPage = Form.create({})(WeChatMenuConfigIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(WeChatMenuConfigIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

