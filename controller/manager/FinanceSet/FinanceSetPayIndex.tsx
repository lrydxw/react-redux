//提现设置
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
import { Button } from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, DatePicker } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import FinanceSetApi from './FinanceSetApi';
//表单验证模块
import Verifier from '../../../pub/Verifier';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class FinanceSetPayIndex extends BaseContainer {
    searchData: any;
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.searchData = {};
        this.initPayConfig = this.initPayConfig.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.state = {
        }

    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initPayConfig();
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
     * 获取支付设置
     */
    initPayConfig() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        FinanceSetApi.getPayConfig({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var setObj = {};
                if (obj.WeChat) {
                    setObj["Id1"] = obj.WeChat.Id;
                    setObj["APPID1"] = obj.WeChat.APPID;
                    setObj["APPSECRET1"] = obj.WeChat.APPSECRET;
                    setObj["MCHID1"] = obj.WeChat.MCHID;
                    setObj["KEY1"] = obj.WeChat.KEY;
                    setObj["IsEnable1"] = obj.WeChat.IsEnable;
                }
                if (obj.BaiFuBao) {
                    setObj["Id2"] = obj.BaiFuBao.Id;
                    setObj["APPID2"] = obj.BaiFuBao.APPID;
                    setObj["APPSECRET2"] = obj.BaiFuBao.APPSECRET;
                    setObj["MCHID2"] = obj.BaiFuBao.MCHID;
                    setObj["KEY2"] = obj.BaiFuBao.KEY;
                    setObj["IsEnable2"] = obj.BaiFuBao.IsEnable;
                }
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
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            console.log(obj);
            if (!obj.IsEnable1 && !obj.IsEnable2) {
                Modal.error({
                    title: '温馨提示',
                    content: '至少要开启一种支付方式吧！',
                });
                return;
            }
            var functionData = [];
            functionData.push({ "Id": obj.Id1, "APPID": obj.APPID1, "APPSECRET": obj.APPSECRET1, "MCHID": obj.MCHID1, "KEY": obj.KEY1, "PayType": 1, "IsEnable": obj.IsEnable1 });
            functionData.push({ "Id": obj.Id2, "APPID": obj.APPID2, "APPSECRET": obj.APPSECRET2, "MCHID": obj.MCHID2, "KEY": obj.KEY2, "PayType": 22, "IsEnable": obj.IsEnable2 });
            FinanceSetApi.updatePayConfig({ PayConfigList: functionData }).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '系统支付设置已保存',
                    });
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue} = this.props.form;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">支付设置</a>
                    <a className="main-content-word pull-left" href="/Manager/FinanceSet/Withdrawals">提现设置</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <Form horizontal>
                            <div className="well clearfix margin-btm0">
                                <span className="pull-left margin-top5">微信支付</span>
                                <div className="switch pull-right">
                                    <FormItem style={{ marginBottom: 0 }}>
                                        <Input type="hidden" {...getFieldProps('Id1') } />
                                    </FormItem>
                                    <FormItem style={{ marginBottom: 0 }}>
                                        <Switch  {...getFieldProps('IsEnable1', { valuePropName: 'checked' }) } />
                                    </FormItem>
                                </div>
                            </div>
                            <div className="well clearfix well-te" style={{ display: getFieldValue("IsEnable1") ? "" : "none" }}>
                                <div className="row margin0 col-xs-12">
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">AppId：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="AppId" {...getFieldProps('APPID1', {
                                                    validate: [{
                                                        rules: [
                                                            { required: getFieldValue("IsEnable1"), message: '请填写AppId' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0 col-xs-12">
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">AppSecret：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="AppSecret" {...getFieldProps('APPSECRET1', {
                                                    validate: [{
                                                        rules: [
                                                            { required: getFieldValue("IsEnable1"), message: '请填写AppSecret' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0 col-xs-12">
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">商户号：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="商户号" {...getFieldProps('MCHID1', {
                                                    validate: [{
                                                        rules: [
                                                            { required: getFieldValue("IsEnable1"), message: '请填写商户号' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0 col-xs-12">
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">支付秘钥：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="支付秘钥" {...getFieldProps('KEY1', {
                                                    validate: [{
                                                        rules: [
                                                            { required: getFieldValue("IsEnable1"), message: '请填写支付秘钥' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="well clearfix margin-btm0">
                                <span className="pull-left margin-top5">百度钱包</span>
                                <div className="switch pull-right">
                                    <FormItem style={{ marginBottom: 0 }}>
                                        <Input type="hidden" {...getFieldProps('Id2') } />
                                    </FormItem>
                                    <FormItem style={{ marginBottom: 0 }}>
                                        <Switch  {...getFieldProps('IsEnable2', { valuePropName: 'checked' }) } />
                                    </FormItem>
                                </div>
                            </div>
                            <div className="well clearfix well-te" style={{ display: getFieldValue("IsEnable2") ? "" : "none" }}>
                                <div className="row margin0 col-xs-12" style={{ display: "none" }}>
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">AppId：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="AppId" {...getFieldProps('APPID2', {
                                                    validate: [{
                                                        rules: [
                                                            { required: false, message: '请填写AppId' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0 col-xs-12" style={{ display: "none" }}>
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">AppSecret：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="AppSecret" {...getFieldProps('APPSECRET2', {
                                                    validate: [{
                                                        rules: [
                                                            { required: false, message: '请填写AppSecret' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0 col-xs-12">
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">商户号：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="商户号" {...getFieldProps('MCHID2', {
                                                    validate: [{
                                                        rules: [
                                                            { required: getFieldValue("IsEnable2"), message: '请填写商户号' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0 col-xs-12">
                                    <div className="col-xs-8">
                                        <label className="control-label col-xs-3 margin-top10 text-right">支付秘钥：</label>
                                        <div className="input-group margin-btm20 col-xs-7">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="支付秘钥" {...getFieldProps('KEY2', {
                                                    validate: [{
                                                        rules: [
                                                            { required: getFieldValue("IsEnable2"), message: '请填写支付秘钥' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
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

let FinanceSetPayIndexPage = Form.create({})(FinanceSetPayIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FinanceSetPayIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
