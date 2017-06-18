//财务概况
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
import FinanceApi from '../Finance/FinanceApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
import * as Highcharts from 'highcharts';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class FinanceIndex extends BaseContainer {
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
        this.initFinanceProfile = this.initFinanceProfile.bind(this);
        this.initDataStatistics = this.initDataStatistics.bind(this);
        this.financePeriodOnClick = this.financePeriodOnClick.bind(this);

        this.state = {
            FinanceProfile: {},//订单概况
            FinancePeriod: 7,//统计周期
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initFinanceProfile();
        this.initDataStatistics();
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
     * 订单概况
     */
    initFinanceProfile() {
        var _this = this;
        FinanceApi.getFinanceProfile({}).then(function (data) {
            if (data.IsOK) {
                _this.setState({ FinanceProfile: data.Value });
            }
        });
    }
    /**
     * 订单趋势图
     */
    initDataStatistics() {
        var _this = this;
        FinanceApi.getFinanceStatistics({ "Period": _this.state.FinancePeriod }).then(function (data) {
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
                            text: '¥'
                        }
                    },
                    tooltip: {
                        valuePrefix: '¥'
                    },
                    series: [
                        {
                            name: '商品收入',
                            data: data.Value.GoodsIncome
                        },
                        {
                            name: '课程收入',
                            data: data.Value.CourseIncome
                        },
                        {
                            name: '会员收入',
                            data: data.Value.MemberIncome
                        }, {
                            name: '总收入',
                            data: data.Value.TotalIncome
                        }],
                    credits: { text: '', href: '' }
                });
            }
        });
        _this.setState({ FinancePeriod: _this.state.FinancePeriod });
    }
    /**
     * 统计周期
     */
    financePeriodOnClick(FinancePeriod) {
        var _this = this;
        _this.state.FinancePeriod = FinancePeriod;
        _this.initDataStatistics();
    }
    render() {
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">财务概况</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <ul className="bg-colorF5 margin0">
                            <li className="number-column text-center">
                                <p className="color-green font30">¥{this.state.FinanceProfile.Balance}</p>
                                <span className="font12">服务费余额</span>
                            </li>
                            <li className="number-column text-center">
                                <p className="color-green font30">¥{this.state.FinanceProfile.TotalTransactions}</p>
                                <span className="font12">交易总额</span>
                            </li>
                            <li className="number-column text-center">
                                <p className="color-green font30">¥{this.state.FinanceProfile.TotalRefund}</p>
                                <span className="font12">退款总额</span>
                            </li>
                            <li className="number-column text-center">
                                <p className="color-green font30">¥{this.state.FinanceProfile.TotalRebate}</p>
                                <span className="font12">返利总额</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <div className="clearfix bg-colorF5 padding5 ">
                            <div className="font12 pull-left padding-top5">
                                <i className="nav-collapse-title-sign"></i>
                                <span className="margin-right15 margin-left5">收入概况</span>
                            </div>
                            <div className="pull-right font12">
                                <span className={this.state.FinancePeriod == 7 ? "day day-active" : "day"} onClick={() => { this.financePeriodOnClick(7) } }>7天</span>
                                <span className={this.state.FinancePeriod == 30 ? "day day-active" : "day"} onClick={() => { this.financePeriodOnClick(30) } }>30天</span>
                                <span className={this.state.FinancePeriod == 90 ? "day day-active" : "day"} onClick={() => { this.financePeriodOnClick(90) } }>90天</span>
                            </div>
                        </div>
                        <div id="highcharts" className="border1 padding10 margin-top10">

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

let FinanceIndexPage = Form.create({})(FinanceIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FinanceIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
