import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Row, Col, Modal, Form, Input, Button, Popconfirm, message } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import { Editor } from '../../components/editor/editor';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import ProductApi from '../Product/ProductApi';
import SystemBasicInfoApi from '../manager/SystemBasicInfo/Api';
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseInfoSetStep3 extends BaseContainer {
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
        this.previousStep1 = this.previousStep1.bind(this);
        this.previousStep2 = this.previousStep2.bind(this);
        this.loadSystemBasicInfo = this.loadSystemBasicInfo.bind(this);

        this.state = {
            detailContent: "请输入课程详情",
            CourseProductId: -1,
            editNextId: -1,
            siteName: ""
        }


    }


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
        if (_this.state.CourseProductId !== _this.state.editNextId) {
            _this.state.editNextId = _this.state.CourseProductId;
            if (_this.state.CourseProductId) {
                ProductApi.getProductDetailInfo({ Id: _this.state.CourseProductId }).then(function (data) {

                    if (data.IsOK) {
                        var obj = data.Value;
                        _this.state["detailContent"] = obj.Details;
                        setFieldsValue({ "Details": obj.Details, "ShareTitle": obj.ShareTitle, "ShareContent": obj.ShareContent });
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
        if (nextProps.nextActiveKey && this.props.activeKey == 3 && nextProps.nextActiveKey != this.props.activeKey) {
            this.handelSubmit(false, nextProps.nextActiveKey);
        }
    }

    loadCourseInfoDetail() {
        var _this = this;
        _this.state.editNextId = -1;
        _this.state.CourseProductId = LocalStorage.get('CourseProductId');


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

    handelSubmit(isPublish, step) {
        var _this = this;
        var form = _this.props.form;

        _this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();
            obj.Id = _this.state.CourseProductId;
            obj.IsPublish = isPublish;
            var msg = "课程信息已保存";
            if (isPublish) {
                msg = "课程信息已保存并且已发布"
            }
            _this.props.nextTab(step, { Third: obj });

        });
    }


    backToCourseList() {
        Tool.goPush('Course/Index');
    }

    previousStep2() {
        var _this = this;
        Tool.goPush('Course/CourseInfoSetStep2');
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
    }

    previousStep1() {
        var _this = this;
        Tool.goPush('Course/CourseInfoSetStep1');
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
    }

    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = _self.props.form;

        const editProps = {
            callbackContentChange: (value) => {
                if (_self.state["detailContent"] !== value) {
                    _self.state["detailContent"] = value;

                    setFieldsValue({ "Details": value });
                }
            }

        }

        const shareTitleProps = getFieldProps("ShareTitle", {

        });

        const shareContentProps = getFieldProps("ShareContent", {

        });


        const inputProps = getFieldProps("Details", {
            rules: [
                { required: false, message: "请输入详情" },
            ],
        });


        return (
            <div>
                <Form horizontal>

                    <div className="editor-box99 padding-top20 padding-btm20 clearfix ">
                        <div className="pull-left editor-left">
                            <div className="editor-left-title">
                                <p className="text-center">{_self.state.siteName}</p>
                            </div>
                            <div className="editor-left-main">
                                <div className="bg-colorE5 padding20 text-center">
                                    基本信息区<br />
                                    固定样式，显示商品主图，价格等信息
                                </div>
                                <div className="courImg">
                                    <div dangerouslySetInnerHTML={{ __html: _self.state["detailContent"] }} />
                                </div>
                            </div>
                        </div>
                        <div className="pull-right">
                            <div className="form-horizontal" >

                                <div className="well well-sm margin-btm10 editor-right99">
                                    <div className="row margin0">
                                        <p className="col-xs-12 font12 margin-top8">分享标题(选填，微信分享给好友时会显示这里的文案) </p>
                                        <div className="col-xs-12">
                                            <FormItem key="ShareTitle"
                                                hasFeedback
                                                >
                                                <Input  {...shareTitleProps} className="form-control" placeholder="分享标题" />
                                            </FormItem>


                                        </div>
                                    </div>
                                    <div className="row margin0 margin-top10">
                                        <p className="col-xs-12 font12 margin-top8">分享简介(选填，微信分享给好友时会显示这里的文案) </p>
                                        <div className="col-xs-12">
                                            <FormItem key="ShareContent"
                                                hasFeedback
                                                >
                                                <Input  {...shareContentProps} className="form-control" placeholder="分享简介" />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                <div className="editor-right editor-right99 padding20 bg-colorF5 ">
                                    <div className="editor-arrow"><img src="/content/images/editor-arrow.jpg" /></div>
                                    <FormItem key="Details"
                                        hasFeedback
                                        >
                                        <Input {...inputProps} type="hidden" />

                                        <Editor {...editProps} value={_self.state["detailContent"]} id="content" height="500" />

                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="seat-80"></div>
                    <div className="position-btm">

                        <div className="row margin0 bg-colorFC padding10 margin-top20">
                            <div className="col-lg-8 col-lg-offset-3">
                                <div className="row">
                                    <div className="col-lg-2  col-sm-4 col-md-2">
                                        <a className="btn btn-block btn-success2" onClick={() => { this.handelSubmit(false, 2) } } >上一步</a>
                                    </div>
                                    <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                        <a className="btn btn-block  btn-info2" onClick={() => { this.handelSubmit(true, -1) } } >保存并发布</a>
                                    </div>

                                    <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                        <a className="btn btn-block btn-success" onClick={() => { this.handelSubmit(false, -1) } } >保存并退出</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </Form>
            </div>
        );
    }
}

let CourseInfoSetStep3Page = Form.create({})(CourseInfoSetStep3);
export { CourseInfoSetStep3Page }
