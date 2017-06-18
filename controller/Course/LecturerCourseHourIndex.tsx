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

//api
import CourseHourApi from './CourseHourApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class LecturerCourseHourIndex extends BaseContainer {
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
        this.onSelectChange = this.onSelectChange.bind(this);
        this.initCourseHourList = this.initCourseHourList.bind(this);
        this.inputonChange = this.inputonChange.bind(this);

        this.searchData = {};

        this.state = {
            CourseHourTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingCourseHour: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectCourseHourIndex: -1,//选择列表序号
            CourseHourListData: [],//列表数据
            LecturerId: LocalStorage.get('LecturerId'),
            LecturerName: LocalStorage.get('LecturerName'),
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCourseHourList();
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
     * 获取课时数据
     */
    initCourseHourList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.LecturerId = _this.state.LecturerId;
        obj.CourseTitle = _this.state.Keywords;
        if (obj.CourseTitle)
            obj.PageIndex = 1;

        _this.state.loadingCourseHour = true;
        CourseHourApi.getCourseHourPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CourseHourListData = functionData;
                _this.state.CourseHourTotalCount = data.AllCount;
            }
            _this.setState({ loadingCourseHour: false });
        });
    }
    inputonChange(e) {
        var _this = this;
        _this.state.Keywords = e.target.value;
    }
    render() {
        const CourseHourColumns = [
            {
                title: '标题',
                dataIndex: 'CourseTitle',
                key: 'CourseTitle',
                width: '30%',
                render: (text, record) =>
                    <div className="clearfix">
                        <img className="pull-left margin-right10" src={record.ShowImgUrl} title={text} width="52" />
                        <div className="pull-left col-xs-10">
                            <p>
                                <span>第{record.CourseNo}期</span>&nbsp; &nbsp;
                                <a className="color-blue font12">{text}</a>
                            </p>
                            <p>
                                {record.StartTime ? (Tool.compareDate(record.StartTime, Tool.getNowFormatDate()) ? <img src="/Content/images/remind-1.png" width="22" height="13" /> : "") : ""}
                                {record.CourseWay == "直播" ? <img src="/Content/images/remind-2.png" width="22" height="13" /> : ""}
                            </p>
                        </div>
                    </div>,
            },
            {
                title: '打赏金额',
                dataIndex: 'Reward',
                key: 'Reward',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '播课时间',
                dataIndex: 'StartTime',
                key: 'StartTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '播课形式',
                dataIndex: 'CourseType',
                key: 'CourseType',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '浏览量',
                dataIndex: 'PV',
                key: 'PV',
                render: (text) => <span> {text}PV</span>,
            },
            {
                title: '评论',
                dataIndex: 'CommentCount',
                key: 'CommentCount',
                render: (text) => <span> {text}</span>,
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
            total: self.state.CourseHourTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initCourseHourList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initCourseHourList();
            },
            showTotal() {
                return `共 ${self.state.CourseHourTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">讲师课时</a>
                </div>
                <div className="row  margin-top20 margin-btm20">
                    <div className="col-lg-6 col-sm-12">
                        <i className="nav-collapse-title-sign"></i>
                        <span className="margin-right15 margin-left5">{this.state.LecturerName}</span>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                        <div className="clearfix">
                            <div className="input-group pull-right add-width-search">
                                <input type="text" className="form-control search-fill" placeholder="搜索" onChange={this.inputonChange} />
                                <span className="input-group-addon  search-btn" onClick={this.initCourseHourList}>
                                    <i className="fa fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="clearfix">
                            <Tabs>
                                <TabPane tab="全部" key="all">
                                    <Table
                                        rowKey={record => record.Id}
                                        columns={CourseHourColumns}
                                        dataSource={this.state.CourseHourListData}
                                        pagination={pagination}
                                        loading={this.state.loadingCourseHour}
                                        rowSelection={rowSelection}
                                        onRowClick={
                                            (record, index) => {
                                                this.state.selectedRowKeys = [];
                                                this.setState({
                                                    selectCourseHourIndex: index
                                                });
                                            }
                                        }
                                        rowClassName={
                                            (record, index) => {
                                                return index === this.state.selectCourseHourIndex ? " ant-table-row-active " : "";
                                            }
                                        }
                                        />
                                </TabPane>
                            </Tabs>
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

let LecturerCourseHourIndexPage = Form.create({})(LecturerCourseHourIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(LecturerCourseHourIndex);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
