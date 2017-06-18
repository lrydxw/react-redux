//发票管理
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

//表单验证模块
import Verifier from '../../pub/Verifier';
import JointInitiatedApi from './JointInitiatedApi';
import PartnerApi from '../Partner/Api';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
//tab选项
const tabConfigs = [
    { name: "全部", key: "0" },
    { name: "审核中", key: "1" },
    { name: "未通过", key: "2" },
    { name: "通过", key: "3" }
];


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class JointFormIndex extends BaseContainer {
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
        this.onSelectChange = this.onSelectChange.bind(this);
        this.tabsonChange = this.tabsonChange.bind(this);
        this.initTableData = this.initTableData.bind(this);
        this.searchDataList = this.searchDataList.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.exportJointExtendFormValue = this.exportJointExtendFormValue.bind(this);

        this.searchData = {};
        this.state = {
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingTable: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            selectedRowId: "",//选择的分类Id
            visibleForm: false,
            TableData: [],//列表数据
            UnionDataStatus: "0",
            ProductId: LocalStorage.get('ProductId'),
            ProductName: LocalStorage.get('ProductName'),
            FormDataList: [],//表单填写数据
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initTableData();
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
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    /**
     * 获取table数据
     */
    initTableData() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.ProductId = _this.state.ProductId;
        obj.UnionDataStatus = _this.state.UnionDataStatus;

        _this.state.visibleForm = false;
        _this.setState({ loadingTable: true });
        JointInitiatedApi.getJointExtendFormValuePageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.TableData = functionData;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingTable: false });
        });
        setFieldsValue({ "UnionDataStatus": _this.state.UnionDataStatus, "PartnerTypeId": _this.state.PartnerTypeId });
    }
    /**
     * 查询条件
     */
    searchDataList() {
        var _this = this;
        var form = _this.props.form;
        _this.state.PageIndex = 1;
        var obj = form.getFieldsValue();
        _this.state.UnionDataStatus = "0";
        _this.state.PartnerTypeId = obj.PartnerTypeId;
        _this.searchData = obj;
        _this.initTableData();
    }
    tabsonChange(key) {
        var _this = this;
        _this.state.UnionDataStatus = key;
        _this.initTableData();
    }
    /**
     * 关闭弹窗
     */
    closeForm() {
        this.setState({ visibleForm: false });
    }
    /**
     * 打开修改弹窗
     */
    openEditForm(Id) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        JointInitiatedApi.getJointExtendFormValue({ Id: Id }).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var functionData = [];
                if (Array.isArray(obj.DataList)) {
                    functionData = obj.DataList;
                }
                _this.setState({ visibleForm: true, FormDataList: functionData });
                setFieldsValue({ "UnionDataStatus": String(obj.UnionDataStatus), "Remark": obj.Remark });
            }
        });
        return false;
    }
    /**
     * 提交数据
     */
    submitForm() {
        var form = this.props.form;
        var _this = this;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.selectedRowId;
            console.log('收到表单值：', obj);
            JointInitiatedApi.updateJointExtendFormValue(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initTableData();
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    /**
     * 导出联合发起人报名信息
     */
    exportJointExtendFormValue() {
        var _this = this;
        var form = _this.props.form;
        var obj = form.getFieldsValue();
        obj.UnionDataStatus = 3;
        if (_this.state.TotalCount == 0) {
            Modal.error({
                title: '温馨提示',
                content: '暂无报名信息',
            });
            return;
        }
        Tool.ExportCSVFile("/Extend/ExportJointExtendFormValue", obj);
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const tableColumns = [
            {
                title: '订单号',
                dataIndex: 'OrderNo',
                key: 'OrderNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '昵称',
                dataIndex: 'NickName',
                key: 'NickName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '姓名',
                dataIndex: 'Name',
                key: 'Name',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '手机号',
                dataIndex: 'Mobile',
                key: 'Mobile',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '创建时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '审核状态',
                dataIndex: 'UnionDataStatus',
                key: 'UnionDataStatus',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.openEditForm(record.Id) } }>审核</a>
                    </span>
                ),
            }
        ];
        const hasSelected = selectedRowKeys.length > 0;
        var self = this;
        const pagination = {
            total: self.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initTableData();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initTableData();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">{this.state.ProductName}</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-12">
                        <div className="bg-colorF5">
                            <div className="row  padding-top20 padding-left20">
                                <Form horizontal>
                                    <div className="col-lg-4 col-sm-12">
                                        <ul className="row">
                                            <li className="col-xs-6">
                                                <FormItem>
                                                    <Input className="cp1 form-control" type="text" placeholder="手机号" {...getFieldProps('Mobile') } />
                                                </FormItem>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-4 col-sm-12">
                                        <div className="row">
                                            <div className="col-xs-3">
                                                <Button type="primary" size="large" className="btn btn-block" htmlType="submit" onClick={this.searchDataList}>搜索</Button>
                                            </div>
                                            <div className="col-xs-6 ">
                                                <Button type="ghost" size="large" icon="download" onClick={this.exportJointExtendFormValue}>导出报名数据</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Tabs activeKey={this.state.UnionDataStatus} onChange={this.tabsonChange}>
                            {tabConfigs.map(function (item, i) {
                                return (
                                    <TabPane tab={item.name} key={item.key}>
                                        <Table
                                            rowKey={record => record.Id}
                                            columns={tableColumns}
                                            dataSource={self.state.TableData}
                                            pagination={pagination}
                                            loading={self.state.loadingTable}
                                            rowSelection={null}
                                            onRowClick={
                                                (record, index) => {
                                                    self.state.selectedRowKeys = [];
                                                    self.setState({
                                                        selectedRowIndex: index,
                                                        selectedRowId: record.Id
                                                    });
                                                }
                                            }
                                            rowClassName={
                                                (record, index) => {
                                                    return index === self.state.selectedRowIndex ? " ant-table-row-active " : "";
                                                }
                                            }
                                            />
                                    </TabPane>
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
                <Modal title="审核" visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm} >
                    <Form horizontal>
                        {this.state.FormDataList.length > 0 ?
                            this.state.FormDataList.map(function (item, index) {
                                if (item.Type == 6) {
                                    return (<div className="form-group" key={"label_" + index}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right">{item.Label}：</label>
                                            <div className="col-xs-7">
                                                <p className="color3 font12">
                                                    {item.Value && item.Value.length > 0 ? item.Value.map(function (children, i) {
                                                        return (<img src={children.url} key={"img_" + i} width={"100%"} />);
                                                    }) : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>);
                                } else {
                                    return (<div className="form-group" key={"label_" + index}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right">{item.Label}：</label>
                                            <div className="col-xs-7">
                                                <p className="color3 font12">{item.Value || ""}</p>
                                            </div>
                                        </div>
                                    </div>)
                                }
                            }) : ""
                        }
                        <div className="form-group">
                            <div className="row">
                                <label className="control-label col-xs-3 text-right">处理结果：</label>
                                <div className="col-xs-7">
                                    <FormItem hasFeedback>
                                        <RadioGroup {...getFieldProps('UnionDataStatus', {
                                            validate: [{
                                                rules: [
                                                    { required: true, message: '请选择处理结果' },
                                                ], trigger: ['onBlur', 'onChange'],
                                            }]
                                        }) }>
                                            <Radio key="UnionDataStatus_3" value="3">通过</Radio>
                                            <Radio key="UnionDataStatus_2" value="2">不通过</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <label className="control-label col-xs-3 text-right">备注：</label>
                                <div className="col-xs-7">
                                    <FormItem hasFeedback>
                                        <Input type="textarea" className="cp1 form-control" placeholder="备注" autosize={{ minRows: 4, maxRows: 6 }} {...getFieldProps('Remark', {
                                            validate: [{
                                                rules: [
                                                    { required: false, message: '请填写备注' },
                                                ], trigger: ['onBlur', 'onChange'],
                                            }]
                                        }) } />
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal >
            </AppBody >
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let JointFormIndexPage = Form.create({})(JointFormIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(JointFormIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
