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
const Option = Select.Option;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import FinanceSetApi from './FinanceSetApi';
//表单验证模块
import RegExpVerify from '../../../pub/RegExpVerify';
import Verifier from '../../../pub/Verifier';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class FinanceSetWithdrawalsIndex extends BaseContainer {
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
        this.initWithdrawConfig = this.initWithdrawConfig.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.selectOnChange = this.selectOnChange.bind(this);

        this.searchData = {};

        this.state = {
        }

    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initWithdrawConfig();
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
     * 获取提现配置
     */
    initWithdrawConfig() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        FinanceSetApi.getWithdrawConfig({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var setObj = {
                    "IsEnableWithdraw": obj.IsEnableWithdraw, "MaxWithdrawLimit": String(obj.MaxWithdrawLimit), "MinWithdrawLimit": String(obj.MinWithdrawLimit),
                    "IsEnableWeChatWithdraw": obj.IsEnableWeChatWithdraw, "IsEnableAlipayWithdraw": obj.IsEnableAlipayWithdraw, "IsEnablePointExchange": obj.IsEnablePointExchange,
                    "PointExchangeRatio": String(obj.PointExchangeRatio), "WithdrawArrivalTime": obj.WithdrawArrivalTime
                };
                setObj["WithdrawArrivalTime"] = obj.WithdrawArrivalTime.substring(0, obj.WithdrawArrivalTime.indexOf(obj.WithdrawArrivalTime.indexOf("工作日") > -1 ? "工作日" : (obj.WithdrawArrivalTime.indexOf("日") > -1 ? "日" : "小时")));
                setObj["SelectArrivalTime"] = obj.WithdrawArrivalTime.indexOf("工作日") > -1 ? "工作日" : (obj.WithdrawArrivalTime.indexOf("日") > -1 ? "日" : "小时");
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
            var obj = form.getFieldsValue();
            if (!!errors && obj.IsEnableWithdraw) {
                console.log(errors);
                console.log('Errors in form!!!');
                return;
            }
            if (!obj.MaxWithdrawLimit) obj.MaxWithdrawLimit = "10000";
            if (!obj.MinWithdrawLimit) obj.MinWithdrawLimit = "0";
            if (!obj.WithdrawArrivalTime) obj.WithdrawArrivalTime = "";
            if (!obj.PointExchangeRatio) obj.PointExchangeRatio = "1";
            obj.WithdrawArrivalTime += obj.SelectArrivalTime;
            //if (!obj.IsEnableWeChatWithdraw && !obj.IsEnableAlipayWithdraw) {
            //    Modal.error({
            //        title: '温馨提示',
            //        content: '至少要开启一种提现方式吧！',
            //    });
            //    return;
            //}
            if (parseInt(obj.MinWithdrawLimit) >= parseInt(obj.MaxWithdrawLimit)) {
                Modal.error({
                    title: '温馨提示',
                    content: '最低限额须小于最高限额！',
                });
                return;
            }
            console.log(obj);
            FinanceSetApi.updateWithdrawConfig(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '系统提现设置已保存',
                    });
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    selectOnChange(value) {
        this.state.selectDefaultValue = value;
    }
    render() {
        const { getFieldProps, getFieldValue, resetFields, setFieldsValue} = this.props.form;
        var IsEnableWithdraw = getFieldValue("IsEnableWithdraw");
        const MaxWithdrawLimitProps = getFieldProps('MaxWithdrawLimit', {
            validate: [{
                rules: [
                    { required: IsEnableWithdraw, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const MinWithdrawLimitProps = getFieldProps('MinWithdrawLimit', {
            validate: [{
                rules: [
                    { required: IsEnableWithdraw, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const WithdrawArrivalTimeProps = getFieldProps('WithdrawArrivalTime', {
            validate: [{
                rules: [
                    { required: IsEnableWithdraw, message: '请填写预计到账时间' }
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        var IsEnablePointExchange = getFieldValue("IsEnablePointExchange");
        const PointExchangeRatioProps = getFieldProps('PointExchangeRatio', {
            validate: [{
                rules: [
                    { required: IsEnablePointExchange, message: '请填写正整数' }, { validator: RegExpVerify.checkNoInteger }
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        if (!IsEnableWithdraw) {
            if (!getFieldValue("MaxWithdrawLimit")) resetFields(['MaxWithdrawLimit']);
            if (!getFieldValue("MinWithdrawLimit")) resetFields(['MinWithdrawLimit']);
            if (!getFieldValue("WithdrawArrivalTime")) resetFields(['WithdrawArrivalTime']);
        }
        if (!IsEnablePointExchange) {
            if (!getFieldValue("PointExchangeRatio") || getFieldValue("PointExchangeRatio") == "0") resetFields(['PointExchangeRatio', '1']);
        }
        const selectAfter = (
            <Select style={{ width: 70 }} {...getFieldProps('SelectArrivalTime') }>
                <Option value="工作日">工作日</Option>
                <Option value="日">日</Option>
                <Option value="小时">小时</Option>
            </Select>
        );
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Manager/FinanceSet/Pay">支付设置</a>
                    <a className="main-content-word pull-left  set-content-word-te">提现设置</a>
                </div>
                <div className="row padding-top20 margin0">
                    <div className="col-lg-2 col-sm-12 padding-top5">
                        <b>提现设置</b>
                    </div>
                </div>
                <Form className="form-horizontal tasi-form" >
                    <div className="col-lg-12 padding-top20">
                        <div className="form-group">
                            <div className="row margin0">
                                <label className="control-label col-xs-2">允许提现：</label>
                                <div className="col-lg-3">
                                    <div className="row">
                                        <FormItem>
                                            <Switch checkedChildren={'是'} unCheckedChildren={'否'}  {...getFieldProps('IsEnableWithdraw', { valuePropName: 'checked' }) } />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: getFieldValue("IsEnableWithdraw") ? "" : "none" }}>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">提现方式：</label>
                                    <div className="col-lg-6 ">
                                        <div className="row">
                                            <div className="col-lg-4" style={{ display: "none" }}>
                                                <FormItem>
                                                    微信：<Switch checkedChildren={'开'} unCheckedChildren={'关'} {...getFieldProps('IsEnableWeChatWithdraw', { valuePropName: 'checked' }) } />
                                                </FormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <FormItem>
                                                    支付宝：<Switch checkedChildren={'开'} unCheckedChildren={'关'}  {...getFieldProps('IsEnableAlipayWithdraw', { valuePropName: 'checked' }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">最低限额：</label>
                                    <div className="input-group  col-lg-3">
                                        <FormItem hasFeedback>
                                            <Input type="text" className="form-control" placeholder="最低限额" {...MinWithdrawLimitProps} />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">最高限额：</label>
                                    <div className="input-group col-lg-3">
                                        <FormItem hasFeedback>
                                            <Input type="text" className="form-control" placeholder="最高限额" {...MaxWithdrawLimitProps } />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">预计到账时间：</label>
                                    <div className="input-group  col-lg-3">
                                        <FormItem>
                                            <Input type="text" className="form-control" addonAfter={selectAfter} placeholder="预计到账时间" {...WithdrawArrivalTimeProps} />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "none" }}>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">积分兑换：</label>
                                    <div className="col-lg-3">
                                        <div className="row">
                                            <FormItem>
                                                <Switch checkedChildren={'开'} unCheckedChildren={'关'}  {...getFieldProps('IsEnablePointExchange', { valuePropName: 'checked' }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: getFieldValue("IsEnablePointExchange") ? "" : "none" }}>
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">兑换比例：</label>
                                    <div className="input-group col-lg-3">
                                        <FormItem>
                                            <Input type="text" className="form-control" addonAfter="：1" placeholder="兑换比例" {...PointExchangeRatioProps} />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
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

let FinanceSetWithdrawalsIndexPage = Form.create({})(FinanceSetWithdrawalsIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FinanceSetWithdrawalsIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
