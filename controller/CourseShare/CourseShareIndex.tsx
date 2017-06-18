//课程共享库
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Button, Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu, Cascader, message } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseChapterApi from '../Course/CourseChapterApi';
import CourseShareApi from './CourseShareApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseShareIndex extends BaseContainer {
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
        this.closeForm = this.closeForm.bind(this);
        this.openForm = this.openForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.initTagList = this.initTagList.bind(this);
        this.tagListOnClick = this.tagListOnClick.bind(this);

        this.searchData = {};

        this.state = {
            visibleForm: false,
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            loadingTable: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            selectedRowId: "",//当前选择的Id
            selectedRows: [],
            TableData: [],//列表数据
            Keywords: "",
            CourseChapterCascaderData: [],//课程章节级联数据
            SelectedCourseTitle: "",
            TagName: "",//标签名称
            TagListData: [],//标签数据
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCourseChapterCascaderList();
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
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
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
        CourseShareApi.getShareCourseHourPageList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _self.state.TableData = functionData;
                _self.state.TotalCount = data.AllCount;
            } else {
                _self.state.TableData = [];
                _self.state.TotalCount = 0;
            }
            _self.setState({ loadingTable: false });
        });
    }
    /**
     * 获取课程章节级联列表数据
     */
    initCourseChapterCascaderList() {
        var _self = this;
        CourseChapterApi.getCourseChapterCascaderList({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _self.state.CourseChapterCascaderData = functionData;
            }
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
    inputonChange(e) {
        var _self = this;
        _self.state.Keywords = e.target.value;
    }
    closeForm() {
        this.setState({ visibleForm: false, selectedRowKeys: [] });
    }
    openForm(PSAId, record) {
        var _self = this;
        if (PSAId) {
            _self.state.selectedRowKeys = [PSAId];
            _self.state.selectedRows = [record];
        }
        var selectedRows = _self.state.selectedRows, courseTitle = "";
        for (var i = 0; i < selectedRows.length; i++) {
            courseTitle += selectedRows[i].CourseTitle;
            if (i < selectedRows.length - 1)
                courseTitle += " | ";
        }
        _self.props.form.resetFields();
        _self.setState({ visibleForm: true, selectedRowKeys: _self.state.selectedRowKeys, SelectedCourseTitle: courseTitle });
    }
    submitForm() {
        var _self = this;
        var form = _self.props.form;
        const { getFieldValue, validateFields } = _self.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.PSAId = _self.state.selectedRowKeys;
            if (obj.CourseChapterCascader.length > 1) {
                obj.CourseProductId = obj.CourseChapterCascader[0];
                obj.ChapterId = obj.CourseChapterCascader[1];
            }
            else {
                obj.CourseProductId = obj.CourseChapterCascader[0];
                obj.ChapterId = "";
            }
            console.log('收到表单值：', obj);
            CourseShareApi.pullShareCourseHour(obj).then(function (data) {
                if (data.IsOK) {
                    var result = [], msg = "";
                    if (Array.isArray(data.Value)) {
                        result = data.Value;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].IsSuccess) {
                                msg += result[i].CourseTitle + "购买成功；";
                            } else {
                                msg += result[i].CourseTitle + "购买失败，原因：【" + result[i].ProcessingMessage + "】；";
                            }
                        }
                        Modal.success({
                            title: '处理结果',
                            content: msg,
                            onOk() {
                                _self.setState({ visibleForm: false });
                                _self.initCourseShareList();
                            },
                        });
                    }
                } else {
                    message.error(data.Message);
                }
            });
        });
    }
    tagListOnClick(tagName) {
        var _self = this;
        _self.state.TagName = tagName;
        _self.initCourseShareList();
    }
    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = _self.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const tableColumns = [
            {
                title: '课时/名称',
                dataIndex: 'CourseTitle',
                key: 'CourseTitle',
                width: '30%',
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
                title: '销量',
                dataIndex: 'SaleCount',
                key: 'SaleCount',
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
                title: '播课形式',
                dataIndex: 'CourseType',
                key: 'CourseType',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    if (record.IsPurchase) {
                        return <span></span>
                    } else {
                        return <span>
                            <a href="javascript:;" onClick={() => { this.openForm(record.PSAId, record) } }>购买</a>
                        </span>
                    }
                },
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.IsPurchase,
            }),
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
                    <a className="main-content-word pull-left set-content-word-te">课程共享库</a>
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
                                rowKey={record => record.PSAId}
                                columns={tableColumns}
                                dataSource={this.state.TableData}
                                pagination={pagination}
                                loading={this.state.loadingTable}
                                rowSelection={rowSelection}
                                footer={() =>
                                    <Button disabled={!hasSelected} onClick={() => { this.openForm("", null) } }>购买</Button>
                                }
                                onRowClick={
                                    (record, index) => {
                                        this.state.selectedRowKeys = [];
                                        this.setState({
                                            selectedRowIndex: index,
                                            selectedRowId: record.PSAId
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
                <Modal title="购买课时" visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm} maskClosable={false} >
                    <Form horizontal>
                        <FormItem
                            {...formItemLayout}
                            label="课时名称"
                            >
                            <span >{this.state.SelectedCourseTitle}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="课时数量"
                            >
                            <span >{this.state.selectedRows.length}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="加入到课程"
                            >
                            <Cascader options={this.state.CourseChapterCascaderData} placeholder="请选择目标位置" {...getFieldProps('CourseChapterCascader', {
                                validate: [{
                                    rules: [
                                        { required: true, type: 'array', message: '请选择目标位置' },
                                    ]
                                }]
                            }) } />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="课时总价"
                            >
                            <span className="color-red">¥ 0</span>
                        </FormItem>
                    </Form>
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

let CourseShareIndexPage = Form.create({})(CourseShareIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseShareIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
