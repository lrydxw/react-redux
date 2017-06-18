import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import {message} from 'antd';
import {Button} from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio } from 'antd';
import {Sortable} from "sortable";
const FormItem = Form.Item;
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import {BaseStore} from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import Verifier from '../../../pub/Verifier';
const store = BaseStore({});

import {UICourseLeft, UICourseRight} from './UICourse'
import {UIShopLeft, UIShopRight} from './UIShop'
import {UIDynamicLeft, UIDynamicRight} from './UIDynamic'
import {UIMyLeft, UIMyRight} from './UIMy'
import {getUISet, changeUISetValue, saveUISet} from '../../../redux/actions/UISetAction';

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class SystemUISetIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        var defaultProps = { IsEnabled: true, DispalyName: "课程", ShowIntoClassTips: true, IntoClassTips: "三人行必有我师，加入班级认识更多同学！", CoursePraise: true, CourseRecommend: "明天的你定将感谢今天来学习的你" }
        this.state = {
            UIIndex: 1,
            sortState: null,
            UILeft: null,
            UIRight: null,
            code: ""
        };

    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        let {dispatch} = this.props;
        dispatch(getUISet(4));
        dispatch(getUISet(1));
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
        var _this = this;
        setTimeout(function () {
            _this.setState({UIIndex:nextProps.UISetReducers.current});
        }, 0);
    }

    saveAndPublish() {
        let {dispatch} = this.props;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            dispatch(saveUISet(values,this.state.UIIndex));
        });
    }

    changeOrderIndex(id, newIndex, oldIndex) {
        clearTimeout(this.state.setOrderTimer);
        var menu = { Id: id, NewOrderIndex: newIndex, OldOrderIndex: oldIndex };
        this.state.setOrderTimer = setTimeout(function () {
            //ManagerWeChatSetMenuApi.updateOrderIndex(menu);
        }, 2000);
    }
    SortMenu() {
        var _this = this;
        var sortmenu = document.getElementById('sortmenu');
        if (this.state.sortState == null) {
            this.state.sortState = Sortable.create(sortmenu, {
                animation: 150,
                onEnd: function (evt) {
                    _this.changeOrderIndex("", evt.newIndex, evt.oldIndex);
                }
            });
        } else {
            if (this.state.sortState) {
                this.state.sortState.destroy();
                this.state.sortState = null;
            }
        }
        this.setState({ showSort: !this.state.showSort });
    }

    getLeft(){
        let {UISetReducers} = this.props;
        switch(UISetReducers.current){
            case 1:
                return <UICourseLeft Props={UISetReducers.UICourse}/>;
            case 2:
                return <UIShopLeft/>;
            case 3:
                return <UIDynamicLeft/>;
            case 4:
                return <UIMyLeft Props={UISetReducers.UIMy}/>;
            default:
                return null;

        }
    }

    getRight(){
        let {UISetReducers} = this.props;
        switch(UISetReducers.current){
            case 1:
                return <UICourseRight form={this.props.form} Props={UISetReducers.UICourse}/>;
            case 2:
                return <UIShopRight/>;
            case 3:
                return <UIDynamicRight/>;
            case 4:
                return <UIMyRight form={this.props.form} Props={UISetReducers.UIMy}/>;
            default:
                return null;

        }
    }


    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        let {UISetReducers,dispatch} = this.props;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left " href="/Manager/SystemTemplate/Index">模板设置</a>
                    <a className="main-content-word pull-left "  href="/Manager/SystemBasicInfo/Index">基础信息</a>
                    <a className="main-content-word pull-left set-content-word-te">编辑界面</a>
                </div>
                <div className="editor-box2  padding-top60 padding-btm20 clearfix ">
                    <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">微领袖商学院</p>
                        </div>
                        {this.getLeft()}
                        <div className="footerNav">
                            <div className="navWrap">
                                <ul className="navListOut" id="sortmenu">
                                    <li className="navList" onClick={() => dispatch(getUISet(1)) }>
                                        <div className={this.state.UIIndex == 1 ? "nacHref navActive" : "nacHref"}>
                                            <span className="navListClass">导航图标</span>
                                            <p className="navListTitle">{UISetReducers.UICourse.DispalyName}</p>
                                        </div>
                                    </li>
                                    <li className="navList" onClick={() => dispatch(getUISet(2)) }>
                                        <div  className={this.state.UIIndex == 2 ? "nacHref navActive" : "nacHref"}>
                                            <span className="navListShop">导航图标</span>
                                            <p className="navListTitle">商城</p>
                                        </div>
                                    </li>
                                    <li className="navList" onClick={() => dispatch(getUISet(3)) }>
                                        <div href="#"  className={this.state.UIIndex == 3 ? "nacHref navActive" : "nacHref"}>
                                            <span className="navListdynamic">导航图标</span>
                                            <p className="navListTitle">动态</p>
                                        </div>
                                    </li>
                                    <li className="navList" onClick={() => dispatch(getUISet(4)) }>
                                        <div href="#" className={this.state.UIIndex == 4 ? "nacHref navActive" : "nacHref"}>
                                            <span className="navListMine">导航图标</span>
                                            <p className="navListTitle">{UISetReducers.UIMy.DispalyName}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="pull-right editor-right editor-right2  padding20">
                        <div className="editor-arrow editor-arrow2"><img src="/content/images/editor-arrow2.png"/></div>
                        {this.getRight()}
                    </div>
                </div>
                <div className="clearfix">
                    <div className="editor-left5 pull-left">
                        <div className="text-center padding-top20">
                            <Button size="large" type="ghost" onClick={this.SortMenu.bind(this) }>菜单排序</Button>
                        </div>
                    </div>
                    <div className="editor-right5 pull-right">
                        <div className="text-center padding-top20">
                            <Button size="large" type="primary" onClick={this.saveAndPublish.bind(this) }>保存并发布</Button>
                        </div>
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
    props.dispatch(changeUISetValue(fields,props.UISetReducers.current));
}

function mapPropsToFields(props){
    var obj={};
    switch(props.UISetReducers.current){
        case 1:
            obj={
                IsEnabled:{value:props.UISetReducers.UICourse.IsEnabled},
                DispalyName:{value:props.UISetReducers.UICourse.DispalyName},
                ShowIntoClassTips:{value:props.UISetReducers.UICourse.ShowIntoClassTips},
                IntoClassTips:{value:props.UISetReducers.UICourse.IntoClassTips},
                CoursePraise:{value:props.UISetReducers.UICourse.CoursePraise},
                CourseRecommend:{value:props.UISetReducers.UICourse.CourseRecommend}
            };
            break;
        case 4:
            obj={
                IsEnabled:{value:props.UISetReducers.UIMy.IsEnabled},
                DispalyName:{value:props.UISetReducers.UIMy.DispalyName},
                ShowStudentCode:{value:props.UISetReducers.UIMy.ShowStudentCode},
                StudentCode:{value:props.UISetReducers.UIMy.StudentCode},
                ShowMemberLevel:{value:props.UISetReducers.UIMy.ShowMemberLevel},
                ShareDispaly:{value:props.UISetReducers.UIMy.ShareDispaly}
            };
            break;
    }
    return obj;
}

let SystemUISetIndexPage = Form.create({ onFieldsChange: onFieldsChange,mapPropsToFields:mapPropsToFields })(SystemUISetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(SystemUISetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);

