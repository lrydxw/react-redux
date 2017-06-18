import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../pub/Server';
import Config from '../../pub/Config';
import { Button, Modal, Form, Checkbox, Input, Upload, DatePicker, InputNumber, Select, message, Radio, Icon, Switch, Table, Popconfirm, TreeSelect } from 'antd';
const FormItem = Form.Item;
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import CourseApi from '../Course/CourseApi';
import CommunityApi from '../User/CommunityApi';
import ProductApi from '../Product/ProductApi';
import ProductCategoryApi from './CategoryApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ProductInfoSetStep1 extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        let formGiftElements: FormElement[] = [
            { key: "GoodsId", element: ElementEnum.Select, type: "string", label: "选择赠品", message: "请选择赠品", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "LargessNumber", element: ElementEnum.Input, type: "text", label: "赠送个数", message: "请输入赠送个数", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveInteger }, dataList: [] },

        ];
        this.initCourseInfo = this.initCourseInfo.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.submitProductInfoSetStep1 = this.submitProductInfoSetStep1.bind(this);
        this.closeGiftForm = this.closeGiftForm.bind(this);
        this.openGiftForm = this.openGiftForm.bind(this);
        this.loadGiftData = this.loadGiftData.bind(this);
        this.submitGiftForm = this.submitGiftForm.bind(this);
        this.setIsHasGiftChange = this.setIsHasGiftChange.bind(this);
        this.initCategoryTreeList = this.initCategoryTreeList.bind(this);
        this.checkedOnChange = this.checkedOnChange.bind(this);

        this.state = {
            priviewVisible: false,
            priviewImage: "",
            ProductId: LocalStorage.get('ProductId'),
            ShowImgUrlFileList: [],
            giftSetDefaultValues: {},
            giftSetData: formGiftElements,
            giftDefaultValues: {},
            visibleGiftForm: false,
            selectGiftList: [],
            giftData: [],
            CategoryTreeData: []
        };
    }
    //插入真实DOM之前被执行 
    componentWillMount() {
        this.initCategoryTreeList();
        this.loadGiftData();
        console.log("componentWillMount");
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCourseInfo();

    }
    //更新DOM之前被执行
    componentWillUpdate() {
        console.log("componentWillUpdate");
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        console.log("componentDidUpdate");
    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log("componentWillUnmount");
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        if (nextProps.nextActiveKey && this.props.activeKey == 1 && nextProps.nextActiveKey != this.props.activeKey) {
            this.submitProductInfoSetStep1(nextProps.nextActiveKey);
        }
        console.log("componentWillReceiveProps");
    }
    //初始化商品信息
    initCourseInfo() {
        var _this = this;
        var obj = obj || {};
        const { setFieldsValue } = _this.props.form;
        obj.Id = _this.state.ProductId;
        if (obj.Id.length <= 0) {
            setFieldsValue({ "IsHasGift": "false" })
            return;
        }
        ProductApi.getProductBasicInfo(obj).then(function (data) {
            if (data.IsOK) {
                var dataObj = data.Value;
                var setObj = {
                    "ProductName": dataObj.ProductName, "IsMail": String(dataObj.IsMail), "ProductImgList": dataObj.ProductImgList,
                    "IsEnablePreSale": dataObj.IsEnablePreSale, "IsHasGift": String(dataObj.IsHasGift), "IsAutoSend": dataObj.IsAutoSend,
                    "RightsDescription": dataObj.RightsDescription, "PreSaleDeliverType": String(dataObj.PreSaleDeliverType), "CategoryId": dataObj.CategoryId,
                }
                if (dataObj.GiftSendStartTime != undefined) {
                    setObj["GiftSendStartTime"] = new Date(dataObj.GiftSendStartTime);
                }
                if (dataObj.GiftSendEndTime != undefined) {
                    setObj["GiftSendEndTime"] = new Date(dataObj.GiftSendEndTime);
                }
                if (dataObj.PreSaleDeliverType == 1 && dataObj.PreSaleDeliverTime != undefined) {
                    setObj["PreSaleDeliverTime"] = new Date(dataObj.PreSaleDeliverTime);
                }
                if (dataObj.PreSaleDeliverType == 2) {
                    setObj["PreSaleDeliverDays"] = String(dataObj.PreSaleDeliverDays);
                }
                if (dataObj.ProductImgList) {
                    var permData = dataObj.ProductImgList.split(",");
                    var imgUrlFileList = [];
                    for (var i = 0; i < permData.length; i++) {
                        imgUrlFileList.push({
                            uid: dataObj.Id + i,
                            name: dataObj.ProductName,
                            status: 'done',
                            url: permData[i],
                            thumbUrl: permData[i],
                        });
                    }
                    _this.state.ShowImgUrlFileList = imgUrlFileList;
                    //$(".ant-upload-select-picture-card").css("display", !!dataObj.ProductImgList ? "none" : "");
                }
                if (dataObj.SelectGiftDataList.length > 0) {
                    _this.state.selectGiftList = dataObj.SelectGiftDataList;
                }
                setFieldsValue(setObj);
            }
            else {
                message.error(data.Message);
            }
        });
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    //关闭添加赠品窗口
    closeGiftForm() {
        this.setState({ visibleGiftForm: false });
    }
    //打开添加赠品窗口
    openGiftForm() {
        this.setState({ visibleGiftForm: true, giftDefaultValues: {} });
    }
    //加载赠品数据
    loadGiftData() {
        var _this = this;
        ProductApi.getDonationList({}).then(function (data) {

            if (data.IsOK) {
                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].GoodsName, value: String(data.Value[i].GoodsId) });
                }
                _this.state.giftData = data.Value;
                _this.state.giftSetData[0].dataList = arrayData;
            }
            else {
                message.error(data.Message);
            }
        });
    }
    //提交添加赠品表单
    submitGiftForm(obj) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var giftDataList = _this.state.giftData;
        var giftName = "";
        var index = _this.arrayIndex(giftDataList, obj);
        if (index > -1) {
            giftName = giftDataList[index].GoodsName;
        }
        var currentGiftList = _this.state.selectGiftList;
        if (_this.arrayContains(currentGiftList, obj)) {
            Modal.error({
                title: '温馨提示',
                content: '该赠品已经添加！',
            });
            return;
        }
        var giftObj = giftObj || {};
        giftObj.GoodsName = giftName;
        giftObj.LargessNumber = obj.LargessNumber;
        giftObj.GoodsId = obj.GoodsId;
        currentGiftList.push(giftObj);
        _this.setState({ selectGiftList: currentGiftList, visibleGiftForm: false });
    }
    /**
     * 删除赠品
     * @param record
     */
    deleteGiftList(record) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var selectGiftData = _this.state.selectGiftList;
        var index = _this.arrayIndex(selectGiftData, record);
        if (index > -1) {
            selectGiftData.splice(index, 1);
        }
        console.log(JSON.stringify(selectGiftData));
        _this.setState({ selectGiftList: selectGiftData });
    }
    /**
    * 判断表单是否已选
    * @param arr
    * @param obj
    */
    arrayContains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].GoodsId === obj.GoodsId) {
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
            if (arr[i].GoodsId === obj.GoodsId) {
                return i;
            }
        }
        return -1;
    }
    setIsHasGiftChange(e) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        setFieldsValue({ "IsHasGift": String(e.target.value) });
    }
    //下一步
    submitProductInfoSetStep1(step) {
        var _this = this;
        var form = _this.props.form;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log(errors);
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.ProductId;
            if (obj.IsEnablePreSale) {
                if (obj.PreSaleDeliverType == "1") {
                    if (!obj.PreSaleDeliverTime) {
                        Modal.error({
                            title: '温馨提示',
                            content: '请选择开始发货时间',
                        });
                        _this.props.cancelNextActive();
                        return;
                    }
                } else if (obj.PreSaleDeliverType == "2") {
                    if (!obj.PreSaleDeliverDays) {
                        Modal.error({
                            title: '温馨提示',
                            content: '请输入预售发货天数',
                        });
                        _this.props.cancelNextActive();
                        return;
                    }
                }
            }
            obj.GiftSendStartTime = Tool.GMTToDate(obj.GiftSendStartTime);
            obj.GiftSendEndTime = Tool.GMTToDate(obj.GiftSendEndTime);
            if (obj.GiftSendStartTime && obj.GiftSendEndTime) {
                if (Tool.compareDateTime(obj.GiftSendStartTime, obj.GiftSendEndTime)) {
                    Modal.error({
                        title: '温馨提示',
                        content: '赠品赠送开始时间不能大于结束时间',
                    });
                    _this.props.cancelNextActive();
                    return;
                }
            }
            obj.PreSaleDeliverTime = Tool.GMTToDate(obj.PreSaleDeliverTime);
            obj.SelectGiftDataList = JSON.stringify(_this.state.selectGiftList);
            obj.ProductType = 1;
            _this.props.nextTab(step, { IsInsert: obj.Id.length <= 0, First: obj });
        });
    }
    backToCourseList() {
        Tool.goPush('Course/Index');
    }
    /**
   * 获取分类树列表
    */
    initCategoryTreeList() {
        var _this = this;
        ProductCategoryApi.getProductCategoryTree({ "ParentId": "0" }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CategoryTreeData = functionData;
            }
        });
    }

    //第二步跳转
    nextStep2(id) {
        Tool.goPush('Product/ProductSetStep2');
        LocalStorage.add('ProductId', id);
    }

    //第三步跳转
    nextStep3(id) {
        Tool.goPush('Product/ProductSetStep3');
        LocalStorage.add('ProductId', id);
    }
    checkedOnChange(e) {
        var _self = this;
        var {resetFields, setFieldsValue, getFieldValue} = _self.props.form;
        var preSaleDeliverType = getFieldValue("PreSaleDeliverType") == "0" ? "" : getFieldValue("PreSaleDeliverType");
        resetFields(['PreSaleDeliverType']);
        setFieldsValue({ "IsEnablePreSale": e.target.checked, "PreSaleDeliverType": preSaleDeliverType });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;
        const productNameProps = getFieldProps('ProductName', {
            validate: [{
                rules: [
                    { required: true, message: '请输入商品名称' },
                ], trigger: ['onBlur', 'onChange'],
            },]
        });
        const productImgListProps = getFieldProps('ProductImgList', {
            validate: [{
                rules: [
                    { required: true, message: '请上传图片' },
                ],
                trigger: ['onBlur', 'onChange'],
            },],
        });
        const isHasGiftProps = getFieldProps('IsHasGift', {
            validate: [{
                rules: [
                    { required: true, message: '请选择是否含有赠品' },
                ],
                trigger: ['onBlur', 'onChange'],
            },],
        });
        const categoryIdProps = getFieldProps('CategoryId', {
            validate: [{
                rules: [
                    { required: false, message: '请选择商品分组' },
                ],
                trigger: ['onBlur', 'onChange'],
            },],
        });
        const isMailProps = getFieldProps('IsMail', {
            validate: [{
                rules: [
                    { required: true, message: '请选择商品类型' },
                ],
                trigger: ['onBlur', 'onChange'],

            },],
        });
        var IsEnablePreSale = getFieldValue('IsEnablePreSale');
        const preSaleDeliverTypeProps = getFieldProps('PreSaleDeliverType', {
            validate: [{
                rules: [
                    { required: IsEnablePreSale, message: '请选择预售发货类型' },
                ],
                trigger: ['onBlur', 'onChange'],
            },],
        });
        const preSaleDeliverTimeProps = getFieldProps('PreSaleDeliverTime', {
            validate: [{
                rules: [
                    { required: false, message: '请选择开始发货时间' },
                ],
                trigger: ['onBlur', 'onChange'],
            },],
        });
        const preSaleDeliverDaysProps = getFieldProps('PreSaleDeliverDays', {
            validate: [{
                rules: [
                    { required: false, message: '请输入预售发货天数' },
                ],
                trigger: ['onBlur', 'onChange'],
            },],
        });
        const isAutoSendProps = getFieldProps('IsAutoSend', {
            valuePropName: 'checked'
        });
        const giftSendStartTimeProps = getFieldProps('GiftSendStartTime');
        const giftSendEndTimeProps = getFieldProps('GiftSendEndTime');
        const rightsDescriptionProps = getFieldProps('RightsDescription', {
            validate: [{
                rules: [
                    { required: false, message: '请输入权益描述' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const giftProductColumns = [
            {
                title: '赠品名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                width: '60%',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '赠送个数',
                dataIndex: 'LargessNumber',
                key: 'LargessNumber',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <Popconfirm title="确定要移除该项吗？" onConfirm={() => { this.deleteGiftList(record) } }>
                            <a href="javascript:;">移除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        const showImgUploadProps = {
            multiple: true,
            action: "/UploadFile/UploadImage",
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["ShowImgUrlFileList"],
            onChange: (info) => {
                let fileList = info.fileList;
                //if (fileList.length > 1) {
                //    fileList = [info.fileList[info.fileList.length - 1]];
                //}
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
                var key = "ProductImgList";
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
                this.setState({ ShowImgUrlFileList: fileList });
                //$(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
            },
            listType: "picture-card",
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }

        };
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 7 },
        };
        var _self = this;
        return (
            <div>
                <Form horizontal>
                    <div className="row padding-top20 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>基础设置</b>
                        </div>
                        <div className="col-lg-10 col-sm-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-horizontal tasi-form" >
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>商品名称：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="ProductName"

                                                        >
                                                        <Input {...productNameProps} className="cp1 form-control" placeholder="商品名称" />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2 "><span className="color-red">*</span>商品图片：</label>
                                                <div className="col-xs-5">
                                                    <FormItem>
                                                        <Input type="hidden" className="cp1 form-control" placeholder="商品图片" {...productImgListProps} />
                                                        <div>
                                                            <Upload {...showImgUploadProps} name="upload" >
                                                                <Icon type="plus" />
                                                                <div className="ant-upload-text" >商品图片</div>
                                                            </Upload>
                                                            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                                <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                                                            </Modal>
                                                        </div>
                                                    </FormItem>
                                                    <span className="color9">&nbsp; &nbsp; &nbsp; 建议尺寸：640*640像素</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">支付成功后权益描述：</label>
                                                <div className="col-xs-5">
                                                    <FormItem>
                                                        <Input rows="6" className="cp1 form-control" type="textarea" {...rightsDescriptionProps} placeholder="请输入权益描述" />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">商品分组：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="CategoryId">
                                                        <TreeSelect
                                                            {...categoryIdProps}
                                                            treeData={this.state.CategoryTreeData}
                                                            placeholder="请选择商品分组"
                                                            treeDefaultExpandAll
                                                            />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>商品类型：</label>
                                                <div className="col-xs-4 radios">
                                                    <div className="row radios-block">
                                                        <FormItem key="isMail">
                                                            <RadioGroup  {...isMailProps}  >
                                                                <Radio value="true" >实物商品（需要物流）</Radio>
                                                                <Radio value="false" >虚拟商品（不需物流）</Radio>
                                                            </RadioGroup>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">预售设置：</label>
                                                <div className="col-xs-4 margin-top5">
                                                    <FormItem key="isEnablePreSale">
                                                        <Checkbox {...getFieldProps('IsEnablePreSale') } checked={getFieldValue("IsEnablePreSale")} onChange={this.checkedOnChange}>预售商品</Checkbox>
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ display: getFieldValue("IsEnablePreSale") ? "" : "none" }}>
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">发货时间：</label>
                                                <div className="col-xs-4 margin-top5">
                                                    <FormItem key="preSaleDeliverType">
                                                        <RadioGroup  {...preSaleDeliverTypeProps}>
                                                            <Radio value="1">
                                                                <DatePicker key="preSaleDeliverTime" showTime format="yyyy-MM-dd HH:mm:ss" {...preSaleDeliverTimeProps} placeholder="请选择时间" />
                                                                开始发货
                                                            </Radio>
                                                            <Radio value="2">付款成功
                                                                <Input {...preSaleDeliverDaysProps} placeholder="请输入天数" />
                                                                天后发货
                                                            </Radio>
                                                            <Radio value="3">不确定发货时间 </Radio>
                                                        </RadioGroup>
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>是否含有赠品：</label>
                                                <div className="col-xs-4 radios">
                                                    <div className="row radios-block">
                                                        <FormItem key="IsHasGift">
                                                            <RadioGroup  {...isHasGiftProps} onChange={this.setIsHasGiftChange} >
                                                                <Radio value="true" >是</Radio>
                                                                <Radio value="false" >否</Radio>
                                                            </RadioGroup>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: getFieldValue("IsHasGift") == "true" ? "" : "none" }}>



                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">赠品设置：</label>
                                                    <div className="col-xs-5 ">

                                                        <Table columns={giftProductColumns} dataSource={this.state.selectGiftList} pagination={false} />
                                                        <div className="margin-top5">
                                                            <a className="color-blue font12 text-left" onClick={this.openGiftForm} >+添加赠品</a>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">赠品赠送开始时间：</label>
                                                    <div className="col-xs-5">
                                                        <FormItem key="giftSendStartTime">
                                                            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...giftSendStartTimeProps} placeholder="赠品赠送开始时间" />

                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">赠品赠送结束时间：</label>
                                                    <div className="col-xs-5">
                                                        <FormItem key="giftSendEndTime">
                                                            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...giftSendEndTimeProps} placeholder="赠品赠送结束时间" />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">是否自动赠送赠品：</label>
                                                    <div className="col-xs-5">
                                                        <FormItem key="isAutoSend" >
                                                            <FormItem key="isAutoSend">
                                                                <Switch {...isAutoSendProps} checkedChildren={'是'} unCheckedChildren={'否'} />
                                                            </FormItem>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="seat-80"></div>
                    <div className="position-btm">

                        <div className="row margin0 bg-colorFC padding10 margin-top20">
                            <div className="col-lg-1 col-xs-offset-3">

                            </div>
                            <div className="col-lg-1 margin-left20">
                                <a className="btn btn-block btn-success" onClick={() => { this.submitProductInfoSetStep1(2) } } >下一步</a>
                            </div>
                            <div className="col-lg-1 margin-left20">

                            </div>
                        </div>

                    </div>
                </Form>

                <Modal title="添加赠品" visible={this.state.visibleGiftForm} onCancel={this.closeGiftForm} maskClosable={false} footer={[]} >
                    <FormTemplate formElements={this.state.giftSetData} defaultValues={this.state.giftDefaultValues} isInsert={true} onSubmit={this.submitGiftForm} onCancel={this.closeGiftForm}></FormTemplate>
                </Modal>
            </div>
        );
    }
}


let ProductInfoSetStep1Page = Form.create({})(ProductInfoSetStep1);
export { ProductInfoSetStep1Page }
