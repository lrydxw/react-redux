//我购买的
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Button, Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu, message } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseHourApi from '../Course/CourseHourApi';
import CourseShareApi from './CourseShareApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseSharePurchase extends BaseContainer {
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
        this.initCourseShareList = this.initCourseShareList.bind(this);
        this.inputonChange = this.inputonChange.bind(this);
        this.initTagList = this.initTagList.bind(this);
        this.tagListOnClick = this.tagListOnClick.bind(this);
        this.updateCourseHourPublish = this.updateCourseHourPublish.bind(this);

        this.searchData = {};

        this.state = {
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingTable: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            selectedRowId: "",//当前选择的Id
            TableData: [],//列表数据
            Keywords: "",
            TagName: "",//标签名称
            TagListData: [],//标签数据
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initTagList();
        this.initCourseShareList();
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
    initCourseShareList() {
        var _self = this;
        var obj = _self.searchData;
        obj.PageIndex = _self.state.PageIndex;
        obj.PageSize = _self.state.PageSize;
        obj.TagName = _self.state.TagName;
        obj.Keywords = _self.state.Keywords;
        if (obj.Keywords || obj.TagName)
            obj.PageIndex = 1;

        _self.setState({ loadingTable: true });
        CourseShareApi.getPullCourseHourPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _self.state.TableData = functionData;
                _self.state.TotalCount = data.AllCount;
            }
            _self.setState({ loadingTable: false });
        });
    }
    /**
     * 获取标签列表
     */
    initTagList() {
        var _self = this;
        CourseShareApi.getTagList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _self.setState({ TagListData: functionData });
            }
        });
    }
    /**
	 * 修改课时发布状态
	 */
    updateCourseHourPublish(Id, IsPublish) {
        var _self = this;
        var obj = { Id: Id, IsPublish: IsPublish };
        CourseHourApi.updateCourseHourPublish(obj).then(function (data) {
            if (data.IsOK) {
                _self.initCourseShareList();
            } else {
                message.error(data.Message);
            }
        });
    }
    inputonChange(e) {
        var _self = this;
        _self.state.Keywords = e.target.value;
    }
    tagListOnClick(tagName) {
        var _self = this;
        _self.state.TagName = tagName;
        _self.initCourseShareList();
    }
    courseHourListPage(Id, ProductName) {
        Tool.goPush('Course/CourseHour');
        LocalStorage.add('CourseProductId', Id);
        LocalStorage.add('ProductName', ProductName);
    }
    courseHourEditPage(Id, CourseProductId) {
        LocalStorage.add('Id', Id);
        LocalStorage.add('CourseProductId', CourseProductId);
        Tool.goPush('Course/CourseHourEdit');
    }
    render() {
        var _self = this;
        const tableColumns = [
            {
                title: '课时/名称',
                dataIndex: 'CourseTitle',
                key: 'CourseTitle',
                width: '25%',
                render: (text, record) =>
                    <div className="clearfix">
                        <img className="pull-left margin-right10" src={record.ShowImgUrl} title={Tool.cutString(text, 14)} width="52" />
                        <div className="pull-left col-xs-8">
                            <p>
                                <span>第{record.CourseNo}期</span>&nbsp; &nbsp;
                                <a className="color-blue font12">{text}</a>
                            </p>
                        </div>
                    </div>,
            },
            {
                title: '课程',
                dataIndex: 'ProductName',
                key: 'ProductName',
                render: (text, record) => <a className="color-blue font12" onClick={() => { this.courseHourListPage(record.CourseProductId, record.ProductName) } }>{text}</a>,
            },
            {
                title: '讲师',
                dataIndex: 'LecturerName',
                key: 'LecturerName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '价格(¥)',
                dataIndex: 'Price',
                key: 'Price',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '来源',
                dataIndex: 'SiteName',
                key: 'SiteName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '标签',
                dataIndex: 'Tags',
                key: 'Tags',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '购买时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '播课形式',
                dataIndex: 'CourseType',
                key: 'CourseType',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '播课时间',
                dataIndex: 'StartTime',
                key: 'StartTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    if (record.CourseType == "微信") {
                        return <span>
                            <a href="javascript:;" onClick={() => { this.courseHourEditPage(record.Id, record.CourseProductId) } }>编辑</a>
                            <span className="ant-divider"></span>
                            <a href="javascript:;">预约</a>
                        </span>
                    } else {
                        return <span>
                            <a href="javascript:;" onClick={() => { this.courseHourEditPage(record.Id, record.CourseProductId) } }>编辑</a>
                            <span className="ant-divider"></span>
                            <a href="javascript:;" onClick={() => this.updateCourseHourPublish(record.PSAId, !record.IsPublish)}>{!record.IsPublish ? "发布" : "取消发布"}</a>
                        </span>
                    }
                },
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const pagination = {
            total: _self.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                _self.state.PageIndex = current;
                _self.state.PageSize = pageSize;
                _self.initCourseShareList();
            },
            onChange(current) {
                _self.state.PageIndex = current;
                _self.initCourseShareList();
            },
            showTotal() {
                return `共 ${_self.state.TotalCount} 条`;
            },
            pageSize: _self.state.PageSize,
            current: _self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">我购买的课时</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <ul className="bg-colorF5 margin0 padding15">
                            <li className="row">
                                <p className="col-xs-1 text-right font14 color3">全部标签：</p>
                                <div className="col-xs-11">
                                    <a style={{ color: !_self.state.TagName ? "#50d433" : "" }} onClick={() => { _self.tagListOnClick("") } } className={_self.state.TagListData.length > 0 ? "padding-right10 padding-left10 border-right1 color6 margin-btm10" : "padding-right10 padding-left10 color6 margin-btm10"}>不限</a>
                                    {_self.state.TagListData.map(function (item, i) {
                                        return (<a key={"col-xs-11_a_" + i} style={{ color: _self.state.TagName == item.TagName ? "#50d433" : "" }} onClick={() => { _self.tagListOnClick(item.TagName) } } className={i < _self.state.TagListData.length - 1 ? "padding-right10 padding-left10 border-right1 color6 margin-btm10" : "padding-right10 padding-left10 color6 margin-btm10"}>{item.TagName}</a>);
                                    })}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row  margin-top20 margin-btm20">
                    <div className="col-xs-2">

                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="课时名称" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.initCourseShareList} />
                            <span className="input-group-addon  search-btn" onClick={this.initCourseShareList}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="clearfix">
                            <Table
                                rowKey={record => record.Id}
                                columns={tableColumns}
                                dataSource={this.state.TableData}
                                pagination={pagination}
                                loading={this.state.loadingTable}
                                rowSelection={null}
                                onRowClick={
                                    (record, index) => {
                                        this.state.selectedRowKeys = [];
                                        this.setState({
                                            selectedRowIndex: index,
                                            selectedRowId: record.Id
                                        });
                                    }
                                }
                                rowClassName={
                                    (record, index) => {
                                        return index === this.state.selectedRowIndex ? " ant-table-row-active " : "";
                                    }
                                }
                                />
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

let CourseSharePurchasePage = Form.create({})(CourseSharePurchase);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseSharePurchasePage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);