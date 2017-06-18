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
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
//tab选项
const tabConfigs = [
    { name: "全部", key: "0" },
    { name: "退款处理中", key: "12" },
    { name: "退款完成", key: "15" }
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class LossOrderIndex extends BaseContainer {
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
        obj.OrderType = 0;//赠品订单
        console.log(obj);

        _this.state.loadingOrder = true;
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
    showNewPage(OrderNo) {
        Tool.goPush('Order/OrderDetail');
        LocalStorage.add('OrderNo', OrderNo);
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const orderColumns = [
            {
                title: '订单号',
                dataIndex: 'OrderNo',
                key: 'OrderNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '买家',
                dataIndex: 'MemberName',
                key: 'MemberName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '所属商品',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
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
                title: '实付金额',
                dataIndex: 'ActualAmountPaid',
                key: 'ActualAmountPaid',
                render: (text) => <span> {text.toFixed(2)}</span>,
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
                    <a className="main-content-word pull-left  set-content-word-te">掉单处理</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <div className="bg-colorF5 margin0">
                            <div className="row  padding-top20 padding-left20">
                                <Form horizontal>
                                    <div className="col-sm-12">
                                        <ul className="row clearfix">
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <Select allowClear {...getFieldProps('SearchType') }>
                                                        <Option value="0">订单号</Option>
                                                        <Option value="1">收货人手机号</Option>
                                                        <Option value="2">收货人姓名</Option>
                                                    </Select>
                                                </FormItem>
                                            </li>
                                            <li className="col-lg-2 col-md-3">
                                                <FormItem>
                                                    <Input className="cp1 form-control" type="text" placeholder="关键词" {...getFieldProps('Keywords') } />
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
                                                <Button type="primary" size="large" className="btn btn-block" onClick={this.searchDataList}>搜索</Button>
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
                        <Tabs defaultActiveKey="0" onChange={this.tabsonChange}>
                            {tabConfigs.map(function (item, i) {
                                return (
                                    <TabPane tab={item.name} key={item.key}>
                                        <Table
                                            rowKey={record => record.Id}
                                            columns={orderColumns}
                                            dataSource={self.state.OrderListData}
                                            pagination={pagination}
                                            loading={self.state.loadingOrder}
                                            rowSelection={rowSelection}
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
                            })}
                        </Tabs>
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

let LossOrderIndexPage = Form.create({})(LossOrderIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(LossOrderIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

