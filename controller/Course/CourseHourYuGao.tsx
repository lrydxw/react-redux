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
//表单验证模块
import Verifier from '../../pub/Verifier';
import RegExpVerify from '../../pub/RegExpVerify';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseHourYuGao extends BaseContainer {
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
        this.handleCancel = this.handleCancel.bind(this);
        this.showQuitPage = this.showQuitPage.bind(this);
        this.checkedOnChange = this.checkedOnChange.bind(this);

        this.state = {
            detailContent: "请输入课时预告",
            CourseHourId: LocalStorage.get('Id'),
            CourseProductId: LocalStorage.get('CourseProductId'),
            CourseTitle: "课时管理",
            editNextId: -1,
            CourseType: 4,//课时类型 默认视频
            CourseHourDetail: {},//课时详情
            NoticeResourceUrl: "",//课时预告资源地址
            ShowFaceUrl: "",//封面地址
            hasUpload: true,//视频资源是否上传成功
            IsPublish: false,//是否发布
            IsSendMessage: false,//是否发送
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadCourseInfoDetail();
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
            CourseHourApi.getCourseHour({ 'Id': _this.state.CourseHourId }).then(function (data) {
                if (data.IsOK) {
                    var obj = data.Value;
                    _this.state["detailContent"] = obj.CourseNotice;
                    var noticeTemplateFileList = [{
                        uid: obj.Id + '_img',
                        name: obj.CourseTitle,
                        status: 'done',
                        url: obj.NoticeTemplate,
                    }];
                    setFieldsValue({
                        "CourseNotice": obj.CourseNotice, "NoticeShareTitle": obj.NoticeShareTitle, "NoticeShareContent": obj.NoticeShareContent, "NoticeTemplate": obj.NoticeTemplate,
                        "ShowFaceUrl": obj.ShowFaceUrl, "NoticeResourceUrl": obj.NoticeResourceUrl, "NoticeIsShowLecturer": obj.NoticeIsShowLecturer,
                        "NoticeIsShowIntroduction": obj.NoticeIsShowIntroduction, "NoticePV": String(obj.NoticePV)
                    });
                    _this.setState({ CourseTitle: obj.CourseTitle, CourseType: obj.CourseType, CourseHourDetail: obj, ShowFaceUrl: obj.ShowFaceUrl, NoticeResourceUrl: obj.NoticeResourceUrl });
                    if (obj.NoticeTemplate)
                        _this.setState({ NoticeTemplateFileList: noticeTemplateFileList });
                    var noticeResourceUrlFileList = [{
                        uid: obj.Id,
                        name: obj.CourseTitle,
                        status: 'done',
                        url: obj.NoticeResourceUrl,
                    }];
                    if (obj.NoticeResourceUrl)
                        _this.setState({ NoticeResourceUrl: obj.NoticeResourceUrl, NoticeResourceUrlFileList: noticeResourceUrlFileList });
                    $(".ant-upload-select-picture-card").css("display", !!obj.NoticeTemplate ? "none" : "");
                } else {
                    message.error(data.Message);
                }
            });
        }
        jwplayer('videoContainer').setup({
            image: this.state.ShowFaceUrl,
            flashplayer: "/Content/js/jwplayer.flash.swf",
            file: this.state.NoticeResourceUrl,
            width: 320,
            height: 200,
        });
    }
    //移除DOM之前被执行
    componentWillUnmount() {
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
    }
    loadCourseInfoDetail() {
        var _this = this;
        _this.state.editNextId = -1;
        _this.state.CourseHourId = LocalStorage.get('Id');
    }
    /**
     * 保存
     * @param isNext false 上一步，true 下一步
     */
    handelSubmit() {
        var _this = this;
        var form = _this.props.form;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            debugger;
            obj.Id = _this.state.CourseHourId;
            obj.NoticeIsPublish = _this.state.IsPublish;
            obj.IsSendMessage = _this.state.IsSendMessage;
            console.log(obj);
            var msg = "课时预告已保存";
            if (obj.NoticeIsPublish) {
                msg = "课时预告已保存并且已发布";
            }
            if (!_this.state.hasUpload) {
                Modal.info({
                    title: '温馨提示',
                    content: '课时预告资源还未上传成功，请稍等',
                });
                return;
            }
            CourseHourApi.updateCourseHourNotice(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: msg,
                        onOk() {
                            _this.showQuitPage();
                        },
                    });
                } else {
                    message.error(data.Message);
                }
            });
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
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    checkedOnChange(e) {
        var _this = this;
        _this.state.IsSendMessage = e.target.checked;
    }
    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = _self.props.form;
        const editProps = {
            callbackContentChange: (value) => {
                if (_self.state["detailContent"] !== value) {
                    _self.state["detailContent"] = value;
                    setFieldsValue({ "CourseNotice": value });
                }
            }
        }
        const inputProps = getFieldProps("CourseNotice", {
            rules: [
                { required: false, message: "请输入详情" },
            ],
        });
        const imageProps = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            data: {
                type: 'course',
                format: 'large'
            },
            fileList: this.state["NoticeTemplateFileList"],
            onChange: (info) => {
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
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "NoticeTemplate";
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
                this.setState({ NoticeTemplateFileList: fileList, ShowFaceUrl: val });
                $(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
            },
            listType: "picture-card",
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }
        };
        const logoProps = {
            multiple: false,
            action: "/UploadFile/UploadFile",
            data: {
                type: 'course',
                format: 'large'
            },
            fileList: this.state["NoticeResourceUrlFileList"],
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
                var key = "NoticeResourceUrl";
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
                this.setState({ NoticeResourceUrlFileList: fileList, NoticeResourceUrl: val });
            },
            onPreview: (file) => { }
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">{this.state.CourseTitle}</a>
                </div>

                <div className="editor-box99 padding-top20 padding-btm20 clearfix">
                    <div className="pull-left editor-left" style={{ height: "auto" }}>
                        <div className="navHead">
                            <div className="navContent">
                                <span className="backLink iosbackLink"><i className="fa fa-angle-left backIcon"></i><em className="backnav">返回</em></span>
                                <span className="homeLink"><i className="fa fa-home homeIcon"></i></span>
                            </div>
                        </div>
                        <div className="commonTips">
                            <span className="topUserPic"><img src="/Content/editor/new/images/others/nz1.png" alt="用户头像" /></span>
                            <p className="topUserName">我是五哥@微领袖商学院Q1</p>
                            <p className="topUserInfo">推荐你加入微领袖商学院</p>
                            <span className="closeTips"><img src="/Content/editor/new/images/icons/clearName.png" alt="关闭提示" /></span>
                        </div>
                        <div className="borderTop borderBot classinfoWrap">
                            <div className="classpreInfo">
                                <h2 className="titleInfo">{this.state.CourseTitle}</h2>
                                <div className="clearfix classStar">
                                    <p className="pull-left starleft">授课形式：<span>{this.state.CourseHourDetail.CourseTypeStr}</span></p>
                                    <p className="pull-left starleft">浏览量：<span>{this.state.CourseHourDetail.PV}</span></p>
                                </div>
                                <div className="clearfix classlastTime">
                                    <p className="pull-left starleft">距开课剩余：</p>
                                    <span className="pull-left bgColor timeBlock">01天</span>
                                    <span className="pull-left bgColor timeBlock">06时</span>
                                    <span className="pull-left bgColor timeBlock">53分</span>
                                </div>
                            </div>
                            <div className="borderTop classintroType">
                                <video id="videoContainer" className="video-js vjs-default-skin vjs-big-play-centered" ></video>
                            </div>
                        </div>
                        <div style={{ display: getFieldValue("NoticeIsShowLecturer") ? "" : "none" }}>
                            <h3 className="borderBot margTop15 tempTitlemd">讲师介绍</h3>
                            <div className="teacherContent">
                                <span className="teacherPicture"><img src={this.state.CourseHourDetail.LecturerHeadImgUrl} alt={this.state.CourseHourDetail.LecturerName} /></span>
                                <p className="pictureName">{this.state.CourseHourDetail.LecturerName}</p>
                                <div className="nameContent" dangerouslySetInnerHTML={{ __html: this.state.CourseHourDetail.LecturerDescription }} />
                            </div>
                        </div>
                        <span className="alinkFont borderTop getmore">点击展开</span>
                        <h3 className="borderBot margTop15 tempTitlemd">内容介绍</h3>
                        <div className="classContentInfo">
                            <div dangerouslySetInnerHTML={{ __html: _self.state["detailContent"] }} />
                        </div>
                        <div className="clearfix shareMoney">
                            <a href="javascript:;" className="alinkbgDef shareLeft"><p className="shareLeftTitle">分享给朋友</p></a>
                            <a href="javascript:;" className="alinkbg shareRight">立即报名</a>
                        </div>
                    </div>
                    <div className="pull-right">
                        <Form className="form-horizontal" >
                            <div className="well well-sm margin-btm10 editor-right99">
                                <div className="row margin0">
                                    <p className="col-xs-12 font12">分享标题(选填，微信分享给好友时会显示这里的文案) </p>
                                    <div className="col-xs-12">
                                        <FormItem key="ShareTitle" hasFeedback>
                                            <Input  {...getFieldProps("NoticeShareTitle") } className="form-control" placeholder="分享标题" />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12">分享简介(选填，微信分享给好友时会显示这里的文案) </p>
                                    <div className="col-xs-12">
                                        <FormItem key="ShareContent" hasFeedback>
                                            <Input  {...getFieldProps("NoticeShareContent") } className="form-control" placeholder="分享简介" />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12">课时预告二维码(宽度：640 px，高度：705px) <a onClick={() => { this.setState({ visibleForm: true }) } }>二维码模板示例</a> </p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input type="hidden" className="form-control" placeholder="课时预告二维码" {...getFieldProps("NoticeTemplate", {
                                                validate: [{
                                                    rules: [
                                                        { required: false, message: '请上传课时预告二维码' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                },],
                                            }) } />
                                            <div>
                                                <Upload {...imageProps} name="upload" >
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text" >课时预告二维码</div>
                                                </Upload>
                                                <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img alt="example" src={this.state.priviewImage} width={"100%"} />
                                                </Modal>
                                            </div>
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12">课时预告(可上传视频、音频文件)</p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input type="hidden" placeholder="请上传课时预告" {...getFieldProps('NoticeResourceUrl', {
                                                validate: [{
                                                    rules: [
                                                        { required: false, message: '请上传课时预告' },
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
                                </div>
                                <div className="row margin0">
                                    <div className="col-xs-12">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <FormItem>
                                                    讲师介绍：<Switch checkedChildren={'开'} unCheckedChildren={'关'} {...getFieldProps('NoticeIsShowLecturer', { valuePropName: 'checked' }) } />
                                                </FormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <FormItem>
                                                    课时简介：<Switch checkedChildren={'开'} unCheckedChildren={'关'}  {...getFieldProps('NoticeIsShowIntroduction', { valuePropName: 'checked' }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12"><span className="color-red">*</span>浏览量</p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input type="text" className="form-control" placeholder="浏览量" {...getFieldProps('NoticePV', {
                                                validate: [{
                                                    rules: [
                                                        { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                    ], trigger: ['onBlur', 'onChange'],
                                                }]
                                            }) } />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="editor-right editor-right99 padding20 bg-colorF5">
                                <div className="editor-arrow"><img src="/content/images/editor-arrow.jpg" /></div>
                                <FormItem key="Details"
                                    hasFeedback
                                    >
                                    <Input {...inputProps} type="hidden" />

                                    <Editor {...editProps} value={_self.state["detailContent"]} id="content" height="500" />

                                </FormItem>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <a className="btn btn-block btn-success" onClick={() => { this.setState({ visibleSendMessage: true, IsPublish: true }) } } >保存并发布</a>
                        </div>
                        <div className="col-lg-1 margin-left20">
                            <a className="btn btn-block btn-info2" onClick={this.handelSubmit} >保存</a>
                        </div>
                    </div>
                </div>
                <Modal title="二维码模板示例" visible={this.state.visibleForm} onCancel={() => { this.setState({ visibleForm: false }) } } footer={[]}>
                    <div className="modal-body" style={{ overflow: "auto" }}>
                        <div className="col-sm-8">
                            <img style={{ maxWidth: 300 }} src="/Content/images/course-notice-template.jpg" />
                        </div>
                        <div className="col-sm-4">
                            宽度：640 px<br />高度：705 px<br />水平分辨率：96 dpi<br />垂直分辨率： 96 dpi<br />处理技巧：从PS导出图片时，要导出为WEB所用格式(快捷键是：ctrl+shift+alt+s) ，将会大大减少图片所占内存大小，提高用户打开速度！
                        </div>
                    </div>
                </Modal>
                <Modal visible={this.state.visibleSendMessage} title="" width={420} onOk={this.handelSubmit} onCancel={() => { this.setState({ visibleSendMessage: false }) } } maskClosable={false}>
                    <div className="row padding-left20">
                        <p className="wen-ico color3 font16">确定保存并发布该课时预告吗？</p >
                        <p className="wen-ico color9 font14 margin-top10"><Checkbox onChange={this.checkedOnChange}>通过公众号给用户发送预告消息</Checkbox></p >
                    </div>
                </Modal>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let CourseHourYuGaoPage = Form.create({})(CourseHourYuGao);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseHourYuGaoPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
