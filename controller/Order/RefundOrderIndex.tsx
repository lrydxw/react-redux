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
import OrderApi from './OrderApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//tab选项
const tabConfigs = [
    { name: "全部", key: "0" },
    { name: "退款处理中", key: "1" },
    { name: "退款完成", key: "6" }
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class RefundOrderIndex extends BaseContainer {
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
        this.initOrderList = this.initOrderList.bind(this);
        this.searchDataList = this.searchDataList.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.openHandleRefundForm = this.openHandleRefundForm.bind(this);
        this.openAgreeRefundForm = this.openAgreeRefundForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.agreeRefundSubmitForm = this.agreeRefundSubmitForm.bind(this);
        this.initCourierCompanyData = this.initCourierCompanyData.bind(this);
        this.operateRefund = this.operateRefund.bind(this);
        this.searchData = {};
        //处理退款
        let handleRefundElements: FormElement[] = [
            { key: "OrderNo", element: ElementEnum.Label, type: "string", label: "订单号", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "OrderStatus", element: ElementEnum.Label, type: "string", label: "订单状态", message: "", defaultValue: "", className: "color-red", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "BackCause", element: ElementEnum.Label, type: "string", label: "退款原因", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "GoodsImg", element: ElementEnum.Upload, type: "array", label: "商品图片", config: {}, message: "", defaultValue: "", rules: { required: false, whitespace: false }, dataList: [] },
            { key: "Remark", element: ElementEnum.Label, type: "string", label: "备注", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "IsAgree", element: ElementEnum.Radio, type: "string", label: "处理结果", message: "请选择处理结果", defaultValue: "false", dataList: [{ "value": "true", "label": "同意" }, { "value": "false", "label": "拒绝" }] },
            { key: "Remark1", element: ElementEnum.Textarea, type: "string", label: "商家回复", message: "请填写商家回复", defaultValue: "", rules: { required: false, whitespace: false }, dataList: [] },
        ];
        //同意退款
        let agreeRefundElements: FormElement[] = [
            { key: "OrderNo", element: ElementEnum.Label, type: "string", label: "订单号", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "OrderStatus", element: ElementEnum.Label, type: "string", label: "订单状态", message: "", defaultValue: "", className: "color-red", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "BackCause", element: ElementEnum.Label, type: "string", label: "退款原因", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "GoodsImg", element: ElementEnum.Upload, type: "array", label: "商品图片", config: {}, message: "", defaultValue: "", rules: { required: false, whitespace: false }, dataList: [] },
            { key: "Remark", element: ElementEnum.Label, type: "string", label: "备注", message: "", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "CourierCompany", element: ElementEnum.Select, type: "string", label: "快递公司", showSearch: true, message: "", defaultValue: "", rules: { required: true, whitespace: false }, dataList: [] },
            { key: "CourierNo", element: ElementEnum.Input, type: "string", label: "快递单号", message: "", defaultValue: "", rules: { required: true, whitespace: false }, dataList: [] },
            { key: "Remark1", element: ElementEnum.Textarea, type: "string", label: "商家回复", message: "请填写备商家回复", defaultValue: "", rules: { required: false, whitespace: false }, dataList: [] },
        ];

        this.state = {
            OrderTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingOrder: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectOrderIndex: -1,//选择列表序号
            OrderListData: [],//列表数据
            RefundSteps: "0",//退款订单状态
            visibleHandleRefundForm: false,//处理退款
            visibleAgreeRefundForm: false,//同意退款
            HandleRefundPara: handleRefundElements,//处理退款表单
            AgreeRefundPara: agreeRefundElements,//同意退款表单
            defaultValues: {},
            editId: "-1",
            OrderStatus: "",//订单状态
            btnDisabled: false,
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initOrderList();
        this.initCourierCompanyData();
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
        _this.state.RefundSteps = "0";
        _this.searchData = obj;
        _this.initOrderList();
    }
    /**
     * 获取订单列表数据
     */
    initOrderList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.RefundSteps = _this.state.RefundSteps;
        console.log(obj);

        _this.setState({ loadingOrder: true });
        OrderApi.getRefundOrderPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.OrderListData = functionData;
                _this.state.OrderTotalCount = data.AllCount;
            }
            _this.setState({ loadingOrder: false });
        });
        _this.state.HandleRefundPara[3].config = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            defaultFileList: [],
        };
        _this.state.AgreeRefundPara[3].config = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            defaultFileList: [],
        };
    }
    /**
     * 加载物流公司信息
     */
    initCourierCompanyData() {
        var _this = this;
        OrderApi.getLogisticConfigList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    for (var i = 0; i < data.Value.length; i++) {
                        functionData.push({ value: data.Value[i].Code.toLowerCase(), key: String(data.Value[i].Name) });
                    }
                    _this.state.AgreeRefundPara[5].dataList = functionData;
                }
            }
        });
    }

    tabsonChange(key) {
        var _this = this;
        _this.state.RefundSteps = key;
        _this.initOrderList();
    }
    showNewPage(OrderNo) {
        Tool.goPush('Order/OrderDetail');
        LocalStorage.add('OrderNo', OrderNo);
    }
    /**
     * 关闭弹窗
     */
    closeForm() {
        this.setState({ visibleHandleRefundForm: false, visibleAgreeRefundForm: false });
    }
    /**
     * 打开处理退款弹窗
     */
    openHandleRefundForm(record) {
        var _this = this;
        _this.state.visibleHandleRefundForm = true;
        _this.state.visibleAgreeRefundForm = false;
        var obj = { Id: record.Id };
        var fileList = [];
        OrderApi.getRefundOrder(obj).then(function (data) {
            if (data.IsOK) {
                var GoodsImg = JSON.parse(data.Value.GoodsImg);
                if (GoodsImg && GoodsImg.length > 0) {
                    for (var i = 0; i < GoodsImg.length; i++) {
                        fileList.push({ uid: record.Id + i, name: '', status: 'done', url: GoodsImg[i].url, thumbUrl: GoodsImg[i].url });
                    }
                }
                _this.state.HandleRefundPara[3].config.defaultFileList = fileList;
                _this.state.OrderStatus = data.Value.OrderStatus;
                _this.setState({ editId: record.Id, defaultValues: data.Value });
            }
        });
        return false;
    }
    /**
     * 打开同意退款弹窗
     */
    openAgreeRefundForm(record) {
        var _this = this;
        _this.state.visibleHandleRefundForm = false;
        _this.state.visibleAgreeRefundForm = true;
        var obj = { Id: record.Id };
        var fileList = [];
        OrderApi.getRefundOrder(obj).then(function (data) {
            if (data.IsOK) {
                var GoodsImg = JSON.parse(data.Value.GoodsImg);
                if (GoodsImg && GoodsImg.length > 0) {
                    for (var i = 0; i < GoodsImg.length; i++) {
                        fileList.push({ uid: record.Id + i, name: '', status: 'done', url: GoodsImg[i].url, thumbUrl: GoodsImg[i].url });
                    }
                }
                _this.state.AgreeRefundPara[3].config.defaultFileList = fileList;
                _this.state.OrderStatus = data.Value.OrderStatus;
                _this.setState({ editId: record.Id, defaultValues: data.Value });
            }
        });
        return false;
    }
    /**
     * 处理退款申请
     * @param obj
     */
    submitForm(obj) {
        var _this = this;
        obj.RefundId = _this.state.editId;
        obj.Remark = obj.Remark1;
        console.log('收到表单值：', obj);
        _this.setState({ btnDisabled: true });
        OrderApi.refuseRefundOrder(obj).then(function (data) {
            _this.setState({ btnDisabled: false });
            if (data.IsOK) {
                _this.closeForm();
                _this.initOrderList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 同意退款申请（填写快递公司和物流单号）
     * @param obj
     */
    agreeRefundSubmitForm(obj) {
        var _this = this;
        obj.RefundId = _this.state.editId;
        obj.CourierCompany = obj.CourierCompany.toUpperCase();
        obj.Remark = obj.Remark1;
        console.log('收到表单值：', obj);
        _this.setState({ btnDisabled: true });
        OrderApi.updateRefundOrderCourierByManager(obj).then(function (data) {
            _this.setState({ btnDisabled: false });
            if (data.IsOK) {
                _this.closeForm();
                _this.initOrderList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 确认退款
     */
    operateRefund(record) {
        var _this = this;
        var obj = { RefundId: record.Id };
        console.log('收到表单值：', obj);
        OrderApi.confirmRefundOrder(obj).then(function (data) {
            if (data.IsOK) {
                _this.initOrderList();
            } else {
                message.error(data.Message);
            }
        });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const orderColumns = [
            {
                title: '商品/名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                width: '30%',
                render: (text, record) => <div className="clearfix">
                    <img className="pull-left margin-right10" src={record.GoodsImg} width="52" height="52" />
                    <div className="pull-left col-xs-10">
                        <p>
                            <a className="color-blue font12" href="javascript:;" onClick={() => { this.showNewPage(record.OrderNo) } }>{text}</a>
                        </p>
                        <p className="color-red">
                            共计{record.GoodsCount}件商品
                        </p>
                    </div>
                </div>,
            },
            {
                title: '订单号',
                dataIndex: 'OrderNo',
                key: 'OrderNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '买家',
                dataIndex: 'NickName',
                key: 'NickName',
                render: (text, record) => { if (record.NickName && record.RealName) { return (<span>{record.NickName}({record.RealName})</span>) } else { return (<span>{record.NickName || record.RealName}</span>) } },
            },
            {
                title: '退款时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '订单状态',
                dataIndex: 'RefundSteps',
                key: 'RefundSteps',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    if (record.RefundSteps == "提交申请") {
                        return (<span>
                            <a href="javascript:;" onClick={() => { this.showNewPage(record.OrderNo) } } >查看详情</a>
                            <span className="ant-divider"></span>
                            <a href="javascript:;" onClick={() => { this.openHandleRefundForm(record) } }>处理申请</a>
                        </span>)
                    } else if (record.RefundSteps == "拒绝退款") {
                        return (<span>
                            <a href="javascript:;" onClick={() => { this.showNewPage(record.OrderNo) } } >查看详情</a>
                            <span className="ant-divider"></span>
                            <a href="javascript:;" onClick={() => { this.openAgreeRefundForm(record) } }>同意退款</a>
                        </span>)
                    } else if (record.RefundSteps == "退货中") {
                        return (<span>
                            <a href="javascript:;" onClick={() => { this.showNewPage(record.OrderNo) } } >查看详情</a>
                            <span className="ant-divider"></span>
                            <Popconfirm title="确定要退款吗？" onConfirm={() => { this.operateRefund(record) } }>
                                <a href="javascript:;">确定退款</a>
                            </Popconfirm>
                        </span>)
                    }
                    else {
                        return (<span>
                            <a href="javascript:;" onClick={() => { this.showNewPage(record.OrderNo) } } >查看详情</a>
                        </span>)
                    }
                },
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
            total: self.state.OrderTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initOrderList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initOrderList();
            },
            showTotal() {
                return `共 ${self.state.OrderTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">退款订单</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <div className="bg-colorF5 margin0">
                            <div className="row  padding-top20 padding-left20">
                                <Form horizontal>
                                    <div className="col-sm-12">
                                        <div className="pull-left margin-top5"><p className="color3">订单号：</p></div>
                                        <ul className="row clearfix">
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <Input className="cp1 form-control" type="text" placeholder="订单号" {...getFieldProps('OrderNo') } />
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <DatePicker showTime placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('StartTime') } />
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <DatePicker showTime placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('EndTime') } />
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-1 col-md-2">
                                                <Button type="primary" size="large" className="btn btn-block" htmlType="submit" onClick={this.searchDataList}>搜索</Button>
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
                        <Tabs activeKey={this.state.RefundSteps} onChange={this.tabsonChange}>
                            {tabConfigs.map(function (item, i) {
                                return (
                                    <TabPane tab={item.name} key={item.key}>
                                        <Table
                                            rowKey={record => record.Id}
                                            columns={orderColumns}
                                            dataSource={self.state.OrderListData}
                                            pagination={pagination}
                                            loading={self.state.loadingOrder}
                                            rowSelection={null}
                                            onRowClick={
                                                (record, index) => {
                                                    self.state.selectedRowKeys = [];
                                                    self.setState({
                                                        selectOrderIndex: index,
                                                        editId: record.Id
                                                    });
                                                }
                                            }
                                            rowClassName={
                                                (record, index) => {
                                                    return index === self.state.selectOrderIndex ? " ant-table-row-active " : "";
                                                }
                                            }
                                            />
                                    </TabPane>
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
                <Modal title="处理退款" visible={this.state.visibleHandleRefundForm} onCancel={this.closeForm} footer={[]} maskClosable={false} >
                    <FormTemplate formElements={this.state.HandleRefundPara} defaultValues={this.state.defaultValues} btnDisabled={this.state.btnDisabled} isInsert={false} editId={this.state.editId} onCancel={this.closeForm} onSubmit={this.submitForm}></FormTemplate>
                </Modal>
                <Modal title="同意退款" visible={this.state.visibleAgreeRefundForm} onCancel={this.closeForm} footer={[]} maskClosable={false} >
                    <FormTemplate formElements={this.state.AgreeRefundPara} defaultValues={this.state.defaultValues} btnDisabled={this.state.btnDisabled} isInsert={false} editId={this.state.editId} onCancel={this.closeForm} onSubmit={this.agreeRefundSubmitForm}></FormTemplate>
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

let RefundOrderIndexPage = Form.create({})(RefundOrderIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(RefundOrderIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
