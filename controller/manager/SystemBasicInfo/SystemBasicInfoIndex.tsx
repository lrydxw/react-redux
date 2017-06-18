import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Tool from '../../../pub/Tool';
import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, Upload, Tabs, Radio } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
//api
import Api from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import RegExpVerify from '../../../pub/RegExpVerify';
const store = BaseStore({});
const confirm = Modal.confirm;

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class SystemBasicInfoIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.inputNumberChange = this.inputNumberChange.bind(this);

        this.state = {
            priviewVisible: false,
            priviewImage: "",
            ExpectedToAvailableIncomeDays:0
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {

    }


    //插入真实DOM之后被执行
    componentDidMount() {

        const { setFieldsValue } = this.props.form;
        var _this = this;
        Api.getAppBasciInfo().then(function (data) {
            if (data.IsOK) {
                setFieldsValue({
                    "SiteName": data.Value.SiteName, "LogoPath": data.Value.LogoPath, "CustomerServicePhone": data.Value.CustomerServicePhone,
                    "DetailAddress": data.Value.DetailAddress, "IsShowAgreement": String(data.Value.IsShowAgreement), "Introduction": data.Value.Introduction,
                    "RefundDays": String(data.Value.RefundDays), "MerchantMobile": data.Value.MerchantMobile, "SubscribeNotice": data.Value.SubscribeNotice, "IsShowBottomRecommend": String(data.Value.IsShowBottomRecommend),
                    "IsEnableInvoice": String(data.Value.IsEnableInvoice)
                });
                _this.state.ExpectedToAvailableIncomeDays = data.Value.ExpectedToAvailableIncomeDays;
                var logoFile = [{
                    uid: -1,
                    name: data.Value.LogoPath,
                    status: 'done',
                    url: data.Value.LogoPath,
                    thumbUrl: data.Value.LogoPath,
                }]

                if (data.Value.LogoPath)
                    _this.setState({ logoFile: logoFile });
                $(".ant-upload-select-picture-card").css("display", !!data.Value.LogoPath ? "none" : "");
            }
        });
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
    }


    handleChange(info) {
        let fileList = info.fileList;

        // 1. 上传列表数量的限制
        //    只显示最近上传的一个，旧的会被新的顶掉
        fileList = fileList;

        // 2. 读取远程路径并显示链接
        fileList = fileList.map((file) => {
            if (file.response) {
                // 组件会将 file.url 作为链接进行展示
                file.url = file.response.url;
            }
            return file;
        });

        // 3. 按照服务器返回信息筛选成功上传的文件
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.status === 'success';
            }
            return true;
        });
        console.log("logoPath");
        this.props.form.setFieldsValue({ "LogoPath": info.fileList.length > 0 ? info.fileList[0].url : "" });
        this.setState({ fileList: fileList });
    }

    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }

    inputNumberChange(e) {
        const { setFieldsValue } = this.props.form;
        var targetName = e.target.id;
        var number = parseFloat(e.target.value || 0);
        if (isNaN(number)) {
            return;
        }
        if (!('value' in this.props)) {
            var setObj = {};
            setObj[targetName] = number;
            setFieldsValue(setObj);
        }

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(number);
        }

    }

    handleSubmit(e) {
        debugger;
        var _this = this;
        e.preventDefault();
        var form = _this.props.form;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            var obj = form.getFieldsValue();
            var currentExpectedToAvailableIncomeDays = _this.state.ExpectedToAvailableIncomeDays;

            if (currentExpectedToAvailableIncomeDays < obj.RefundDays) {
                confirm({
                    title: '温馨提示',
                    content: '当前预计收益转可提现收益的时间为' + currentExpectedToAvailableIncomeDays + '天，小于退款期限，您仍要保存当前设置吗？',
                    onOk() {
                        _this.saveConfig(values);
                    },
                    onCancel() { },
                });
            }
            else {
                _this.saveConfig(values);
            }
        });
    }

    saveConfig(obj)
    {
        Api.setAppBasciInfo(obj).then(function (data) {
            if (data.IsOK) {
                Modal.success({
                    title: '操作成功',
                    content: '基础信息设置已保存',

                });
            } else {
                message.error(data.Message);
            }
        });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;
        const nameProps = getFieldProps('SiteName', {
            validate: [{
                rules: [
                    { required: true, min: 5, message: '网站名称至少为 5 个字符' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const logoPathProps = getFieldProps('LogoPath', {
            validate: [{
                rules: [
                    { required: true, message: '请上传品牌Logo' },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });
        const logoProps = {
            //multiple: false,
            //action: "/UploadFile/UploadImage",
            //defaultFileList: this.state.logoFile,
            //onChange: this.handleChange,
            //listType: "picture-card", onPreview: (file) => {
            //    this.setState({
            //        priviewImage: file.url,
            //        priviewVisible: true,
            //    })
            //}



            multiple: false,
            action: "/UploadFile/UploadImage",
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["logoFile"],
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
                var key = "LogoPath";
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
                this.state["logoFile"] = fileList;
                this.setState({ logoFile: fileList });
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

        const introductionProps = getFieldProps('Introduction', {
            validate: [{
                rules: [
                    { required: false, message: '请输入简介' },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });

        const csPhoneProps = getFieldProps('CustomerServicePhone', {
            validate: [{
                rules: [
                    { required: false, message: '请输入服务电话' },
                    { validator: RegExpVerify.checkPhone },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });

        const merchantMobileProps = getFieldProps('MerchantMobile', {
            validate: [{
                rules: [
                    { required: true, message: '请输入商户手机' },
                    { validator: RegExpVerify.checkPhone },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });

        const addressProps = getFieldProps('DetailAddress', {
            rules: [
                { required: false, message: '请输入详细地址' },
            ],
        });
        const subscribeNoticeProps = getFieldProps('SubscribeNotice', {
            rules: [
                { required: false, message: '请输入首次关注欢迎语' },
            ],
        });
        const buyAgreementProps = getFieldProps('IsShowAgreement', {
            rules: [
                { required: true, message: '请选择是否开启' },
            ],

        });

        const refundDaysProps = getFieldProps('RefundDays', {
            validate: [{
                rules: [
                    { required: true, message: '请输入退款期限' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const isShowBottomRecommendProps = getFieldProps('IsShowBottomRecommend', {
            rules: [
                { required: true, message: '请选择网站底部是否显示推荐此系统' },
            ],

        });

        const isEnableInvoiceProps = getFieldProps('IsEnableInvoice', {
            rules: [
                { required: true, message: '请选择是否允许开发票' },
            ],

        });

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left " href="/Manager/SystemTemplate/Index">模板设置</a>
                    <a className="main-content-word pull-left  set-content-word-te">基础信息</a>
                </div>

                <div className="row padding-top20 margin0">
                    <div className="col-lg-12 padding-top60">
                        <div className="form-horizontal tasi-form" >
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>平台名称：</label>
                                    <div className="col-xs-5">
                                        <FormItem
                                            hasFeedback
                                            help={isFieldValidating('SiteName') ? '校验中...' : (getFieldError('SiteName') || []).join(', ')}
                                            >
                                            <Input {...nameProps} placeholder="请输入平台名称" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2 "><span className="color-red">*</span>平台标志：</label>
                                    <div className="col-xs-9">
                                        <FormItem >
                                            <Input type="hidden"  {...logoPathProps} placeholder="请上传平台标志" />
                                            <div >
                                                <Upload {...logoProps} name="upload" >
                                                    <Icon type="plus" />
                                                    <div className="ant-upload-text">上传平台标志</div>
                                                </Upload>
                                                <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img alt="example" src={this.state.priviewImage} />
                                                </Modal>
                                            </div>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>退款期限：</label>
                                    <div className="col-xs-5">
                                        <FormItem style={{ marginBottom: 5 }}>
                                            <Input addonAfter="天" {...refundDaysProps} onChange={this.inputNumberChange} className="cp1 form-control" placeholder="请输入退款期限" />
                                        </FormItem>
                                        <span className="control-label">退款期限短于预计收益转可提现收益的时间，可以避免用户收益为负</span>
                                    </div>
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">简介：</label>
                                    <div className="col-xs-5">
                                        <FormItem >
                                            <Input {...introductionProps} type="textarea" rows={4} placeholder="简介" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">服务热线：</label>
                                    <div className="col-xs-5">

                                        <FormItem >
                                            <Input {...csPhoneProps} placeholder="请输入服务热线" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>商户手机：</label>
                                    <div className="col-xs-5">
                                        <FormItem hasFeedback>
                                            <Input {...merchantMobileProps} placeholder="请输入商户手机" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">显示“了解此系统”：</label>
                                    <div className="col-xs-4 radios">
                                        <div className="row radios-block">
                                            <div className="col-xs-6">
                                                <FormItem >
                                                    <RadioGroup {...isShowBottomRecommendProps}>
                                                        <Radio value="true">是</Radio>
                                                        <Radio value="false">否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        
                                            <a style={{ display: getFieldValue("IsShowBottomRecommend")=="true"?"":"none" }} href="/Extend/RecommendIndex">查看我推荐的人</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">允许开发票：</label>
                                    <div className="col-xs-4 radios">
                                        <div className="row radios-block">
                                            <div className="col-xs-6">
                                                <FormItem >
                                                    <RadioGroup {...isEnableInvoiceProps}>
                                                        <Radio value="true">是</Radio>
                                                        <Radio value="false">否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">详细地址：</label>
                                    <div className="col-xs-5">
                                        <FormItem >
                                            <Input {...addressProps} type="textarea" placeholder="请输入详细地址" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">关注欢迎语：</label>
                                    <div className="col-xs-5">
                                        <FormItem >
                                            <Input {...subscribeNoticeProps} type="textarea" placeholder="请输入首次关注欢迎语" />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <Button type="primary" size="large" className="btn btn-block" onClick={this.handleSubmit}>保存</Button>
                        </div>
                    </div>
                </div>

            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let SystemBasicInfoIndexPage = Form.create({})(SystemBasicInfoIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(SystemBasicInfoIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

