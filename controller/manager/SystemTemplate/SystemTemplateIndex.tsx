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
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio } from 'antd';
import { Sortable } from "sortable";
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
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
const store = BaseStore({});

/**
 * 定义组件（首字母比较大写），相当于java中的类的声明
 */
class WeChatSetInfoIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.selectIndexOnChange = this.selectIndexOnChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.initUITemplateList = this.initUITemplateList.bind(this);
        this.initTemplatePageSet = this.initTemplatePageSet.bind(this);

        this.state = {
            SelectIndex: "",//当前选择的版本Id
            UITemplateData: [],//模板数据
        };
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initUITemplateList();
        this.initTemplatePageSet();
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
    /**
     * 获取模板列表
     */
    initUITemplateList() {
        var _this = this;
        WeChatSetInfoApi.getUITemplateList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ UITemplateData: functionData });
            }
        });
    }
    /**
     * 获取模板配置
     */
    initTemplatePageSet() {
        var _this = this;
        WeChatSetInfoApi.getTemplatePageSet({}).then(function (data) {
            if (data.IsOK) {
                _this.setState({ SelectIndex: data.Value.TemplateId });
            }
        });
    }
    selectIndexOnChange(index) {
        var _this = this;
        _this.setState({ SelectIndex: index });
    }
    /**
     * 提交数据
     */
    submitForm() {
        var _this = this;
        var form = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            if (!_this.state.SelectIndex) {
                Modal.error({
                    title: '温馨提示',
                    content: '至少要选择一个模板吧！',
                });
                return;
            }
            var obj = form.getFieldsValue();
            obj.TemplateId = _this.state.SelectIndex;
            console.log('收到表单值：', obj);
            WeChatSetInfoApi.updateTemplatePageSet(obj).then(function (data) {
                if (data.IsOK) {
                    Tool.goPush('Manager/SystemUISet/Index');
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        var self = this;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">模板设置</a>
                    <a className="main-content-word pull-left" href="/Manager/SystemBasicInfo/Index">基础信息</a>
                </div>
                <div className="row padding-top20 margin0">
                    <div className="col-lg-12 padding-top60">
                        <div className="set-template-box col-lg-10 padding-left60">
                            <ul>
                                {this.state.UITemplateData.length > 0 ?
                                    this.state.UITemplateData.map(function (item, index) {
                                        return (<li className="col-lg-4 col-sm-12" key={"ul_li_" + index}>
                                            <p>{item.Name}</p>
                                            <a href="javascript:;" onClick={() => { self.selectIndexOnChange(item.Id) } }>
                                                <div className="set-template-img">
                                                    <img src={item.ImageView} />
                                                    {self.state.SelectIndex == item.Id ?
                                                        <img className="set-template-img1" src="/content/images/set-template-ok.png" /> : ""
                                                    }
                                                </div>
                                            </a>
                                        </li>);
                                    }) : ""
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <Button type="primary" size="large" className="btn btn-block" onClick={this.submitForm}>下一步</Button>
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

let WeChatSetInfoIndexPage = Form.create({})(WeChatSetInfoIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(WeChatSetInfoIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

