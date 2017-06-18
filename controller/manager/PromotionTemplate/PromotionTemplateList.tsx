// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

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
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, Cascader } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import PromotionTemplateAPI from './PromotionTemplateAPI';

//表单验证模块
import Verifier from '../../../pub/Verifier';
import RegExpVerify from '../../../pub/RegExpVerify';
//表单组件
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class PromotionTemplateList extends BaseContainer {
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
        this.GetPromotionTemplateList = this.GetPromotionTemplateList.bind(this);//指定类型的推广模板列表数据   
        this.GetPromotionTypeList = this.GetPromotionTypeList.bind(this); // 系统模板类型
        this.searchData = {};

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isCopy: true,//是否复制 true：复制  false：移动
            ListData: [],//列表数据
            loading: false,//正在加载列表
            selectSortIndex: -1,//选择列表序号
            selectId: "",//选择的Id
            selectedRowKeys: [],//功能选择
            selectedRows: [],

            visibleConfirm: false,//是否显示confirm
            IsEnabledTitle: "",//弹窗提示内容
            IsEnabled: false,//是否启用
            TemplateTypes: [], //模板类型
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.GetPromotionTemplateList();
        this.GetPromotionTypeList();
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
     * 获取所有模板列表数据
     */
    GetPromotionTemplateList() {
        var _this = this;
        var obj = _this.searchData;

        _this.state.visibleForm = false;
        _this.setState({ loading: true });
        PromotionTemplateAPI.GetPromotionTemplateList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.ListData = functionData;
            }
            _this.setState({ loading: false, selectedRowKeys: [] });
        });
    }


    //获取系统模板类型列表
    GetPromotionTypeList() {
        var _this = this;
        var obj = obj || {};

        PromotionTemplateAPI.GetPromotionTypeList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.TemplateTypes = functionData;
            }

        });
    }
    //编辑模板信息
    showNewPage(Id, TemplateType, OP) {
        LocalStorage.add('Id', Id);
        LocalStorage.add('TemplateType', TemplateType);
        LocalStorage.add("OP", OP);
        Tool.goPush('/Manager/PromotionTemplate/PromotionTemplateEdit');
    }


    /*
    启用|不启用
    */
    IsEnabled(Id) {
        var _this = this;
        var obj = { Id: Id };
        PromotionTemplateAPI.UpdateIsEnable(obj).then(function (data) {
            if (data.IsOK) {
                _this.GetPromotionTemplateList();
            } else {
                message.error(data.Message);
            }
        });
    }
    //添加新模板弹窗
    AddNewTemplate() {
        var _this = this;
        _this.setState({ visibleAdd: true });
    }

    //确认添加 关闭弹窗 进行跳转
    AddNewTemplateOk() {
        var _this = this;
        var form = _this.props.form;
        const {getFieldValue, validateFields} = _this.props.form;
    

        var selectValue = getFieldValue("SelectTemplateType");
        if (selectValue == undefined) {
            message.error("请选择模板类型");
            return;
        }
        LocalStorage.add('Id', "0");
        LocalStorage.add('TemplateType', selectValue);
        LocalStorage.add("OP", "Add");
        Tool.goPush('/Manager/PromotionTemplate/PromotionTemplateAdd');
        _this.setState({ visibleAdd: false });
    }

    //取消添加 新模板
    AddNewTemplateCancel() {
        var _this = this;
        _this.setState({ visibleAdd: false });
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const Columns = [
            {
                title: '排序',
                dataIndex: 'OrderIndex',
                key: 'OrderIndex',
                render: (text) => <span> {text}</span>
            },
            {
                title: '模板名称',
                dataIndex: 'TemplateName',
                key: 'TemplateName',
                render: (text) => <span> {text}</span>
            },
            {
                title: '模板类型',
                dataIndex: 'TemplateType',
                key: 'TemplateType',
                render: (text) => <span> {text}</span>
            },
            {
                title: '模板描述',
                dataIndex: 'TemplateDesc',
                key: 'TemplateDesc',
                render: (text) => <span> {text}</span>
            },
            {
                title: '是否启用',
                dataIndex: 'IsEnabled',
                key: 'IsEnabled',
                render: (text) => <span> {text ? '是' : '否'}</span>
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => this.showNewPage(record.Id, record.TemplateType, "Edit")}>编辑配置信息</a>
                        <span className="ant-divider"></span>
                        {record.IsEnabled ? <Popconfirm title="确定要禁用吗？" onConfirm={() => { this.IsEnabled(record.Id) } }>
                            <a href="javascript:;">禁用</a>
                        </Popconfirm> : <Popconfirm title="确定要启用吗？" onConfirm={() => { this.IsEnabled(record.Id) } }>
                                <a href="javascript:;">启用</a>
                            </Popconfirm>}
                    </span>
                )
            }
        ];
        const { selectedRowKeys } = this.state;

        const hasSelected = selectedRowKeys.length > 0;

        var self = this;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">模板列表</a>
                </div>
                <div className="row  margin-top20 margin-btm20">
                    <div className="col-lg-6 col-sm-12">
                        <i className="nav-collapse-title-sign"></i>
                        <span className="margin-right15 margin-left5"></span>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                        <div className="clearfix">
                            <button className="btn btn-info pull-right margin-left5" onClick={() => this.AddNewTemplate()}>添加模板</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="clearfix">
                            <Tabs >
                                <TabPane tab="全部" key="all">
                                    <Table
                                        rowKey={record => record.Id}
                                        columns={Columns}
                                        dataSource={self.state.ListData}
                                        pagination={false}
                                        loading={self.state.loading}

                                        onRowClick={
                                            (record, index) => {
                                                self.state.selectedRowKeys = [];
                                                self.setState({
                                                    selectId: index
                                                });
                                            }
                                        }
                                        rowClassName={
                                            (record, index) => {
                                                return index === self.state.selectId ? " ant-table-row-active " : "";
                                            }
                                        }
                                        />
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>

                <Form>
                    <Modal title="添加模板" visible={this.state.visibleAdd} onOk={() => this.AddNewTemplateOk()} onCancel={() => this.AddNewTemplateCancel()} >
                        <div>
                            请选择模板类型：
                        <Select style={{ width: 200 }} placeholder="请选择模板类型" {...getFieldProps("SelectTemplateType") }>                                             
                                {this.state.TemplateTypes.map(function (item, i) {
                                    return (<Option value={item.TypeName} key={"Option_" + i}>{item.TypeName}</Option>);
                                })}
                            </Select>
                        </div>
                    </Modal>
                </Form>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let IndexPage = Form.create({})(PromotionTemplateList);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(IndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);