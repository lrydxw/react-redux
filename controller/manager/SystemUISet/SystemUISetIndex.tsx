import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio, Popover, Select, Upload } from 'antd';
import Toast from '../../../components/toast/Toast';
import Tool from '../../../pub/Tool';

import { Sortable } from "sortable";
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import { DragDropContext } from 'react-dnd';
import { DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
import Card from './component/Card'
import CardGroup from './component/CardGroup'
import NavCard from './component/NavCard'

import update = require('react/lib/update');

const ItemTypes = { CARD: 'card' }
const FormItem = Form.Item;



const Api = {
	/**
	 * 获取基本信息
	 */
    GetMyCenterFunction: (basciInfo: {}) => {
        return Server.resource('POST', "UITemplate/GetMyCenterFunction",
            basciInfo
        );
    },
    UpdateFunction: (basicInfo: {}) => {
        return Server.resource('POST', "UITemplate/UpdateFunction",
            basicInfo
        );
    },
    UpdateSort: (basicInfo: {}) => {
        return Server.resource('POST', "UITemplate/UpdateSort",
            basicInfo
        );
    },
    /**
    *获取模板配置
    */
    GetTemplatePageSet: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemTemplate/GetTemplatePageSet",
            basciInfo
        );
    },
}
/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class SystemUISetIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        super(props);
        /*
    1、初始化时，将被执行
    2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
    3、相当于java中全局变量的声明
    4、值发生变化时，render将会重新被渲染
    */

        this.addToCenter = this.addToCenter.bind(this);
        this.editProps = this.editProps.bind(this);
        this.removeFromCenter = this.removeFromCenter.bind(this);
        this.moveCard = this.moveCard.bind(this);
        this.saveOrder = this.saveOrder.bind(this);
        this.state = {
            Functions: [],
            TemplateName: "",//模板名称
            Integral: null
        };
    }

    //插入真实DOM之前被执行
    componentWillMount() {
    }
    moveCard(dragIndex, hoverIndex) {
        var self = this;
        const {Functions} = self.state;
        const dragCard = Functions[dragIndex];

        self.setState(update(self.state, {
            Functions: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard]
                ]
            }
        }));
        console.log(Functions);
    }

    //插入真实DOM之后被执行
    componentDidMount() {
        var self = this;
        Api.GetMyCenterFunction({}).then(function (data) {
            if (data.IsOK) {
                self.state.Functions = data.Value;
                var integral = self.state.Functions.filter((item, index) => {
                    return item.FunctionName == "返利中心";
                });
                self.setState({ Integral: integral });
            }
        });
        Api.GetTemplatePageSet({}).then((data) => {
            if (data.IsOK) {
                self.setState({ TemplateName: data.Value.TemplateName });
            }
        });
    }

    saveOrder() {
        var self = this;
        const {Functions} = self.state;
        var updateSorts = [];
        for (var i = 0; i < Functions.length; i++) {
            Functions[i].Sort = i;
            updateSorts.push({
                Id: Functions[i].Id,
                Sort: Functions[i].Sort,
                ShowGroup: Functions[i].ShowGroup
            });
        }
        Api.UpdateSort({ FunctionUISort: updateSorts }).then((data) => {
            if (data.IsOK) {
                Modal.success({
                    title: '操作成功',
                    content: '配置信息已保存'
                });
            } else {
                message.error(data.Message);
            }
        });
    }

    addToCenter(index) {
        var self = this;
        var functions = self.state.Functions;
        var center = functions.filter(function (item) { return item.ShowGroup == "学员中心" });
        if (center.length >= 11) {
            message.info("已经放不下了，去掉几个再试吧");
            return;
        }
        functions[index].ShowGroup = "学员中心";
        self.setState({ Functions: functions });
    }

    editProps(index, editItem) {
        var self = this;
        var functions = self.state.Functions;
        const editCard = functions[index];
        editCard.Display = editItem.Display;
        editCard.DisplayName = editItem.DisplayName;
        editCard.FunctionType = editItem.FunctionType;
        editCard.Display = editItem.Display;
        editCard.IcoUrl = editItem.IcoUrl;
        editCard.Link = editItem.Link;
        editCard.Config = editItem.Config;
        if (!editCard.Display)
            editCard.ShowGroup = "None";
        var self = this;
        const {Functions} = self.state;
        Api.UpdateFunction(editCard).then((data) => {
            if (data.IsOK) {
                self.setState({ Functions: functions });
            } else {
                Toast.open(data.Message);
            }
        });
    }
    removeFromCenter(index) {
        var self = this;
        var functions = self.state.Functions;
        functions[index].ShowGroup = "None";
        self.setState({ Functions: functions });
    }


    render() {
        var self = this;
        var integralConfig = self.state.Integral && JSON.parse(self.state.Integral[0].Config);
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">模板设置</a>
                    <a className="main-content-word pull-left" href="/Manager/SystemBasicInfo/Index">基础信息</a>
                </div>
                <div className="row padding-top20 margin0">
                    <div className="col-lg-2 col-sm-12 padding-top5">
                        <b>{this.state.TemplateName}</b>
                    </div>
                </div>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">会员中心及功能设置</a>
                    <a className="main-content-word pull-left" href="/Manager/Systemuiset/shophomesetindex">商城首页设置</a>
                </div>
                <div className="editor-box2  padding-top60 padding-btm20 clearfix ">
                    <div className="pull-left editor-left" style={{ height: "630px", overflow: "inherit" }}>
                        <div className="bgColor memberTop">
                            <span className="memberImg"><img src="/content/images/class-con355.png" alt="会员头像" /></span>
                            <h2 className="memberTopName">用户名</h2>
                            <p className="memberNumber">学号：86001069</p>
                            <div className="memberCash"><a href="#" className="alinkFontTheme myCash">预计{integralConfig && integralConfig.PointDisplayName}：9119.00{integralConfig && integralConfig.PointUnitName}</a></div>
                        </div>
                        <div className="container-fluid blockOut">
                            <ul className="row blockContent">
                                {
                                    this.state.Functions.map(function (item, index) {
                                        if (item.ShowGroup == "学员中心") {
                                            return (
                                                <Card key={item.Id} id={item.Id} index={index} item={item} moveCard={self.moveCard} removeFromCenter={self.removeFromCenter} />
                                            );
                                        }
                                    })
                                }
                                <li className="col-xs-3 blockItem">
                                    <a href="#" className="alinkbgDef blockHref">
                                        <span className="blockIcon"><img src="/content/editor/images/icons/blockAll.png" alt="全部" /></span>
                                        <h4 className="blockMain">全部</h4>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="navWrapper">
                            <ul className="navItemOut">
                                {
                                    this.state.Functions.filter((item) => { return item.ShowNav }).sort((a, b) => { return (a.NavSort - b.NavSort) > 0 }).map(function (item, index) {
                                        if (item.ShowNav) {
                                            return <NavCard key={index} item={item} />
                                        }
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="pull-right editor-right editor-right2  padding20">
                        <div className="editor-arrow editor-arrow2"><img src="/content/images/editor-arrow2.png" /></div>
                        <form className="form-horizontal tasi-form">
                            <div className="clearfix editor-title margin-btm20">
                                <span className="pull-left margin-top5 font18">全部功能</span>
                                <a style={{ display: "none" }} className="pull-right btn-info btn" href="#myModal2" data-toggle="modal">添加</a>
                            </div>
                            <div className="lc-blockItem">
                                <p className="font16">我的功能</p>
                                <ul className="row blockContent">
                                    {
                                        this.state.Functions.map(function (item, index) {
                                            if (item.FunctionType == "主要功能") {
                                                return <CardGroup key={item.Id} index={index} item={item} addToCenter={self.addToCenter} editProps={self.editProps} />
                                            }
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="lc-blockItem margin-top15">
                                <p className="font16">我的活动</p>
                                <ul className="row blockContent">
                                    {
                                        this.state.Functions.map(function (item, index) {
                                            if (item.FunctionType == "活动") {
                                                return <CardGroup key={item.Id} index={index} item={item} addToCenter={self.addToCenter} editProps={self.editProps} />
                                            }
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="lc-blockItem margin-top15">
                                <p className="font16">更多</p>
                                <ul className="row blockContent">
                                    {
                                        this.state.Functions.map(function (item, index) {
                                            if (item.FunctionType == "更多") {
                                                return <CardGroup key={item.Id} index={index} item={item} addToCenter={self.addToCenter} editProps={self.editProps} />
                                            }
                                        })
                                    }

                                </ul>
                            </div>
                            <div className="lc-blockItem margin-top15">
                                <p className="font16">特定功能</p>
                                <ul className="row blockContent">
                                    {
                                        this.state.Functions.map(function (item, index) {
                                            if (item.FunctionType == "None") {
                                                return <CardGroup key={item.Id} index={index} item={item} addToCenter={self.addToCenter} editProps={self.editProps} />
                                            }
                                        })
                                    }

                                </ul>
                            </div>
                            <div className="text-center padding-top20">
                                <input type="button" className="btn-success btn  margin-right10" onClick={this.saveOrder.bind(this)} value="保存并发布" />
                            </div>
                        </form>
                    </div>
                </div>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers,
        UISetReducers: state.UISetReducers,
    }
}

function onFieldsChange(props, fields) {
    //props.dispatch(changeUISetValue(fields, props.UISetReducers.current));
}

function mapPropsToFields(props) {
    var obj = {};
    switch (props.UISetReducers.current) {
        case 1:
            obj = {
                IsEnabled: { value: props.UISetReducers.UICourse.IsEnabled },
                DispalyName: { value: props.UISetReducers.UICourse.DispalyName },
                ShowIntoClassTips: { value: props.UISetReducers.UICourse.ShowIntoClassTips },
                IntoClassTips: { value: props.UISetReducers.UICourse.IntoClassTips },
                CoursePraise: { value: props.UISetReducers.UICourse.CoursePraise },
                CourseRecommend: { value: props.UISetReducers.UICourse.CourseRecommend }
            };
            break;
        case 4:
            obj = {
                IsEnabled: { value: props.UISetReducers.UIMy.IsEnabled },
                DispalyName: { value: props.UISetReducers.UIMy.DispalyName },
                ShowStudentCode: { value: props.UISetReducers.UIMy.ShowStudentCode },
                StudentCode: { value: props.UISetReducers.UIMy.StudentCode },
                ShowMemberLevel: { value: props.UISetReducers.UIMy.ShowMemberLevel },
                ShareDispaly: { value: props.UISetReducers.UIMy.ShareDispaly }
            };
            break;
    }
    return obj;
}

let SystemUISetIndexPage = Form.create({ onFieldsChange: onFieldsChange, mapPropsToFields: mapPropsToFields })(DragDropContext(HTML5Backend)(SystemUISetIndex));

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(SystemUISetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

