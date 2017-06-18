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
import { TreeSelect, Timeline } from 'antd';
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

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class OrderDetailIndex extends BaseContainer {
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
        this.initOrderValues = this.initOrderValues.bind(this);
        this.initGoodsList = this.initGoodsList.bind(this);
        this.initOrderRecordList = this.initOrderRecordList.bind(this);

        this.state = {
            GoodsTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            selectedRowKeys: [],//功能选择
            selectGoodsIndex: -1,//选择列表序号
            loadingOrderGoods: false,//正在加载列表
            GoodsListData: [],//订单商品列表数据
            OrderNo: LocalStorage.get('OrderNo'),//订单号
            OrderValues: {},//订单详细信息
            OrderRecordData: [],//订单记录
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initOrderRecordList();
        this.initOrderValues();
        this.initGoodsList();
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
     * 获取订单信息数据
     */
    initOrderValues() {
        var _this = this;
        OrderApi.getGoodsOrder({ "OrderNo": _this.state.OrderNo }).then(function (data) {
            if (data.IsOK) {
                var functionData = data.Value;
                _this.setState({ OrderValues: functionData });
            }
        });
    }
    /**
     * 获取订单商品列表
     */
    initGoodsList() {
        var _this = this;
        _this.state.loadingOrderGoods = true;
        OrderApi.getGoodsPageList({ "OrderNo": _this.state.OrderNo }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.GoodsListData = functionData;
                _this.state.GoodsTotalCount = data.AllCount;
            }
            _this.setState({ loadingOrderGoods: false });
        });
    }
    /**
     * 获取订单日志
     */
    initOrderRecordList() {
        var _this = this;
        OrderApi.getOrderRecordList({ "OrderNo": _this.state.OrderNo }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.OrderRecordData = functionData;
            }
        });
    }
    render() {
        const orderColumns = [
            {
                title: '名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                width: '30%',
                render: (text, record) => <div className="clearfix">
                    <img className="pull-left margin-right10" src={record.ProductImg} width="52" height="52" />
                    <div className="pull-left margin-top15 col-xs-10" >
                        <span>{record.GoodsName}</span>
                    </div>
                </div>,
            },
            {
                title: '商品/赠品',
                dataIndex: 'ProductType',
                key: 'ProductType',
                render: (text, record) => <span> {record.ProductType == "赠品" || record.ProductType == "奖品" ? record.ProductType : "商品"}</span>,
            },
            {
                title: '单价',
                dataIndex: 'UnitPrice',
                key: 'UnitPrice',
                render: (text) => <span> {text.toFixed(2)}</span>,
            },
            {
                title: '数量',
                dataIndex: 'Number',
                key: 'Number',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '运费',
                dataIndex: 'Freight',
                key: 'Freight',
                render: (text) => <span> {text.toFixed(2)}</span>,
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
            total: self.state.GoodsTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initGoodsList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initGoodsList();
            },
            showTotal() {
                return `共 ${self.state.GoodsTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">订单详情</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12 margin-btm20">
                        <div className="clearfix bg-colorF5 padding10 ">
                            <div className="font12 pull-left">
                                <i className="nav-collapse-title-sign"></i>
                                <span className="margin-right15">订单信息</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row margin0 border1" style={{ position: "relative" }}>
                    <div className="col-lg-4 col-sm-12 margin-top20">
                        <Timeline>
                            {this.state.OrderRecordData.map(function (item, i) {
                                return (
                                    <Timeline.Item>{item.Remark}&nbsp; &nbsp; &nbsp; {item.AddTime}</Timeline.Item>
                                );
                            })}
                        </Timeline>
                    </div>
                    <div style={{ width: 1, background: "#ddd", position: "absolute", height: "100%", left: "33.333%", top: 0 }}></div>
                    <div className="col-lg-8 col-sm-12">
                        <ul className="row margin-top20">
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">订单编号: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.OrderNo}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">买家姓名: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.RealName || this.state.OrderValues.NickName}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">订单类型: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.ProductType == "招募" ? "课程" : this.state.OrderValues.ProductType}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">收货人信息: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.ShoppingName}&nbsp; &nbsp; {this.state.OrderValues.ShoppingPhone}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">订单状态: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.OrderStatus}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">收货人地址: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.ShoppingAddress}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">付款方式: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.PayType}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">快递单号: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.LogisticsName}&nbsp; &nbsp; {this.state.OrderValues.LogisticsNumber}</span>
                                </div>
                            </li>
                            <li className="col-lg-6 margin-btm20">
                                <div className="row">
                                    <p className="col-lg-3">买家留言: </p>
                                    <span className="col-lg-7 color9">{this.state.OrderValues.BuyerLeaveMessage}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12 " >
                        <Table
                            rowKey={record => record.Id}
                            columns={orderColumns}
                            dataSource={this.state.GoodsListData}
                            pagination={pagination}
                            loading={this.state.loadingOrderGoods}
                            rowSelection={null}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    this.setState({
                                        selectOrderIndex: index
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectOrderIndex ? " ant-table-row-active " : "";
                                }
                            }
                            />
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

let OrderDetailIndexPage = Form.create({})(OrderDetailIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(OrderDetailIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
