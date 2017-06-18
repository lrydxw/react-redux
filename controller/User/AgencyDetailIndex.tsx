import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Tabs, Tree, Button } from 'antd';
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import * as Highcharts from 'highcharts'
//api
import AgencyManageApi from './AgencyManageApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;



/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class AgencyDetailIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initAgencyInfo = this.initAgencyInfo.bind(this);
        this.loadAgencyOrderList = this.loadAgencyOrderList.bind(this);
        this.tabsonChange = this.tabsonChange.bind(this);
        this.loadChart = this.loadChart.bind(this);
        this.loadAgencyPayOrderList = this.loadAgencyPayOrderList.bind(this);
        this.getNewTreeData = this.getNewTreeData.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        this.loadAgencyList = this.loadAgencyList.bind(this);
        this.exportMyAgencyList = this.exportMyAgencyList.bind(this);

        this.state = {
            agencyOrderListData: [],//列表数据
            agencyPayOrderListData: [],//列表数据
            loadingAgencyOrderData: false,//正在加载列表
            loadingAgencyPayOrderData: false,//正在加载列表
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            MemberId: LocalStorage.get('MemberId'),
            AgencyInfo: {},
            selectTabKey: "",
            treeData: [],
            agencyData: []
        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initAgencyInfo();
        this.loadAgencyOrderList();
        this.loadAgencyPayOrderList();
        this.loadChart();
        this.loadAgencyList();

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
    componentWillReceiveProps(nextState) {

    }


    loadAgencyList() {
        var _this = this;
        var obj = obj || {};
        obj.AgencyId = _this.state.MemberId;
        obj.PageIndex = _this.state.PageIndex;
        AgencyManageApi.getMyAgencyList(obj).then(function (data) {
            if (data.IsOK) {

                var oneLevelData = _this.state.treeData;
                for (var i = 0; i < data.Value.length; i++) {
                    var curr = data.Value[i];
                    oneLevelData.push({ name: curr.NickName, key: curr.Id, headImgURL: curr.HeadImgURL, parentId: curr.ParentId, childrenCount: curr.ChildrenCount });
                }

                _this.state.PageIndex = data.NextPage;
                _this.setState({ treeData: oneLevelData });

            }
            else {
                message.error(data.Message);
            }

        });

    }


    initAgencyInfo() {
        var _this = this;
        var memberId = _this.state.MemberId;
        AgencyManageApi.getAgencyDetailMemberInfo({ AgencyMemberId: memberId }).then(function (data) {
            if (data.IsOK) {
                var obj = obj || {};
                var result = data.Value;
                obj.WeId = result.WeId;
                obj.HeadImgURL = result.HeadImgURL;
                obj.Mobile = result.Mobile;
                obj.RealName = result.RealName;
                obj.SuperiorAnency = result.SuperiorAnency;
                obj.LastLoginTime = result.LastLoginTime;
                obj.NickName = result.NickName;
                _this.state.AgencyInfo = obj;
                _this.setState({ AgencyInfo: obj });

            }
            else {
                message.error(data.Message);
            }

        });
    }

    loadAgencyOrderList() {
        var _this = this;
        var agencyId = _this.state.MemberId;
        var obj = obj || {};
        obj.AgnecyId = agencyId;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        _this.setState({ loadingAgencyOrderData: true });
        AgencyManageApi.getAgnecyOrderPageList(obj).then(function (data) {
            if (data.IsOK) {
                _this.state.agencyOrderListData = data.Value;
                _this.state.TotalCount = data.AllCount;
                _this.setState({ loadingAgencyOrderData: false });
            }
            else {
                message.error(data.Message);
            }

        });
    }

    loadAgencyPayOrderList() {
        var _this = this;
        var agencyId = _this.state.MemberId;
        var obj = obj || {};
        obj.AgnecyId = agencyId;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        _this.setState({ loadingAgencyPayOrderData: true });
        AgencyManageApi.getAgnecyPayOrderPageList(obj).then(function (data) {
            if (data.IsOK) {
                _this.state.agencyPayOrderListData = data.Value;
                _this.state.TotalCount = data.AllCount;
                _this.setState({ loadingAgencyPayOrderData: false });
            }
            else {
                message.error(data.Message);
            }

        });
    }


    tabsonChange(key) {
        var _this = this;
        _this.state.selectTabKey = key;

        _this.state.PageIndex = 1;

        //_this.initStudentList();
    }

    exportMyAgencyList() {
        var _this = this;
        Tool.ExportCSVFile("/User/ExportMyAgencyList", { AgencyId: _this.state.MemberId });
    }

    getNewTreeData(treeData, curKey, child, level) {
        const loop = (data) => {

            if (level < 1) return;
            data.forEach((item) => {


                if (item.children) {
                    loop(item.children);
                } else {
                    if (item.key === curKey) {
                        item.children = child;
                        return;
                    }
                }
            });

        };
        loop(treeData);
        //this.setLeaf(treeData, curKey, level);
    }

    onSelect(info) {
        console.log('selected', info);
    }

    onLoadData(treeNode) {
        var self = this;
        return new Promise((resolve) => {
            const treeData = self.state.treeData;
            const arr = [];
            const key = treeNode.props.eventKey;
            var obj = obj || {};
            obj.AgencyId = key;

            AgencyManageApi.getMyAgencyList(obj).then(function (data) {
                if (data.IsOK) {
                    for (var i = 0; i < data.Value.length; i++) {
                        var curr = data.Value[i];
                        arr.push({ name: curr.NickName, key: curr.Id, headImgURL: curr.HeadImgURL, parentId: curr.ParentId, childrenCount: curr.ChildrenCount })
                    }
                    self.state.agencyData = arr;
                    self.getNewTreeData(treeData, treeNode.props.eventKey, arr, 2);
                    self.setState({ treeData });
                }
                else {
                    message.error(data.Message);
                }
                resolve({});
            });
        });
    }


    loadChart() {

        var _this = this;
        var agencyId = _this.state.MemberId;

        AgencyManageApi.getAgencyInfo({ AgencyId: agencyId }).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container2',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '三级关系图'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: '总占比',

                        data: [
                            {
                                name: '一级代理',
                                y: obj.OneLevelAgencyProportion
                            }, {
                                name: '二级代理',
                                y: obj.TwoLevelAgencyProportion
                            }, {
                                name: '三级代理',
                                y: obj.ThreeLevelAgencyProportion
                            }]
                    }],
                    credits: { text: '', href: '' }
                });
            }
            else {
                message.error(data.Message);
            }

        });



    }


    render() {

        const loop = data => data.map((item) => {
            if (item.children) {
                console.log(item);
                return <TreeNode title={<span> <img width="52" height="52" src={item.headImgURL} alt="头像" /> <span>{item.name}【{item.childrenCount}】</span></span>} key={item.key}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={<span> <img width="52" height="52" src={item.headImgURL} alt="头像" /> <span>{item.name}【{item.childrenCount}】 </span></span>} key={item.key} isLeaf={item.childrenCount == 0} />;
        });
        const treeNodes = loop(this.state.treeData);



        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };


        const agencyOrderColumns = [
            {
                title: '订单号',
                dataIndex: 'OrderNo',
                key: 'OrderNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '数量',
                dataIndex: 'GoodsCount',
                key: 'GoodsCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '总价格',
                dataIndex: 'GoodsTotalAmount',
                key: 'GoodsTotalAmount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '订单状态',
                dataIndex: 'OrderStatus',
                key: 'OrderStatus',
                render: (text) => <span> {text}</span>,
            },


        ];


        const agencyPayOrderColumns = [
            {
                title: '交易号',
                dataIndex: 'TradeSerialNo',
                key: 'TradeSerialNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '类型',
                dataIndex: 'PayType',
                key: 'PayType',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '金额',
                dataIndex: 'PayAmount',
                key: 'PayAmount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '状态',
                dataIndex: 'PayStatus',
                key: 'PayStatus',
                render: (text) => <span> {text}</span>,
            },


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
                if (self.state.selectTabKey == "payOrder") {
                    self.loadAgencyPayOrderList();
                }
                else {
                    self.loadAgencyOrderList();
                }
            },
            onChange(current) {
                self.state.PageIndex = current;
                if (self.state.selectTabKey == "payOrder") {
                    self.loadAgencyPayOrderList();
                }
                else {
                    self.loadAgencyOrderList();
                }
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };


        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">用户详情</a>
                </div>
                <div className="row  margin-top20">
                    <div className="col-xs-12 ">
                        <section className="panel">
                            <header className="panel-heading bg-colorEC padding5 font12">
                                <i className="nav-collapse-title-sign"></i>
                                <span className="margin-right15">用户信息</span>
                            </header>
                            <div className="panel-body border1">
                                <div className="row text-center">
                                    <div className="col-xs-2 border-right1 padding-top10 padding-btm10">
                                        <p><img width="52" src={this.state.AgencyInfo.HeadImgURL} /></p>
                                        <span>{this.state.AgencyInfo.NickName}</span>
                                    </div>
                                    <div className="col-xs-2  padding-top10 padding-btm10">
                                        <p className="margin-btm20">WEID</p>
                                        <span className="color9">{this.state.AgencyInfo.WeId}</span>
                                    </div>
                                    <div className="col-xs-2  padding-top10 padding-btm10">
                                        <p className="margin-btm20">姓名</p>
                                        <span className="color9">{this.state.AgencyInfo.RealName}</span>
                                    </div>
                                    <div className="col-xs-2  padding-top10 padding-btm10">
                                        <p className="margin-btm20">上级代理</p>
                                        <span className="color9">{this.state.AgencyInfo.SuperiorAnency}</span>
                                    </div>
                                    <div className="col-xs-2  padding-top10 padding-btm10">
                                        <p className="margin-btm20">登录账号</p>
                                        <span className="color9">{this.state.AgencyInfo.Mobile}</span>
                                    </div>
                                    <div className="col-xs-2  padding-top10 padding-btm10">
                                        <p className="margin-btm20">最近登录日期</p>
                                        <span className="color9">{this.state.AgencyInfo.LastLoginTime}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="row">


                    <Tabs onChange={self.tabsonChange}>
                        <TabPane tab="订单列表" key="order">
                            <Table
                                rowKey={record => record.Id}
                                columns={agencyOrderColumns}
                                dataSource={self.state.agencyOrderListData}
                                bordered
                                pagination={pagination}
                                loading={self.state.loadingAgencyOrderData}
                                />
                        </TabPane>

                        <TabPane tab="财务列表" key="payOrder">
                            <Table
                                rowKey={record => record.Id}
                                columns={agencyPayOrderColumns}
                                dataSource={self.state.agencyPayOrderListData}
                                bordered
                                pagination={pagination}
                                loading={self.state.loadingAgencyPayOrderData}

                                />
                        </TabPane>
                    </Tabs>


                </div>

                <div className="row margin-top20">
                    <div className="col-xs-12 ">
                        <section className="panel">
                            <header className="panel-heading bg-colorEC padding5 font12 clearfix">
                                <span className="pull-left">
                                    <i className="nav-collapse-title-sign"></i>
                                    <span className="margin-right15">代理信息</span>
                                </span>
                                <a onClick={this.exportMyAgencyList} className="pull-right color-blue font14 "><i className="fa fa-download"></i>批量导出学员</a>
                            </header>
                            <div className="panel-body border1">
                                <div className="row">
                                    <div id="container2" className="col-xs-5 border-right1 padding15">


                                    </div>
                                    <ul className="col-xs-6 col-xs-offset-1 padding-top5 padding-btm5" style={{ height: "400px", overflow: "auto" }}>
                                        <li className="row padding-btm10 padding-top10">
                                            <Tree onSelect={this.onSelect} loadData={this.onLoadData}>
                                                {treeNodes}
                                            </Tree>
                                        </li>
                                        <li>  <Button style={{ display: this.state.PageIndex == -1 ? "none" : "" }} type="ghost" onClick={this.loadAgencyList}>点击加载更多</Button></li>
                                    </ul>


                                </div>
                            </div>
                        </section>
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

let AgencyDetailIndexPage = Form.create({})(AgencyDetailIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(AgencyDetailIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
