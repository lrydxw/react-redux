import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Row, Col, Modal, Form, Input, Button, Popconfirm, message, Upload, Icon, Checkbox } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import { Editor } from '../../components/editor/editor';
//添加、修改表单
import RegExpVerify from '../../pub/RegExpVerify';
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import ProductApi from '../Product/ProductApi';
import SystemBasicInfoApi from '../manager/SystemBasicInfo/Api';
const store = BaseStore({});
const CheckboxGroup = Checkbox.Group;
const checkOptions = [
    { label: '正品保证', value: '1' },
    { label: '极速发货', value: '2' },
    { label: '安全交易', value: '3' },
    { label: '企业认证', value: '4' },
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ProductSetStep3 extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.loadProductInfoDetail = this.loadProductInfoDetail.bind(this);
        this.handelSubmit = this.handelSubmit.bind(this);
        this.previousStep1 = this.previousStep1.bind(this);
        this.previousStep2 = this.previousStep2.bind(this);
        this.loadSystemBasicInfo = this.loadSystemBasicInfo.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.checkOnChange = this.checkOnChange.bind(this);
        
        this.state = {
            detailContent: "请输入详情",
            ProductId: -1,
            editNextId: -1,
            siteName: "",
            logoPath: "",
            visibleForm: false,
            MonitorList: [],
            IsEnablePreSale: false,//是否预售
            ShowImg: "", //商品图片
            Goods: {}
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadProductInfoDetail();
        this.loadSystemBasicInfo();
    }
    //更新DOM之前被执行
    componentWillUpdate() {

    }
    //更新DOM之后被执行
    componentDidUpdate() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        if (_this.state.ProductId !== _this.state.editNextId) {
            _this.state.editNextId = _this.state.ProductId;
            ProductApi.getProductDetailInfo({ Id: _this.state.ProductId }).then(function (data) {
                if (data.IsOK) {
                    var obj = data.Value;
                    var imgUrlFileList = [{
                        uid: _this.state.ProductId,
                        name: obj.ShareTitle,
                        status: 'done',
                        url: obj.ShareImg,
                        thumbUrl: obj.ShareImg,
                    }];
                    if (obj.ShareImg)
                        _this.state.ShareImgFileList = imgUrlFileList;
                    _this.state["detailContent"] = obj.Details;
                    _this.state.IsEnablePreSale = obj.IsEnablePreSale;
                    _this.state.ShowImg = obj.ShowImg;
                    _this.state.Goods = obj.Goods;
                    var setObj = {
                        "Details": obj.Details, "ShareTitle": obj.ShareTitle, "ShareContent": obj.ShareContent,
                        "ShareImg": obj.ShareImg, "SaleCountBaseCount": String(obj.SaleCountBaseCount)
                    };
                    if (obj.MonitorList) {
                        setObj["MonitorList"] = obj.MonitorList;
                        _this.state.MonitorList = obj.MonitorList;
                    }
                    setFieldsValue(setObj);
                    $(".ant-upload-select-picture-card").css("display", !!obj.ShareImg ? "none" : "");
                } else {
                    message.error(data.Message);
                }
            });
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
    loadSystemBasicInfo() {
        var _this = this;
        SystemBasicInfoApi.getAppBasciInfo().then(function (data) {
            if (data.IsOK) {
                _this.state.siteName = data.Value.SiteName;
                _this.state.logoPath = data.Value.LogoPath;
            } else {
                message.error(data.Message);
            }
        });
    }
    loadProductInfoDetail() {
        var _this = this;
        _this.state.editNextId = -1;
        _this.state.ProductId = LocalStorage.get('ProductId');
    }

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
            obj.Id = _this.state.ProductId;
            obj.IsPublish = isPublish;
            console.log(obj);
            if (obj.MonitorList && obj.MonitorList.length > 3) {
                Modal.error({
                    title: '温馨提示',
                    content: '安全标志最多可选三个！',
                });
                return;
            }
            _this.props.nextTab(step, { Third: obj });
        });
    }
    backToProductList() {
        Tool.goPush('Product/ProductList');
    }
    previousStep2() {
        var _this = this;
        Tool.goPush('Product/ProductSetStep2');
        LocalStorage.add('ProductId', _this.state.ProductId);
    }
    previousStep1() {
        var _this = this;
        Tool.goPush('Product/ProductSetStep1');
        LocalStorage.add('ProductId', _this.state.ProductId);
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    checkOnChange(checkedValues) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        _this.state.MonitorList = checkedValues;
        setFieldsValue({ "MonitorList": checkedValues });
    }
    arrayIndex(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].value === obj) {
                return i;
            }
        }
        return -1;
    }
   
    render() {
        var _self = this;
        const { getFieldProps, getFieldValue, resetFields, setFieldsValue } = _self.props.form;
        const editProps = {
            callbackContentChange: (value) => {
                if (_self.state["detailContent"] !== value) {
                    _self.state["detailContent"] = value;
                    setFieldsValue({ "Details": value });
                }
            }
        }
        const shareTitleProps = getFieldProps("ShareTitle", {});
        const shareContentProps = getFieldProps("ShareContent", {});
        const inputProps = getFieldProps("Details", {
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
            fileList: this.state["ShareImgFileList"],
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
                var key = "ShareImg";
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
                this.setState({ ShareImgFileList: fileList });
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
        return (
            <div>
                <div className="editor-box99 padding-top20 padding-btm20 clearfix">
                    <div className="pull-left editor-left">
                        <div className="editor-left-title">
                            <p className="text-center">{_self.state.siteName}</p>
                        </div>
                        <div className="editor-left-main3 editor-left-main2-tete">
                            <div className="productDetail">
                                <div className="detailWrapper">
                                    <img src={_self.props.showImg} width="100%" />
                                </div>
                            </div>
                            <div className="detailout">
                                <h2 className="detailTitle">{_self.state.IsEnablePreSale ? <span className="fontColordanger prevesell">预售</span> : ""}{_self.state.Goods && _self.state.Goods.Name}</h2>
                                <p className="fontColordanger detailPrice">¥{_self.props.salePrice == 0 ? (_self.state.Goods && _self.state.Goods.SalePrice) : _self.props.salePrice}<span>原价：{_self.props.marketPrice == 0 ? (_self.state.Goods && _self.state.Goods.MarketPrice) : _self.props.marketPrice}</span></p>
                                <ul className="clearfix detailList">
                                    <li className="detailItem">剩余：{_self.state.Goods? _self.state.Goods.Inventory:0}</li>
                                    <li className="detailItem">销量：{getFieldValue("SaleCountBaseCount")}</li>
                                </ul>
                            </div>
                            <div className="trueout">
                                <ul className="clearfix truelist">
                                    {_self.state.MonitorList && _self.state.MonitorList.length > 0 ? _self.state.MonitorList.map(function (item, i) {
                                        return (<li key={"ul_li_" + i}>{checkOptions[_self.arrayIndex(checkOptions, item)].label}</li>)
                                    }) : ""}
                                </ul>

                            </div>
                            <div className="clearfix tempTitleicon margin-top15">
                                <h3 className="titletip chooseHead">选择型号</h3>
                                <span className="alinkFont morehref"><i className="fa fa-angle-right itemsRightIcon"></i></span>
                            </div>
                            <div className="shopCare">
                                <div className="carelogo">
                                    <span className="careImage"><img src={_self.state.logoPath} /></span>
                                    <p className="caretitle">{_self.state.siteName}</p>
                                    <p className="carewe">微信认证</p>
                                </div>
                                <div className="clearfix caregroup">
                                    <div className="acareout"><a className="btnsmBgWhite careall"><span>全部商品</span></a></div>
                                    <div className="acareout"><a className="btnsmBgWhite enterCenter"><span>学员中心</span></a></div>
                                </div>
                            </div>
                            <div className="imageDetail">
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
                                        <FormItem key="ShareTitle" hasFeedback>
                                            <Input  {...shareTitleProps} className="form-control" placeholder="分享标题" />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12 margin-top8">分享简介(选填，微信分享给好友时会显示这里的文案) </p>
                                    <div className="col-xs-12">
                                        <FormItem key="ShareContent" hasFeedback>
                                            <Input  {...shareContentProps} className="form-control" placeholder="分享简介" />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12">分享二维码(宽度：640 px，高度：705px) <a onClick={() => { this.setState({ visibleForm: true }) } }>二维码模板示例</a> </p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input type="hidden" className="form-control" placeholder="分享二维码" {...getFieldProps("ShareImg", {
                                                validate: [{
                                                    rules: [
                                                        { required: false, message: '请上传分享二维码' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                },],
                                            }) } />
                                            <div>
                                                <Upload {...imageProps} name="upload" >
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text" >分享二维码</div>
                                                </Upload>
                                                <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                                                </Modal>
                                            </div>
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12 margin-top8">安全标志(最多可选三个) </p>
                                    <div className="col-xs-12">
                                        <FormItem>
                                            <CheckboxGroup options={checkOptions} {...getFieldProps("MonitorList", {
                                                validate: [{
                                                    rules: [
                                                        { required: false, type: "array", message: '请选择安全标志' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                },],
                                            }) } onChange={this.checkOnChange} />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row margin0">
                                    <p className="col-xs-12 font12 margin-top8">销售量</p>
                                    <div className="col-xs-12">
                                        <FormItem hasFeedback>
                                            <Input {...getFieldProps("SaleCountBaseCount", {
                                                validate: [{
                                                    rules: [
                                                        { required: false, message: '请填写销售量' }, { validator: RegExpVerify.checkPositiveInteger }
                                                    ], trigger: ['onBlur', 'onChange'],
                                                },],
                                            }) } />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="editor-right editor-right99 padding20 bg-colorF5">
                                <div className="editor-arrow"><img src="/content/images/editor-arrow.jpg" /></div>
                                <FormItem key="Details" hasFeedback>
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
                        <div className="col-lg-1 col-xs-offset-3">
                        </div>
                        <div className="col-lg-1 margin-left16">
                            <a className="btn btn-block  btn-info2" onClick={() => { this.handelSubmit(true, 2) } } >上一步</a>
                        </div>
                        <div className="col-lg-1 margin-left20">
                            <a className="btn btn-block btn-success" onClick={() => { this.handelSubmit(false, -1) } } >保存</a>
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
            </div>
        );
    }
}


let ProductSetStep3Page = Form.create({})(ProductSetStep3);
export { ProductSetStep3Page }
