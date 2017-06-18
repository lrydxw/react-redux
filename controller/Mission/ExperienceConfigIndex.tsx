import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Button } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import MissionApi from './Api';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ExperienceConfigIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.initDefaultForm = this.initDefaultForm.bind(this);

    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initDefaultForm();
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

    initDefaultForm() {
        const { setFieldsValue } = this.props.form;
        MissionApi.getExperienceConfig({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var setObj = {
                    "ListenCourse": String(obj.ListenCourse), "Comment": String(obj.Comment), "Praise": String(obj.Praise), "Reward": String(obj.Reward), "ProduceSubordinate": String(obj.ProduceSubordinate),
                    "SubordinateBargain": String(obj.SubordinateBargain), "LoginEveryday": String(obj.LoginEveryday), "SaveStudentCertificateFirstTime": String(obj.SaveStudentCertificateFirstTime),
                    "SubordinateBargainFirstTime": String(obj.SubordinateBargainFirstTime), "ShareLinkFirstTime": String(obj.ShareLinkFirstTime), "UnitExperienceAmount": String(obj.UnitExperienceAmount),
                    "CreateGeneralizeQRCodeFirstTime": String(obj.CreateGeneralizeQRCodeFirstTime), "SigninFirstTime": String(obj.SigninFirstTime), "CreateNoteQRCodeFirstTime": String(obj.CreateNoteQRCodeFirstTime),
                    "CreateAdvanceNoticeQRCodeFirstTime": String(obj.CreateAdvanceNoticeQRCodeFirstTime), "BecomeJointInitiated": String(obj.BecomeJointInitiated), "MemberRefund": String(obj.MemberRefund),
                    "SigninEveryday": String(obj.SigninEveryday), "JoinClass": String(obj.JoinClass)
                };
                setFieldsValue(setObj);
            } else {
                message.error(data.Message);
            }
        });
    }

    submitForm(e) {
        e.preventDefault();
        var form = this.props.form;
        var _this = this;

        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();

            console.log('收到表单值：', obj);

            MissionApi.updateExperienceConfig(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '经验配置已保存',
                        onOk() { },
                    });
                } else {
                    message.error(data.Message);
                }
            });


        });
    }


    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const unitExperienceAmountProps = getFieldProps('UnitExperienceAmount', {
            validate: [{
                rules: [
                    { required: true, message: '请输入一元可购买经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const listenCourseProps = getFieldProps('ListenCourse', {
            validate: [{
                rules: [
                    { required: true, message: '请输入听课经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const commentProps = getFieldProps('Comment', {
            validate: [{
                rules: [
                    { required: true, message: '请输入评论经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const praiseProps = getFieldProps('Praise', {
            validate: [{
                rules: [
                    { required: true, message: '请输入点赞经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const rewardProps = getFieldProps('Reward', {
            validate: [{
                rules: [
                    { required: true, message: '请输入打赏经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const produceSubordinateProps = getFieldProps('ProduceSubordinate', {
            validate: [{
                rules: [
                    { required: true, message: '请输入产生下级经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const subordinateBargainProps = getFieldProps('SubordinateBargain', {
            validate: [{
                rules: [
                    { required: true, message: '请输入下级成交经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const loginEverydayProps = getFieldProps('LoginEveryday', {
            validate: [{
                rules: [
                    { required: true, message: '请输入每天登录经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const saveStudentCertificateFirstTimeProps = getFieldProps('SaveStudentCertificateFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次保存学员证经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const subordinateBargainFirstTimeProps = getFieldProps('SubordinateBargainFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次成交下级经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const shareLinkFirstTimeProps = getFieldProps('ShareLinkFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次分享链接经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const createGeneralizeQRCodeFirstTimeProps = getFieldProps('CreateGeneralizeQRCodeFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次生成推广二维码经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const signinFirstTimeTimeProps = getFieldProps('SigninFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次签到经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const createNoteQRCodeFirstTimeProps = getFieldProps('CreateNoteQRCodeFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次生成课程笔记二维码经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const createAdvanceNoticeQRCodeFirstTimeProps = getFieldProps('CreateAdvanceNoticeQRCodeFirstTime', {
            validate: [{
                rules: [
                    { required: true, message: '请输入第一次生成课程预告二维码经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const becomeJointInitiatedProps = getFieldProps('BecomeJointInitiated', {
            validate: [{
                rules: [
                    { required: true, message: '请输入成为联合发起人经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const memberRefundProps = getFieldProps('MemberRefund', {
            validate: [{
                rules: [
                    { required: true, message: '请输入会员退款经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const signinEverydayProps = getFieldProps('SigninEveryday', {
            validate: [{
                rules: [
                    { required: true, message: '请输入每日签到经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const joinClassProps = getFieldProps('JoinClass', {
            validate: [{
                rules: [
                    { required: true, message: '请输入加入微信班级群经验值' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">经验配置</a>
                    <a className="main-content-word pull-left" href="/Manager/MemberSetInfo/MemberRebateSetIndex">会员分销</a>
                </div>
                <Form horizontal>
                    <div className="form-horizontal tasi-form" >

                        <div className="row padding-top20 margin0">
                            <div className="col-lg-2 col-sm-12 padding-top5">
                                <b>日常经验</b>
                            </div>

                            <div className="col-lg-10 col-sm-12">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">一元可购买经验值：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="listenCourse"
                                                            hasFeedback
                                                            >
                                                            <Input {...unitExperienceAmountProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>
                                                    <span className="col-xs-2 color9 margin-top10">0代表不能购买</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">听课：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="listenCourse"
                                                            hasFeedback
                                                            >
                                                            <Input {...listenCourseProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>
                                                    <span className="col-xs-2 color9 margin-top10">0代表不增加经验</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">评论：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="comment"
                                                            hasFeedback
                                                            >
                                                            <Input {...commentProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">点赞：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="praise"
                                                            hasFeedback
                                                            >
                                                            <Input {...praiseProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">打赏：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="reward"
                                                            hasFeedback
                                                            >
                                                            <Input {...rewardProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">产生下级：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="produceSubordinate"
                                                            hasFeedback
                                                            >
                                                            <Input {...produceSubordinateProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">下级成交：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="subordinateBargain"
                                                            hasFeedback
                                                            >
                                                            <Input {...subordinateBargainProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">每天登录：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="loginEveryday"
                                                            hasFeedback
                                                            >
                                                            <Input {...loginEverydayProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">成为联合发起人：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="BecomeJointInitiated"
                                                            hasFeedback
                                                            >
                                                            <Input {...becomeJointInitiatedProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">会员退款：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="MemberRefund"
                                                            hasFeedback
                                                            >
                                                            <Input {...memberRefundProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">每日签到：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="SigninEveryday"
                                                            hasFeedback
                                                            >
                                                            <Input {...signinEverydayProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">
                                                    <label className="control-label col-xs-2">加入微信班级群：</label>
                                                    <div className="col-xs-4">
                                                        <FormItem key="JoinClass"
                                                            hasFeedback
                                                            >
                                                            <Input {...joinClassProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                        </FormItem>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row padding-top20 margin0">
                            <div className="col-lg-2 col-sm-12 padding-top5">
                                <b>任务经验</b>
                            </div>
                            <div className="col-lg-10 col-sm-12">
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次保存学员证：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="saveStudentCertificateFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...saveStudentCertificateFirstTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次成交下级：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="subordinateBargainFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...subordinateBargainFirstTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次分享链接：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="shareLinkFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...shareLinkFirstTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次生成推广二维码：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="CreateGeneralizeQRCodeFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...createGeneralizeQRCodeFirstTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次签到：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="SigninFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...signinFirstTimeTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次生成课程笔记二维码：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="CreateNoteQRCodeFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...createNoteQRCodeFirstTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row margin0">
                                        <div className="col-xs-8">
                                            <label className="control-label col-xs-2">第一次生成课程预告二维码：</label>
                                            <div className="col-xs-4">
                                                <FormItem key="CreateAdvanceNoticeQRCodeFirstTime"
                                                    hasFeedback
                                                    >
                                                    <Input {...createAdvanceNoticeQRCodeFirstTimeProps} className="cp1 form-control" placeholder="请输入经验值" />
                                                </FormItem>
                                            </div>

                                        </div>
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

let ExperienceConfigIndexPage = Form.create({})(ExperienceConfigIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ExperienceConfigIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
