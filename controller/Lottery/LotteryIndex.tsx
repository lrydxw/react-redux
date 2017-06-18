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
import * as QRCode from 'qrcode-js';
//表单组件
const store = BaseStore({});
const TabPane = Tabs.TabPane;
const tabConfigs = [
    { name: "全部", key: "0" },
    { name: "未开奖", key: "1" },
    { name: "已开奖", key: "2" }
];

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ExtendIndex extends BaseContainer {
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
        this.updateLotterySetPublish = this.updateLotterySetPublish.bind(this);
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
            LotteryName: "",//搜索关键词
            LotteryStatus: "0",//开奖状态
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
        _this.state.LotteryStatus = "0";
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
        obj.LotteryStatus = _this.state.LotteryStatus;
        obj.LotteryName = _this.state.LotteryName;
        if (obj.LotteryName) //有关键词从第一页查询
            obj.PageIndex = 1;

        _this.setState({ loadingTable: true });
        LotteryApi.getLotterySetPageList(obj).then(function (data) {
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
     * 修改发布状态
     * @param Id
     * @param IsPublish
     */
    updateLotterySetPublish(Id, IsPublish) {
        var _this = this;
        var obj = { Id: Id, IsPublish: IsPublish };
        LotteryApi.updateLotterySetPublish(obj).then(function (data) {
            if (data.IsOK) {
                _this.initTableData();
            } else {
                message.error(data.Message);
            }
        });
    }
    showNewPage(Id) {
        LocalStorage.add('Id', Id);
        Tool.goPush('Lottery/LotterySetEdit');
    }
    showLotterySignInPage(Id, Name) {
        LocalStorage.add('LotteryId', Id);
        LocalStorage.add('LotteryName', Name);
        Tool.goPush('Lottery/LotterySignIn');
    }
    inputonChange(e) {
        var _this = this;
        _this.state.LotteryName = e.target.value;
    }
    tabsonChange(key) {
        var _this = this;
        _this.state.LotteryStatus = key;
        _this.initTableData();
    }
    createImg(siteDomain, Id) {
        var imgUrl = QRCode.toDataURL("http://" + siteDomain + "/LotteryIndex?LotteryId=" + Id, 2);
        return imgUrl;
    }
    render() {
        const tableColumns = [
            {
                title: '听课签到抽奖标题',
                dataIndex: 'LotteryName',
                key: 'LotteryName',
                render: (text) => <span className="col-xs-10"> {text}</span>,
            },
            {
                title: '所属课程',
                dataIndex: 'ProductName',
                key: 'ProductName',
                width: '30%',
                render: (text, record) => <div className="clearfix">
                    <img className="pull-left col-xs-3 padding-left0" src={this.createImg(record.SiteDomain, record.Id)} width="82" />
                    <div className="pull-left col-xs-9 padding-left0">
                        <p className="margin-top10">
                            所属课程：<span> {text}</span>
                        </p>
                        <p className="margin-top30">
                            签到链接：<a href={"http://" + record.SiteDomain + "/LotteryIndex?LotteryId=" + record.Id}>http://{record.SiteDomain}/LotteryIndex?LotteryId={record.Id}</a>
                        </p>
                    </div>
                </div>,
            },
            {
                title: '签到开始时间',
                dataIndex: 'StartTime',
                key: 'StartTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '签到结束时间',
                dataIndex: 'EndTime',
                key: 'EndTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '奖品数量',
                dataIndex: 'PrizeList',
                key: 'PrizeList',
                render: (text) => <span>{
                    text != null && text.length > 0 ? text.map(function (item, index) {
                        if (item.PrizeLevel == 1) { return (<p key={"table_PrizeList_" + index}>一等奖：{item.PrizeCount}名</p>); }
                        else if (item.PrizeLevel == 2) { return (<p key={"table_PrizeList_" + index}>二等奖：{item.PrizeCount}名</p>); }
                        else if (item.PrizeLevel == 3) { return (<p key={"table_PrizeList_" + index}>三等奖：{item.PrizeCount}名</p>); }
                    }) : '暂无'
                }</span>,
            },
            {
                title: '签到人数',
                dataIndex: 'SignInCount',
                key: 'SignInCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '活动状态',
                dataIndex: 'active',
                key: 'active',
                render: (text, record) => {
                    if (Tool.compareDateTime(record.StartTime, Tool.getNowFormatDate())) {
                        return (<span>未开始</span>)
                    } else {
                        if (Tool.compareDateTime(Tool.getNowFormatDate(), record.StartTime) && Tool.compareDateTime(record.EndTime, Tool.getNowFormatDate())) {
                            return (<span>已开始</span>)
                        } else {
                            return (<span> 已结束</span>)
                        }
                    }
                },
            },
            {
                title: '开奖状态',
                dataIndex: 'LotteryStatus',
                key: 'LotteryStatus',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '是否发布',
                dataIndex: 'IsPublish',
                key: 'IsPublish',
                render: (text) => <span> {text ? '是' : '否'}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.showNewPage(record.Id) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title={!record.IsPublish ? "确定要发布吗？" : "确定要取消发布吗？"} onConfirm={() => { this.updateLotterySetPublish(record.Id, !record.IsPublish) } }>
                            <a href="javascript:;">{!record.IsPublish ? "发布" : "取消发布"}</a>
                        </Popconfirm>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={() => { this.showLotterySignInPage(record.Id, record.LotteryName) } }>签到记录</a>
                    </span>
                ),
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
                    <a className="main-content-word pull-left  set-content-word-te">营销 / 签到抽奖</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={() => { this.showNewPage("") } }>添加签到抽奖</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="搜索" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.searchDataList} />
                            <span className="input-group-addon  search-btn" onClick={this.searchDataList}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Tabs activeKey={this.state.LotteryStatus} onChange={this.tabsonChange}>
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

let ExtendIndexPage = Form.create({})(ExtendIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ExtendIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
