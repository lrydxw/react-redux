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
import RegExpVerify from '../../../pub/RegExpVerify';
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});

/**
 * 定义组件（首字母比较大写），相当于java中的类的声明
 */
class TemplateSetIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.initTemplatePageSet = this.initTemplatePageSet.bind(this);

        this.state = {
            TemplateId: "",//模板Id
            TemplateName: "",//模板名称
            TemplateParameterValue: [],//模板参数
        };
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
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
     * 获取模板配置
     */
    initTemplatePageSet() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        WeChatSetInfoApi.getTemplatePageSet({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                _this.state.TemplateId = obj.TemplateId;
                _this.state.TemplateName = obj.TemplateName;
                _this.state.TemplateParameterValue = obj.TemplateParameterValue;
                var setObj = setObj || {};
                obj.TemplateParameterValue.map(function (item, index) {
                    setObj[String(item.ParameterKey)] = item.ParameterValue;
                });
                setFieldsValue(setObj);
            }
        });
    }
    /**
     * 提交数据
     */
    submitForm() {
        var _this = this;
        var form = _this.props.form;
        const { getFieldValue } = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            var functionData = _this.state.TemplateParameterValue;
            functionData.map(function (item, index) {
                functionData[index].ParameterValue = getFieldValue(String(item.ParameterKey));
            });
            obj.TemplateId = _this.state.TemplateId;
            obj.TemplateParameterValue = functionData;
            console.log('收到表单值：', obj);
            WeChatSetInfoApi.updateTemplatePageSet(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '模板配置已保存',
                        onOk() {
                            _this.initTemplatePageSet();
                        },
                    });
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, getFieldValue } = this.props.form;
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
                    <div className="col-lg-2 col-sm-12 padding-top5">
                        <b>{this.state.TemplateName}</b>
                    </div>
                </div>
                <div className="col-lg-12 padding-top20">
                    <Form className="form-horizontal tasi-form" >
                        {this.state.TemplateParameterValue.length > 0 ?
                            this.state.TemplateParameterValue.map(function (item, index) {
                                if (item.ParameterKey == 4) {
                                    return (<div className="form-group" key={"form-group_" + index}>
                                        <div className="row margin0">
                                            <label className="control-label col-xs-2">{item.DisplayName}：</label>
                                            <div className="input-group col-lg-3">
                                                <FormItem hasFeedback>
                                                    <RadioGroup {...getFieldProps(String(item.ParameterKey), {
                                                        validate: [{
                                                            rules: [
                                                                { required: item.Required, message: '请选择' + item.DisplayName },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } >
                                                        <Radio key="Radio_1" value="1">前</Radio>
                                                        <Radio key="Radio_2" value="2">后</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>);
                                } else {
                                    return (<div className="form-group" key={"form-group_" + index}>
                                        <div className="row margin0">
                                            <label className="control-label col-xs-2">{item.DisplayName}：</label>
                                            <div className="input-group col-lg-3">
                                                <FormItem hasFeedback>
                                                    <Input type="text" className="form-control" placeholder={item.DisplayName}  {...getFieldProps(String(item.ParameterKey), {
                                                        validate: [{
                                                            rules: [
                                                                { required: item.Required, message: '请填写' + item.DisplayName },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>);
                                }
                            }) : ""
                        }
                    </Form>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <Button type="primary" size="large" className="btn btn-block" onClick={this.submitForm}>保存</Button>
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

let TemplateSetIndexPage = Form.create({})(TemplateSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(TemplateSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
