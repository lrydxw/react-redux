import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio, Upload } from 'antd';
import { Sortable } from "sortable";
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
import WeChatSetInfoApi from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
//表单验证模块

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class WeChatSetInfoIndex extends BaseContainer {
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
        this.changeWechatPublicAccountType = this.changeWechatPublicAccountType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            priviewVisible: false,
            wechatPublicAccountType: 2,
            wechatPublicAccountTypeName: "服务号"
        };
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        var _this = this;
        const { setFieldsValue } = this.props.form;
        WeChatSetInfoApi.GetWeChatInfo({}).then(function (data) {
            if (data.IsOK) {
                var qRCodePathFileList = [{
                    uid: -1,
                    name: data.Value.QRCodePath,
                    status: 'done',
                    url: data.Value.QRCodePath,
                    thumbUrl: data.Value.QRCodePath,
                }];
                _this.state.wechatPublicAccountType = data.Value.WechatPublicAccountType;
                _this.state.wechatPublicAccountTypeName = data.Value.WechatPublicAccountType == 1 ? "订阅号" : "服务号";
                if (data.Value.QRCodePath)
                    _this.setState({ QRCodePathFileList: qRCodePathFileList });
                $(".ant-upload-select-picture-card").css("display", !!data.Value.QRCodePath ? "none" : "");
                setFieldsValue(data.Value);
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
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    handleSubmit(e) {
        var _self = this;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            values["WechatPublicAccountType"] = _self.state.wechatPublicAccountType;
            WeChatSetInfoApi.InitWeChat(values).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '公众号配置已保存',
                    });
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    changeWechatPublicAccountType(type) {
        if (type == 1) {
            this.state.wechatPublicAccountTypeName = "订阅号";
        }
        else {
            this.state.wechatPublicAccountTypeName = "服务号";
        }
        this.setState({ wechatPublicAccountType: type });
    }
    render() {
        const { getFieldProps, setFieldsValue } = this.props.form;
        const WechatPublicAccountProps = getFieldProps('WechatPublicAccount', {
            validate: [{
                rules: [
                    { required: true, message: '请填写微信公众号名称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const AppIdProps = getFieldProps('AppId', {
            validate: [{
                rules: [
                    { required: true, message: '请填写服务号AppId' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const AppSecretProps = getFieldProps('AppSecret', {
            validate: [{
                rules: [
                    { required: true, message: '请填写服务号AppSecret' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const logoPathProps = getFieldProps('QRCodePath', {
            validate: [{
                rules: [
                    { required: true, message: '请上传微信公众号二维码' },
                ]
            },
            ],
        });
        const subscibeAppIdProps = getFieldProps('SubscibeAppId', {
            validate: [{
                rules: [
                    { required: true, message: '请填写订阅号AppSecret' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const subscibeAppSecretProps = getFieldProps('SubscibeAppSecret', {
            validate: [{
                rules: [
                    { required: true, message: '请填写订阅号AppSecret' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const WeChatAccountProps = getFieldProps('WeChatAccount', {
            validate: [{
                rules: [
                    { required: true, message: '请填写服务号账号' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const SubscibeAccountProps = getFieldProps('SubscibeAccount', {
            validate: [{
                rules: [
                    { required: true, message: '请填写订阅号账号' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });


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
            fileList: this.state["QRCodePathFileList"],
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
                var key = "QRCodePath";
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
                this.setState({ QRCodePathFileList: fileList });
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
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left " href="/Manager/WeChatSetMenu/Index">公众号菜单</a>
                    <a className="main-content-word pull-left set-content-word-te " >公众号配置</a>
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetInfo/WechatReplyConfig" >自动回复</a>
                </div>

                <div className="row">
                    <div className="clo-xs-12 padding-left20 margin-top60 margin-btm10">
                        <p className="font12 color3 text-left">基础设置</p>
                    </div>
                </div>
                <div className="wechat-box clearfix">
                    <p className="wechat-box-p pull-left">公众号类型：</p>
                    <div className="wechat-box-right pull-left">
                        <div className={this.state.wechatPublicAccountType == 2 ? "wechat-box-d wechat-box-dAct" : "wechat-box-d"} onClick={() => { this.changeWechatPublicAccountType(2) } }>服务号</div>
                        <div className={this.state.wechatPublicAccountType == 1 ? "wechat-box-d margin-left15 wechat-box-dAct" : "margin-left15 wechat-box-d"} onClick={() => { this.changeWechatPublicAccountType(1) } }>订阅号</div>
                        <p className="font12 color9 margin-top10">请根据您的系统需求，选择对应的公众号类型</p>
                    </div>
                </div>
                <div className="wechat-box clearfix">
                    <p className="wechat-box-p pull-left">公众号昵称：</p>
                    <div className="wechat-box-W pull-left">
                        <FormItem
                            hasFeedback
                            >
                            <Input {...WechatPublicAccountProps} placeholder="请填写公众号昵称" className="cp1 form-control" />
                        </FormItem>
                    </div>
                </div>
                <div className="wechat-box clearfix">
                    <p className="wechat-box-p pull-left">公众号二维码：</p>
                    <div className="wechat-box-W pull-left">
                        <FormItem
                            hasFeedback
                            >
                            <Input {...logoPathProps} type="hidden" placeholder="请填写微信公众号二维码" />
                            <div>
                                <Upload {...logoProps} name="upload" >
                                    <Icon type="plus" />
                                    <div className="ant-upload-text">公众号二维码</div>
                                </Upload>
                                <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                                </Modal>
                            </div>
                        </FormItem>
                        <p className="font12 color9 margin-top10">请您上传您的{this.state.wechatPublicAccountTypeName}二维码,格式为JPG</p>
                    </div>
                </div>
                <div className="row">
                    <div className="clo-xs-12 padding-left20 margin-top60 margin-btm10">
                        <p className="font12 color3 text-left">服务号接口设置</p>
                    </div>
                </div>
                <div className="wechat-box clearfix">
                    <p className="wechat-box-p pull-left">服务号账号：</p>
                    <div className="wechat-box-W pull-left">
                        <FormItem
                            hasFeedback
                            >
                            <Input {...WeChatAccountProps} placeholder="请填写服务号账号" className="cp1 form-control" />
                        </FormItem>
                    </div>
                </div>
                <div className="wechat-box clearfix">
                    <p className="wechat-box-p pull-left">AppID(应用ID）：</p>
                    <div className="wechat-box-W pull-left">
                        <FormItem
                            hasFeedback
                            >
                            <Input {...AppIdProps} placeholder="请填写AppID(应用ID)" className="cp1 form-control" />
                        </FormItem>
                    </div>
                </div>
                <div className="wechat-box clearfix">
                    <p className="wechat-box-p pull-left">AppSecret(应用秘钥）：</p>
                    <div className="wechat-box-W pull-left">
                        <FormItem
                            hasFeedback
                            >
                            <Input {...AppSecretProps} placeholder="请填写AppSecret(应用密钥)" className="cp1 form-control" />
                        </FormItem>
                    </div>
                </div>


                <div style={{ display: this.state.wechatPublicAccountType == 1 ? "block" : "none" }}><div className="row">
                    <div className="clo-xs-12 padding-left20 margin-top60 margin-btm10">
                        <p className="font12 color3 text-left">订阅号接口设置</p>
                    </div>
                </div>
                    <div className="wechat-box clearfix">
                        <p className="wechat-box-p pull-left">订阅号账号：</p>
                        <div className="wechat-box-W pull-left">
                            <FormItem
                                hasFeedback
                                >
                                <Input {...SubscibeAccountProps} placeholder="请填写订阅号账号" className="cp1 form-control" />
                            </FormItem>

                        </div>
                    </div>
                    <div className="wechat-box clearfix">
                        <p className="wechat-box-p pull-left">AppID(应用ID）：</p>
                        <div className="wechat-box-W pull-left">
                            <FormItem
                                hasFeedback
                                >
                                <Input {...subscibeAppIdProps} placeholder="请填写AppID(应用ID)" className="cp1 form-control" />
                            </FormItem>

                        </div>
                    </div>
                    <div className="wechat-box clearfix">
                        <p className="wechat-box-p pull-left">AppSecret(应用秘钥）：</p>
                        <div className="wechat-box-W pull-left">
                            <FormItem
                                hasFeedback
                                >
                                <Input {...subscibeAppSecretProps} placeholder="请填写AppSecret(应用秘钥）" className="cp1 form-control" />
                            </FormItem>
                        </div>
                    </div></div>

                <div className="row margin-top60 margin-btm30 margin-left100">
                    <div className="width100">
                        <Button type="primary" size="large" className="btn btn-block" onClick={this.handleSubmit}>保存</Button>
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

let WeChatSetInfoIndexPage = Form.create({})(WeChatSetInfoIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(WeChatSetInfoIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

