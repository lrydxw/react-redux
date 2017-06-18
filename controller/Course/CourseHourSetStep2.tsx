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
import { Popconfirm, message, Switch, Radio, Checkbox } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseHourApi from './CourseHourApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseHourSetStep2 extends BaseContainer {
    postData: any;
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
        this.initCourseHourData = this.initCourseHourData.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.showQuitPage = this.showQuitPage.bind(this);
        this.showFirstPage = this.showFirstPage.bind(this);
        this.checkedOnChange = this.checkedOnChange.bind(this);

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            CourseHourId: LocalStorage.get('Id'),
            CourseProductId: LocalStorage.get('CourseProductId'),
            DefaultValues: {},
            ResourceUrlFileList: [],
            ResourceUrl: "",//视频源地址
            ShowFaceUrl: "",//封面地址
            hasUpload: true,//视频资源是否上传成功
            IsPublish: false,//是否发布
            IsSendMessage: false,//是否发送
            IsPurchase: false,//是否购买
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCourseHourData();
    }
    //更新DOM之前被执行
    componentWillUpdate() {
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        if (this.props.CourseType == 2) {
            jwplayer('videoContainer').setup({
                flashplayer: "/Content/js/jwplayer.flash.swf",
                file: this.state.ResourceUrl,
                width: 320,
                height: 200,
            });
        }
    }
    //移除DOM之前被执行
    componentWillUnmount() {
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        if (nextProps.nextActiveKey && this.props.activeKey == 2 && nextProps.nextActiveKey != this.props.activeKey) {
            this.submitForm(nextProps.nextActiveKey);
        }
    }
    /**
     * 初始化数据
     */
    initCourseHourData() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        if (_this.state.CourseHourId) {
            CourseHourApi.getCourseHour({ 'Id': _this.state.CourseHourId }).then(function (data) {
                if (data.IsOK) {
                    var obj = data.Value;
                    var resourceUrlFileList = [{
                        uid: obj.Id,
                        name: obj.CourseTitle,
                        status: 'done',
                        url: obj.ResourceUrl,
                    }];
                    //var faceUrlFileList = [{
                    //    uid: obj.Id + '_img',
                    //    name: obj.CourseTitle,
                    //    status: 'done',
                    //    url: obj.ShowFaceUrl,
                    //}];
                    setFieldsValue({
                        "ResourceUrl": obj.ResourceUrl, "ShowFaceUrl": obj.ShowFaceUrl, "IsShowLecturer": obj.IsShowLecturer, "IsShowIntroduction": obj.IsShowIntroduction,
                        "ShareTitle": obj.ShareTitle, "ShareContent": obj.ShareContent, "ResourceUrl1": obj.ResourceUrl
                    });
                    _this.state.IsPublish = obj.IsPublish;
                    _this.setState({ DefaultValues: obj, IsPurchase: obj.IsPurchase });
                    if (obj.ResourceUrl)
                        _this.setState({ ResourceUrl: obj.ResourceUrl, ResourceUrlFileList: resourceUrlFileList });
                    //if (obj.ShowFaceUrl)
                    //    _this.setState({ ShowFaceUrl: obj.ShowFaceUrl, ShowFaceUrlFileList: faceUrlFileList });
                    //$(".ant-upload-select-picture-card").css("display", !!obj.ShowFaceUrl ? "none" : "");
                }
            });
        }
    }
    /**
     * 提交数据
     */
    submitForm(step) {
        var _this = this;
        var form = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.CourseHourId;
            obj.IsPublish = _this.state.IsPublish;
            obj.IsSendMessage = _this.state.IsSendMessage;
            if (_this.props.CourseType == 4) { obj.ResourceUrl = obj.ResourceUrl1; }
            console.log(obj);
            var msg = "课时信息已保存";
            if (obj.IsPublish) {
                msg = "课时信息已保存并且已发布";
            }
            if (!_this.state.hasUpload) {
                Modal.info({
                    title: '温馨提示',
                    content: '课时资源还未上传成功，请稍等',
                });
                return;
            }
            _this.props.nextTab(step, { Second: obj });
        });
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
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
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const logoProps = {
            multiple: false,
            action: "/UploadFile/UploadFile",
            data: {
                type: 'course',
                format: 'large'
            },
            fileList: this.state["ResourceUrlFileList"],
            onChange: (info) => {
                this.state.hasUpload = false;
                let fileList = info.fileList;
                if (fileList.length > 1) {
                    fileList = [info.fileList[info.fileList.length - 1]];
                }

                // 1. 上传列表数量的限制
                //    只显示最近上传的一个，旧的会被新的顶掉
                fileList = fileList;
                // 2. 读取远程路径并显示链接
                fileList = fileList.map((file) => {
                    console.log("fileList：" + fileList.length);
                    if (file.response) {
                        // 组件会将 file.url 作为链接进行展示  
                        file.url = file.response.url;
                    }
                    return file;
                });

                // 3. 按照服务器返回信息筛选成功上传的文件
                fileList = fileList.filter((file) => {
                    console.log("filter：" + fileList.length);
                    //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                    if (file.response) {
                        this.state.hasUpload = true;//上传成功
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "ResourceUrl";
                var obj = {};
                var val = "";
                if (fileList.length > 0) {
                    fileList.map(function (file, i) {
                        if (i === 0) {
                            val += file.url;
                        }
                        else {
                            val += "," + file.url;
                        }
                    });
                }
                obj[key] = val;
                setFieldsValue(obj);
                this.setState({ ResourceUrlFileList: fileList, ResourceUrl: val });
            },
            onPreview: (file) => { }
        };
        return (
            <div>

                <div className="editor-box2 padding-top20 padding-btm20 clearfix ">
                    <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">微领袖商学院</p>
                        </div>
                        <div className="container-fluid editor-left-main2">
                            <div className="row">
                                {this.props.CourseType == 2 ? <div className="col-xs-12">
                                    <video id="videoContainer" className="video-js vjs-default-skin vjs-big-play-centered" ></video>
                                </div> : ""}
                                {this.props.CourseType == 4 ? < div className="col-xs-12">
                                    <div dangerouslySetInnerHTML={{ __html: getFieldValue("ResourceUrl1") }} />
                                </div> : ""}
                            </div>
                            <div className="row videoClassTi">
                                <h2 className="col-xs-12 videoName">{this.state.DefaultValues.CourseTitle}</h2>
                                <p className="col-xs-12 classplayTime">即将开始：<em className="fontColordanger fontNormal">{this.state.DefaultValues.StartTime}</em></p>
                                <div className="col-xs-12 shareClasses"><span className="btnmdBorCir shareClassCon">分享课程</span></div>
                            </div>
                            <div className="row borderTop margTop10 classNavOut">
                                <div className="col-xs-12 classNavBar">
                                    <ul className="navBarList">
                                        <li className="borderBot navItems navItemsActive">详情</li>
                                        <li className="borderBot navItems">目录</li>
                                        <li className="borderBot navItems">评论</li>
                                    </ul>
                                    <div className="col-xs-12 classNavCon">
                                        <div className="classDail">
                                            <div className="col-xs-12 classNavCon">
                                                <div className="classDail">
                                                    <h3 className="clearfix classCont"><span className="bgColor pull-left classConLeft">左侧竖条</span><em className="pull-left fontNormal">课程概要</em></h3>
                                                    <div className=" classSection">
                                                        <p className="classSecCon">
                                                            {this.state.DefaultValues.CourseIntroduction}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row margin0 ">
                            <div className="col-xs-12 pad0"><a href="javascript:;" className="btnlgBg nuyCrecruit">发表评论</a></div>
                        </div>
                    </div>
                    <div className="pull-right editor-right editor-right2  padding20">
                        <Form horizontal>
                            <div className="editor-arrow editor-arrow2"><img src="/Content/images/editor-arrow2.png" /></div>
                            <div className="clearfix editor-title margin-btm20">
                                <span className="pull-left">编辑课程内容</span>
                            </div>
                            <div className="row margin0">
                                <p className="col-xs-12 font12">分享标题(选填，微信分享给好友时会显示这里的文案) </p>
                                <div className="col-xs-12">
                                    <FormItem key="ShareTitle" hasFeedback>
                                        <Input  {...getFieldProps("ShareTitle") } className="form-control" placeholder="分享标题" />
                                    </FormItem>
                                </div>
                            </div>
                            <div className="row margin0">
                                <p className="col-xs-12 font12">分享简介(选填，微信分享给好友时会显示这里的文案) </p>
                                <div className="col-xs-12">
                                    <FormItem key="ShareContent" hasFeedback>
                                        <Input  {...getFieldProps("ShareContent") } className="form-control" placeholder="分享简介" />
                                    </FormItem>
                                </div>
                            </div>
                            {this.props.CourseType == 2 ? <div className="row margin0">
                                <p className="col-xs-12 font12">课时资源(音频文件)</p>
                                <div className="col-xs-12">
                                    <FormItem hasFeedback>
                                        <Input type="hidden" placeholder="请上传课时资源" {...getFieldProps('ResourceUrl', {
                                            validate: [{
                                                rules: [
                                                    { required: false, message: '请上传课时资源' },
                                                ], trigger: ['onBlur', 'onChange'],
                                            }]
                                        }) } />
                                        <Upload {...logoProps} name="upload" >
                                            <Button type="ghost">
                                                <Icon type="upload" /> 点击上传
                                    </Button>
                                        </Upload>
                                    </FormItem>
                                </div>
                            </div> : ""}
                            {this.props.CourseType == 4 ? <div className="row margin0">
                                <p className="col-xs-12 font12">视频地址 (请插入视频网站分享的通用代码) <a onClick={() => { this.setState({ visibleVideo: true }) } }>上传示例</a></p>
                                <div className="col-xs-12">
                                    <FormItem key="ShareContent" hasFeedback>
                                        <Input placeholder="请插入视频网站分享的通用代码" {...getFieldProps('ResourceUrl1', {
                                            validate: [{
                                                rules: [
                                                    { required: false, message: '请插入视频网站分享的通用代码' },
                                                ], trigger: ['onBlur', 'onChange'],
                                            }]
                                        }) } />
                                    </FormItem>
                                </div>
                            </div> : ""}
                            <div className="row margin0">
                                <div className="col-xs-12">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <FormItem>
                                                讲师介绍：<Switch checkedChildren={'开'} unCheckedChildren={'关'} {...getFieldProps('IsShowLecturer', { valuePropName: 'checked' }) } />
                                            </FormItem>
                                        </div>
                                        <div className="col-lg-4">
                                            <FormItem>
                                                课时简介：<Switch checkedChildren={'开'} unCheckedChildren={'关'}  {...getFieldProps('IsShowIntroduction', { valuePropName: 'checked' }) } />
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
                        <div className="col-lg-8 col-lg-offset-3">
                            <div className="row">
                                <div className="col-lg-2  col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-success2" onClick={() => { this.submitForm(1) } }>上一步</a>
                                </div>
                                <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-success" onClick={() => { this.setState({ visibleForm: true, IsPublish: true }) } } >保存并发布</a>
                                </div>
                                <div className="col-lg-2 margin-left20 col-sm-4 col-md-2">
                                    <a className="btn btn-block btn-info2" onClick={() => { this.submitForm(-1) } } >保存</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal visible={this.state.visibleForm} title="" width={420} onOk={() => { this.submitForm(-1) } } onCancel={() => { this.setState({ visibleForm: false }) } } maskClosable={false}>
                    <div className="row padding-left20">
                        <p className="wen-ico color3 font16">确定保存并发布该课时吗？</p >
                        <p className="wen-ico color9 font14 margin-top10"><Checkbox onChange={this.checkedOnChange}>通过公众号给用户发送开课消息</Checkbox></p >
                    </div>
                </Modal>
                <Modal title="上传示例" visible={this.state.visibleVideo} onCancel={() => { this.setState({ visibleVideo: false }) } } footer={[]}>
                    <div className="modal-body" style={{ overflow: "auto" }}>
                        <a href="/Content/images/loadvideo.gif" target="view_window"><img src="/Content/images/loadvideo.gif" style={{ width: "98%" }} /></a>
                    </div>
                </Modal>
            </div >
        );
    }
}



let CourseHourSetStep2Page = Form.create({})(CourseHourSetStep2);
export { CourseHourSetStep2Page }
