//用户概况
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
import { TreeSelect, Progress } from 'antd';
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, DatePicker } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import AgencyManageApi from './AgencyManageApi';
import { cnmap } from './cnmap-all';
//表单验证模块
import Verifier from '../../pub/Verifier';
import * as Highcharts from 'highcharts';
import * as HighchartsMap from 'highcharts/highmaps';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class UserOverviewIndex extends BaseContainer {
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
        this.countPeriodOnClick = this.countPeriodOnClick.bind(this);
        this.initMemberProfile = this.initMemberProfile.bind(this);
        this.initDataStatistics = this.initDataStatistics.bind(this);
        this.initMemberAreaDistribute = this.initMemberAreaDistribute.bind(this);
        this.selectMemberType = this.selectMemberType.bind(this);
        this.initMapJoinData = this.initMapJoinData.bind(this);
        this.initMemberPercent = this.initMemberPercent.bind(this);
        this.initMemberRankList = this.initMemberRankList.bind(this);

        this.searchData = {};

        this.state = {
            PageIndex: 1, //当前页
            PageSize: 35, //每页条数
            CountPeriod: 7,//统计周期
            MemberProfile: {},//用户概况
            MemberType: 1,//地区数据用户类型
            MemberAreaDistributeData: [],//用户地区分布数据
            MapJoinData: [],//地图展示数据
            MemberIntegralRankData: [],//积分排行数据
            MemberExperienceRankData: [],//用户经验值排行数据
            PartnerIntegralRankData: [],//合作伙伴积分排行
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initMemberProfile();
        this.initDataStatistics();
        this.initMemberAreaDistribute();
        this.initMemberPercent();
        this.initMemberRankList();
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
     * 用户概况
     */
    initMemberProfile() {
        var _this = this;
        AgencyManageApi.getMemberProfile({}).then(function (data) {
            if (data.IsOK) {
                _this.setState({ MemberProfile: data.Value });
            }
        });
    }
    /**
     * 用户增长趋势图数据
     */
    initDataStatistics() {
        var _this = this;
        AgencyManageApi.getMemberStatistics({ "Period": _this.state.CountPeriod }).then(function (data) {
            if (data.IsOK) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'highcharts',
                        zoomType: 'x'
                    },
                    title: { text: null },
                    subtitle: { text: null },
                    xAxis: {
                        categories: data.Value.Categories,
                    },
                    yAxis: {
                        title: {
                            text: '人'
                        }
                    },
                    tooltip: {
                        valueSuffix: '人'
                    },
                    series: [
                        {
                            name: '用户',
                            data: data.Value.MemberCount
                        }
                    ],
                    credits: { text: '', href: '' }
                });
            }
        });
        _this.setState({ CountPeriod: _this.state.CountPeriod });
    }
    /**
     * 统计周期
     */
    countPeriodOnClick(CountPeriod) {
        var _this = this;
        _this.state.CountPeriod = CountPeriod;
        _this.initDataStatistics();
    }
    /**
     * 用户地区分布数据
     */
    initMemberAreaDistribute() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.MemberType = _this.state.MemberType;
        AgencyManageApi.getMemberAreaDistribute(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                var mapData = [];
                if (Array.isArray(data.Value)) {
                    //百分比数据，前十个
                    functionData = data.Value.slice(0, 10);
                    //地图数据，所有
                    for (var i = 0; i < data.Value.length; i++) {
                        mapData.push({ "cn-name": data.Value[i].ProvinceName, "value": data.Value[i].MemberCount });
                    }
                    _this.state.MapJoinData = mapData;
                    _this.initMapJoinData();
                }
                _this.setState({ MemberAreaDistributeData: functionData, MemberType: _this.state.MemberType });
            }
        });
    }
    /**
     * 加载地图关联数据
     */
    initMapJoinData() {
        var _this = this;
        var memberType = "";
        if (_this.state.MemberType == 1) {
            memberType = "用户";
        } else if (_this.state.MemberType == 2) {
            memberType = "代理";
        } else if (_this.state.MemberType == 3) {
            memberType = "合作伙伴";
        }
        var maps = HighchartsMap.mapChart('highchartsMap', {
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            mapNavigation: {
                enabled: false,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            tooltip: {
                pointFormat: '{point.properties.cn-name}:{point.value}'
            },
            colorAxis: {
                min: 0
            },
            series: [{
                data: _this.state.MapJoinData,
                mapData: cnmap,
                joinBy: 'cn-name',
                name: memberType,
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.cn-name}'
                }
            }],
            credits: { text: '', href: '' }
        });
    }
    /**
     * 获取用户比例数据
     */
    initMemberPercent() {
        var _this = this;
        AgencyManageApi.getMemberPercent({}).then(function (data) {
            if (data.IsOK) {
                var MemberSexPercent = data.Value.MemberSexPercent;
                var MemberLevelPercent = data.Value.MemberLevelPercent;
                var PartnerLevelPercent = data.Value.PartnerLevelPercent;
                //用户性别
                if (Array.isArray(MemberSexPercent)) {
                    var MemberSexData = [];
                    for (var i = 0; i < MemberSexPercent.length; i++) {
                        MemberSexData.push({ name: MemberSexPercent[i].SexName, y: MemberSexPercent[i].SexPercent });
                    }
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'highchartSex',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: { text: null },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '总占比',
                            data: MemberSexData
                        }],
                        credits: { text: '', href: '' }
                    });
                }
                //会员级别
                if (Array.isArray(MemberLevelPercent)) {
                    var MemberLevelData = [];
                    for (var i = 0; i < MemberLevelPercent.length; i++) {
                        MemberLevelData.push({ name: MemberLevelPercent[i].LevelName, y: MemberLevelPercent[i].LevelPercent });

                    }
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'highchartMemberLevel',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: { text: null },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '总占比',
                            data: MemberLevelData
                        }],
                        credits: { text: '', href: '' }
                    });
                }
                //合作伙伴级别
                if (Array.isArray(PartnerLevelPercent)) {
                    var PartnerLevelData = [];
                    for (var i = 0; i < PartnerLevelPercent.length; i++) {
                        PartnerLevelData.push({ name: PartnerLevelPercent[i].LevelName, y: PartnerLevelPercent[i].LevelPercent });
                    }
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'highchartPartnerLeve',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: { text: null },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '总占比',
                            data: PartnerLevelData
                        }],
                        credits: { text: '', href: '' }
                    });
                }
            }
        });
    }
    /**
     * 获取用户排行（积分、经验值）
     */
    initMemberRankList() {
        var _this = this;
        AgencyManageApi.getMemberRankList({ "PageSize": 3, "PageIndex": 1 }).then(function (data) {
            if (data.IsOK) {
                var MemberIntegralRank = data.Value.MemberIntegralRank;
                var MemberExperienceRank = data.Value.MemberExperienceRank;
                var PartnerIntegralRank = data.Value.PartnerIntegralRank;
                _this.setState({ MemberIntegralRankData: MemberIntegralRank, MemberExperienceRankData: MemberExperienceRank, PartnerIntegralRankData: PartnerIntegralRank });
            }
        });
    }
    selectMemberType(MemberType) {
        var _this = this;
        _this.state.MemberType = MemberType;
        _this.initMemberAreaDistribute();
    }
    /**
     * 用户详情
     * @param id
     */
    goToAnencyDetail(id) {
        Tool.goPush('User/AgencyDetailIndex');
        LocalStorage.add('MemberId', id);
    }
    render() {
        var self = this;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">用户概况</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <ul className="bg-colorF5 margin0">
                            <li className="number-column text-center">
                                <p className="color-green font30">{this.state.MemberProfile.MemberCount}</p>
                                <span className="font12">用户总数</span>
                            </li>
                            <li className="number-column text-center">
                                <p className="color-green font30">{this.state.MemberProfile.DaiLiCount}</p>
                                <span className="font12">代理总数</span>
                            </li>
                            <li className="number-column text-center">
                                <p className="color-green font30">{this.state.MemberProfile.PartnerCount}</p>
                                <span className="font12">合作伙伴总数</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <div className="clearfix bg-colorF5 padding5 ">
                            <div className="font12 pull-left padding-top5">
                                <i className="nav-collapse-title-sign"></i>
                                <span className="margin-right15 margin-left5">用户增长趋势图</span>
                            </div>
                            <div className="pull-right font12">
                                <span className={this.state.CountPeriod == 7 ? "day day-active" : "day"} onClick={() => { this.countPeriodOnClick(7) } }>7天</span>
                                <span className={this.state.CountPeriod == 30 ? "day day-active" : "day"} onClick={() => { this.countPeriodOnClick(30) } }>30天</span>
                                <span className={this.state.CountPeriod == 90 ? "day day-active" : "day"} onClick={() => { this.countPeriodOnClick(90) } }>90天</span>
                            </div>
                        </div>
                        <div id="highcharts" className="border1 padding10 margin-top10">

                        </div>
                    </div>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12 margin-btm20">
                        <div className="clearfix bg-colorF5 padding5 ">
                            <div className="font12 pull-left">
                                <i className="nav-collapse-title-sign"></i>
                                <span className="margin-right15 margin-left5">用户地区分布图</span>
                            </div>
                        </div>
                    </div>
                    <div id="highchartsMap" style={{ height:"400px" }} className="col-xs-8">

                    </div>
                    <div className="col-xs-4">
                        <div className="btn-group  margin-btm20">
                            <button className={this.state.MemberType == 1 ? "btn btn-success" : "btn btn-white"} type="button" onClick={() => { this.selectMemberType(1) } }>用户</button>
                            <button className={this.state.MemberType == 2 ? "btn btn-success" : "btn btn-white"} type="button" onClick={() => { this.selectMemberType(2) } }>代理</button>
                            <button className={this.state.MemberType == 3 ? "btn btn-success" : "btn btn-white"} type="button" onClick={() => { this.selectMemberType(3) } }>合作伙伴</button>
                        </div>
                        {
                            this.state.MemberAreaDistributeData.map(function (item, i) {
                                return (<div className="row font12 margin-btm10" key={item.ProvinceId}>
                                    <p className="col-lg-2">{i + 1}.{item.ProvinceName}</p>
                                    <div className="col-lg-8">
                                        <Progress percent={item.MemberPercent} />
                                    </div>
                                </div>);
                            })
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-xs-12">
                        <div className="row margin-top20">
                            <div className="col-xs-12">
                                <div className="clearfix bg-colorF5 padding5 ">
                                    <div className="font12 pull-left">
                                        <i className="nav-collapse-title-sign"></i>
                                        <span className="margin-right15 margin-left5">用户积分排行榜</span>
                                    </div>
                                    <a className="pull-right font12 color-blue" href="/User/UserIntegralRank">查看更多>></a>
                                </div>
                                <div className="border1 margin-top10">
                                    <table className="table table-hover personal-task margin0  align-mid">
                                        <tbody>
                                            {this.state.MemberIntegralRankData.length > 0 ?
                                                this.state.MemberIntegralRankData.map(function (item, i) {
                                                    return (<tr key={item.Id} style={{ cursor: "pointer" }} onClick={() => { self.goToAnencyDetail(item.Id) } }>
                                                        <td className="align-mid-con">第{item.RankId}名</td>
                                                        <td><img src={item.HeadImgURL ? item.HeadImgURL : "/Content/images/noheader.png"} height="46" /></td>
                                                        <td className="align-mid-con">{item.NickName}</td>
                                                        <td className="align-mid-con">
                                                            <span className="color-green">{item.TotalIntegral}</span>
                                                        </td>
                                                    </tr>);
                                                }) : <tr><td colSpan={4} style={{ textAlign: "center" }}>暂无排行</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xs-12">
                        <div className="row margin-top20">
                            <div className="col-xs-12">
                                <div className="clearfix bg-colorF5 padding5 ">
                                    <div className="font12 pull-left">
                                        <i className="nav-collapse-title-sign"></i>
                                        <span className="margin-right15 margin-left5">用户经验值排行榜</span>
                                    </div>
                                    <a className="pull-right font12 color-blue" href="/User/UserExperienceRank">查看更多>></a>
                                </div>
                                <div className="border1 margin-top10">
                                    <table className="table table-hover personal-task margin0  align-mid">
                                        <tbody>
                                            {this.state.MemberExperienceRankData.length > 0 ?
                                                this.state.MemberExperienceRankData.map(function (item, i) {
                                                    return (<tr key={item.Id} style={{ cursor: "pointer" }} onClick={() => { self.goToAnencyDetail(item.Id) } }>
                                                        <td className="align-mid-con">第{item.RankId}名</td>
                                                        <td><img src={item.HeadImgURL ? item.HeadImgURL : "/Content/images/noheader.png"} height="46" /></td>
                                                        <td className="align-mid-con">{item.NickName}</td>
                                                        <td className="align-mid-con">
                                                            <span className="color-green">{item.Experience}</span>
                                                        </td>
                                                    </tr>);
                                                }) : <tr><td colSpan={4} style={{ textAlign: "center" }}>暂无排行</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xs-12">
                        <div className="row margin-top20">
                            <div className="col-xs-12">
                                <div className="clearfix bg-colorF5 padding5 ">
                                    <div className="font12 pull-left">
                                        <i className="nav-collapse-title-sign"></i>
                                        <span className="margin-right15 margin-left5">合作伙伴积分排行榜</span>
                                    </div>
                                    <a className="pull-right font12 color-blue" href="/User/PartnerIntegralRank">查看更多>></a>
                                </div>
                                <div className="border1 margin-top10">
                                    <table className="table table-hover personal-task margin0  align-mid">
                                        <tbody>
                                            {this.state.PartnerIntegralRankData.length > 0 ?
                                                this.state.PartnerIntegralRankData.map(function (item, i) {
                                                    return (<tr key={item.Id} style={{ cursor: "pointer" }} onClick={() => { self.goToAnencyDetail(item.Id) } }>
                                                        <td className="align-mid-con">第{item.RankId}名</td>
                                                        <td><img src={item.HeadImgURL ? item.HeadImgURL : "/Content/images/noheader.png"} height="46" /></td>
                                                        <td className="align-mid-con">{item.NickName}</td>
                                                        <td className="align-mid-con">
                                                            <span className="color-green">{item.TotalIntegral}</span>
                                                        </td>
                                                    </tr>);
                                                }) : <tr><td colSpan={4} style={{ textAlign: "center" }}>暂无排行</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-xs-12">
                        <div className="row margin-top20">
                            <div className="col-xs-12">
                                <div className="clearfix bg-colorF5 padding5 ">
                                    <div className="font12 pull-left">
                                        <i className="nav-collapse-title-sign"></i>
                                        <span className="margin-right15 margin-left5">用户级别比例</span>
                                    </div>
                                </div>
                                <div id="highchartMemberLevel" className="border1 margin-top10">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xs-12">
                        <div className="row margin-top20">
                            <div className="col-xs-12">
                                <div className="clearfix bg-colorF5 padding5 ">
                                    <div className="font12 pull-left">
                                        <i className="nav-collapse-title-sign"></i>
                                        <span className="margin-right15 margin-left5">合作伙伴级别比例</span>
                                    </div>
                                </div>
                                <div id="highchartPartnerLeve" className="border1 margin-top10">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-xs-12">
                        <div className="row margin-top20">
                            <div className="col-xs-12">
                                <div className="clearfix bg-colorF5 padding5 ">
                                    <div className="font12 pull-left">
                                        <i className="nav-collapse-title-sign"></i>
                                        <span className="margin-right15 margin-left5">用户性别比例</span>
                                    </div>
                                </div>
                                <div id="highchartSex" className="border1 margin-top10">

                                </div>
                            </div>
                        </div>
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

let UserOverviewIndexPage = Form.create({})(UserOverviewIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(UserOverviewIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
