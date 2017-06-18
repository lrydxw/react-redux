import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import {Button} from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, DatePicker } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';

//api
import OrderApi from './OrderApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
//tab选项
const tabConfigs = [
    { name: "全部", key: "0" },
    { name: "待发货", key: "2" },
    { name: "出库中", key: "3" },
    { name: "待收货", key: "4" },
    { name: "已完成", key: "5" }
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class PressieOrderIndex extends BaseContainer {
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
        this.importOrder = this.importOrder.bind(this);
        this.showExportOrderModel = this.showExportOrderModel.bind(this);
        this.showImportOrderModel = this.showImportOrderModel.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.exportOrder = this.exportOrder.bind(this);
        this.searchData = {};

        this.state = {
            OrderTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingOrder: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectOrderIndex: -1,//选择列表序号
            OrderListData: [],//列表数据
            OrderStatus: "0",//订单状态
            SearchType: "0",//搜索下拉选择
            visibleExportOrder: false,
            visibleImportOrder: false
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initOrderList();
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
        if (obj.SearchType == "0") {
            //订单号
            obj.OrderNo = obj.Keywords;
        } else if (obj.SearchType == "1") {
            //手机号
            obj.ShoppingPhone = obj.Keywords;
        } else if (obj.SearchType == "2") {
            //姓名
            obj.ShoppingName = obj.Keywords;
        }
        _this.state.OrderStatus = "0";
        _this.state.SearchType = obj.SearchType;
        _this.searchData = obj;
        _this.initOrderList();
    }
    /**
     * 获取订单列表数据
     */
    initOrderList() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.OrderStatus = _this.state.OrderStatus;
        obj.OrderType = 5;//赠品订单
        console.log(obj);

        _this.setState({ loadingOrder: true });
        OrderApi.getGoodsOrderPageList(obj).then(function (data) {
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
        setFieldsValue({ "SearchType": _this.state.SearchType });
    }

    tabsonChange(key) {
        var _this = this;
        _this.state.OrderStatus = key;
        _this.initOrderList();
    }

    /**
   * 验证文件名
   */
    checkFileName(rule, value, callback) {
        if (value && ((/[\\/:\*\?""<>\|]/).test(value.toString().trim()))) {
            callback('文件名中包含非法字符');
        }
        else {
            callback();
        }
    }
    exportOrder() {
        var _this = this;
        const { getFieldValue} = _this.props.form;

        _this.props.form.validateFields(["ExportOrderName"], { force: true }, (errors, values) => {

            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            var exportOrderName = getFieldValue("ExportOrderName");

            Tool.ExportCSVFile("/Order/ExportOrder?exportOrderName=" + encodeURIComponent(exportOrderName), { OrderType: 5 });
            _this.handleCancel();

        });

    }

    importOrder() {
        const { getFieldValue} = this.props.form;
        var _this = this;

        _this.props.form.validateFields(["ResourceUrl"], { force: true }, (errors, values) => {

            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            OrderApi.ImportOrder({ FilePath: _this.state.ResourceUrl }).then(function (data) {
                if (data.IsOK) {
                    _this.handleCancel();
                }

            });

        });

    }

    showImportOrderModel() {
        this.setState({ visibleImportOrder: true });
    }

    showExportOrderModel() {

        const {setFieldsValue } = this.props.form;
        this.state.visibleExportOrder = true;
        setFieldsValue({ "ExportOrderName": new Date().toLocaleDateString().replace(/\//g, "-") + "发货单" });
        this.setState({ visibleExportOrder: true });

    }

    handleCancel() {
        this.setState({ visibleExportOrder: false, visibleImportOrder: false });
    }


    showNewPage(OrderNo) {
        Tool.goPush('Order/OrderDetail');
        LocalStorage.add('OrderNo', OrderNo);
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const fileProps = {
            accept: ".xls,.xlsx",
            uploadList: false,
            multiple: false,
            action: "/UploadFile/UploadFile",
            data: {
                type: 'course',
                format: 'large'
            },
            fileList: this.state["ResourceUrlFileList"],
            onChange: (info) => {
                this.state.hasUpload = false;
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
                        this.state.hasUpload = true;//上传成功
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "ResourceUrl";
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
                this.setState({ ResourceUrlFileList: fileList, ResourceUrl: val });
            },
            onPreview: (file) => { }
        };

        const exportOrderNameProps = getFieldProps('ExportOrderName', {
            validate: [{
                rules: [
                    { required: true, message: '请输入导出名称' },
                    { validator: this.checkFileName },
                ], trigger: ['onBlur', 'onChange'],
            }]


        });

        const rsourceUrlProps = getFieldProps('ResourceUrl', {
            validate: [{
                rules: [
                    { required: true, message: '请上传文件' }
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const orderColumns = [
            {
                title: '商品/名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                width: '28%',
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
                width: '12%',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '买家',
                dataIndex: 'NickName',
                key: 'NickName',
                width: '10%',
                render: (text, record) => { if (record.NickName && record.RealName) { return (<span>{record.NickName}({record.RealName})</span>) } else { return (<span>{record.NickName || record.RealName}</span>) } },
            },
            {
                title: '收货人姓名',
                dataIndex: 'ShoppingName',
                key: 'ShoppingName',
                width: '5%',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '收货人手机号',
                dataIndex: 'ShoppingPhone',
                key: 'ShoppingPhone',
                width: '10%',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '赠送时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '订单状态',
                dataIndex: 'OrderStatus',
                key: 'OrderStatus',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.showNewPage(record.OrderNo) } } >查看详情</a>
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
                    <a className="main-content-word pull-left  set-content-word-te">赠品订单</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <div className="bg-colorF5">
                            <Form horizontal>
                                <div className="row padding20">
                                    <div className=" margin-left15 clearfix">
                                        <div className="wechat-box-W5 pull-left">
                                            <FormItem>
                                                <Select allowClear={true} {...getFieldProps('SearchType') }>
                                                    <Option value="0">订单号</Option>
                                                    <Option value="1">收货人手机号</Option>
                                                    <Option value="2">收货人姓名</Option>
                                                </Select>
                                            </FormItem>
                                        </div>
                                        <div className="wechat-box-W5 pull-left">
                                            <FormItem>
                                                <Input className="cp1 form-control" type="text" placeholder="关键词" {...getFieldProps('Keywords') } />
                                            </FormItem>
                                        </div>
                                    </div>
                                    <div className="margin-left15 clearfix">
                                        <div className="wechat-box-W8 pull-left">
                                            <FormItem>
                                                <DatePicker style={{ width: 200 }} showTime={true} placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('StartTime') } />
                                            </FormItem>
                                        </div>
                                        <div className="wechat-box-W5 pull-left">
                                            <FormItem>
                                                <DatePicker style={{ width: 200 }} showTime={true} placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('EndTime') } />
                                            </FormItem>
                                        </div>
                                    </div>
                                    <div className="margin-left15 clearfix">
                                        <div className="wechat-bat2 pull-left">
                                            <Button type="primary" size="large" className="btn btn-block" htmlType="submit" onClick={this.searchDataList}>搜索</Button>
                                        </div>
                                        <div className="wechat-bat1 pull-left">
                                            <Button type="ghost" icon="upload" size="large" onClick={this.showImportOrderModel}> 导入发货单</Button>
                                        </div>
                                        <div className="wechat-bat1 pull-left">
                                            <Button type="ghost" icon="download" size="large" onClick={this.showExportOrderModel}> 导出发货单</Button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="row margin-top20">
                    <div className="col-xs-12 " >
                        <Tabs activeKey={this.state.OrderStatus} onChange={this.tabsonChange}>
                            {tabConfigs.map(function (item, i) {
                                return (
                                    <TabPane tab={item.name} key={item.key}>
                                        <Table
                                            rowKey={record => record.Id}
                                            columns={orderColumns}
                                            dataSource={self.state.OrderListData}
                                            pagination={pagination }
                                            loading={self.state.loadingOrder}
                                            rowSelection={null}
                                            onRowClick={
                                                (record, index) => {
                                                    self.state.selectedRowKeys = [];
                                                    self.setState({
                                                        selectOrderIndex: index
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
                            }) }
                        </Tabs>
                    </div>
                </div>

                <Modal title="导出发货单" visible={this.state.visibleExportOrder} onCancel={this.handleCancel} footer={[]} maskClosable={false}>
                    <div className="modal-body clearfix">
                        <div className="form-horizontal tasi-form padding20">

                            <div className="form-group">
                                <div className="row">
                                    <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>发货单名称：</label>
                                    <div className="col-xs-7">
                                        <FormItem>
                                            <Input className="cp1 form-control" type="text" placeholder="请输入发货单名称" {...exportOrderNameProps } />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <label className="control-label col-xs-3 text-right"></label>
                                    <div className="col-xs-7 color-red margin-top20">
                                        点击“导出”，此批订单状态更改为“出库中”
                                    </div>
                                </div>
                            </div>
                            <div className="row padding-top20">
                                <div className="col-xs-4 col-xs-offset-4">

                                    <Button type="primary" size="large" className="btn-success btn btn-block" onClick={this.exportOrder }>导出</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>


                <Modal title="导入发货单" visible={this.state.visibleImportOrder} onCancel={this.handleCancel} footer={[]} maskClosable={false} >
                    <div className="modal-body clearfix">
                        <div className="form-horizontal tasi-form padding20">
                            <div className="form-group">
                                <div className="row">
                                    <label className="control-label col-xs-4  text-right margin-top10"><span className="color-red">*</span>选择文件：</label>
                                    <div className="col-xs-8">
                                        <FormItem >
                                            <Input type="hidden" placeholder="导入发货单" {...rsourceUrlProps} />
                                            <Upload {...fileProps}  name="upload" >
                                                <Button type="ghost">
                                                    <Icon type="upload" /> 点击上传
                                                </Button>
                                            </Upload>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-xs-8 col-xs-offset-2">
                                        <span className="color-red margin-left15">点击“导入”，此批订单状态更改为“待收货”</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row padding-top20">
                                <div className="col-xs-4 col-xs-offset-4">
                                    <Button type="primary" size="large" className="btn-success btn btn-block" onClick={this.importOrder }>导入</Button>
                                </div>
                            </div>
                        </div>
                    </div>
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

let PressieOrderIndexPage = Form.create({})(PressieOrderIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(PressieOrderIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
