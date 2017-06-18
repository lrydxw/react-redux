import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button, Radio, Tabs, Popconfirm } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import MissionApi from './Api';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class MissionConfigIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.initMissionInfoList = this.initMissionInfoList.bind(this);
        this.switchMissionEnable = this.switchMissionEnable.bind(this);
        this.submitMissionInfoForm = this.submitMissionInfoForm.bind(this);
        this.closeMissionInfoForm = this.closeMissionInfoForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.loadMissionInfoFromDb = this.loadMissionInfoFromDb.bind(this);

        let formMissionConfigSetElements: FormElement[] = [
            { key: "MissionTitle", element: ElementEnum.Input, type: "string", label: "任务标题", message: "请输入任务标题", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "RewardValue", element: ElementEnum.Input, type: "string", label: "奖励值", message: "请输入奖励值", rules: { required: true, whitespace: true, validator: RegExpVerify.checkNumber }, dataList: [] },
            { key: "Description", element: ElementEnum.Textarea, type: "string", label: "任务描述", message: "请输入任务描述", rules: { required: false, whitespace: true }, dataList: [] },
            { key: "IsEnable", element: ElementEnum.Radio, type: "text", label: "是否启用", message: "请选择", rules: { required: true, whitespace: true }, dataList: [{ "value": "true", "label": "是" }, { "value": "false", "label": "否" },] },
        ];

        this.state = {
            isInsert: false,
            MissionId: LocalStorage.get('MissionId'),
            visibleForm: false,//是否显示编辑或添加弹窗
            MissionInfoListData: [],//列表数据
            loadingMissionInfo: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            missionConfigSetDefaultValues: {},
            missionConfigSetData: formMissionConfigSetElements,
            editId: -1,
            editNextId: -1,

        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initMissionInfoList();


    }
    //更新DOM之前被执行
    componentWillUpdate() {

    }
    //更新DOM之后被执行
    componentDidUpdate() {
        var _this = this;
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleForm === true) {

            _this.loadMissionInfoFromDb(_this.state.editId);
            _this.state.editNextId = _this.state.editId;
        }
    }
    //移除DOM之前被执行
    componentWillUnmount() {

    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextState) {

    }


    /**
    * 获取列表数据
    */
    initMissionInfoList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        _this.state.loadingMissionInfo = true;

        MissionApi.getMissionInfoList(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.MissionInfoListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingMissionInfo: false, selectedRowKeys: [] });

        });
    }

    loadMissionInfoFromDb(id) {
        var _this = this
        MissionApi.getMissionInfo({ Id: id }).then(function (data) {
            if (data.IsOK) {
                debugger;
                data.Value.RewardValue = String(data.Value.RewardValue);
                data.Value.IsEnable = String(data.Value.IsEnable);
                
                _this.setState({ missionConfigSetDefaultValues: data.Value, editId: id, });
            } else {
                message.error(data.Message);
            }
        });
    }

    switchMissionEnable(id, isEnable) {
        var _this = this;
        MissionApi.switchMissionEnable({ Id: id, IsEnable: isEnable }).then(function (data) {
            if (data.IsOK) {

                _this.initMissionInfoList();
            }
            else {
                message.error(data.Message);
            }


        });
    }

    closeMissionInfoForm() {
        this.setState({ visibleForm: false });
    }

    openEditForm(record) {

        this.setState({ isInsert: false, visibleForm: true, editNextId: -1, editId: record.Id });
    }

    submitMissionInfoForm(obj) {
        var _this = this;
        obj.Id = _this.state.editId;
        MissionApi.updateMissionInfo(obj).then(function (data) {
            if (data.IsOK) {
                _this.state.visibleForm = false;
                _this.initMissionInfoList();
            } else {
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


        const PartnerColumns = [
            {
                title: '任务标题',
                dataIndex: 'MissionTitle',
                key: 'MissionTitle',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '任务类型',
                dataIndex: 'MissionType',
                key: 'MissionType',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '任务频次类型',
                dataIndex: 'FrequencyType',
                key: 'FrequencyType',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '任务奖励类型',
                dataIndex: 'RewardType',
                key: 'RewardType',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '任务奖励值',
                dataIndex: 'RewardValue',
                key: 'RewardValue',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '是否启用',
                dataIndex: 'IsEnable',
                key: 'IsEnable',
                render: (text, record) => {
                    if (record.IsEnable)
                        return (<span className="color-green">已启用</span>)
                    else
                        return (<span className="color-red">已禁用</span>)

                },
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
                render: (text, record) => {

                    if (record.IsEnable) {
                        return (
                            <span>
                                <a href="javascript:;" onClick={() => { this.openEditForm(record) } }>编辑</a>
                                <span className="ant-divider"></span>
                                <Popconfirm title="确定要禁用该任务吗？" onConfirm={() => { this.switchMissionEnable(record.Id,false) } }>
                                    <a >禁用</a>
                                </Popconfirm>
                            </span>)

                    }
                    else {
                        return (
                            <span>
                                <a href="javascript:;" onClick={() => { this.openEditForm(record) } }>编辑</a>
                                <span className="ant-divider"></span>
                                <Popconfirm title="确定要启用该任务吗？" onConfirm={() => { this.switchMissionEnable(record.Id, true) } }>
                                    <a >启用</a>
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
                self.initMissionInfoList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initMissionInfoList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>

                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">任务配置</a>
                    <a className="main-content-word pull-left" href="/Manager/MemberSetInfo/MemberRebateSetIndex">会员分销</a>
                </div>

                <div className="row margin-top20 margin-btm20">

                </div>

                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={PartnerColumns}
                            dataSource={this.state.MissionInfoListData}
                            pagination={pagination}
                            loading={this.state.loadingMissionInfo}
                            rowKey={record => record.Id}

                            />
                    </div>
                </div>
                <Modal title={"编辑任务配置"} visible={this.state.visibleForm} maskClosable={false} onCancel={this.closeMissionInfoForm} footer={[]} >
                    <FormTemplate formElements={this.state.missionConfigSetData} defaultValues={this.state.missionConfigSetDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitMissionInfoForm} onCancel={this.closeMissionInfoForm}></FormTemplate>
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

let MissionConfigIndexPage = Form.create({})(MissionConfigIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(MissionConfigIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
