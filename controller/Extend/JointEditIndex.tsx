import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import JointInitiatedApi from './JointInitiatedApi';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';

import { Tabs, Modal, message } from 'antd';
const TabPane = Tabs.TabPane;
import { JointFirstIndexPage } from './JointFirstIndex'
import { JointSecondIndexPage } from './JointSecondIndex'
import { JointThirdIndexPage } from './JointThirdIndex'

class JointEditIndex extends BaseContainer {

    constructor(props) {
        super(props);
        this.nextTab = this.nextTab.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveProductInfo = this.saveProductInfo.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.cancelNextActive = this.cancelNextActive.bind(this);
        this.state = { activeKey: 1, nextActiveKey: 1, ProductInfo: null };
    }
    cancelNextActive() {
        this.setState({ nextActiveKey: Number(this.state.activeKey) });
    }
    nextTab(nextKey, currentObj) {
        var activeTab = Number(this.state.activeKey);
        this.state.ProductInfo = Tool.assign(this.state.ProductInfo, currentObj);
        if (nextKey > 0)
            this.setState({ activeKey: String(nextKey), nextActiveKey: nextKey });
        if (nextKey == -1) {
            this.saveProductInfo();
        }
    }
    saveProductInfo() {
        console.log(this.state.ProductInfo);
        JointInitiatedApi.updateOrInsertJointInitiated(this.state.ProductInfo).then((data) => {
            if (data.IsOK) {
                //使用Message返回产品id
                if (data.Message) {
                    LocalStorage.add('Id', data.Message);
                }
                Modal.success({
                    title: '操作成功',
                    content: '联合发起人信息已保存',
                    onOk() {
                        Tool.goPush('Extend/Joint');
                    },
                });
            } else {
                message.error(data.Message);
            }
        });
    }
    onTabClick(clickKey) {
        var activeTab = Number(this.state.activeKey);
        if (activeTab != Number(clickKey)) {
            this.setState({ nextActiveKey: Number(clickKey) });
        }
    }
    onChange(activeKey) {

    }
    render() {
        return <AppBody>
            <div className="main-content-title padding-top15 clearfix">
                <a className="main-content-word pull-left set-content-word-te">设置联合发起人信息</a>
            </div>
            <Tabs activeKey={this.state.activeKey} onChange={this.onChange} onTabClick={this.onTabClick}>
                <TabPane tab={<li className="step-con step-active" >1.设置基础信息</li>} key="1">
                    <JointFirstIndexPage nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 1 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
                <TabPane tab={<li className="step-con" >2.设置出售信息</li>} key="2">
                    <JointSecondIndexPage nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 2 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
                <TabPane tab={<li className="step-con" >3.编辑详情</li>} key="3">
                    <JointThirdIndexPage nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 3 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
            </Tabs>
        </AppBody>
            ;
    }
}
let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}
const store = BaseStore({});

const App = connect(mapStateToProps)(JointEditIndex);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
