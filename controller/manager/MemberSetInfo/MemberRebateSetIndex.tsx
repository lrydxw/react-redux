import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Button, Radio } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import MemberSetInfoApi from './Api';
//表单验证模块
import RegExpVerify from '../../../pub/RegExpVerify';
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RadioGroup = Radio.Group;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class MemberRightsSetIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.loadDistributionConfig = this.loadDistributionConfig.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.isTemporaryLockChange = this.isTemporaryLockChange.bind(this);
        this.state = {
            isTemporaryLock: false
        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadDistributionConfig();
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
    componentWillReceiveProps(nextState) {

    }

    isTemporaryLockChange(e) {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        _this.state.isTemporaryLock = e.target.value;
        setFieldsValue({ "IsTemporaryLock": e.target.value });

    }


    loadDistributionConfig() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        MemberSetInfoApi.getMemberRebateConfig({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                _this.state.isTemporaryLock = obj.IsTemporaryLock;
                setFieldsValue({
                    "RebateOneLevelProportion": String(obj.RebateOneLevelProportion), "RebateTwoLevelProportion": String(obj.RebateTwoLevelProportion),
                    "RebateThreeLevelProportion": String(obj.RebateThreeLevelProportion), "IsTemporaryLock": Boolean(obj.IsTemporaryLock),
                    "TemporaryLockTime": String(obj.TemporaryLockTime), "ExpectedToExpectDays": String(obj.ExpectedToExpectDays),
                    "ExpectedToAvailableIncomeDays": String(obj.ExpectedToAvailableIncomeDays),
                });
            } else {
                message.error(data.Message);
            }
        });
    }

    submitForm() {
        var form = this.props.form;
        console.log('收到表单值：', form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();

            if (parseFloat(obj.RebateOneLevelProportion) + parseFloat(obj.RebateTwoLevelProportion) + parseFloat(obj.RebateThreeLevelProportion) > 100) {
                Modal.error({
                    title: '温馨提示',
                    content: '三级代理分成比例总和不能大于100%',

                });
                return;
            }


            MemberSetInfoApi.updateMemberRebateConfig(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '会员分销设置已保存',
                    });
                } else {
                    message.error(data.Message);
                }
            });

        });
    }


    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };


        const rebateOneLevelProportionProps = getFieldProps('RebateOneLevelProportion', {
            validate: [{
                rules: [
                    { required: true, message: '请输入一级返利占比' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const rebateTwoLevelProportionProps = getFieldProps('RebateTwoLevelProportion', {
            validate: [{
                rules: [
                    { required: true, message: '请输入二级返利占比' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const rebateThreeLevelProportionProps = getFieldProps('RebateThreeLevelProportion', {
            validate: [{
                rules: [
                    { required: true, message: '请输入三级返利占比' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const isTemporaryLockProps = getFieldProps('IsTemporaryLock', {
            validate: [{
                rules: [
                    { required: true, message: '请选择是否临时锁定', type: "boolean" },
                ], trigger: ['onBlur', 'onChange'],
            }]

        });

        const temporaryLockTimeProps = getFieldProps('TemporaryLockTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入临时锁定时间' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const expectedToExpectDaysProps = getFieldProps('ExpectedToExpectDays', {
            validate: [{
                rules: [
                    { required: true, message: '请输入预期收益到期时间' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const expectedToAvailableIncomeDaysProps = getFieldProps('ExpectedToAvailableIncomeDays', {
            validate: [{
                rules: [
                    { required: true, message: '请输入预计收益到期时间' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Mission/MissionConfigIndex">任务配置</a>
                    <a className="main-content-word pull-left set-content-word-te">会员分销</a>
                </div>

                <Form horizontal>
                    <div className="col-lg-12 padding-top60">
                        <div className="form-horizontal tasi-form" >
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">一级返利：</label>
                                    <div className="col-lg-3">
                                        <FormItem key="rebateOneLevelProportion">
                                            <Input addonAfter="%"  {...rebateOneLevelProportionProps} className="form-control" placeholder="请输入一级返利占比" />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0 margin-top20 margin-btm20" >
                                    <label className="control-label col-xs-2">二级返利：</label>
                                    <div className="col-lg-3">

                                        <FormItem key="rebateTwoLevelProportion" >
                                            <Input addonAfter="%"  {...rebateTwoLevelProportionProps} className="form-control" placeholder="请输入二级返利占比" />
                                        </FormItem>

                                    </div>
                                </div>
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">三级返利：</label>
                                    <div className="col-lg-3">
                                        <FormItem key="rebateThreeLevelProportion">
                                            <Input addonAfter="%"  {...rebateThreeLevelProportionProps} className="form-control" placeholder="请输入三级返利占比" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row margin0 ">
                                    <label className="control-label col-xs-2">是否临时锁定：</label>
                                    <div className="col-lg-3 ">
                                        <div className="row">
                                            <FormItem key="isTemporaryLockProps">
                                                <RadioGroup  {...isTemporaryLockProps} onChange={this.isTemporaryLockChange}>
                                                    <Radio value={true} >是</Radio>
                                                    <Radio value={false} >否</Radio>
                                                </RadioGroup>
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: this.state.isTemporaryLock ? "" : "none" }}>
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">临时锁定时间：</label>
                                    <div className="col-lg-3">
                                        <FormItem key="temporaryLockTime" >
                                            <Input addonAfter="小时"  {...temporaryLockTimeProps} className="form-control" placeholder="请输入临时锁定时间" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group" style={{ display:"none" }}>
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">预期收益到期时间：</label>
                                    <div className="col-lg-3">
                                        <FormItem key="expectedToExpectDays">
                                            <Input addonAfter="天"  {...expectedToExpectDaysProps} className="form-control" placeholder="请输入预期收益到期时间" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">预计收益转可用收益时间：</label>
                                    <div className="col-lg-3">
                                        <FormItem key="expectedToExpectDays">
                                            <Input addonAfter="天"  {...expectedToAvailableIncomeDaysProps} className="form-control" placeholder="请输入预计收益转可用收益时间" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="clearfix"></div>
                    <div className="row margin0 padding10 margin-top60">
                        <div className="col-lg-1 col-sm-2 col-lg-offset-3 col-sm-offset-3">

                            <Button type="primary" size="large" className="btn btn-block" onClick={this.submitForm}>保存</Button>
                        </div>
                    </div>
                    <div className="row margin0 padding10 margin-top60 bg-colorFC">
                        <div className="col-lg-12 col-sm-12 ">
                            <p className=" font14 padding-top10">返利说明：</p>
                        </div>
                        <div className="col-lg-12 col-sm-12 ">
                            <p className=" font12">1、通过《微信公众号运营规则》，微信公众帐号实施多级分销欺诈行为，发布分销信息诱导用户进行关注、分享或直接参与为按照违规内容，多级分销有一定的违规嫌疑。</p>
                        </div>
                        <div className="col-lg-12 col-sm-12 ">
                            <p className=" font12">2、微信官方处理分销行为，多是因为投诉。商户设置多级分销后，要避免非法分销行为，引起用户投诉。</p>
                        </div>
                        <div className="col-lg-12 col-sm-12">
                            <p className=" font12 padding-btm10">3、多级分销不超过三级，分销返利不超过总金额的50%。</p>
                        </div>
                    </div>

                </Form>

            </AppBody>
        );
    }
}


let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let MemberRightsSetIndexPage = Form.create({})(MemberRightsSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(MemberRightsSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
