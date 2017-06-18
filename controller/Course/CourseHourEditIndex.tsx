import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import CourseHourApi from './CourseHourApi';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';

import { Tabs, Modal, message } from 'antd';
const TabPane = Tabs.TabPane;
import { CourseHourSetStep1Page } from './CourseHourSetStep1'
import { CourseHourSetStepDetailPage } from './CourseHourSetStepDetail'
import { CourseHourSetStep2Page } from './CourseHourSetStep2'

class CourseHourEditIndex extends BaseContainer {

    constructor(props) {
        super(props);
        this.nextTab = this.nextTab.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveCourseInfo = this.saveCourseInfo.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.cancelNextActive = this.cancelNextActive.bind(this);
        this.state = { activeKey: 1, nextActiveKey: 1, ProductInfo: null, showCourseHourThird: false };
    }
    cancelNextActive() {
        this.setState({ nextActiveKey: Number(this.state.activeKey) });
    }
    nextTab(nextKey, currentObj) {
        console.log(currentObj);
        var activeTab = Number(this.state.activeKey);
        this.state.ProductInfo = Tool.assign(this.state.ProductInfo, currentObj);
        var obj = this.state.ProductInfo;
        if (obj.First.CourseType && (obj.First.CourseType == 1 || obj.First.CourseType == 8)) {
            this.state.showCourseHourThird = false;
        }
        else {
            this.state.showCourseHourThird = true;
        }
        var courseType = 0;
        if (obj.First) {
            courseType = parseInt(obj.First.CourseType);
        }
        if (nextKey > 0)
            this.setState({ activeKey: String(nextKey), nextActiveKey: nextKey, CourseType: courseType });
        if (nextKey == -1) {
            this.saveCourseInfo();
        }
    }
    saveCourseInfo() {
        CourseHourApi.courseHourUpdateOrInsert(this.state.ProductInfo).then((data) => {
            if (data.IsOK) {
                //使用Message返回产品id
                console.log(this.state.ProductInfo);
                var courseProductId = this.state.ProductInfo.First.CourseProductId;
                Modal.success({
                    title: '操作成功',
                    content: '课时信息已保存',
                    onOk() {
                        LocalStorage.add('CourseProductId', courseProductId );
                        Tool.goPush('Course/CourseHour');
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
                <a className="main-content-word pull-left set-content-word-te">设置课程信息</a>
            </div>
            <Tabs activeKey={this.state.activeKey} onChange={this.onChange} onTabClick={this.onTabClick}>
                <TabPane tab={<li className="step-con step-active" >1.设置课时内容</li>} key="1">
                    <CourseHourSetStep1Page nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 1 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
                <TabPane style={{ display: this.state.showStep3 ? "none" : "" }} tab={<li className="step-con" >2.编辑课时详情</li>} key="2">
                    {this.state.showCourseHourThird ? <CourseHourSetStep2Page CourseType={this.state.CourseType} nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 2 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                        : <CourseHourSetStepDetailPage nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 2 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                        }
                    
                    
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

const App = connect(mapStateToProps)(CourseHourEditIndex);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);