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

//api
import JointInitiatedApi from './JointInitiatedApi';
import ProductApi from '../Product/ProductApi';
import CommunityApi from '../User/CommunityApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//表单组件
const store = BaseStore({});
const RadioGroup = Radio.Group;
const Option = Select.Option;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class JointFirstIndex extends BaseContainer {
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
        this.addExtendForm = this.addExtendForm.bind(this);
        this.deleteExtendForm = this.deleteExtendForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.initJointInitiated = this.initJointInitiated.bind(this);
        this.customOnClick = this.customOnClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.loadCommunityData = this.loadCommunityData.bind(this);
        this.initExtendFormTemplateData = this.initExtendFormTemplateData.bind(this);
        this.labelOnChange = this.labelOnChange.bind(this);

        this.state = {
            extendFormConfig: [],//扩展表单模板数据
            extendFormData: [],//扩展表单数据
            ProductId: LocalStorage.get('Id'),
            IsCustom: false,//是否显示自定义控件
            ShowImgFileList: [],
            siteName: "",
            classCommunitySelectData: [],
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initJointInitiated();
        this.initExtendFormTemplateData();
        this.loadCommunityData();
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
    /**
     * 获取联合发起人详情
     */
    initJointInitiated() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        if (_this.state.ProductId) {
            JointInitiatedApi.getJointInitiatedFirst({ 'Id': _this.state.ProductId }).then(function (data) {
                if (data.IsOK) {
                    var obj = data.Value;
                    var setObj = {
                        "ProductName": obj.ProductName, "SignUpStartTime": new Date(obj.SignUpStartTime), "SignUpEndTime": new Date(obj.SignUpEndTime),
                        "Inventory": String(obj.Inventory), "IsVerify": String(obj.IsVerify), "IsUseIntegral": String(obj.IsUseIntegral),
                        "ShowImg": obj.ShowImg, "RightsDescription": obj.RightsDescription, "NoticeDescribe": obj.NoticeDescribe, "CommunityList": obj.CommunityList
                    };
                    if (obj.SignUpStartTime)
                        setObj["SignUpStartTime"] = new Date(obj.SignUpStartTime);
                    if (obj.SignUpEndTime)
                        setObj["SignUpEndTime"] = new Date(obj.SignUpEndTime);
                    if (obj.GiftSendStartTime)
                        setObj["GiftSendStartTime"] = new Date(obj.GiftSendStartTime);
                    if (obj.GiftSendEndTime)
                        setObj["GiftSendEndTime"] = new Date(obj.GiftSendEndTime);
                    if (Array.isArray(obj.ExtendForm) && obj.ExtendForm.length > 0)
                        _this.state.extendFormData = obj.ExtendForm;
                    var imgUrlFileList = [{
                        uid: obj.Id,
                        name: obj.ProductName,
                        status: 'done',
                        url: obj.ShowImg,
                        thumbUrl: obj.ShowImg,
                    }];
                    if (obj.ShowImg)
                        _this.state.ShowImgFileList = imgUrlFileList;
                    $(".ant-upload-select-picture-card").css("display", !!obj.ShowImg ? "none" : "");
                    _this.state.siteName = obj.SiteName;
                    setFieldsValue(setObj);
                }
            });
        }
    }
    /**
     * 获取社群信息
     */
    loadCommunityData() {
        var _this = this;
        CommunityApi.getCommunitySelectData({ ProductType: 3 }).then(function (data) {
            if (data.IsOK) {
                _this.setState({ classCommunitySelectData: data.Value });
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 获取扩展表单模板数据
     */
    initExtendFormTemplateData() {
        var _this = this;
        JointInitiatedApi.getExtendFormTemplateList({}).then(function (data) {
            if (data.IsOK) {
                if (Array.isArray(data.Value)) {
                    _this.state.extendFormConfig = data.Value;
                    console.log("extendFormData:" + JSON.stringify(_this.state.extendFormData));
                    if (!_this.state.ProductId || _this.state.extendFormData.length == 0) {
                        var dataArr = data.Value;
                        var functionData = [];
                        for (var i = 0; i < dataArr.length; i++) {
                            if (dataArr[i].Label == "姓名" || dataArr[i].Label == "手机号") {
                                functionData.push({ TemplateId: dataArr[i].TemplateId, Type: dataArr[i].Type, Label: dataArr[i].Label, Message: dataArr[i].Message, Required: dataArr[i].Required, DataList: dataArr[i].DataList });
                            }
                        }
                        _this.setState({ extendFormData: functionData });
                    }
                }
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 提交数据
     * @param Step 跳转步骤
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
            obj.Id = _this.state.ProductId;
            obj.SignUpStartTime = Tool.GMTToDate(obj.SignUpStartTime);
            obj.SignUpEndTime = Tool.GMTToDate(obj.SignUpEndTime);
            if (obj.SignUpStartTime && obj.SignUpEndTime) {
                if (Tool.compareDateTime(obj.SignUpStartTime, obj.SignUpEndTime)) {
                    Modal.error({
                        title: '温馨提示',
                        content: '发起开始时间不能大于结束时间',
                    });
                    _this.props.cancelNextActive();
                    return;
                }
            }
            obj.ExtendForm = _this.state.extendFormData;
            _this.props.nextTab(Step, { IsInsert: obj.Id.length <= 0, First: obj });
        });
    }
    /**
     * 添加表单
     * @param record
     */
    addExtendForm(record) {
        var _this = this;
        var functionData = _this.state.extendFormData;
        functionData.push({ TemplateId: record.TemplateId, Type: record.Type, Label: record.Label, Message: record.Message, Required: record.Required, DataList: record.DataList });
        console.log(JSON.stringify(functionData));
        _this.setState({ extendFormData: functionData });
    }
    /**
     * 删除表单
     * @param record
     */
    deleteExtendForm(record) {
        var _this = this;
        var functionData = _this.state.extendFormData;
        var index = _this.arrayIndex(functionData, record);
        if (index > -1) {
            functionData.splice(index, 1);
        }
        console.log(JSON.stringify(functionData));
        _this.setState({ extendFormData: functionData });
    }
    /**
     * 判断表单是否已选
     * @param arr
     * @param obj
     */
    arrayContains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].TemplateId === obj.TemplateId) {
                if (obj.Type == 6 || obj.Type == 7) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    /**
     * 获取数组中某个对象的index
     * @param arr
     * @param obj
     */
    arrayIndex(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].TemplateId === obj.TemplateId && arr[i].Label == obj.Label) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 表单是否必选
     * @param e
     * @param record
     */
    onChange(e, record) {
        var _this = this;
        var functionData = _this.state.extendFormData;
        var index = _this.arrayIndex(functionData, record);
        if (index > -1) {
            functionData[index].Required = e.target.checked;
        }
        console.log(JSON.stringify(functionData));
        _this.setState({ extendFormData: functionData });
    }
    /**
     * 修改Label
     * @param e
     * @param record
     */
    labelOnChange(e, record) {
        var _this = this;
        var messageStr = "请填写";
        if (record.Type == 4 || record.Type == 5) messageStr = "请选择";
        if (record.Type == 6 || record.Type == 7) messageStr = "请上传";
        var functionData = _this.state.extendFormData;
        var index = _this.arrayIndex(functionData, record);
        if (index > -1) {
            functionData[index].Label = e.target.value;
            functionData[index].Message = messageStr + e.target.value;
        }
        console.log(JSON.stringify(functionData));
        _this.setState({ extendFormData: functionData });
    }
    customOnClick() {
        var _this = this;
        var custom = _this.state.IsCustom;
        _this.setState({ IsCustom: !custom });
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    //setRightsDescription(courseName) {
    //    var _this = this;
    //    const { setFieldsValue, getFieldValue } = _this.props.form;
    //    var siteName = _this.state.siteName;
    //    var rightsDescription = "1.《" + courseName + "》联合发起人推荐位一个；\r\n";
    //    var selectGiftList = _this.state.selectGiftList;
    //    var num = 1;
    //    if (getFieldValue("IsHasGift") == "true") {
    //        for (var i = 0; i < selectGiftList.length; i++) {
    //            num++;
    //            rightsDescription += "" + num + "." + selectGiftList[i].GoodsName + "" + selectGiftList[i].LargessNumber + "个；\r\n"
    //        }
    //    }
    //    num++;
    //    rightsDescription += "" + num + "." + siteName + "学员中心永久展示位；\r\n";
    //    rightsDescription += "" + (num + 1) + ".《" + courseName + "》署名权；\r\n";
    //    rightsDescription += "" + (num + 2) + ".500个高端人脉。";
    //    setFieldsValue({ "RightsDescription": rightsDescription, "ProductName": courseName });
    //}
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;
        var self = this;
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
            fileList: this.state["ShowImgFileList"],
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
                var key = "ShowImg";
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
                this.state["ShowImgFileList"] = fileList;
                this.setState({ ShowImgFileList: fileList });
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
        var classCommunitySelectOption = this.state.classCommunitySelectData.map(function (item) {
            return (
                <Option key={"key" + item.Id} value={item.Id}>{item.CommunityName}</Option>
            );
        });
        return (
            <div>
                <Form horizontal className="form-horizontal tasi-form">
                    <div className="row padding-top0 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>基础设置</b>
                        </div>
                        <div className="col-lg-10 col-sm-12">
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>发起名称：</label>
                                    <div className="col-xs-5">
                                        <FormItem hasFeedback>
                                            <Input type="text" className="form-control" placeholder="发起名称" {...getFieldProps('ProductName', {
                                                validate: [{
                                                    rules: [
                                                        { required: true, message: '请填写发起名称' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                }]
                                            }) } />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>发起时间：</label>
                                    <div className="col-xs-5">
                                        <div className="row">
                                            <div className="col-xs-6">
                                                <FormItem>
                                                    <DatePicker placeholder="开始时间" showTime={true} format="yyyy-MM-dd HH:mm"  {...getFieldProps('SignUpStartTime', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, type: 'date', message: '请选择开始时间' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                            <div className="col-xs-6">
                                                <FormItem>
                                                    <DatePicker placeholder="结束时间" showTime={true} format="yyyy-MM-dd HH:mm"  {...getFieldProps('SignUpEndTime', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, type: 'date', message: '请选择结束时间' },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>发起封面：</label>
                                    <div className="col-xs-7">
                                        <FormItem hasFeedback style={{ marginBottom: 5 }}>
                                            <Input type="hidden" className="cp1 form-control" placeholder="发起封面" {...getFieldProps("ShowImg", {
                                                validate: [{
                                                    rules: [
                                                        { required: true, message: '请上传发起封面' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                },],
                                            }) } />
                                            <div>
                                                <Upload {...logoProps} name="upload" >
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text" >发起封面</div>
                                                </Upload>
                                                <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                                                </Modal>
                                            </div>
                                        </FormItem>
                                        <span className="color9">建议尺寸：640*640像素</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">支付成功后权益描述：</label>
                                    <div className="col-xs-5">
                                        <FormItem key="rightsDescription">
                                            <Input className="cp1 form-control" type="textarea" autosize={{ minRows: 6, maxRows: 8 }} {...getFieldProps('RightsDescription', {
                                                validate: [{
                                                    rules: [
                                                        { required: false, message: '请输入权益描述' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                }]
                                            }) } placeholder="请输入权益描述" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">通知描述：</label>
                                    <div className="col-xs-5">
                                        <FormItem key="rightsDescription">
                                            <Input className="cp1 form-control" type="text" {...getFieldProps('NoticeDescribe', {
                                                validate: [{
                                                    rules: [
                                                        { required: false, message: '请输入通知描述' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                }]
                                            }) } placeholder="请输入通知描述" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">选择微信班级：</label>
                                    <div className="col-xs-5">
                                        <FormItem key="ClassCommunityList">
                                            <Select
                                                multiple
                                                placeholder="请选择微信班级"
                                                {...getFieldProps('CommunityList', {
                                                    validate: [{
                                                        rules: [{ type: "array" }],
                                                        trigger: ['onBlur', 'onChange']
                                                    }],
                                                    valuePropName: "value"
                                                }) }
                                                >
                                                {classCommunitySelectOption}
                                            </Select>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>是否审核：</label>
                                    <div className="col-xs-5">
                                        <FormItem hasFeedback>
                                            <RadioGroup {...getFieldProps('IsVerify', {
                                                validate: [{
                                                    rules: [
                                                        { required: true, message: '请选择是否审核' },
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
                        </div>
                    </div>
                    <div className="row padding-top0 margin0">
                        <div className="col-lg-3 col-sm-12 padding-top5">
                            <b>报名信息</b>
                        </div>
                        <div className="col-lg-9 col-sm-12">
                            {this.state.extendFormData.length > 0 ?
                                this.state.extendFormData.map(function (item, index) {
                                    if (item.Type == 3) {
                                        return (<div className="form-group" key={"form_div_" + index}>
                                            <div className="row margin0">
                                                <div className="col-xs-3">
                                                    <div className="row">
                                                        <Checkbox className="col-xs-4" onChange={(e) => self.onChange(e, item)} checked={item.Required} >必填</Checkbox>
                                                        <Input type="text" className="form-control col-xs-6" defaultValue={item.Label} style={{ width: "60%" }} onChange={(e) => { self.labelOnChange(e, item) } } />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <Input type="textarea" className="form-control" placeholder={item.Message} autosize={{ minRows: 1, maxRows: 2 }} />
                                                </div>
                                                <span className="col-xs-1"><Button className="btn btn-default margin-right15" onClick={() => { self.deleteExtendForm(item) } } > 删除</Button></span>
                                            </div>
                                        </div>);
                                    } else if (item.Type == 4) {
                                        return (<div className="form-group" key={"form_div_" + index}>
                                            <div className="row margin0">
                                                <div className="col-xs-3">
                                                    <div className="row">
                                                        <Checkbox className="col-xs-4" onChange={(e) => self.onChange(e, item)} checked={item.Required} >必填</Checkbox>
                                                        <Input type="text" className="form-control col-xs-6" defaultValue={item.Label} style={{ width: "60%" }} onChange={(e) => { self.labelOnChange(e, item) } } />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <RadioGroup>
                                                        {item.DataList.map(function (children, i) {
                                                            return (<Radio key={"form_radio_" + i} value={children.Value}>{children.Label}</Radio>);
                                                        })}
                                                    </RadioGroup>
                                                </div>
                                                <span className="col-xs-1"><Button className="btn btn-default margin-right15" onClick={() => { self.deleteExtendForm(item) } } > 删除</Button></span>
                                            </div>
                                        </div>);
                                    } else if (item.Type == 5) {
                                        return (<div className="form-group" key={"form_div_" + index}>
                                            <div className="row margin0">
                                                <div className="col-xs-3">
                                                    <div className="row">
                                                        <Checkbox className="col-xs-4" onChange={(e) => self.onChange(e, item)} checked={item.Required} >必填</Checkbox>
                                                        <Input type="text" className="form-control col-xs-6" defaultValue={item.Label} style={{ width: "60%" }} onChange={(e) => { self.labelOnChange(e, item) } } />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <Select allowClear={true} placeholder={item.Message}>
                                                        {item.DataList.map(function (children, i) {
                                                            return (<Option key={"form_option_" + i} value={children.Value}>{children.Label}</Option>);
                                                        })}
                                                    </Select>
                                                </div>
                                                <span className="col-xs-1"><Button className="btn btn-default margin-right15" onClick={() => { self.deleteExtendForm(item) } } > 删除</Button></span>
                                            </div>
                                        </div>);
                                    } else {
                                        return (<div className="form-group" key={"form_div_" + index}>
                                            <div className="row margin0">
                                                <div className="col-xs-3">
                                                    {item.Type == 2 || item.Label.indexOf("姓名") >= 0 || item.Label.indexOf("手机号") >= 0 ? <div className="row">
                                                        <Checkbox className="col-xs-4" disabled={true} checked={item.Required} >必填</Checkbox>
                                                        <Input type="text" className="form-control col-xs-6" defaultValue={item.Label} disabled={true} style={{ width: "60%" }} />
                                                    </div> : <div className="row">
                                                            <Checkbox className="col-xs-4" onChange={(e) => self.onChange(e, item)} checked={item.Required} >必填</Checkbox>
                                                            <Input type="text" className="form-control col-xs-6" defaultValue={item.Label} style={{ width: "60%" }} onChange={(e) => { self.labelOnChange(e, item) } } />
                                                        </div>}
                                                </div>
                                                <div className="col-xs-3">
                                                    <Input type="text" className="form-control" placeholder={item.Message} />
                                                </div>
                                                <span className="col-xs-1">
                                                    <Button className="btn btn-default margin-right15" disabled={item.Type == 2 || item.Label.indexOf("姓名") >= 0 || item.Label.indexOf("手机号") >= 0} onClick={() => { self.deleteExtendForm(item) } } > 删除</Button>
                                                </span>
                                            </div>
                                        </div>);
                                    }
                                }) : ""}
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-1"></label>
                                    <div className="col-xs-5 padding-left0">
                                        <div className="btn btn-white btn-block font14 color-blue border-xu" onClick={this.customOnClick}>自定义</div>
                                        <div className="btn btn-white btn-block  font12 padding-top5 padding-btm10" style={{ display: this.state.IsCustom ? "" : "none", whiteSpace: "normal" }}>
                                            <p className="text-left">
                                                {this.state.extendFormConfig.length > 0 ?
                                                    this.state.extendFormConfig.map(function (item, index) {
                                                        return (<Button key={"button_" + index} className="btn btn-default margin-right15 margin-top5" disabled={self.arrayContains(self.state.extendFormData, item)} onClick={() => { self.addExtendForm(item) } } > {item.Label}</Button>);
                                                    }) : ""
                                                }
                                            </p>
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
                            <a className="btn btn-block btn-success" onClick={() => { this.submitForm(2) } }>下一步</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
let JointFirstIndexPage = Form.create({})(JointFirstIndex);
export { JointFirstIndexPage }