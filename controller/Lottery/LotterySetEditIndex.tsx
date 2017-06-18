import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Popconfirm, message, Switch, Radio, DatePicker, Select, Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
import { Editor } from '../../components/editor/editor';
//api
import ProductApi from '../Product/ProductApi';
import CourseApi from '../Course/CourseApi';
import LotteryApi from './LotteryApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class LotterySetEditIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        let formPrizeElements: FormElement[] = [
            { key: "PrizeLevel", element: ElementEnum.Radio, type: "string", label: "奖品等级", message: "请选择奖品等级", rules: { required: true, whitespace: true }, dataList: [{ "value": "1", "label": "一等奖" }, { "value": "2", "label": "二等奖" }, { "value": "3", "label": "三等奖" }] },
            { key: "GoodsId", element: ElementEnum.Select, type: "string", label: "奖品", message: "请选择奖品", showSearch: true, rules: { required: true, whitespace: true }, dataList: [] },
            { key: "PrizeCount", element: ElementEnum.Input, type: "text", label: "奖品数量", message: "请输入奖品数量", rules: { required: true, whitespace: true, validator: RegExpVerify.checkNoInteger }, dataList: [] },
        ];
        this.handleCancel = this.handleCancel.bind(this);
        this.openPrizeForm = this.openPrizeForm.bind(this);
        this.closePrizeForm = this.closePrizeForm.bind(this);
        this.submitPrizeForm = this.submitPrizeForm.bind(this);
        this.initPrizeData = this.initPrizeData.bind(this);
        this.initLotterySetData = this.initLotterySetData.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.state = {
            prizeSetPara: formPrizeElements,
            visiblePrizeForm: false,
            prizeDefaultValues: {},
            courseSelectData: [],//课程数据
            prizeTableData: [],//设置奖品数据
            prizeSelectData: [],//奖品下拉框数据
            LotteryId: LocalStorage.get('Id'),
            editNextId: -1,
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initPrizeData();
        this.initCourseData();
        this.initLotterySetData();
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
            this.submitForm(nextProps.nextActiveKey);
        }
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    /**
     * 打开添加奖品窗口
     */
    openPrizeForm() {
        this.setState({ visiblePrizeForm: true, prizeDefaultValues: {} });
    }
    /**
     * 关闭添加奖品窗口
     */
    closePrizeForm() {
        this.setState({ visiblePrizeForm: false });
    }
    /**
     * 获取签到抽奖设置信息
     */
    initLotterySetData() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var lotteryRule = "1.学员在每期课程开课前，进行签到活动。\r\n2.本次奖品由赞助商商家提供，并提供售后服务和质量保障。";
        if (_this.state.LotteryId) {
            LotteryApi.getLotterySet({ "Id": _this.state.LotteryId }).then(function (data) {
                if (data.IsOK) {
                    var obj = data.Value;
                    var lotteryTemplateFileList = [{
                        uid: obj.Id,
                        name: '模板',
                        status: 'done',
                        url: obj.LotteryTemplate,
                        thumbUrl: obj.LotteryTemplate,
                    }];
                    var setObj = {
                        "LotteryName": obj.LotteryName, "ForeignId": obj.ForeignId, "LotteryRule": obj.LotteryRule || lotteryRule, "StartTime": new Date(obj.StartTime), "EndTime": new Date(obj.EndTime),
                        "LotteryTime": new Date(obj.LotteryTime), "PrizeEndTime": new Date(obj.PrizeEndTime), "LotteryTemplate": obj.LotteryTemplate
                    };
                    if (obj.LotteryTemplate)
                        _this.state.LotteryTemplateFileList = lotteryTemplateFileList;
                    _this.state.prizeTableData = obj.PrizeList;
                    setFieldsValue(setObj);
                    $(".ant-upload-select-picture-card").css("display", !!obj.LotteryTemplate ? "none" : "");
                }
            });
        } else {
            setFieldsValue({ "LotteryRule": lotteryRule });
        }
    }
    /**
     * 获取奖品商品数据
     */
    initPrizeData() {
        var _this = this;
        ProductApi.getDonationList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    functionData.push({ key: data.Value[i].GoodsName, value: String(data.Value[i].GoodsId) });
                }
                _this.state.prizeSelectData = data.Value;
                _this.state.prizeSetPara[1].dataList = functionData;
            }
            else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 获取课程数据
     */
    initCourseData() {
        var _this = this;
        CourseApi.getCourseInfoList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ courseSelectData: functionData });

            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 提交奖品数据
     * @param obj
     */
    submitPrizeForm(obj) {
        var _this = this;
        console.log('收到表单值：', obj);

        var functionData = _this.state.prizeTableData;
        var prizeDataList = _this.state.prizeSelectData;
        var prizeName = "";

        var index = _this.arrayIndex(prizeDataList, obj);
        if (index > -1) {
            prizeName = prizeDataList[index].GoodsName;
        }
        if (_this.arrayContainsPrizeLevel(functionData, obj)) {
            Modal.error({
                title: '温馨提示',
                content: '该等级已经添加，换个奖品等级吧！',
            });
            return;
        }
        if (_this.arrayContainsGoodsId(functionData, obj)) {
            Modal.error({
                title: '温馨提示',
                content: '该奖品已经添加！',
            });
            return;
        }
        functionData.push({ PrizeLevel: obj.PrizeLevel, GoodsId: obj.GoodsId, GoodsName: prizeName, PrizeCount: obj.PrizeCount });
        console.log(JSON.stringify(functionData));
        _this.setState({ prizeTableData: functionData, visiblePrizeForm: false });
    }
    /**
     * 移除奖品
     * @param record
     */
    deletePrizeList(record) {
        var _this = this;
        if (_this.state.LotteryIsPublish) {
            Modal.error({
                title: '温馨提示',
                content: '已经是发布状态了，怎么可以移除奖品！',
            });
            return;
        }
        var functionData = _this.state.prizeTableData;
        var index = _this.arrayIndex(functionData, record);
        if (index > -1) {
            functionData.splice(index, 1);
        }
        console.log(JSON.stringify(functionData));
        _this.setState({ prizeTableData: functionData });
    }
    /**
     * 提交签到抽奖数据
     */
    submitForm(Step) {
        var _this = this;
        var form = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.LotteryId;
            obj.LotteryType = 1;
            obj.StartTime = Tool.GMTToDate(obj.StartTime);
            obj.EndTime = Tool.GMTToDate(obj.EndTime);
            if (obj.StartTime && obj.EndTime) {
                if (Tool.compareDateTime(obj.StartTime, obj.EndTime)) {
                    Modal.error({
                        title: '温馨提示',
                        content: '签到开始时间不能大于结束时间',
                    });
                    _this.props.cancelNextActive();
                    return;
                }
            }
            obj.LotteryTime = Tool.GMTToDate(obj.LotteryTime);
            obj.PrizeEndTime = Tool.GMTToDate(obj.PrizeEndTime);
            obj.PrizeList = _this.state.prizeTableData;
            console.log(obj);
            _this.props.nextTab(Step, { IsInsert: obj.Id.length <= 0, First: obj });
        });
    }
    /**
    * 获取数组中某个对象的index
    * @param arr
    * @param obj
    */
    arrayIndex(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].GoodsId === obj.GoodsId) {
                return i;
            }
        }
        return -1;
    }
    /**
    * 判断奖品是否已添加
    * @param arr
    * @param obj
    */
    arrayContainsGoodsId(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].GoodsId === obj.GoodsId) {
                return true;
            }
        }
        return false;
    }
    /**
     * 判断奖项是否已添加
     * @param arr
     * @param obj
     */
    arrayContainsPrizeLevel(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].PrizeLevel === obj.PrizeLevel) {
                return true;
            }
        }
        return false;
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const templateProps = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            data: {
                type: 'course',
                format: 'large'
            },
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["LotteryTemplateFileList"],
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
                var key = "LotteryTemplate";
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
                this.state["LotteryTemplateFileList"] = fileList;
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
        const prizeGoodsColumns = [
            {
                title: '奖品等级',
                dataIndex: 'PrizeLevel',
                key: 'PrizeLevel',
                render: (text) => <span> {text == 1 ? "一等奖" : (text == 2 ? "二等奖" : "三等奖")}</span>,
            },
            {
                title: '奖品名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                width: '60%',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '奖品数量',
                dataIndex: 'PrizeCount',
                key: 'PrizeCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <Popconfirm title="确定要移除该项吗？" onConfirm={() => { this.deletePrizeList(record) } }>
                            <a href="javascript:;">移除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        var courseSelectItems = this.state.courseSelectData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={item.Id}>{item.ProductName}</Option>
            );
        });
        const lotteryNameProps = getFieldProps('LotteryName', {
            validate: [{
                rules: [
                    { required: true, message: '请填写标题' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const foreignIdProps = getFieldProps('ForeignId', {
            validate: [{
                rules: [
                    { required: true, message: '请选择课程' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const lotteryRuleProps = getFieldProps('LotteryRule', {
            validate: [{
                rules: [
                    { required: true, message: '请填写签到抽奖规则' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const startTimeProps = getFieldProps('StartTime', {
            validate: [{
                rules: [
                    { required: true, type: 'date', message: '请填写签到开始时间' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const endTimeProps = getFieldProps('EndTime', {
            validate: [{
                rules: [
                    { required: true, type: 'date', message: '请填写签到结束时间' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const lotteryTimeProps = getFieldProps('LotteryTime', {
            validate: [{
                rules: [
                    { required: true, type: 'date', message: '请填写开奖时间' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const prizeEndTimeProps = getFieldProps('PrizeEndTime', {
            validate: [{
                rules: [
                    { required: true, type: 'date', message: '请填写领奖截止时间' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const lotteryTemplateProps = getFieldProps('LotteryTemplate', {
            validate: [{
                rules: [
                    { required: false, message: '请上传签到抽奖模板' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const locale = { emptyText: '暂无奖品' };
        return (
            <div>
                <div className="row padding-top20 margin0">
                    <Form horizontal>
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>基础设置</b>
                        </div>
                        <div className="col-lg-10 col-sm-12 padding-top20">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-horizontal tasi-form" >
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>签到标题：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <Input type="text" className="cp1 form-control" placeholder="签到标题" {...lotteryNameProps} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>选择课程：</label>
                                                <div className="col-xs-5">
                                                    <FormItem>
                                                        <Select allowClear={true} placeholder="选择课程" {...foreignIdProps}>
                                                            {courseSelectItems}
                                                        </Select>
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>签到规则：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <Input type="textarea" className="cp1 form-control" autosize={{ minRows: 6, maxRows: 8 }} placeholder="签到规则" {...lotteryRuleProps} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>签到开始时间：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="签到开始时间" {...startTimeProps} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>签到结束时间：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="签到结束时间" {...endTimeProps} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>开奖时间：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="开奖时间" {...lotteryTimeProps} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>领奖截止时间：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="领奖截止时间" {...prizeEndTimeProps} />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">中奖页面模板：</label>
                                                <div className="col-xs-5">
                                                    <FormItem hasFeedback>
                                                        <Input type="hidden" className="cp1 form-control" placeholder="中奖页面模板" {...lotteryTemplateProps} />
                                                        <div>
                                                            <Upload {...templateProps} name="upload" >
                                                                <Icon type="plus" />
                                                                <div className="ant-upload-text" >中奖页面模板</div>
                                                            </Upload>
                                                            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                                <img alt="example" src={this.state.priviewImage} width={"100%"} />
                                                            </Modal>
                                                        </div>
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>奖品设置</b>
                        </div>
                        <div className="col-lg-10 col-sm-12 padding-top20">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-horizontal tasi-form" >
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>设置奖品：</label>
                                                <div className="col-xs-5">
                                                    <Table columns={prizeGoodsColumns} dataSource={this.state.prizeTableData} locale={locale} pagination={false} />
                                                    <div className="margin-top5">
                                                        <a className="color-blue font12 text-left" onClick={this.openPrizeForm} >+添加奖品</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <a className="btn btn-block btn-success" onClick={() => { this.submitForm(2) } }>下一步</a>
                        </div>
                    </div>
                </div>
                <Modal title="添加奖品" visible={this.state.visiblePrizeForm} onCancel={this.closePrizeForm} maskClosable={false} footer={[]} >
                    <FormTemplate formElements={this.state.prizeSetPara} defaultValues={this.state.prizeDefaultValues} isInsert={true} onSubmit={this.submitPrizeForm} onCancel={this.closePrizeForm}></FormTemplate>
                </Modal>
            </div>
        );
    }
}

let LotterySetEditIndexPage = Form.create({})(LotterySetEditIndex);
export { LotterySetEditIndexPage }
