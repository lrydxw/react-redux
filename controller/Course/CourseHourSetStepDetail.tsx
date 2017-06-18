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
import { Editor } from '../../components/editor/editor';

//api
import CourseHourApi from './CourseHourApi';
import SystemBasicInfoApi from '../manager/SystemBasicInfo/Api';
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
class CourseHourSetStepDetail extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.loadCourseInfoDetail = this.loadCourseInfoDetail.bind(this);
        this.handelSubmit = this.handelSubmit.bind(this);
        this.showQuitPage = this.showQuitPage.bind(this);
        this.showFirstPage = this.showFirstPage.bind(this);
        this.showPreviouPage = this.showPreviouPage.bind(this);
        this.checkedOnChange = this.checkedOnChange.bind(this);
        this.loadSystemBasicInfo = this.loadSystemBasicInfo.bind(this);
        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            detailContent: "请输入课时详情",
            CourseHourId: LocalStorage.get('Id'),
            CourseProductId: LocalStorage.get('CourseProductId'),
            CourseTitle: "课时管理",
            editNextId: -1,
            IsPublish: false,//是否发布
            IsSendMessage: false,//是否发送
            siteName: ""
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadCourseInfoDetail();
        this.loadSystemBasicInfo();
    }
    //更新DOM之前被执行
    componentWillUpdate() {
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        if (_this.state.CourseHourId !== _this.state.editNextId) {
            _this.state.editNextId = _this.state.CourseHourId;
            if (_this.state.CourseHourId) {
                CourseHourApi.getCourseHour({ 'Id': _this.state.CourseHourId }).then(function (data) {
                    if (data.IsOK) {
                        var obj = data.Value;
                        _this.state.IsPublish = obj.IsPublish;
                        setFieldsValue({ "CourseDetails": obj.CourseDetails });
                        _this.setState({ CourseTitle: obj.CourseTitle, "detailContent": obj.CourseDetails });
                    } else {
                        message.error(data.Message);
                    }
                });
            }
        }
    }
    //移除DOM之前被执行
    componentWillUnmount() {
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        if (nextProps.nextActiveKey && this.props.activeKey == 2 && nextProps.nextActiveKey != this.props.activeKey) {
            this.handelSubmit(nextProps.nextActiveKey);
        }
    }
    loadCourseInfoDetail() {
        var _this = this;
        _this.state.editNextId = -1;
        _this.state.CourseHourId = LocalStorage.get('Id');
    }
    /**
     * 保存
     */
    handelSubmit(step) {
        var _this = this;
        var form = _this.props.form;
        _this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.CourseHourId;
            obj.IsPublish = _this.state.IsPublish;
            obj.IsSendMessage = _this.state.IsSendMessage;
            console.log(obj);
            var msg = "课时信息已保存";
            if (obj.IsPublish) {
                msg = "课时信息已保存并且已发布";
            }
            _this.props.nextTab(step, { Second: obj });

            //CourseHourApi.insertCourseHourThird(obj).then(function (data) {
            //    if (data.IsOK) {
            //        _this.setState({ visibleForm: false })
            //        Modal.success({
            //            title: '操作成功',
            //            content: msg,
            //            onOk() {
            //                _this.showQuitPage();
            //            },
            //        });
            //    } else {
            //        message.error(data.Message);
            //    }
            //});
        });
    }
    /**
     * 退出到课时页面
     * @param Id
     * @param CourseProductId
     */
    showQuitPage() {
        var _this = this;
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
        Tool.goPush('Course/CourseHour');
    }
    /**
     * 上一步
     */
    showPreviouPage() {
        var _this = this;
        LocalStorage.add('Id', _this.state.CourseHourId);
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
        Tool.goPush('Course/CourseHourSecondStep1');
    }
    /**
     * 第一步
     */
    showFirstPage() {
        var _this = this;
        LocalStorage.add('Id', _this.state.CourseHourId);
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
        Tool.goPush('Course/CourseHourSecond');
    }
    checkedOnChange(e) {
        var _this = this;
        _this.state.IsSendMessage = e.target.checked;
    }
    loadSystemBasicInfo() {
        var _this = this;
        SystemBasicInfoApi.getAppBasciInfo().then(function (data) {
            if (data.IsOK) {
                _this.state.siteName = data.Value.SiteName;

            } else {
                message.error(data.Message);
            }
        });
    }
    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = _self.props.form;
        const editProps = {
            callbackContentChange: (value) => {
                if (_self.state["detailContent"] !== value) {
                    _self.state["detailContent"] = value;
                    setFieldsValue({ "CourseDetails": value });
                }
            }
        }
        const inputProps = getFieldProps("CourseDetails", {
            rules: [
                { required: false, message: "请输入详情" },
            ],
        });
        return (
            <div>
                <div className="editor-box99 padding-top20 padding-btm20 clearfix ">
                    <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">  {_self.state.siteName}</p>
                        </div>
                        <div className="editor-left-main">
                            <div className="bg-colorE5 padding20 text-center">
                                基本信息区<br />
                                固定样式，显示课时详情
                            </div>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: _self.state["detailContent"] }} />
                            </div>
                        </div>
                    </div>
                    <div className="pull-right">
                        <form className="form-horizontal" >
                            <div className="editor-right editor-right99 padding20 bg-colorF5">
                                <div className="editor-arrow"><img src="/content/images/editor-arrow.jpg" /></div>
                                <FormItem key="Details"
                                    hasFeedback
                                    >
                                    <Input {...inputProps} type="hidden" />

                                    <Editor {...editProps} value={_self.state["detailContent"]} id="content" height="500" />

                                </FormItem>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-8 col-lg-offset-3">
                            <div className="row">
                                <div className="col-lg-2  col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-success2" onClick={() => { this.handelSubmit(1) } }>上一步</a>
                                </div>
                                <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-success" onClick={() => { this.setState({ visibleForm: true, IsPublish: true }) } } >保存并发布</a>
                                </div>
                                <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-info2" onClick={() => { this.handelSubmit(-1) } } >保存</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal visible={this.state.visibleForm} title="" width={420} onOk={() => { this.handelSubmit(-1) } } onCancel={() => { this.setState({ visibleForm: false }) } } maskClosable={false}>
                    <div className="row padding-left20">
                        <p className="wen-ico color3 font16">确定保存并发布该课时吗？</p >
                        <p className="wen-ico color9 font14 margin-top10"><Checkbox onChange={this.checkedOnChange}>通过公众号给用户发送开课消息</Checkbox></p >
                    </div>
                </Modal>
            </div>
        );
    }
}



let CourseHourSetStepDetailPage = Form.create({})(CourseHourSetStepDetail);
export { CourseHourSetStepDetailPage }
