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
import JointInitiatedApi from './JointInitiatedApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class JointInitiatedIndex extends BaseContainer {
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
        this.inputonChange = this.inputonChange.bind(this);
        this.initTableData = this.initTableData.bind(this);
        this.deleteJointInitiated = this.deleteJointInitiated.bind(this);
        this.updateJointInitiatedPublish = this.updateJointInitiatedPublish.bind(this);

        this.searchData = {};

        this.state = {
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingTable: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            TableData: [],//列表数据
            ProductName: "",//搜索
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
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    /**
     * 获取table数据
     */
    initTableData() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.ProductName = _this.state.ProductName;
        if (obj.ProductName)//有关键词从第一页查询
            obj.PageIndex = 1;

        _this.setState({ loadingTable: true });
        JointInitiatedApi.getJointInitiatedPageList(obj).then(function (data) {
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
    inputonChange(e) {
        var _this = this;
        _this.state.ProductName = e.target.value;
    }
    showNewPage(Id) {
        Tool.goPush('Extend/JointFirst');
        LocalStorage.add('Id', Id);
    }
    /**
     * 查看联合发起人
     * @param ProductId
     * @param ProductName
     */
    showJointForm(ProductId, ProductName) {
        Tool.goPush('Extend/JointForm');
        LocalStorage.add('ProductId', ProductId);
        LocalStorage.add('ProductName', ProductName);
    }
    /**
    * 删除联合发起人
    */
    deleteJointInitiated(Id) {
        var _this = this;
        var obj = { Id: Id };
        JointInitiatedApi.deleteJointInitiated(obj).then(function (data) {
            if (data.IsOK) {
                _this.initTableData();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
	 * 修改联合发起人发布状态
	 */
    updateJointInitiatedPublish(Id, IsPublish) {
        var _this = this;
        var obj = { Id: Id, IsPublish: IsPublish };
        JointInitiatedApi.updateJointInitiatedPublish(obj).then(function (data) {
            if (data.IsOK) {
                _this.initTableData();
            } else {
                message.error(data.Message);
            }
        });
    }
    render() {
        const tableColumns = [
            {
                title: '名称',
                dataIndex: 'ProductName',
                key: 'ProductName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '价格',
                dataIndex: 'SalePrice',
                key: 'SalePrice',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '报名人数',
                dataIndex: 'JointCount',
                key: 'JointCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '预售时间',
                dataIndex: 'SignUpStartTime',
                key: 'SignUpStartTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '是否发布',
                dataIndex: 'IsPublish',
                key: 'IsPublish',
                render: (text) => <span> {text ? '已发布' : '未发布'}</span>,
            },
            {
                title: '创建时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.showNewPage(record.Id) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title={!record.IsPublish ? "确定要发布吗？" : "确定要取消发布吗？"} onConfirm={() => { this.updateJointInitiatedPublish(record.Id, !record.IsPublish) } }>
                            <a href="javascript:;">{!record.IsPublish ? "发布" : "取消发布"}</a>
                        </Popconfirm>
                        {!record.IsPublish ? <span><span className="ant-divider"></span>
                            <Popconfirm title="确定要删除吗？" onConfirm={() => { this.deleteJointInitiated(record.Id) } }>
                                <a href="javascript:;">删除</a>
                            </Popconfirm></span> : ""}
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={() => { this.showJointForm(record.Id, record.ProductName) } }>查看联合发起人</a>
                    </span>
                ),
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
                    <a className="main-content-word pull-left  set-content-word-te">营销 / 联合发起人</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={() => { this.showNewPage("") } }>创建联合发起</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.initTableData} />
                            <span className="input-group-addon  search-btn" onClick={this.initTableData}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
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
                                        selectedRowIndex: index
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
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let JointInitiatedIndexPage = Form.create({})(JointInitiatedIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(JointInitiatedIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
