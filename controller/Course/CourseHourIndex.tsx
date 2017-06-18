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
import { Popconfirm, message, Switch, Radio, Checkbox, Tabs, Cascader } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseHourApi from './CourseHourApi';
import CourseChapterApi from './CourseChapterApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
import RegExpVerify from '../../pub/RegExpVerify';
//表单组件
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
const store = BaseStore({});
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseHourIndex extends BaseContainer {
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
        this.initCourseHourList = this.initCourseHourList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.initChapterList = this.initChapterList.bind(this);
        this.tabsonChange = this.tabsonChange.bind(this);
        this.deleteCourseHour = this.deleteCourseHour.bind(this);
        this.updateCourseHourOrder = this.updateCourseHourOrder.bind(this);
        this.updateCourseHourPublish = this.updateCourseHourPublish.bind(this);
        this.inputonChange = this.inputonChange.bind(this);
        this.initCourseChapterCascaderList = this.initCourseChapterCascaderList.bind(this);
        this.openOperateForm = this.openOperateForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.batchDeleteCourseHour = this.batchDeleteCourseHour.bind(this);
        this.batchUpdateCourseHourPublish = this.batchUpdateCourseHourPublish.bind(this);
        this.openChapterForm = this.openChapterForm.bind(this);
        this.submitChapterForm = this.submitChapterForm.bind(this);
        this.UpdateCourseHourSendMessage = this.UpdateCourseHourSendMessage.bind(this);
        this.checkedOnChange = this.checkedOnChange.bind(this);
        this.tabsOnEdit = this.tabsOnEdit.bind(this);
        //章节表单
        let chapterElements: FormElement[] = [
            { key: "ChapterTitle", element: ElementEnum.Input, type: "string", label: "章节名称", message: "请填写章节名称", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "OrderIndex", element: ElementEnum.Input, type: "string", label: "章节排序", message: "请输入1-100之间的整数。", defaultValue: "0", rules: { required: true, whitespace: false, validator: this.checkOrderIndex }, dataList: [] },
        ];

        this.searchData = {};

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isCopy: true,//是否复制 true：复制  false：移动
            CourseHourListData: [],//列表数据
            loadingCourseHour: false,//正在加载列表
            selectCourseHourIndex: -1,//选择列表序号
            selectCourseHourId: "",//选择的Id
            selectedRowKeys: [],//功能选择
            selectedRows: [],
            CourseHourTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            CourseProductId: LocalStorage.get('CourseProductId'),
            ProductName: LocalStorage.get('ProductName'),
            ChapterSelectId: "",//章节Id
            ChapterListData: [],//章节数据
            Keywords: "",
            CourseChapterCascaderData: [],//课程章节级联数据
            visibleChapterForm: false,//是否显示章节添加弹窗
            ChapterPara: chapterElements,//章节表单
            ChapterDefaultValues: {},//章节默认数据
            visibleConfirm: false,//是否显示confirm
            publishTitle: "",//弹窗提示内容
            IsPublish: false,//是否发布
            IsSendMessage: false,//是否发送
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initChapterList();
        this.initCourseHourList();
        this.initCourseChapterCascaderList();
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
     * 获取课时列表数据
     */
    initCourseHourList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.CourseProductId = _this.state.CourseProductId;
        obj.ChapterId = _this.state.ChapterSelectId;
        obj.CourseTitle = _this.state.Keywords;
        if (obj.CourseTitle) //有关键词从第一页查询
            obj.PageIndex = 1;

        _this.state.visibleForm = false;
        _this.setState({ loadingCourseHour: true });
        CourseHourApi.getCourseHourPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CourseHourListData = functionData;
                _this.state.CourseHourTotalCount = data.AllCount;
            }
            _this.setState({ loadingCourseHour: false, selectedRowKeys: [] });
        });
    }
    /**
     * 获取章节列表数据
     */
    initChapterList() {
        var _this = this;
        CourseChapterApi.getCourseChapterList({ "CourseProductId": _this.state.CourseProductId }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ ChapterListData: functionData });
            }
        });
    }
    /**
     * 获取章节级联列表数据
     */
    initCourseChapterCascaderList() {
        var _this = this;
        CourseChapterApi.getCourseChapterCascaderList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CourseChapterCascaderData = functionData;
            }
        });
    }
    /**
     * 删除课时数据
     */
    deleteCourseHour(Id) {
        var _this = this;
        var obj = { Id: Id };
        CourseHourApi.deleteCourseHour(obj).then(function (data) {
            if (data.IsOK) {
                _this.initCourseHourList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 修改课时排序
     * @param Id Id
     * @param OrderIndex 上移-1，下移1
     */
    updateCourseHourOrder(Id, OrderIndex, ShiftUp) {
        var _this = this;
        var obj = { Id: Id, OrderIndex: OrderIndex, ShiftUp: ShiftUp };
        CourseHourApi.updateCourseHourOrder(obj).then(function (data) {
            if (data.IsOK) {
                _this.initCourseHourList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
    }
    showNewPage(Id, CourseProductId) {
        LocalStorage.add('Id', Id);
        LocalStorage.add('CourseProductId', CourseProductId);
        Tool.goPush('Course/CourseHourEdit');
    }
    /**
     * 课时预告
     * @param Id
     * @param CourseProductId
     */
    showNoticePage(Id, CourseProductId) {
        LocalStorage.add('Id', Id);
        LocalStorage.add('CourseProductId', CourseProductId);
        Tool.goPush('Course/CourseHourYuGao');
    }
    tabsonChange(key) {
        var _this = this;
        _this.state.ChapterSelectId = key;
        _this.state.Keywords = "";
        _this.state.selectedRowKeys = [];
        _this.initCourseHourList();
    }
    inputonChange(e) {
        var _this = this;
        _this.state.Keywords = e.target.value;
    }
    /**
     * 关闭弹窗
     */
    closeForm() {
        this.setState({ visibleForm: false, visibleChapterForm: false });
    }
    /**
     * 打开操作弹窗
     * @param isCopy true 复制  false 移动
     */
    openOperateForm(isCopy) {
        var _this = this;
        _this.props.form.resetFields();
        _this.setState({ isCopy: isCopy, visibleForm: true });
        return false;
    }
    /**
     * 提交数据
     * @param isCopy true 复制  false 移动
     */
    submitForm() {
        var form = this.props.form;
        var _this = this;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.Id = _this.state.selectedRowKeys;
            if (obj.CourseChapterCascader.length > 1) {
                obj.CourseProductId = obj.CourseChapterCascader[0];
                obj.ChapterId = obj.CourseChapterCascader[1];
            }
            else {
                obj.CourseProductId = obj.CourseChapterCascader[0];
            }
            console.log('收到表单值：', obj);
            if (_this.state.isCopy) {
                //复制
                CourseHourApi.batchCopyCourseHour(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseHourList();
                    } else {
                        message.error(data.Message);
                    }
                });
            } else {
                //移动
                CourseHourApi.batchRemoveCourseHour(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseHourList();
                    } else {
                        message.error(data.Message);
                    }
                });
            }
        });
    }
    /**
     * 批量删除
     */
    batchDeleteCourseHour() {
        var _this = this;
        var obj = { Id: _this.state.selectedRowKeys };
        confirm({
            title: "确定要删除吗？",
            onOk() {
                CourseHourApi.batchDeleteCourseHour(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initCourseHourList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }
    /**
	 * 修改课时发布状态
	 */
    updateCourseHourPublish(Id, IsPublish) {
        var _this = this;
        var obj = { Id: Id, IsPublish: IsPublish };
        CourseHourApi.updateCourseHourPublish(obj).then(function (data) {
            if (data.IsOK) {
                _this.initCourseHourList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 批量修改课时发布状态
     */
    batchUpdateCourseHourPublish(IsPublish) {
        var _this = this;
        var selectedCourseHour = [];
        if (IsPublish) {
            _this.state.selectedRows.map(function (item) {
                if (item.IsPublish) {
                    selectedCourseHour.push(item.CourseTitle);
                }
            });
        } else {
            _this.state.selectedRows.map(function (item) {
                if (!item.IsPublish) {
                    selectedCourseHour.push(item.CourseTitle);
                }
            });
        }
        if (selectedCourseHour.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的课时中【' + selectedCourseHour.join("，") + "】已经是" + (IsPublish ? "发布状态" : "未发布状态"),
            });
            return;
        }
        _this.state.publishTitle = IsPublish ? "确定要发布吗？" : "确定要取消发布吗？";
        _this.state.IsPublish = IsPublish;
        _this.setState({ visibleConfirm: true });
    }

    /**
     * *发布课时
     */
    UpdateCourseHourSendMessage() {
        var _this = this;
        var IsPublish = _this.state.IsPublish;
        var IsSendMessage = _this.state.IsSendMessage;
        if (!IsPublish) IsSendMessage = false;
        var obj = { Id: _this.state.selectedRowKeys, IsPublish: IsPublish, IsSendMessage: IsSendMessage };
        if (obj.Id.length < 1)
            obj.Id = [_this.state.selectCourseHourId];
        console.log(obj);
        CourseHourApi.batchUpdateCourseHourPublish(obj).then(function (data) {
            if (data.IsOK) {
                _this.setState({ visibleConfirm: false });
                _this.initCourseHourList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 打开章节弹窗
     */
    openChapterForm() {
        this.setState({ ChapterDefaultValues: {} });
        this.setState({ visibleChapterForm: true });
        return false;
    }
    /**
     * 提交章节表单
     */
    submitChapterForm(obj) {
        var _this = this;
        obj.CourseProductId = _this.state.CourseProductId;
        console.log('收到表单值：', obj);
        CourseChapterApi.insertCourseChapter(obj).then(function (data) {
            if (data.IsOK) {
                _this.setState({ visibleChapterForm: false });
                _this.initChapterList();
                _this.initCourseHourList();
            } else {
                message.error(data.Message);
            }
        });
    }

    checkOrderIndex(rule, value, callback) {
        if (value && (!(/^\d+?$/).test(value.toString().trim()))) {
            callback('输入的数字格式有误');
        }
        else {
            if (value && (value < 1 || value > 100)) {
                callback('请输入1-100之间的整数。');
            }
            else {
                callback();
            }
        }
    }

    checkedOnChange(e) {
        var _this = this;
        _this.state.IsSendMessage = e.target.checked;
    }
    /**
     * 删除章节
     */
    tabsOnEdit(targetKey, action) {
        var _this = this;
        confirm({
            title: "确定要删除吗？",
            onOk() {
                CourseChapterApi.deleteCourseChapter({ Id: targetKey }).then(function (data) {
                    if (data.IsOK) {
                        _this.initChapterList();
                        _this.initCourseHourList();
                    } else {
                        Modal.info({
                            title: '温馨提示',
                            content: data.Message,
                        });
                    }
                });
            },
            onCancel() { },
        });
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const CourseHourColumns = [
            {
                title: '标题',
                dataIndex: 'CourseTitle',
                key: 'CourseTitle',
                width: '30%',
                render: (text, record) =>
                    <div className="clearfix">
                        <img className="pull-left margin-right10" src={record.ShowImgUrl} title={Tool.cutString(text, 14)} width="52" />
                        <div className="pull-left col-xs-10">
                            <p>
                                <span>第{record.CourseNo}期</span>&nbsp; &nbsp;
                                <a className="color-blue font12" onClick={() => { this.showNewPage(record.Id, record.CourseProductId) } }>{text}</a>
                            </p>
                            <p>
                                {record.StartTime ? (Tool.compareDate(record.StartTime, Tool.getNowFormatDate()) ? <img src="/Content/images/remind-1.png" width="22" height="13" /> : "") : ""}
                                {record.CourseWay == "直播" ? <img src="/Content/images/remind-2.png" width="22" height="13" /> : ""}
                            </p>
                        </div>
                    </div>,
            },
            {
                title: '章节',
                dataIndex: 'ChapterTitle',
                key: 'ChapterTitle',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '讲师',
                dataIndex: 'LecturerName',
                key: 'LecturerName',
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
            },
            {
                title: '显示期号',
                dataIndex: 'IsShowCourseNo',
                key: 'IsShowCourseNo',
                render: (text) => <span> {text ? '是' : '否'}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.showNoticePage(record.Id, record.CourseProductId) } }>编辑预告</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={() => { this.showNewPage(record.Id, record.CourseProductId) } }>编辑内容</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={() => { this.setState({ visibleConfirm: true, selectCourseHourId: record.Id, IsPublish: !record.IsPublish, publishTitle: (!record.IsPublish ? "确定要发布吗？" : "确定要取消发布吗？") }) } }>{!record.IsPublish ? "发布" : "取消发布"}</a>
                        {!record.IsPublish ? <span><span className="ant-divider"></span>
                            <Popconfirm title="确定要删除吗？" onConfirm={() => { this.deleteCourseHour(record.Id) } }>
                                <a href="javascript:;">删除</a>
                            </Popconfirm></span> : ""}
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
                    <a className="main-content-word pull-left set-content-word-te">课时管理</a>
                </div>

                <div className="row  margin-top20 margin-btm20">
                    <div className="col-lg-6 col-sm-12">
                        <i className="nav-collapse-title-sign"></i>
                        <span className="margin-right15 margin-left5">{self.state.ProductName}</span>
                        <span className="color9">此{self.state.ChapterSelectId && self.state.ChapterSelectId != "all" ? "章节" : "门课程"}包含{self.state.CourseHourTotalCount}节课时</span>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                        <div className="clearfix">
                            <button className="btn btn-info pull-right margin-left5" onClick={self.openChapterForm}>添加章节</button>
                            <button className="btn btn-success pull-right margin-left5" onClick={() => { self.showNewPage("", self.state.CourseProductId) } }>新增课时</button>
                            <div className="input-group pull-right add-width-search">
                                <Input type="text" className="col-lg-6 form-control search-fill" placeholder="课时标题" onChange={self.inputonChange} style={{ height: 34 }} onPressEnter={self.initCourseHourList} />
                                <span className="input-group-addon  search-btn" onClick={self.initCourseHourList}>
                                    <i className="fa fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <div className="clearfix">
                            <Tabs onChange={self.tabsonChange} type={self.state.CourseHourTotalCount > 0 ? "line" : "editable-card"} onEdit={self.tabsOnEdit} hideAdd={true}>
                                <TabPane tab="全部" key="all">
                                    <Table
                                        rowKey={record => record.Id}
                                        columns={CourseHourColumns}
                                        dataSource={self.state.CourseHourListData}
                                        pagination={pagination}
                                        loading={self.state.loadingCourseHour}
                                        rowSelection={rowSelection}
                                        footer={() =>
                                            <ButtonGroup>
                                                <Button disabled={!hasSelected} onClick={() => { self.batchUpdateCourseHourPublish(true) } }>发布</Button>
                                                <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={() => { self.batchUpdateCourseHourPublish(false) } }>取消发布</Button>
                                                <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={() => { self.openOperateForm(true) } }>复制</Button>
                                                <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={() => { self.openOperateForm(false) } }>移动</Button>
                                                <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={self.batchDeleteCourseHour}>删除</Button>
                                            </ButtonGroup>
                                        }
                                        onRowClick={
                                            (record, index) => {
                                                self.state.selectedRowKeys = [];
                                                self.setState({
                                                    selectCourseHourIndex: index
                                                });
                                            }
                                        }
                                        rowClassName={
                                            (record, index) => {
                                                return index === self.state.selectCourseHourIndex ? " ant-table-row-active " : "";
                                            }
                                        }
                                        />
                                </TabPane>
                                {self.state.ChapterListData.map(function (item, i) {
                                    return (
                                        <TabPane tab={item.ChapterTitle} key={item.Id}>
                                            <Table
                                                rowKey={record => record.Id}
                                                columns={CourseHourColumns}
                                                dataSource={self.state.CourseHourListData}
                                                pagination={pagination}
                                                loading={self.state.loadingCourseHour}
                                                rowSelection={rowSelection}
                                                footer={() =>
                                                    <ButtonGroup>
                                                        <ButtonGroup>
                                                            <Button disabled={!hasSelected} onClick={() => { self.batchUpdateCourseHourPublish(true) } }>发布</Button>
                                                            <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={() => { self.batchUpdateCourseHourPublish(false) } }>取消发布</Button>
                                                            <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={() => { self.openOperateForm(true) } }>复制</Button>
                                                            <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={() => { self.openOperateForm(false) } }>移动</Button>
                                                            <Button style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={self.batchDeleteCourseHour}>删除</Button>
                                                        </ButtonGroup>
                                                    </ButtonGroup>
                                                }
                                                onRowClick={
                                                    (record, index) => {
                                                        self.state.selectedRowKeys = [];
                                                        self.setState({
                                                            selectCourseHourIndex: index
                                                        });
                                                    }
                                                }
                                                rowClassName={
                                                    (record, index) => {
                                                        return index === self.state.selectCourseHourIndex ? " ant-table-row-active " : "";
                                                    }
                                                }
                                                />
                                        </TabPane>
                                    );
                                })}
                            </Tabs>
                        </div>
                    </div>
                </div>

                <Modal title={self.state.isCopy ? "复制课时" : "移动课时"} visible={self.state.visibleForm} onOk={self.submitForm} onCancel={self.closeForm} maskClosable={false} >
                    <Form horizontal>
                        <FormItem
                            {...formItemLayout}
                            label={self.state.isCopy ? "复制课时到" : "移动课时到"}
                            >
                            <Cascader options={self.state.CourseChapterCascaderData} placeholder="请选择目标位置" {...getFieldProps('CourseChapterCascader', {
                                validate: [{
                                    rules: [
                                        { required: true, type: 'array', message: '请选择目标位置' },
                                    ]
                                }]
                            }) } />
                        </FormItem>
                    </Form>
                </Modal>
                <Modal title="添加章节" visible={this.state.visibleChapterForm} onCancel={this.closeForm} footer={[]} maskClosable={false}>
                    <FormTemplate formElements={this.state.ChapterPara} defaultValues={this.state.ChapterDefaultValues} isInsert={true} onSubmit={this.submitChapterForm} onCancel={this.closeForm}></FormTemplate>
                </Modal>
                <Modal visible={this.state.visibleConfirm} title="" width={420} onOk={this.UpdateCourseHourSendMessage} onCancel={() => { this.setState({ visibleConfirm: false }) } } maskClosable={false}>
                    <div className="row padding-left20">
                        <p className="wen-ico color3 font16">{this.state.publishTitle}</p >
                        <p className="wen-ico color3 font14">
                            {this.state.IsPublish ? <Checkbox onChange={this.checkedOnChange}>通过公众号给用户发送开课消息</Checkbox> : ""}
                        </p >
                    </div>
                </Modal>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let CourseHourIndexPage = Form.create({})(CourseHourIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseHourIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);