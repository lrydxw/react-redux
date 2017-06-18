//系统费用
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
import FinanceApi from './FinanceApi';
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
class SystemFinanceIndex extends BaseContainer {
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
        this.initFinanceList = this.initFinanceList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);

        this.searchData = {};

        this.state = {
            FinanceTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingFinance: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectFinanceIndex: -1,//选择列表序号
            FinanceListData: [],//列表数据
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initFinanceList();
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
     * 获取财务列表数据
     */
    initFinanceList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        console.log(obj);

        _this.state.loadingFinance = true;
        FinanceApi.getSystemMoneyLogPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.FinanceListData = functionData;
                _this.state.FinanceTotalCount = data.AllCount;
            }
            _this.setState({ loadingFinance: false });
        });
    }
    render() {
        const financeColumns = [
            {
                title: '操作类型',
                dataIndex: 'LogTypeStr',
                key: 'LogTypeStr',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '金额',
                dataIndex: 'Money',
                key: 'Money',
                render: (text, record) => { if (record.LogType >= 5) { return (<span className="color-green"> -{text.toFixed(2)}</span>) } else { return (<span className="color-red"> +{text.toFixed(2)}</span>) } }
            },
            {
                title: '操作后余额',
                dataIndex: 'Balance',
                key: 'Balance',
                render: (text) => <span> {text.toFixed(2)}</span>,
            },
            {
                title: '支付订单',
                dataIndex: 'OrderNo',
                key: 'OrderNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '内容',
                dataIndex: 'Remark',
                key: 'Remark',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
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
            total: self.state.FinanceTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initFinanceList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initFinanceList();
            },
            showTotal() {
                return `共 ${self.state.FinanceTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">系统费用</a>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <Table
                            rowKey={record => record.Id}
                            columns={financeColumns}
                            dataSource={this.state.FinanceListData}
                            pagination={pagination}
                            loading={this.state.loadingFinance}
                            rowSelection={null}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    this.setState({
                                        selectFinanceIndex: index
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectFinanceIndex ? " ant-table-row-active " : "";
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

let SystemFinanceIndexPage = Form.create({})(SystemFinanceIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(SystemFinanceIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
