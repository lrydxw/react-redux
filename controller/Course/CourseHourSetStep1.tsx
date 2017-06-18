import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Popconfirm, message, Switch, Radio, DatePicker, Select } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseHourApi from './CourseHourApi';
import LecturerApi from './LecturerApi';
import CourseChapterApi from './CourseChapterApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;
//表单组件
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseHourSetStep1 extends BaseContainer {
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
        this.handleCancel = this.handleCancel.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.initLecturerList = this.initLecturerList.bind(this);
        this.initCourseChapterList = this.initCourseChapterList.bind(this);
        this.initCourseHourData = this.initCourseHourData.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.openLecturerForm = this.openLecturerForm.bind(this);
        this.openChapterForm = this.openChapterForm.bind(this);
        this.submitLecturerForm = this.submitLecturerForm.bind(this);
        this.submitChapterForm = this.submitChapterForm.bind(this);
        this.showLastPage = this.showLastPage.bind(this);
        //讲师表单
        let lecturerElements: FormElement[] = [
            { key: "LecturerName", element: ElementEnum.Input, type: "string", label: "讲师姓名", message: "请填写讲师姓名", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "LecturerTitle", element: ElementEnum.Input, type: "string", label: "讲师称谓", message: "请填写讲师称谓", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "WeChatAccount", element: ElementEnum.Input, type: "string", label: "微信号", message: "请填写讲师微信号", defaultValue: "", rules: { required: false, whitespace: true }, dataList: [] },
            { key: "Mobile", element: ElementEnum.Input, type: "string", label: "手机号", message: "请填写讲师手机号", defaultValue: "", rules: { required: false, whitespace: true, validator: RegExpVerify.checkMobile }, dataList: [] },
            { key: "HeadImgUrl", element: ElementEnum.Upload, type: "array", label: "头像", config: {}, message: "请上传头像", rules: { required: true }, dataList: [] },
            { key: "Description", element: ElementEnum.Textarea, type: "string", label: "讲师描述", message: "请填写讲师描述", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
        ];
        //章节表单
        let chapterElements: FormElement[] = [
            { key: "ChapterTitle", element: ElementEnum.Input, type: "string", label: "章节名称", message: "请填写章节名称", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "OrderIndex", element: ElementEnum.Input, type: "string", label: "章节排序", message: "请输入1-100之间的整数。", defaultValue: "0", rules: { required: true, whitespace: false, validator: RegExpVerify.checkPositiveInteger }, dataList: [] },
        ];

        this.state = {
            LecturerSelectData: [],//讲师下拉数据
            CourseChapterSelectData: [],//章节下拉数据
            CourseHourId: LocalStorage.get('Id'),
            CourseProductId: LocalStorage.get('CourseProductId'),
            ShowImgUrlFileList: [],
            visibleLecturerForm: false,//是否显示讲师添加弹窗
            visibleChapterForm: false,//是否显示章节添加弹窗
            LecturerPara: lecturerElements,//讲师表单
            ChapterPara: chapterElements,//章节表单
            LecturerDefaultValues: {},
            ChapterDefaultValues: {},
            CourseType: 4,//课时类型 默认视频
            IsPurchase: false,//是否购买
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initLecturerList();
        this.initCourseChapterList();
        this.initCourseHourData();
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
        if (nextProps.nextActiveKey && this.props.activeKey == 1 && nextProps.nextActiveKey != this.props.activeKey) {
            this.submitForm();
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
                    var imgUrlFileList = [{
                        uid: obj.Id,
                        name: obj.CourseTitle,
                        status: 'done',
                        url: obj.ShowImgUrl,
                        thumbUrl: obj.ShowImgUrl,
                    }];
                    var setObj = {
                        "CourseType": String(obj.CourseType), "CourseTitle": obj.CourseTitle, "ShowImgUrl": obj.ShowImgUrl, "CourseIntroduction": obj.CourseIntroduction, "LecturerId": obj.LecturerId,
                        "ChapterId": obj.ChapterId, "IsAudition": String(obj.IsAudition), "IsTop": String(obj.IsTop), "PV": String(obj.PV), "IsShowCourseNo": String(obj.IsShowCourseNo)
                    };
                    if (obj.StartTime)
                        setObj["StartTime"] = new Date(obj.StartTime);
                    if (obj.ShowImgUrl)
                        _this.setState({ ShowImgUrlFileList: imgUrlFileList });
                    $(".ant-upload-select-picture-card").css("display", !!obj.ShowImgUrl ? "none" : "");
                    _this.state.CourseHourId = obj.Id;
                    _this.state.CourseProductId = obj.CourseProductId;
                    _this.state.CourseTitle = obj.CourseTitle;
                    _this.state.IsPurchase = obj.IsPurchase;
                    setFieldsValue(setObj);
                }
            });
        }
        _this.state.LecturerPara[4].config = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            defaultFileList: [],
        };
    }
    /**
     * 讲师数据
     */
    initLecturerList() {
        var _this = this;
        LecturerApi.getSelectLecturerList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ LecturerSelectData: functionData });
            }
        });
    }
    /**
     * 章节数据
     */
    initCourseChapterList() {
        var _this = this;
        CourseChapterApi.getCourseChapterSelectList({ 'CourseProductId': _this.state.CourseProductId }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ CourseChapterSelectData: functionData });
            }
        });
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    /**
     * 提交数据
     * @param step 跳转步骤
     */
    submitForm() {
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
            obj.CourseProductId = _this.state.CourseProductId;
            obj.StartTime = Tool.GMTToDate(obj.StartTime);
            obj.CourseType = parseInt(obj.CourseType);
            _this.state.CourseType = parseInt(obj.CourseType);
            console.log(obj);
            //var step = -1;
            //if (_this.state.CourseType == 1 || _this.state.CourseType == 8) {
            //    step = 2;
            //} else {
            //    step = 3;
            //}
            _this.props.nextTab(2, { IsInsert: obj.Id.length <= 0, First: obj });
        });
    }
    /**
     * 重置
     */
    cancelForm() {
        this.props.form.resetFields();
        return false;
    }
    /**
     * 关闭弹窗
     */
    closeForm() {
        this.setState({ visibleLecturerForm: false, visibleChapterForm: false });
    }
    /**
     * 打开讲师弹窗
     */
    openLecturerForm() {
        this.setState({ visibleLecturerForm: true, visibleChapterForm: false, LecturerDefaultValues: {} });
        return false;
    }
    /**
     * 打开章节弹窗
     */
    openChapterForm() {
        this.setState({ visibleLecturerForm: false, visibleChapterForm: true, ChapterDefaultValues: {} });
        return false;
    }
    /**
     * 提交讲师表单
     */
    submitLecturerForm(obj) {
        var _this = this;
        console.log('收到表单值：', obj);
        LecturerApi.insertLecturer(obj).then(function (data) {
            if (data.IsOK) {
                _this.setState({ visibleLecturerForm: false, visibleChapterForm: false });
                _this.initLecturerList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 提交章节表单
     */
    submitChapterForm(obj) {
        var _this = this;
        obj.CourseProductId = _this.state.CourseProductId;
        console.log('收到表单值：', obj);
        CourseChapterApi.insertCourseChapter(obj).then(function (data) {
            if (data.IsOK) {
                _this.setState({ visibleLecturerForm: false, visibleChapterForm: false });
                _this.initCourseChapterList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 最后一步
     * @param Id
     */
    showLastPage(Id) {
        var _this = this;
        LocalStorage.add('Id', Id);
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
        if (_this.state.CourseType == 1 || _this.state.CourseType == 8) {
            Tool.goPush('Course/CourseHourThirdDetail');
        } else {
            Tool.goPush('Course/CourseHourThird');
        }
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 7 },
        };
        const logoProps = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            data: {
                type: 'course',
                format: 'large'
            },
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["ShowImgUrlFileList"],
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
                var key = "ShowImgUrl";
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
                this.state["ShowImgUrlFileList"] = fileList;
                this.setState(this.state);
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
        var lecturerSelectItems = this.state.LecturerSelectData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={item.Id}>{item.LecturerName}</Option>
            );
        });
        var chapterSelectItems = this.state.CourseChapterSelectData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={item.Id}>{item.ChapterTitle}</Option>
            );
        });
        return (
            <div>

                <div className="row padding-top20 margin0">
                    <div className="col-lg-2 col-sm-12 padding-top5">
                        <b>基础设置</b>
                    </div>
                    <div className="col-lg-10 col-sm-12">
                        <div className="row">
                            <div className="col-lg-12">
                                <Form horizontal>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1"><span className="color-red">*</span>课时名：</label>
                                            <div className="col-xs-7">
                                                <FormItem hasFeedback>
                                                    <Input type="text" className="cp1 form-control" placeholder="课时名" {...getFieldProps('CourseTitle', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, message: '请填写课时名' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1"><span className="color-red">*</span>课时形式：</label>
                                            <div className="col-xs-7">
                                                <FormItem>
                                                    <Select disabled={this.state.IsPurchase} allowClear={true} placeholder="课时形式" {...getFieldProps('CourseType', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, message: '请选择课时形式' },
                                                            ], trigger: ['onChange'],
                                                        }]
                                                    }) } >
                                                        <Option value="4">视频课程</Option>
                                                        <Option value="2">音频课程</Option>
                                                        <Option value="1">图文课程</Option>
                                                        <Option value="8">微信群</Option>
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1"><span className="color-red">*</span>课时封面：</label>
                                            <div className="col-xs-7">
                                                <FormItem hasFeedback>
                                                    <Input type="hidden" className="cp1 form-control" placeholder="课时封面" {...getFieldProps("ShowImgUrl", {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, message: '请上传课时封面' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        },],
                                                    }) } />
                                                    <div>
                                                        <Upload {...logoProps} name="upload" >
                                                            <Icon type="plus" />
                                                            <div className="ant-upload-text" >课时封面</div>
                                                        </Upload>
                                                        <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                            <img alt="example" src={this.state.priviewImage} width={"100%"} />
                                                        </Modal>
                                                    </div>
                                                </FormItem>
                                                <span className="color9">建议尺寸：640*360像素</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1"><span className="color-red">*</span>课时简介：</label>
                                            <div className="col-xs-7">
                                                <FormItem hasFeedback>
                                                    <Input type="textarea" className="cp1 form-control" placeholder="课时简介" autosize={{ minRows: 4, maxRows: 6 }} {...getFieldProps('CourseIntroduction', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, message: '请填写课时简介' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1">选择讲师：</label>
                                            <div className="col-xs-3">
                                                <FormItem>
                                                    <Select disabled={this.state.IsPurchase} allowClear={true} showSearch={true} optionFilterProp="children" placeholder="讲师" notFoundContent="请先添加讲师" {...getFieldProps('LecturerId', {
                                                        validate: [{
                                                            rules: [
                                                                { required: false, message: '请选择讲师' },
                                                            ], trigger: ['onChange'],
                                                        }]
                                                    }) } >
                                                        {lecturerSelectItems}
                                                    </Select>
                                                </FormItem>
                                            </div>
                                            <div className="col-xs-3 margin-top5">
                                                <a className="color-blue font12" href="javascript:;" onClick={this.openLecturerForm}>新增讲师</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1">播课时间：</label>
                                            <div className="col-xs-2">
                                                <FormItem>
                                                    <DatePicker showTime={true} format="yyyy-MM-dd HH:mm" placeholder="播课时间"  {...getFieldProps('StartTime', {
                                                        validate: [{
                                                            rules: [
                                                                { required: false, type: 'date', message: '请选择播课时间' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1">选择章节：</label>
                                            <div className="col-xs-2">
                                                <FormItem>
                                                    <Select allowClear={true} placeholder="章节" notFoundContent="请先添加章节" {...getFieldProps('ChapterId', {
                                                        validate: [{
                                                            rules: [
                                                                { required: false, message: '请选择章节' },
                                                            ], trigger: ['onChange'],
                                                        }]
                                                    }) } >
                                                        {chapterSelectItems}
                                                    </Select>
                                                </FormItem>
                                            </div>
                                            <div className="col-xs-3 margin-top5">
                                                <a className="color-blue font12" href="javascript:;" onClick={this.openChapterForm}>增加章节</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1">试听设置：</label>
                                            <div className="col-xs-6">
                                                <FormItem hasFeedback>
                                                    <RadioGroup {...getFieldProps('IsAudition', {
                                                        validate: [{
                                                            rules: [
                                                                { required: false, message: '请选择试听设置' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } >
                                                        <Radio key="IsAudition_1" value="true">允许试听</Radio>
                                                        <Radio key="IsAudition_0" value="false">不允许试听</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ display: "none" }}>
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1">是否置顶：</label>
                                            <div className="col-xs-6">
                                                <FormItem hasFeedback>
                                                    <RadioGroup {...getFieldProps('IsTop', {
                                                        validate: [{
                                                            rules: [
                                                                { required: false, message: '请选择是否置顶' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) }>
                                                        <Radio key="IsTop_1" value="true">是</Radio>
                                                        <Radio key="IsTop_0" value="false">否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1"><span className="color-red">*</span>显示期号：</label>
                                            <div className="col-xs-6">
                                                <FormItem hasFeedback>
                                                    <RadioGroup {...getFieldProps('IsShowCourseNo', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, message: '请选择是否显示期号' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) }>
                                                        <Radio key="IsTop_1" value="true">是</Radio>
                                                        <Radio key="IsTop_0" value="false">否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-1"><span className="color-red">*</span>浏览量：</label>
                                            <div className="col-xs-2">
                                                <FormItem hasFeedback>
                                                    <Input type="text" className="cp1 form-control" placeholder="浏览量" {...getFieldProps('PV', {
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
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <a className="btn btn-block btn-success" onClick={this.submitForm}>下一步</a>
                        </div>
                    </div>
                </div>

                <Modal title="新增讲师" visible={this.state.visibleLecturerForm} onCancel={this.closeForm} footer={[]} maskClosable={false}>
                    <FormTemplate formElements={this.state.LecturerPara} defaultValues={this.state.LecturerDefaultValues} isInsert={true} onSubmit={this.submitLecturerForm} onCancel={this.closeForm}></FormTemplate>
                </Modal>
                <Modal title="增加章节" visible={this.state.visibleChapterForm} onCancel={this.closeForm} footer={[]} maskClosable={false}>
                    <FormTemplate formElements={this.state.ChapterPara} defaultValues={this.state.ChapterDefaultValues} isInsert={true} onSubmit={this.submitChapterForm} onCancel={this.closeForm}></FormTemplate>
                </Modal>
            </div>
        );
    }
}



let CourseHourSetStep1Page = Form.create({})(CourseHourSetStep1);
export { CourseHourSetStep1Page }
