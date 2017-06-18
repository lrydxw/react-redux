import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Button, Timeline } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CrmApi from './CrmApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class RecommendVisitDetail extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.loadLeaveMsgDetail = this.loadLeaveMsgDetail.bind(this);

        this.state = {
            leaveMsgId: LocalStorage.get('LeaveMsgId'),
            detailContent: []
        };

    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadLeaveMsgDetail();
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

    backToRecommendIndex() {
        Tool.goPush('Extend/RecommendIndex');
    }

    loadLeaveMsgDetail() {
        var _this = this;
        var id = _this.state.leaveMsgId;
       
        CrmApi.getCrmLeaveMsgDetail({ Id: id }).then(function (data) {
            if (data.IsOK) {
                _this.state.detailContent = data.Value;
            }
            _this.setState({ detailContent: data.Value });
        });
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };



        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">我推荐的人回访明细</a>
                </div>
                <Form horizontal>
                    <div className="form-horizontal tasi-form" >

                        <div className="row padding-top20 margin0">
                            <div className="col-lg-2 col-sm-12 padding-top5">
                                <b>回访明细</b>
                            </div>

                            <div className="col-lg-10 col-sm-12">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <div className="col-xs-8">

                                                    <Timeline>
                                                        {this.state.detailContent.map(function (item, i) {
                                                            return (
                                                                <Timeline.Item>【{item.VisitType}】&nbsp;{item.VisitContent}&nbsp; &nbsp; &nbsp; {item.VisitTime}</Timeline.Item>
                                                            );
                                                        })}
                                                    </Timeline>
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </Form>
                <div className="seat-80"></div>
                <div className="position-btm">
                    <div className="row margin0 bg-colorFC padding10 margin-top20">
                        <div className="col-lg-1 col-xs-offset-4">
                            <Button type="primary" size="large" className="btn btn-block" onClick={this.backToRecommendIndex} >返回</Button>
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

let RecommendVisitDetailPage = Form.create({})(RecommendVisitDetail);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(RecommendVisitDetailPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
