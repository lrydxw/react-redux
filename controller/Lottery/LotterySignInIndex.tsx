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
//api
import LotteryApi from './LotteryApi';
//表单组件
const store = BaseStore({});
const TabPane = Tabs.TabPane;
const tabConfigs = [
    { name: "全部", key: "false" },
    { name: "已中奖", key: "true" }
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class LotterySignInIndex extends BaseContainer {
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

        this.searchData = {};
        this.initTableData = this.initTableData.bind(this);
        this.initDrawLottery = this.initDrawLottery.bind(this);
        this.inputonChange = this.inputonChange.bind(this);
        this.tabsonChange = this.tabsonChange.bind(this);
        this.searchDataList = this.searchDataList.bind(this);

        this.state = {
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingTable: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            selectedRowId: "",//当前选择的Id
            TableData: [],//列表数据
            LotteryId: LocalStorage.get('LotteryId'),
            LotteryName: LocalStorage.get('LotteryName'),
            Keywords: "",
            IsPrize: "false",
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
     * 搜索
     */
    searchDataList() {
        var _this = this;
        _this.state.IsPrize = "false";
        _this.initTableData();
    }
    /**
     * 获取table数据
     */
    initTableData() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.LotteryId = _this.state.LotteryId;
        obj.IsPrize = _this.state.IsPrize;
        obj.Keywords = _this.state.Keywords;
        if (obj.Keywords)//有关键词从第一页查询
            obj.PageIndex = 1;

        _this.setState({ loadingTable: true });
        LotteryApi.getLotterySignInPageList(obj).then(function (data) {
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
    }
    /**
     * 摇奖
     */
    initDrawLottery() {
        var _this = this;
        var obj = obj || {};
        obj.LotteryId = _this.state.LotteryId;
        if (_this.state.TotalCount == 0) {
            Modal.error({
                title: '温馨提示',
                content: '暂无签到用户',
            });
            return;
        }
        LotteryApi.drawLottery(obj).then(function (data) {
            if (data.IsOK) {
                Modal.success({
                    title: '操作成功',
                    content: '摇奖成功',
                });
            } else {
                Modal.error({
                    title: '温馨提示',
                    content: data.Message,
                });
            }
        });
    }
    inputonChange(e) {
        var _this = this;
        _this.state.Keywords = e.target.value;
    }
    tabsonChange(key) {
        var _this = this;
        _this.state.IsPrize = key;
        _this.initTableData();
    }
    render() {
        const tableColumns = [
            {
                title: '签到人',
                dataIndex: 'RealName',
                key: 'RealName',
                render: (text, record) => <span> {text}({record.NickName})</span>,
            },
            {
                title: '签到时间',
                dataIndex: 'SignInTime',
                key: 'SignInTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '联系电话',
                dataIndex: 'Mobile',
                key: 'Mobile',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '是否中奖',
                dataIndex: 'IsPrize',
                key: 'IsPrize',
                render: (text) => <span> {text ? '中奖' : '未中奖'}</span>,
            },
            {
                title: '奖品等级',
                dataIndex: 'PrizeLevel',
                key: 'PrizeLevel',
                render: (text) => { if (text == 1) { return (<span>一等奖</span>) } else if (text == 2) { return (<span>二等奖</span>) } else if (text == 3) { return (<span>三等奖</span>) } },
            },
            {
                title: '奖品',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                render: (text) => <span> {text}</span>,
            }
        ];
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
                    <a className="main-content-word pull-left  set-content-word-te">签到记录({this.state.LotteryName})</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={this.initDrawLottery}>摇奖</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="签到人姓名、昵称、电话" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.searchDataList} />
                            <span className="input-group-addon  search-btn" onClick={this.searchDataList}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Tabs activeKey={this.state.IsPrize} onChange={this.tabsonChange}>
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
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let LotterySignInIndexPage = Form.create({})(LotterySignInIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(LotterySignInIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
