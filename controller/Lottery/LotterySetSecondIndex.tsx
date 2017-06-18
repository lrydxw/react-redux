﻿import 'antd/dist/antd.less'
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
import LotteryApi from './LotteryApi';
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
class LotterySetSecondIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.loadLotterySetDetail = this.loadLotterySetDetail.bind(this);
        this.handelSubmit = this.handelSubmit.bind(this);
        this.showFirstPage = this.showFirstPage.bind(this);

        this.state = {
            detailContent: "请输入签到抽奖详情",
            LotteryId: LocalStorage.get('Id'),
            editNextId: -1,
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadLotterySetDetail();
    }
    //更新DOM之前被执行
    componentWillUpdate() {
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        if (_this.state.LotteryId !== _this.state.editNextId) {
            _this.state.editNextId = _this.state.LotteryId;
            if (_this.state.LotteryId) {
                LotteryApi.getLotterySet({ "Id": _this.state.LotteryId }).then(function (data) {
                    if (data.IsOK) {
                        var obj = data.Value;
                        _this.state["detailContent"] = obj.LotteryDetails;
                        setFieldsValue({ "LotteryDetails": obj.LotteryDetails, "ShareTitle": obj.ShareTitle, "ShareContent": obj.ShareContent });
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
            this.handelSubmit(false, nextProps.nextActiveKey);
        }
    }
    loadLotterySetDetail() {
        var _this = this;
        _this.state.editNextId = -1;
        _this.state.LotteryId = LocalStorage.get('Id');
    }
    /**
     * 保存
     * @param isPublish
     */
    handelSubmit(isPublish, step) {
        var _this = this;
        var form = _this.props.form;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.LotteryId;
            obj.IsPublish = isPublish;
            console.log(obj);
            _this.props.nextTab(step, { Second: obj });
        });
    }
    /**
     * 第一步
     */
    showFirstPage() {
        var _this = this;
        LocalStorage.add('Id', _this.state.LotteryId);
        Tool.goPush('Lottery/LotterySetEdit');
    }
    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const editProps = {
            callbackContentChange: (value) => {
                if (this.state["detailContent"] !== value) {
                    this.state["detailContent"] = value;
                    setFieldsValue({ "LotteryDetails": value });
                }
            }
        }
        const inputProps = getFieldProps("LotteryDetails", {
            rules: [
                { required: false, message: "请输入详情" },
            ],
        });
        const shareTitleProps = getFieldProps("ShareTitle");
        const shareContentProps = getFieldProps("ShareContent");
        return (
            <div>
                <div className="editor-box99 padding-top20 padding-btm20 clearfix ">
                    <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">微领袖商学院</p>
                        </div>
                        <div className="editor-left-main">
                            <div className="bg-colorE5 padding20 text-center">
                                基本信息区<br />
                                固定样式，显示签到抽奖详情
                            </div>
                            <div className="courImg">
                                <div dangerouslySetInnerHTML={{ __html: _self.state["detailContent"] }} />
                            </div>
                        </div>
                    </div>
                    <div className="pull-right">
                        <Form className="form-horizontal" >

                            <div className="well well-sm margin-btm10 editor-right99">
                                <div className="row margin0">
                                    <p className="col-xs-12 font12 margin-top8">分享标题(选填，微信分享给好友时会显示这里的文案) </p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input  {...shareTitleProps} className="form-control" placeholder="分享标题" />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0 margin-top10">
                                    <p className="col-xs-12 font12 margin-top8">分享简介(选填，微信分享给好友时会显示这里的文案) </p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input  {...shareContentProps} className="form-control" placeholder="分享简介" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="editor-right editor-right99 padding20 bg-colorF5 ">
                                <div className="editor-arrow"><img src="/content/images/editor-arrow.jpg" /></div>
                                <FormItem hasFeedback>
                                    <FormItem>
                                        <Input {...inputProps} type="hidden" />
                                        <Editor {...editProps} value={this.state["detailContent"]} id="content" height="500" />
                                    </FormItem>
                                </FormItem>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-8 col-lg-offset-3">
                            <div className="row">
                                <div className="col-lg-2  col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-success2" onClick={() => { this.handelSubmit(false, 1) } }>上一步</a>
                                </div>
                                <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-success" onClick={() => { this.handelSubmit(true, -1) } } >保存并发布</a>
                                </div>
                                <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-info2" onClick={() => { this.handelSubmit(false, -1) } }>保存</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
let LotterySetSecondIndexPage = Form.create({})(LotterySetSecondIndex);
export { LotterySetSecondIndexPage }
