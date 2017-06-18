/// <reference path="wechatmessageindx.tsx" />
//短信模板设置
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
import { Button } from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, DatePicker } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import TemplateApi from './TemplateApi';
//表单验证模块
import Verifier from '../../../pub/Verifier';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ShortMessageIndex extends BaseContainer {
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
        this.initMessageNoticeList = this.initMessageNoticeList.bind(this);
        this.messageNoticeOnClick = this.messageNoticeOnClick.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.templateOnChange = this.templateOnChange.bind(this);
        this.inputonChange = this.inputonChange.bind(this);

        this.searchData = {};

        this.state = {
            selectedRowId: "",//选择的埋点Id
            MessageNoticeList: [],//埋点数据
            MessageTemplateData: {},//模板数据
        }

    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initMessageNoticeList();
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
    /**
     * 获取埋点列表
     */
    initMessageNoticeList() {
        var _this = this;
        TemplateApi.getMessageNoticeList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ MessageNoticeList: functionData });
            }
        });
    }
    /**
     * 获取模板列表
     * @param Id
     */
    messageNoticeOnClick(Id, record) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        TemplateApi.getMessageTemplateList({ "Id": Id, "MessageTemplateType": 1 }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                setFieldsValue({ "IsEnable": record.IsEnable });
                _this.setState({ MessageTemplateData: functionData, selectedRowId: Id });
            }
        });
    }
    /**
     * 提交
     */
    submitForm() {
        var _this = this;
        var form = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.selectedRowId;
            obj.MessageTemplate = _this.state.MessageTemplateData;
            console.log(obj);
            TemplateApi.updateMessageTemplateList(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '消息通知模板保存成功',
                        onOk() {
                            Tool.goPush('Manager/MessageTemplate/Index');
                        },
                    });
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    /**
     * 修改模板状态
     * @param checked
     * @param record
     */
    templateOnChange(checked, record) {
        var _this = this;
        var functionData = _this.state.MessageTemplateData;
        var index = _this.arrayIndex(functionData, record);
        if (index > -1) {
            functionData[index].IsEnable = checked;
        }
        _this.setState({ MessageTemplateData: functionData });
    }
    /**
     * 获取数组中某个对象的index
     * @param arr
     * @param obj
     */
    arrayIndex(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].MessageNoticeType === obj.MessageNoticeType) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 修改自定义参数
     * @param e
     * @param record
     */
    inputonChange(e, record) {
        var _this = this;
        var functionData = _this.state.MessageTemplateData;
        var key = e.target.getAttribute("data-key");
        if (key) {
            var index = _this.arrayIndex(functionData, record);
            if (index > -1) {
                key = key.substring(_this.state.selectedRowId.length + 1);
                functionData[index].TemplateParameter[key] = e.target.value;
            }
            _this.state.MessageTemplateData = functionData;
        }
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue} = this.props.form;
        var self = this;
        const getTemplateParameter = (TemplateParameter, record) => {
            var parameterHtml = [];
            for (var item in TemplateParameter) {
                parameterHtml.push(<span key={"span_" + self.state.selectedRowId + item}><span>#{item}#</span>
                    <Input type="text" className="cp1 form-control margin-top10 margin-btm30" data-key={self.state.selectedRowId + "_" + item} defaultValue={TemplateParameter[item]} onChange={(e) => { self.inputonChange(e, record) } } /></span>);
            }
            return parameterHtml;
        }
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">短信模板设置</a>
                </div>
                <div className="col-xs-12 margin-left20 margin-top30">
                    <ul className="message-kuang pull-left">
                        <a href="javascript:;"><li className="message-kuang-te">需发短信点</li></a>
                        {this.state.MessageNoticeList.length > 0 ?
                            this.state.MessageNoticeList.map(function (item, index) {
                                return (<a href="javascript:;" onClick={() => { self.messageNoticeOnClick(item.Id, item) } } key={"a_" + index}><li className={self.state.selectedRowId == item.Id ? "message-kuang-te1 message-kuang-te2" : "message-kuang-te1"}>{item.NoticeName}</li></a>);
                            }) : ""
                        }
                    </ul>
                    <div className="pull-left margin-left20">
                        <Form horizontal>
                            <div className="message-xuan1 pull-left" style={{ display: this.state.MessageTemplateData.length > 0 ? "" : "none" }}>
                                <FormItem>
                                    <p className="pull-left">是否开启：
                                        <Switch checkedChildren={'开'} unCheckedChildren={'关'} {...getFieldProps('IsEnable', { valuePropName: 'checked' }) } />
                                    </p>
                                </FormItem>
                            </div>
                        </Form>
                        <div className="clearfix"></div>
                        {this.state.MessageTemplateData.length > 0 ?
                            this.state.MessageTemplateData.map(function (item, index) {
                                return (<div key={"div_" + index}>
                                    <p className="margin-btm10">提示：<span>{item.TemplateDesc}</span></p>
                                    <div className="message-Nei pull-left">
                                        <div className="message-Nei1">{item.TemplateName}<div className="switch pull-right"><Switch checkedChildren={'开'} unCheckedChildren={'关'} defaultChecked={item.IsEnable} onChange={(checked) => { self.templateOnChange(checked, item) } } /></div></div>
                                        <div className="message-Nei2">
                                            <p>模板内容</p>
                                            <Input type="textarea" rows={5} className="cp1 form-control" disabled={true} value={item.TemplateContent} />
                                            <p className="margin-top20">设置自定义内容</p>
                                            {getTemplateParameter(item.TemplateParameter, item)}
                                        </div>
                                    </div>
                                </div>);
                            }) : ""
                        }
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="seat-80"></div>
                <div className="position-btm" style={{ display: this.state.MessageTemplateData.length > 0 ? "" : "none" }}>
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-lg-offset-4">
                            <Button type="primary" size="large" className="btn btn-block" onClick={this.submitForm}>保存</Button>
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

let ShortMessageIndexPage = Form.create({})(ShortMessageIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ShortMessageIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
