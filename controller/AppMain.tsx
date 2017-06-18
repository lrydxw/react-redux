import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../pub/Server';
import Config from '../pub/Config';
import Tool from '../pub/Tool';
import { message } from 'antd';
import { Button } from 'antd';
import AppInitStep from './SystemConfig/AppInitStep';
import { changeActiveAction, getActive, saveParentActive, saveChildActive } from '../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../components/pubController/BaseContainer';
import AppBody from '../components/layout/AppBody';
import { BaseStore } from '../redux/store/BaseStore';
//API
import BaseApi from './SystemConfig/Api';
//表单验证模块
import Verifier from '../pub/Verifier';
const store = BaseStore({});

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class AppMain extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initSystemProfile = this.initSystemProfile.bind(this);

        this.state = {
            SystemProfile: {},//基础数据
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
        let active_Json = { parentkey: 0 };
        saveParentActive(active_Json);
        let activeChile_Json = { childkey: -1, childvalue: "" };
        saveChildActive(activeChile_Json);
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initSystemProfile();
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
     * 获取基础数据
     */
    initSystemProfile() {
        var _this = this;
        BaseApi.getSystemProfile().then(function (data) {
            if (data.IsOK) {
                _this.setState({ SystemProfile: data.Value });
            }
        });
    }
    render() {
        return (
            <AppBody>
                <section style={{ marginLeft: -140 }}>
                    <header>
                        <div className="padding-top20 padding-btm20">
                            <b className="font20">{this.state.SystemProfile.SiteName}</b>
                            <span className="mark-green margin-left10">拓客分销系统</span>
                            <span className="mark-green margin-left10">培训版</span>
                        </div>
                    </header>
                    <div className="row margin-top20">
                        <div className="col-xs-12">
                            <ul className="bg-colorF5 margin0">
                                <li className="number-column text-center">
                                    <p className="color-green font30" style={{ cursor: "pointer" }} onClick={() => { Tool.goPush('Order/All') } }>{this.state.SystemProfile.WaitOrder}</p>
                                    <span className="font12">待发货订单</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color-green font30" style={{ cursor: "pointer" }} onClick={() => { Tool.goPush('Finance/Agent') } }>{this.state.SystemProfile.WaitWithdrawal}</p>
                                    <span className="font12">待处理提现</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color-green font30" style={{ cursor: "pointer" }} onClick={() => { Tool.goPush('Order/All') } }>{this.state.SystemProfile.OrderCount}</p>
                                    <span className="font12">订单总数</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color-green font30" style={{ cursor: "pointer" }} onClick={() => { Tool.goPush('User/UserOverviewIndex') } }>{this.state.SystemProfile.MemberCount}</p>
                                    <span className="font12">用户总数</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color-green font30" style={{ cursor: "pointer" }} onClick={() => { Tool.goPush('Finance/Index') } }>￥{this.state.SystemProfile.MoneyCount}</p>
                                    <span className="font12">交易总额</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row margin-top20">
                        <p className="col-xs-12 font14">
                            <b>常用功能</b>
                        </p>
                        <div className="col-xs-12">
                            <ul className="clearfix block-5 margin0">
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/Course/Index" className="color3"><img className="margin-right5" src="/Content/images/push1.png" />发布课程</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/Product/ProductList" className="color3"><img className="margin-right5" src="/Content/images/push2.png" />发布商品</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/User/UserOverviewIndex" className="color3"><img className="margin-right5" src="/Content/images/push3.png" />用户概况</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/Finance/Index" className="color3"><img className="margin-right5" src="/Content/images/push4.png" />财务概况</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/ManagerAccount/Index" className="color3"><img className="margin-right5" src="/Content/images/push5.png" />添加管理员</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/Course/Lecturer" className="color3"><img className="margin-right5" src="/Content/images/push6.png" />添加讲师</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/Order/Index" className="color3"><img className="margin-right5" src="/Content/images/push7.png" />订单概况</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/User/CommunityManageIndex" className="color3"><img className="margin-right5" src="/Content/images/push8.png" />微信班级管理</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="/Finance/Agent" className="color3"><img className="margin-right5" src="/Content/images/push9.png" />代理提现</a>
                                </li>
                                <li className="padding90 bg-colorF5 border-white pull-left">
                                    <a href="javascript:;" className="color3"><img className="margin-right5" src="/Content/images/push10.png" />帮助引导</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row margin-top20">
                        <p className="col-xs-12 font14">
                            <b>推荐营销应用</b>
                        </p>
                        <div className="col-xs-12">
                            <ul className="clearfix block-99 margin0">
                                <li className="padding10 bg-color-blue2 border-white pull-left">
                                    <a target="_blank" href="http://www.huiyijingling.cn/" className="colorFF text-center">
                                        <div className="font16 margin-top20">会议精灵</div>
                                        <div className="font12">免费的商务会议一站式解决方案</div>
                                    </a>
                                </li>
                                <li className="padding10 bg-color-yellow2 border-white pull-left">
                                    <a href="javascript:;" className="colorFF text-center">
                                        <div className="font16 margin-top20">视频直播</div>
                                        <div className="font12">现场直播，更灵活的互动宣传</div>
                                    </a>
                                </li>
                                <li className="padding10 bg-color-red2 border-white pull-left">
                                    <a href="javascript:;" className="colorFF text-center">
                                        <div className="font16 margin-top20">积分兑换</div>
                                        <div className="font12">用积分增加粉丝粘性</div>
                                    </a>
                                </li>
                                <li className="padding10 bg-color-violet border-white pull-left">
                                    <a href="javascript:;" className="colorFF text-center">
                                        <div className="font16 margin-top20">排行榜</div>
                                        <div className="font12">用排行榜增加用户活力</div>
                                    </a>
                                </li>
                                <li className="padding10 bg-color-green2 border-white pull-left">
                                    <a href="javascript:;" className="colorFF text-center">
                                        <div className="font16 margin-top20">联合发起</div>
                                        <div className="font12">裂变式营销新玩法</div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row margin-top20">
                        <p className="col-xs-6 font14">
                            <b>系统信息</b>
                        </p>
                        <div className="col-xs-12">
                            <ul className="bg-colorF5 margin0">
                                <li className="number-column text-center">
                                    <p className=" color0 font30">{this.state.SystemProfile.Balance}</p>
                                    <span className="font12">服务费余额</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color0 font30">{this.state.SystemProfile.ServiceRate}%</p>
                                    <span className="font12">服务费费率</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color0 font30">0.1</p>
                                    <span className="font12">短信服务费</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color0 font30">V3.0</p>
                                    <span className="font12">系统版本</span>
                                </li>
                                <li className="number-column text-center">
                                    <p className="color0 font30">2016-12-24</p>
                                    <span className="font12">更新时间</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(AppMain);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

