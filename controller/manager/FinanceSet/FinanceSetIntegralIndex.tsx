//积分设置
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
import {Button} from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, DatePicker } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import {BaseStore} from '../../../redux/store/BaseStore';

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
class FinanceSetIntegralIndex extends BaseContainer {
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
        this.initIntegralSetData = this.initIntegralSetData.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.searchData = {};

        this.state = {
        }

    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initIntegralSetData();
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
     * 获取积分设置数据
     */
    initIntegralSetData() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        FinanceSetApi.getSystemIntegral({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                setFieldsValue({ "PointUnitName": obj.PointUnitName, "PointExchangeRatio": String(obj.PointExchangeRatio) });
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
            FinanceSetApi.updateSystemIntegral(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '系统积分设置已保存',
                    });
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
   
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Manager/FinanceSet/Pay">支付设置</a>
                    <a className="main-content-word pull-left" href="/Manager/FinanceSet/Withdrawals">提现设置</a>
                </div>
                <div className="row padding-top20 margin0">
                    <div className="col-lg-2 col-sm-12 padding-top5">
                        <b>积分设置</b>
                    </div>
                </div>
                <div className="col-lg-12 padding-top20">
                    <Form className="form-horizontal tasi-form" >
                        <div className="form-group">
                            <div className="row margin0">
                                <label className="control-label col-xs-2">积分名称：</label>
                                <div className="input-group col-lg-3">
                                    <FormItem hasFeedback>
                                        <Input type="text" className="form-control" placeholder="积分名称" {...getFieldProps('PointUnitName', {
                                            validate: [{
                                                rules: [
                                                    { required: true, message: '请填写积分名称' },
                                                ], trigger: ['onBlur', 'onChange'],
                                            }]
                                        }) }/>
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row margin0">
                                <label className="control-label col-xs-2">兑换比例：</label>
                                <div className="input-group col-lg-3">
                                    <FormItem hasFeedback>
                                        <Input type="text" className="form-control" placeholder="兑换比例" {...getFieldProps('PointExchangeRatio', {
                                            validate: [{
                                                rules: [
                                                    { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                ], trigger: ['onBlur', 'onChange'],
                                            }]
                                        }) }/>
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="clearfix"></div>
                <div className="row margin0 bg-colorFC padding10 margin-top60">
                    <div className="col-lg-1 col-sm-2 col-lg-offset-4">
                        <Button type="primary" size="large" className="btn btn-block" onClick={this.submitForm}>保存</Button>
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

let FinanceSetIntegralIndexPage = Form.create({})(FinanceSetIntegralIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FinanceSetIntegralIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
