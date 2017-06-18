import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import {Button} from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio  } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';

//api
import CourseApi from './CourseApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseCommentIndex extends BaseContainer {
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
        this.initCourseCommentList = this.initCourseCommentList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.searchData = {};

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            CourseCommentListData: [],//列表数据
            loadingCourseComment: false,//正在加载列表
            selectCourseCommentIndex: -1,//选择列表序号
            selectCourseCommentId: "",//选择的Id
            selectedRowKeys: [],//功能选择
            CourseCommentTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCourseCommentList();
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
     * 获取列表数据
     */
    initCourseCommentList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;

        _this.state.visibleForm = false;
        _this.state.loadingCourseComment = true;
        CourseApi.getCourseCommentList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CourseCommentListData = functionData;
                _this.state.CourseCommentTotalCount = data.AllCount;
            }
            _this.setState({ loadingCourseComment: false });
        });
    }
    /**
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const CourseCommentColumns = [
            {
                title: '用户名',
                dataIndex: 'MemberName',
                key: 'MemberName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '点赞数',
                dataIndex: 'PraiseCount',
                key: 'PraiseCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '评论/回复数',
                dataIndex: 'CommentCount',
                key: 'CommentCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '评论时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" >审核</a>
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
            total: self.state.CourseCommentTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initCourseCommentList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initCourseCommentList();
            },
            showTotal() {
                return `共 ${self.state.CourseCommentTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">评论管理</a>
                </div>
                <Row>
                    <Col>
                        <Table
                            rowKey={record => record.Id}
                            columns={CourseCommentColumns}
                            dataSource={this.state.CourseCommentListData}
                            pagination={pagination }
                            loading={this.state.loadingCourseComment}
                            rowSelection={rowSelection}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    this.setState({
                                        selectCourseCommentIndex: index,
                                        selectCourseCommentId: record.Id
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectCourseCommentIndex ? " ant-table-row-active " : "";
                                }
                            }
                            />
                    </Col>
                </Row>

            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let CourseCommentIndexPage = Form.create({})(CourseCommentIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseCommentIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);