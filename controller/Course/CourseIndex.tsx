import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Row, Col, Modal, Form, Input, Button, Popconfirm, message, Radio, Select, Checkbox, Upload, Icon } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import CourseApi from './CourseApi';
import ProductApi from '../Product/ProductApi';
import CommunityApi from '../User/CommunityApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const ButtonGroup = Button.Group;
//查询表单
import SearchForm from '../../components/FormTemplate/SearchForm';
const Search = Form.create()(SearchForm);
const confirm = Modal.confirm;
const Option = Select.Option;
const RadioGroup = Radio.Group;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseIndex extends BaseContainer {
    //初始化加载
    searchData: any;
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initCourseList = this.initCourseList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
        this.publishCourse = this.publishCourse.bind(this);
        this.canclePublishCourse = this.canclePublishCourse.bind(this);
        this.onshelveCourse = this.onshelveCourse.bind(this);
        this.unshelveCourse = this.unshelveCourse.bind(this);
        this.setCreateClassChange = this.setCreateClassChange.bind(this);
        this.setSearchKeywords = this.setSearchKeywords.bind(this);
        this.searchCourse = this.searchCourse.bind(this);
        this.recommendedHomeCourse = this.recommendedHomeCourse.bind(this);
        this.unRecommendedHomeCourse = this.unRecommendedHomeCourse.bind(this);

        this.searchData = {};
        this.state = {
            CourseListData: [],//列表数据
            loadingCourse: false,//正在加载列表
            selectCourseIndex: -1,//选择列表序号
            selectCourseId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            CourseTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            searchPara: [
                { key: "ProductName", type: "Input", name: "课程名称", message: "课程名称" },
            ],
            searchKeywords: "",
            selectedRows: []
        }
    }



    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCourseList();
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
    initCourseList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.ProductType = 2;//课程
        obj.ProductName = _this.state.searchKeywords;
        _this.state.visibleForm = false;
        _this.setState({ loadingCourse: true });
        CourseApi.getCourseList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CourseListData = functionData;
                _this.state.CourseTotalCount = data.AllCount;
            }
            _this.setState({ loadingCourse: false, selectedRowKeys: [] });

        });
    }


    setSearchKeywords(e) {
        this.state.searchKeywords = e.target.value;
    }

    searchCourse() {
        this.state.PageIndex = 1;
        this.initCourseList();
    }



    deleteCourse(Id) {

        var _this = this;
        confirm({
            title: '您是确认要删除已选课程吗？',
            content: '该操作不可恢复！！！',
            onOk() {
                var obj = { CourseIdArray: _this.state.selectedRowKeys };
                CourseApi.deleteCourse(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }


    //创建新课程
    editCourse() {
        Tool.goPush('Course/CourseInfoSetStep1');
        LocalStorage.add('CourseProductId', "");
    }


    /**
     * 列表更改事件
     * @param selectedLecturerKeys
     * @param selectedRows
     */
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
    }

    setCreateClassChange(e) {
        this.setState({ isCreateClass: e.target.checked });
    }

    showNewPage(Id, ProductName) {
        Tool.goPush('Course/CourseHour');
        LocalStorage.add('CourseProductId', Id);
        LocalStorage.add('ProductName', ProductName);
    }

    EditCourse(id) {
        Tool.goPush('Course/CourseInfoSetStep1');
        LocalStorage.add('CourseProductId', id);
    }

    publishCourse() {
        var _this = this;
        var selectedPublishCourse = [];

        _this.state.selectedRows.map(function (item) {
            if (item.IsPublish) {
                selectedPublishCourse.push(item.ProductName);
            }

        });

        if (selectedPublishCourse.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课程中【' + selectedPublishCourse.join("，") + "】已经是发布状态",
            });
            return;
        }

        confirm({
            title: '您是确认要发布这些课程吗？',
            onOk() {
                var obj = { CourseIdArray: _this.state.selectedRowKeys, IsPublish: true };
                CourseApi.SwitchCoursePublishState(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }

    canclePublishCourse() {
        var _this = this;

        var selectedUnPublishCourse = [];

        _this.state.selectedRows.map(function (item) {
            if (!item.IsPublish) {
                selectedUnPublishCourse.push(item.ProductName);
            }

        });

        if (selectedUnPublishCourse.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课程中【' + selectedUnPublishCourse.join("，") + "】已经是未发布状态",
            });
            return;
        }

        confirm({
            title: '您是确认要取消发布这些课程吗？',
            onOk() {
                var obj = { CourseIdArray: _this.state.selectedRowKeys, IsPublish: false };
                CourseApi.SwitchCoursePublishState(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }

    onshelveCourse() {
        var _this = this;

        var selectedOnShelvesCourse = [];
        _this.state.selectedRows.map(function (item) {
            if (item.IsShelves) {
                selectedOnShelvesCourse.push(item.ProductName);
            }

        });

        if (selectedOnShelvesCourse.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课程中【' + selectedOnShelvesCourse.join("，") + "】已经是发布状态",
            });
            return;
        }


        confirm({
            title: '您是确认要发布这些课程吗？',
            onOk() {
                var obj = { ProductIdArray: _this.state.selectedRowKeys, IsShelves: true };
                ProductApi.setProductStatusBatch(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }

    unshelveCourse() {
        var _this = this;

        var selectedUnShelvesCourse = [];
        _this.state.selectedRows.map(function (item) {
            if (!item.IsShelves) {
                selectedUnShelvesCourse.push(item.ProductName);
            }

        });

        if (selectedUnShelvesCourse.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课程中【' + selectedUnShelvesCourse.join("，") + "】已经是未发布状态",
            });
            return;
        }


        confirm({
            title: '您是确认要取消这些课程吗？',
            onOk() {
                var obj = { ProductIdArray: _this.state.selectedRowKeys, IsShelves: false };
                ProductApi.setProductStatusBatch(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }


    recommendedHomeCourse() {
        var _this = this;

        var selectedCourse = [];
        _this.state.selectedRows.map(function (item) {
            if (item.IsRecommendedHome) {
                selectedCourse.push(item.ProductName);
            }

        });

        if (selectedCourse.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课程中【' + selectedCourse.join("，") + "】已经推荐到首页",
            });
            return;
        }


        confirm({
            title: '您是确认要把已选课程推荐到首页吗？',
            onOk() {
                var obj = { CourseIdArray: _this.state.selectedRowKeys, IsRecommendedHome: true };
                CourseApi.SwitchCourseRecommendedHomeState(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }

    unRecommendedHomeCourse() {
        var _this = this;

        var selectedCourse = [];
        _this.state.selectedRows.map(function (item) {
            if (!item.IsRecommendedHome) {
                selectedCourse.push(item.ProductName);
            }

        });

        if (selectedCourse.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课程中【' + selectedCourse.join("，") + "】已经取消推荐到首页",
            });
            return;
        }


        confirm({
            title: '您是确认要把已选课程取消推荐到首页吗？',
            onOk() {
                var obj = { CourseIdArray: _this.state.selectedRowKeys, IsRecommendedHome: false };
                CourseApi.SwitchCourseRecommendedHomeState(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }


    render() {
        let SearchFormModel = Search;

        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const CourseColumns = [
            {
                title: '课程名称',
                dataIndex: 'ProductName',
                key: 'ProductName',
                render: (text, record) => <span><a href="javascript:;" onClick={(event) => { this.showNewPage(record.Id, record.ProductName) } }>{text}</a> </span>,
            },
            {
                title: '章节数量',
                dataIndex: 'ChapterCount',
                key: 'ChapterCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '课时数量',
                dataIndex: 'CourseHourCount',
                key: 'CourseHourCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '学员数量',
                dataIndex: 'StudentCount',
                key: 'StudentCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '售卖数量',
                dataIndex: 'SellCount',
                key: 'SellCount',
                render: (text) => <span> {text}</span>,
            },
           
            {
                title: '是否发布',
                dataIndex: 'IsShelves',
                key: 'IsShelves',
                render: (text, record) => (<span> {record.IsShelves ? "已发布" : "未发布"}</span>),
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
                        <a href="javascript:;" onClick={(event) => { this.EditCourse(record.Id) } }>查看编辑</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={(event) => { this.showNewPage(record.Id, record.ProductName) } }>管理课时</a>
                    </span>
                ),
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            //getCheckboxProps: record => ({
            //    disabled: this.state.selectRoleIndex < 0,    // 配置无法勾选的列
            //}),
        };





        //批量操作按钮是否可用
        const hasSelected = selectedRowKeys.length > 0;
        var self = this;
        const pagination = {
            total: self.state.CourseTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initCourseList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initCourseList();
            },
            showTotal() {
                return `共 ${self.state.CourseTotalCount} 条`;
            }
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">课程管理</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={this.editCourse}>创建新课程</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="课程名称" onChange={this.setSearchKeywords} style={{ height: 34 }} onPressEnter={this.searchCourse} />
                            <span className="input-group-addon  search-btn" onClick={this.searchCourse}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <Row>

                    <Col>

                        <Table
                            columns={CourseColumns}
                            dataSource={this.state.CourseListData}
                            pagination={pagination}
                            loading={this.state.loadingCourse}
                            rowSelection={rowSelection}
                            rowKey={record => record.Id}
                            footer={() =>
                                <ButtonGroup>
                                    <Button style={{ marginLeft: 8 }} onClick={this.onshelveCourse} disabled={!hasSelected} >发布</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.unshelveCourse} disabled={!hasSelected} >取消发布</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.deleteCourse} disabled={!hasSelected} >删除</Button>
                                </ButtonGroup>
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

let CourseIndexPage = Form.create({})(CourseIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
