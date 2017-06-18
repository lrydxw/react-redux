//我上传的
import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Button, Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu, Tabs, message, Popconfirm } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import { UploadComponent } from './UploadComponent';
//api
import CourseShareApi from './CourseShareApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
//表单组件
const store = BaseStore({});
const TabPane = Tabs.TabPane;
const tabConfigs = [
    { name: "全部", key: "0" },
    { name: "待审核", key: "1" },
    { name: "已通过", key: "2" },
    { name: "未通过", key: "3" }
];
/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseShareUpload extends BaseContainer {
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
        this.tabsonChange = this.tabsonChange.bind(this);
        this.searchDataList = this.searchDataList.bind(this);
        this.cancelShare = this.cancelShare.bind(this);

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
            visibleForm: false,
            Keywords: "",
            TagName: "",//标签名称
            TagListData: [],//标签数据
            ShareCourseHourState: "0",
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
        obj.ShareCourseHourState = _self.state.ShareCourseHourState;

        _self.setState({ loadingTable: true });
        CourseShareApi.getSiteContributionLog(obj).then(function (data) {
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
     * 查询条件
     */
    searchDataList() {
        var _self = this;
        _self.state.PageIndex = 1;
        _self.state.ShareCourseHourState = "0";
        _self.initCourseShareList();
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
    tabsonChange(key) {
        var _self = this;
        _self.state.PageIndex = 1;
        _self.state.ShareCourseHourState = key;
        _self.initCourseShareList();
    }
    inputonChange(e) {
        var _self = this;
        _self.state.Keywords = e.target.value;
    }
    tagListOnClick(tagName) {
        var _self = this;
        _self.state.PageIndex = 1;
        _self.state.TagName = tagName;
        _self.initCourseShareList();
    }
    closeForm() {
        this.setState({ visibleForm: false });
    }
    openForm() {
        this.setState({ visibleForm: true });
    }
    submitForm(obj) {
        var _self = this;
        console.log('收到表单值：', obj);
        CourseShareApi.uploadContributionList(obj).then(function (data) {
            if (data.IsOK) {
                var result = [], msg = "";
                if (Array.isArray(data.Value)) {
                    result = data.Value;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].IsSuccess) {
                            msg += result[i].CourseTitle + "上传成功；";
                        } else {
                            msg += result[i].CourseTitle + "上传失败，原因：【" + result[i].ProcessingMessage + "】；";
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
    }
    /**
     * 取消课时共享
     * @param psaId
     */
    cancelShare(psaId) {
        var _self = this;
        CourseShareApi.cancelCourseHourShare({ PSAId: psaId }).then(function (data) {
            if (data.IsOK) {
                _self.initCourseShareList();
            } else {
                message.error(data.Message);
            }
        });
    }
    render() {
        var _self = this;
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
                title: '上传时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '审核状态',
                dataIndex: 'ShareCourseHourState',
                key: 'ShareCourseHourState',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '备注',
                dataIndex: 'Remark',
                key: 'Remark',
                width: '10%',
                render: (text, record) => <span> {record.ShareCourseHourState == "审核拒绝" ? text : ""}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        {record.IsShare && record.ShareCourseHourState == "审核通过" ? < Popconfirm title="确定要取消共享吗？" onConfirm={() => { this.cancelShare(record.PSAId) } }>
                            <a href="javascript:;">取消共享</a>
                        </Popconfirm> : ""}
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
                    <a className="main-content-word pull-left set-content-word-te">我上传的课时</a>
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
                        <Button type="primary" size="large" className="btn" onClick={this.openForm}>上传课时</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="搜索" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.searchDataList} />
                            <span className="input-group-addon  search-btn" onClick={this.searchDataList}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="clearfix">
                            <Tabs activeKey={this.state.ShareCourseHourState} onChange={this.tabsonChange}>
                                {tabConfigs.map(function (item, i) {
                                    return (
                                        <TabPane tab={item.name} key={item.key}>
                                            <Table
                                                rowKey={record => record.PSAId}
                                                columns={tableColumns}
                                                dataSource={_self.state.TableData}
                                                pagination={pagination}
                                                loading={_self.state.loadingTable}
                                                rowSelection={null}
                                                />
                                        </TabPane>
                                    );
                                })}
                            </Tabs>
                        </div>
                    </div>
                </div>
                <Modal title="可上传课时" width={600} visible={this.state.visibleForm} onCancel={this.closeForm} footer={[]} maskClosable={false} >
                    <UploadComponent onSubmit={this.submitForm} />
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

let CourseShareUploadPage = Form.create({})(CourseShareUpload);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CourseShareUploadPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);