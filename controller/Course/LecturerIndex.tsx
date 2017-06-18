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
import { Popconfirm, message, Switch, Radio } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import LecturerApi from './LecturerApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;

import { RewardRecord } from './LectureComponent/RewardRecord';
import { WithDraw } from './LectureComponent/WithDraw';


//查询表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class LecturerIndex extends BaseContainer {
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
        this.openInsertForm = this.openInsertForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.initLecturerList = this.initLecturerList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deleteLecturer = this.deleteLecturer.bind(this);
        this.inputonChange = this.inputonChange.bind(this);
        this.closeRewardModal = this.closeRewardModal.bind(this);
        this.openRewardModal = this.openRewardModal.bind(this);
        this.closeWithDrawModal = this.closeWithDrawModal.bind(this);
        this.openWithDrawModal = this.openWithDrawModal.bind(this);
        this.searchData = {};

        let formElements: FormElement[] = [
            { key: "LecturerName", element: ElementEnum.Input, type: "string", label: "讲师姓名", message: "请填写讲师姓名", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "LecturerTitle", element: ElementEnum.Input, type: "string", label: "讲师称谓", message: "请填写讲师称谓", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "WeChatAccount", element: ElementEnum.Input, type: "string", label: "微信号", message: "请填写讲师微信号", defaultValue: "", rules: { required: false, whitespace: true }, dataList: [] },
            { key: "Mobile", element: ElementEnum.Input, type: "string", label: "手机号", message: "请填写讲师手机号", defaultValue: "", rules: { required: false, whitespace: true, validator: RegExpVerify.checkMobile }, dataList: [] },
            { key: "HeadImgUrl", element: ElementEnum.Upload, type: "array", label: "头像", config: {}, message: "请上传头像", rules: { required: true }, dataList: [] },
            { key: "Description", element: ElementEnum.Textarea, type: "string", label: "讲师描述", message: "请填写讲师描述", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            LecturerListData: [],//列表数据
            loadingLecturer: false,//正在加载列表
            selectLecturerIndex: -1,//选择列表序号
            selectLecturerId: "",//选择的Id
            selectedRowKeys: [],//功能选择
            LecturerTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            modalPara: formElements,
            defaultValues: {},
            editId: "-1",
            Keywords: "",
            showRewardModal: false,//显示打赏记录
            LectureId: null,
            showWithDrawModal: false
        }
    }
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initLecturerList();
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
    initLecturerList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.Keywords = _this.state.Keywords;
        if (obj.Keywords)
            obj.PageIndex = 1;

        _this.state.visibleForm = false;
        _this.setState({ loadingLecturer: true });
        LecturerApi.getLecturerList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.LecturerListData = functionData;
                _this.state.LecturerTotalCount = data.AllCount;
            }
            _this.setState({ loadingLecturer: false });
        });
        _this.state.modalPara[4].config = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            defaultFileList: [],
        };
    }
    /**
     * 提交数据
     */
    submitForm(obj) {
        var _this = this;
        console.log('收到表单值：', obj);
        if (_this.state.isInsert) {
            LecturerApi.insertLecturer(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initLecturerList();
                } else {
                    message.error(data.Message);
                }
            });
        } else {
            obj.Id = _this.state.selectLecturerId;
            LecturerApi.updateLecturer(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initLecturerList();
                } else {
                    message.error(data.Message);
                }
            });
        }
    }
    /**
     * 删除
     * @param Id
     */
    deleteLecturer(Id) {
        var _this = this;
        var obj = { Id: Id };
        LecturerApi.deleteLecturer(obj).then(function (data) {
            if (data.IsOK) {
                _this.initLecturerList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 关闭弹窗
     */
    closeForm() {
        this.setState({ visibleForm: false });
    }
    /**
     * 关闭打赏弹窗
     */
    closeRewardModal() {
        this.setState({ showRewardModal: false });
    }
    /**
     * 关闭打赏弹窗
     */
    openRewardModal(lectureId, IsReward) {
        this.setState({ IsReward: IsReward, LectureId: lectureId, showRewardModal: true });
    }
    /**
     * 关闭提现弹窗
     */
    closeWithDrawModal(isRefresh) {
        var self = this;
        this.setState({ showWithDrawModal: false }, () => {
            if (isRefresh) {
                self.initLecturerList();
            }
        });
    }
    /**
     * 关闭提现弹窗
     */
    openWithDrawModal(lectureId) {
        this.setState({ LectureId: lectureId, showWithDrawModal: true });
    }
    /**
 * 打开修改弹窗
 */
    openEditForm(Id) {
        var _this = this;
        _this.state.isInsert = false;
        _this.state.visibleForm = true;
        var obj = { Id: Id };
        LecturerApi.getLecturer(obj).then(function (data) {
            if (data.IsOK) {
                var record = data.Value;
                record.Description = record.Description.replace(/<br \/>/g, "\r\n");
                console.log(record);
                _this.state.modalPara[4].config.defaultFileList = [{
                    uid: record.Id,
                    name: record.LecturerName,
                    status: 'done',
                    url: record.HeadImgUrl,
                    thumbUrl: record.HeadImgUrl,
                }];
                _this.setState({ editId: record.Id, defaultValues: record });
                $(".ant-upload-select-picture-card").css("display", !!record.HeadImgUrl ? "none" : "");
            }
        });
        return false;
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        var _this = this;
        _this.state.isInsert = true;
        _this.state.visibleForm = true;
        _this.state.modalPara[4].config.defaultFileList = [];
        _this.setState({ defaultValues: {} });
        return false;
    }
    /**
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    inputonChange(e) {
        var _this = this;
        _this.state.Keywords = e.target.value;
    }

    showNewPage(Id, LecturerName) {
        Tool.goPush('Course/LecturerCourseHour');
        LocalStorage.add('LecturerId', Id);
        LocalStorage.add('LecturerName', LecturerName);
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const LecturerColumns = [
            {
                title: '讲师姓名',
                dataIndex: 'LecturerName',
                key: 'LecturerName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '打赏金额',
                dataIndex: 'Reward',
                key: 'Reward',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '账户余额',
                dataIndex: 'TotalAccount',
                key: 'TotalAccount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '课时数量',
                dataIndex: 'CourseHour',
                key: 'CourseHour',
                render: (text, record) => <a onClick={() => { this.showNewPage(record.Id, record.LecturerName) } } className="color-blue">{text}</a>,
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
                        <a href="javascript:;" onClick={(event) => { this.openWithDrawModal(record.Id) } }>提现</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={(event) => { this.openRewardModal(record.Id, false) } }>提现记录</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={(event) => { this.openRewardModal(record.Id, true) } }>打赏记录</a>
                        <span className="ant-divider"></span>
                        <a href="javascript:;" onClick={(event) => { this.openEditForm(record.Id) } }>修改</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={(event) => { this.deleteLecturer(record.Id) } }>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
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
            total: self.state.LecturerTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initLecturerList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initLecturerList();
            },
            showTotal() {
                return `共 ${self.state.LecturerTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">讲师管理</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={this.openInsertForm}>添加新讲师</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="搜索" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.initLecturerList} />
                            <span className="input-group-addon  search-btn" onClick={this.initLecturerList}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Table
                            rowKey={record => record.Id}
                            columns={LecturerColumns}
                            dataSource={this.state.LecturerListData}
                            pagination={pagination}
                            loading={this.state.loadingLecturer}
                            rowSelection={rowSelection}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    this.setState({
                                        selectLecturerIndex: index,
                                        selectLecturerId: record.Id
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectLecturerIndex ? " ant-table-row-active " : "";
                                }
                            }
                            />
                    </div>
                </div>

                <Modal title={this.state.isInsert ? "添加讲师" : "修改讲师"} visible={this.state.visibleForm} onCancel={this.closeForm} footer={[]} maskClosable={false}>
                    <FormTemplate formElements={this.state.modalPara} defaultValues={this.state.defaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onCancel={this.closeForm} onSubmit={this.submitForm}></FormTemplate>
                </Modal>

                {
                    this.state.showRewardModal ?
                        <Modal title="记录列表" width={600} visible={true} onCancel={this.closeRewardModal} footer={<Button onClick={this.closeRewardModal}>关闭</Button>} maskClosable={false}>
                            <RewardRecord LectureId={this.state.LectureId} IsReward={this.state.IsReward} />
                        </Modal>
                        : null

                }
                {
                    this.state.showWithDrawModal ?
                        <Modal title="提现" width={600} visible={true} onCancel={this.closeWithDrawModal} footer={null} maskClosable={false}>
                            <WithDraw LectureId={this.state.LectureId} onClose={this.closeWithDrawModal} />
                        </Modal>
                        : null

                }

            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let LecturerIndexPage = Form.create({})(LecturerIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(LecturerIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
