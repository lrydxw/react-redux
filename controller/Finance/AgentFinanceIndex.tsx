//会员提现
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
import FinanceApi from './FinanceApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
const tabConfigs = [
    { name: "全部", key: "0" },
    //{ name: "微信", key: "1" },
    //{ name: "支付宝", key: "2" }
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class AgentFinanceIndex extends BaseContainer {
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
        this.searchDataList = this.searchDataList.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.exportWithdrawalApply = this.exportWithdrawalApply.bind(this);
        this.initFinanceProfile = this.initFinanceProfile.bind(this);
        this.tabsonChange = this.tabsonChange.bind(this);

        this.searchData = {};
        let formElements: FormElement[] = [
            { key: "Account", element: ElementEnum.Label, type: "string", label: "提现账号", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "Type", element: ElementEnum.Label, type: "string", label: "提现方式", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "Amount", element: ElementEnum.Label, type: "string", label: "提现金额", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "State", element: ElementEnum.Radio, type: "string", label: "处理结果", message: "请选择处理结果", defaultValue: "", dataList: [{ "value": "3", "label": "完成" }, { "value": "2", "label": "拒绝" }] },
            { key: "Remark", element: ElementEnum.Textarea, type: "string", label: "备注", message: "请填写备注", defaultValue: "", rules: { required: true, whitespace: false }, dataList: [] },
        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            FinanceTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingFinance: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectFinanceIndex: -1,//选择列表序号
            selectFinanceId: "",//选择的Id
            WithdrawalState: "0",//提现状态
            FinanceListData: [],//列表数据
            modalPara: formElements,
            defaultValues: {},
            editId: "-1",
            btnDisabled: false,
            WaitWithdrawal: 0,//待处理提现数量
            WithdrawalType: "0",//提现类型
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initFinanceList();
        this.initFinanceProfile();
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
    initFinanceProfile() {
        var _this = this;
        FinanceApi.getFinanceProfile({}).then(function (data) {
            if (data.IsOK) {
                _this.state.WaitWithdrawal = data.Value.WaitWithdrawal;
            }
        });
    }
    /**
     * 查询条件
     */
    searchDataList() {
        var _this = this;
        var form = _this.props.form;
        _this.state.PageIndex = 1;
        var obj = form.getFieldsValue();
        obj.StartTime = Tool.GMTToDate(obj.StartTime);
        obj.EndTime = Tool.GMTToDate(obj.EndTime);
        if (obj.StartTime && obj.EndTime) {
            if (Tool.compareDateTime(obj.StartTime, obj.EndTime)) {
                Modal.error({
                    title: '温馨提示',
                    content: '开始时间不能大于结束时间',
                });
                return;
            }
        }
        _this.state.WithdrawalState = obj.State;
        _this.searchData = obj;
        _this.initFinanceList();
    }
    /**
     * 获取财务列表数据
     */
    initFinanceList() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var obj = _this.searchData;
        obj.WithdrawalType = _this.state.WithdrawalType;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;

        _this.state.visibleForm = false;
        _this.setState({ loadingFinance: true });
        FinanceApi.getWithdrawalApplyPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.FinanceListData = functionData;
                _this.state.FinanceTotalCount = data.AllCount;
            }
            _this.setState({ loadingFinance: false });
        });
        setFieldsValue({ "State": _this.state.WithdrawalState });
    }
    /**
     * 导出提现记录
     */
    exportWithdrawalApply() {
        var _this = this;
        var form = _this.props.form;
        var obj = form.getFieldsValue();
        obj.StartTime = Tool.GMTToDate(obj.StartTime);
        obj.EndTime = Tool.GMTToDate(obj.EndTime);
        obj.State = 1;
        obj.WithdrawalType = _this.state.WithdrawalType;
        if (_this.state.WaitWithdrawal == 0) {
            Modal.error({
                title: '温馨提示',
                content: '暂无提现申请',
            });
            return;
        }
        Tool.ExportCSVFile("/Finance/ExportWithdrawalApplyList", obj);
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
    openEditForm(record) {
        var _this = this;
        _this.state.isInsert = false;
        _this.state.visibleForm = true;
        var obj = { Id: record.Id };
        FinanceApi.getMemberWithdrawal(obj).then(function (data) {
            if (data.IsOK) {
                record = data.Value;
                record.State = String(data.Value.State);
                console.log(record);
                _this.setState({ editId: record.Id, defaultValues: record });
            }
        });
        return false;
    }
    /**
     * 提交数据
     */
    submitForm(obj) {
        var _this = this;
        console.log('收到表单值：', obj);
        obj.Id = _this.state.editId;
        _this.setState({ btnDisabled: true });
        FinanceApi.updateMemberWithdrawal(obj).then(function (data) {
            _this.setState({ btnDisabled: false });
            if (data.IsOK) {
                _this.initFinanceList();
            } else {
                message.error(data.Message);
            }
        });
    }
    tabsonChange(key) {
        var _self = this;
        _self.state.WithdrawalType = key;
        _self.initFinanceList();
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const financeColumns = [
            {
                title: '申请时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '提现账号',
                dataIndex: 'Account',
                key: 'Account',
                render: (text, record) => <span> <p>{record.Type}丨{record.Account}</p></span>,
            },
            {
                title: '申请人',
                dataIndex: 'RealName',
                key: 'RealName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '提现金额',
                dataIndex: 'Amount',
                key: 'Amount',
                render: (text) => <span className="color-red"> {text}</span>,
            },
            {
                title: '处理状态',
                dataIndex: 'State',
                key: 'State',
                render: (text, record) => <span className={record.State == "已完成" ? "color-green" : (record.State == "已拒绝" ? "color-red" : "")}> {text}</span>,
            },
            {
                title: '处理完成时间',
                dataIndex: 'CompleteTime',
                key: 'CompleteTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '备注',
                dataIndex: 'Remark',
                key: 'Remark',
                width: '10%',
                render: (text, record) => <span> {record.State == "已完成" || record.State == "已拒绝" ? text : ""}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                width: '12%',
                render: (text, record) => (
                    <span>
                        {record.State != "已完成" && record.State != "已拒绝" ? <a href="javascript:;" onClick={() => { this.openEditForm(record) } } >处理提现</a> : ""}
                    </span>
                ),
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        var self = this;
        const pagination = {
            total: self.state.FinanceTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initFinanceList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initFinanceList();
            },
            showTotal() {
                return `共 ${self.state.FinanceTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">代理提现</a>
                </div>

                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <div className="bg-colorF5 margin0">
                            <div className="row  padding-top20 padding-left20">
                                <Form horizontal>
                                    <div className="col-sm-12">
                                        <div className="pull-left margin-top5"><p className="color3">提现状态：</p></div>
                                        <ul className="row clearfix">
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <Select allowClear={true} {...getFieldProps('State') }>
                                                        <Option value="0">全部</Option>
                                                        <Option value="1">提现中</Option>
                                                        <Option value="2">已拒绝</Option>
                                                        <Option value="3">已完成</Option>
                                                    </Select>
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <DatePicker showTime={true} placeholder="开始时间" format="yyyy-MM-dd HH:mm" {...getFieldProps('StartTime') } />
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <DatePicker showTime={true} placeholder="结束时间" format="yyyy-MM-dd HH:mm" {...getFieldProps('EndTime') } />
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-1 col-md-2">
                                                <Button type="primary" size="large" className="btn btn-block" htmlType="submit" onClick={this.searchDataList}>搜索</Button>
                                            </li>
                                            <li className="col-lg-2 col-md-2">
                                                <button className="btn btn-info btn-block" onClick={this.exportWithdrawalApply} ><i className="fa fa-download"></i>导出提现申请</button>
                                            </li>
                                        </ul>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="row margin-top20">
                    <div className="col-xs-12 " >
                        <Tabs onChange={this.tabsonChange}>
                            {tabConfigs.map(function (item, i) {
                                return (
                                    <TabPane tab={item.name} key={item.key}>
                                        <Table
                                            rowKey={record => record.Id}
                                            columns={financeColumns}
                                            dataSource={self.state.FinanceListData}
                                            pagination={pagination}
                                            loading={self.state.loadingFinance}
                                            rowSelection={null}
                                            onRowClick={
                                                (record, index) => {
                                                    self.state.selectedRowKeys = [];
                                                    self.setState({
                                                        selectFinanceIndex: index,
                                                        selectFinanceId: record.Id
                                                    });
                                                }
                                            }
                                            rowClassName={
                                                (record, index) => {
                                                    return index === self.state.selectFinanceIndex ? " ant-table-row-active " : "";
                                                }
                                            }
                                            />
                                    </TabPane>
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
                <Modal title="处理提现申请" visible={this.state.visibleForm} onCancel={this.closeForm} footer={[]} >
                    <FormTemplate formElements={this.state.modalPara} defaultValues={this.state.defaultValues} btnDisabled={this.state.btnDisabled} isInsert={false} editId={this.state.editId} onCancel={this.closeForm} onSubmit={this.submitForm}></FormTemplate>
                </Modal>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let AgentFinanceIndexPage = Form.create({})(AgentFinanceIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(AgentFinanceIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);