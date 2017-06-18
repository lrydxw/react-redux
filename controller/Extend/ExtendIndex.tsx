//发票管理
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Button } from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, DatePicker } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ExtendIndex extends BaseContainer {
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
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
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
    render() {
        return (
            <AppBody>
                <header>
                    <div className="padding-top20 padding-btm10">
                        <b className="font20">扩展功能</b>
                        <span className="mark-green margin-left10">拓客分销系统</span>
                        <span className="mark-green margin-left10">培训版</span>
                    </div>
                </header>
                <hr />
                <div className="row margin-top20">
                    <p className="col-xs-12 font14">
                        <b>常用功能</b>
                    </p>
                    <div className="col-xs-12">
                        <ul className="clearfix block-7 margin0">
                            <li className="padding15 bg-colorF5 border-white pull-left block-7-li">
                                <a href="/Extend/Joint"><img className="margin-right10 pull-left" src="/Content/images/a999.png" alt="联合发起人" />
                                    <div className="pull-left">
                                        <p className="color3 font14 margin-btm5">联合发起人</p>
                                    </div>
                                </a>
                            </li>
                            <li className="padding15 bg-colorF5 border-white pull-left block-7-li">
                                <a href="/Lottery/Index"><img className="margin-right10 pull-left" src="/Content/images/a109.png" alt="签到抽奖" />
                                    <div className="pull-left">
                                        <p className="color3 font14 margin-btm5">签到抽奖</p>
                                    </div>
                                </a>
                            </li>
                           

                        </ul>
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

let ExtendIndexPage = Form.create({})(ExtendIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ExtendIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
