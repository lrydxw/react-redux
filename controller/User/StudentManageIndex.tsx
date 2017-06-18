import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Tabs, Select, Popconfirm } from 'antd';
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CommunityApi from './CommunityApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class StudentManageIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.loadCommunityClassSelectData = this.loadCommunityClassSelectData.bind(this);
        this.initStudentList = this.initStudentList.bind(this);
        this.tabsonChange = this.tabsonChange.bind(this);
        this.switchStudentState = this.switchStudentState.bind(this);
        this.searchStudent = this.searchStudent.bind(this);
        this.exportStudentList = this.exportStudentList.bind(this);

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            CommunitySelectData: [],//列表数据
            loadingStudent: false,//正在加载列表
            studentListData: [],
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            CommunityId: LocalStorage.get('CommunityId'),
            AllStudentCount: 0,
            ClassSelectId: "all"

        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadCommunityClassSelectData();
        this.initStudentList();
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


    loadCommunityClassSelectData() {
        var _this = this;
        var communityId = _this.state.CommunityId;

        CommunityApi.getClassSelectData({ CommunityId: communityId, RecordStudentCount: true }).then(function (data) {
            if (data.IsOK) {
                var allCount = 0;
                data.Value.map(function (item) {
                    allCount += item.TotalStudentCount;
                });
                _this.state.AllStudentCount = allCount;

                _this.setState({ CommunitySelectData: data.Value });

            } else {
                message.error(data.Message);
            }

        });
    }

    exportStudentList() {
        var _this = this;

        var form = this.props.form;
        var obj = form.getFieldsValue();

        Tool.ExportCSVFile("/User/ExportStudentBasicList", obj);
    }

    initStudentList() {
        var _this = this;
        var form = _this.props.form;
        var obj = form.getFieldsValue();
        obj.CommunityId = _this.state.CommunityId;

        if (_this.state.ClassSelectId != "all" && !obj.ClassId) {
            obj.ClassId = _this.state.ClassSelectId;
        }


        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        _this.setState({ loadingStudent: true });
        CommunityApi.getStudentBasicPageList(obj).then(function (data) {
            if (data.IsOK) {
                _this.state.studentListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingStudent: false, selectedRowKeys: [] });

        });

    }

    searchStudent() {
        var _this = this;
        _this.state.PageIndex = 1;
        _this.state.ClassSelectId = "all";
        _this.initStudentList();
    }

    tabsonChange(key) {
        var _this = this;
        var form = _this.props.form;
        form.resetFields();

        _this.state.ClassSelectId = key;
        _this.state.PageIndex = 1;
        _this.state.selectedRowKeys = [];
        _this.initStudentList();
    }

    switchStudentState(id, isEnterGroup) {
        var _this = this;
        CommunityApi.switchStudentEnterGroupState({ Id: id, IsEnterGroup: isEnterGroup }).then(function (data) {
            if (data.IsOK) {

                _this.initStudentList();
            }
            else {
                message.error(data.Message);
            }


        });
    }


    render() {

        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const NameProps = getFieldProps('Name', {

        });

        const StudentNoProps = getFieldProps('StudentNo', {

        });

        const ClassIdProps = getFieldProps('ClassId', {

        });

        const startTimeProps = getFieldProps('StartTime', {

        });

        const endTimeProps = getFieldProps('EndTime', {

        });


        const StudentColumns = [
            {
                title: '姓名',
                dataIndex: 'Name',
                key: 'Name',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '级别',
                dataIndex: 'MemberLevelName',
                key: 'MemberLevelName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '班级',
                dataIndex: 'ClassName',
                key: 'ClassName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '手机号',
                dataIndex: 'Phone',
                key: 'Phone',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '学号',
                dataIndex: 'StudentNo',
                key: 'StudentNo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '班长',
                dataIndex: 'Monitor',
                key: 'Monitor',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '状态',
                dataIndex: 'StudentState',
                key: 'StudentState',
                render: (text, record) => {
                    if (record.StudentState == 1)
                        return (<span className="color-red">{record.StudentStateName}</span>)
                    else if (record.StudentState == 2)
                        return (<span className="color-green">{record.StudentStateName}</span>)
                    else if (record.StudentState == 7)
                        return (<span className="color-gray">{record.StudentStateName}</span>)
                    else
                        return (<span>{record.StudentStateName}</span>)
                },


            },

            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {

                    if (record.StudentState == 1 || record.StudentState == 7) {
                        return (
                            <span>
                                <Popconfirm title="确定要让该学员进群吗？" onConfirm={() => { this.switchStudentState(record.Id, true) } }>
                                    <a >进群</a>
                                </Popconfirm>
                            </span>)

                    }
                    else if (record.StudentState == 2) {
                        return (
                            <span>
                                <Popconfirm title="确定要让该学员退群吗？" onConfirm={() => { this.switchStudentState(record.Id, false) } }>
                                    <a >退群</a>
                                </Popconfirm>
                            </span>)
                    }
                }


            }
        ];

        var self = this;
        const pagination = {
            total: self.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initStudentList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initStudentList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">学员管理</a>
                </div>
                <Form>
                    <div className="row  margin0 margin-top20 ">
                        <div className="col-lg-5 col-sm-12">
                            <ul className="row">
                                <li className="col-xs-4">
                                    <FormItem key="Name" >
                                        <Input {...NameProps} className="cp1 form-control" placeholder="请输入姓名" />
                                    </FormItem>

                                </li>
                                <li className="col-xs-4">
                                    <FormItem key="StudentNo" >
                                        <Input {...StudentNoProps} className="cp1 form-control" placeholder="请输入学号" />
                                    </FormItem>

                                </li>
                                <li className="col-xs-4">

                                    <FormItem key="DonationList">
                                        <Select
                                            placeholder="请选择班级"

                                            {...ClassIdProps}
                                            >

                                            {this.state.CommunitySelectData.map(function (item) {
                                                return (
                                                    <Option key={'li_' + item.Id} value={item.Id}>{item.ClassName}</Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>

                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-sm-12">
                            <ul className="row">
                                <li className="col-xs-6">
                                    <div className="input-group">
                                        <FormItem key="StartTime"
                                            hasFeedback
                                            >
                                            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...startTimeProps} placeholder="开始时间" />
                                        </FormItem>

                                    </div>
                                </li>
                                <li className="col-xs-6">
                                    <div className="input-group">
                                        <FormItem key="EndTime"
                                            hasFeedback
                                            >
                                            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...endTimeProps} placeholder="结束时间" />
                                        </FormItem>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-sm-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <button className="btn btn-success btn-block" onClick={self.searchStudent}>搜索</button>
                                </div>
                                <div className="col-xs-8 ">
                                    <button className="btn btn-info btn-block" onClick={this.exportStudentList}><i className="fa fa-download" aria-hidden="true"></i> 导出客户数据</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
                <hr />
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <Tabs activeKey={self.state.ClassSelectId} onChange={self.tabsonChange}>
                            <TabPane tab={"全部【共" + self.state.AllStudentCount + "人】"} key="all">
                                <Table
                                    rowKey={record => record.Id}
                                    columns={StudentColumns}
                                    dataSource={self.state.studentListData}
                                    pagination={pagination}
                                    loading={self.state.loadingStudent}

                                    />
                            </TabPane>
                            {self.state.CommunitySelectData.map(function (item, i) {
                                return (
                                    <TabPane tab={item.ClassName + "【共" + item.TotalStudentCount + "人】"} key={item.Id}>
                                        <Table
                                            rowKey={record => record.Id}
                                            columns={StudentColumns}
                                            dataSource={self.state.studentListData}
                                            pagination={pagination}
                                            loading={self.state.loadingStudent}

                                            />
                                    </TabPane>
                                );
                            })}

                        </Tabs>
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

let StudentManageIndexPage = Form.create({})(StudentManageIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(StudentManageIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
