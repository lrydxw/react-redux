import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Button } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';
//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import AgencyManageApi from './AgencyManageApi';
import MemberSetInfoApi from '../manager/MemberSetInfo/Api';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class MemberLevelSetIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initMemberLevelList = this.initMemberLevelList.bind(this);
        this.loadMemberLevelFromDb = this.loadMemberLevelFromDb.bind(this);
        this.loadMemberRightsData = this.loadMemberRightsData.bind(this);
        this.submitMemberLevelForm = this.submitMemberLevelForm.bind(this);
        this.closeMemberLevelForm = this.closeMemberLevelForm.bind(this);
        this.openMemberLevelForm = this.openMemberLevelForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);

        let formMemberLevelElements: FormElement[] = [
            { key: "Name", element: ElementEnum.Input, type: "text", label: "级别名称", message: "请输入级别名称", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "Experience", element: ElementEnum.Input, type: "string", label: "所需经验", message: "请输入所需经验", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveInteger }, dataList: [] },
           
        ];
        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            MemberLevelListData: [],//列表数据
            loadingMemberLevel: false,//正在加载列表
            selectCourseIndex: -1,//选择列表序号
            selectCourseId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            memberLevelDefaultValues: {},
            memberLevelData: formMemberLevelElements,
            editId: -1,
            editNextId: -1
        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initMemberLevelList();
        this.loadMemberRightsData();
    }
    //更新DOM之前被执行
    componentWillUpdate() {

    }
    //更新DOM之后被执行
    componentDidUpdate() {
        var _this = this;
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleForm === true) {

            _this.loadMemberLevelFromDb(_this.state.editId);
            _this.state.editNextId = _this.state.editId;
        }
    }
    //移除DOM之前被执行
    componentWillUnmount() {

    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextState) {

    }

    initMemberLevelList() {
        var _this = this;
        var obj = obj || {};
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;

        _this.state.loadingMemberLevel = true;

        AgencyManageApi.getMemberLevelPageList(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.MemberLevelListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingMemberLevel: false, selectedRowKeys: [] });

        });
    }

    loadMemberLevelFromDb(id) {
        var _this = this
        AgencyManageApi.getMemberLevelData({ Id: id }).then(function (data) {
            if (data.IsOK) {
                data.Value.Experience = String(data.Value.Experience);
                _this.setState({ memberLevelDefaultValues: data.Value, editId: id, });
            } else {
                message.error(data.Message);
            }
        });
    }

    loadMemberRightsData() {
        var _this = this;
        MemberSetInfoApi.getMemberRightsSelectData({}).then(function (data) {
            if (data.IsOK) {
                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].RightsName, value: String(data.Value[i].Id) });
                }

                _this.state.memberLevelData[2].dataList = arrayData;
                //_this.setState({ memberRightsSelectData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    submitMemberLevelForm(obj) {
        var _this = this;

        if (_this.state.isInsert) {
            AgencyManageApi.insertMemberLevel(obj).then(function (data) {
                if (data.IsOK) {
                    _this.state.visibleForm = false;
                    _this.initMemberLevelList();
                } else {
                    message.error(data.Message);
                }
            });
        }
        else {
            obj.Id = _this.state.editId;
            AgencyManageApi.updateMemberLevel(obj).then(function (data) {
                if (data.IsOK) {
                    _this.state.visibleForm = false;
                    _this.initMemberLevelList();
                } else {
                    message.error(data.Message);
                }
            });
        }
    }


    //关闭添加编辑窗口
    closeMemberLevelForm() {
        this.setState({ visibleForm: false });
    }


    //打开添加编辑窗口
    openMemberLevelForm() {
        this.setState({ visibleForm: true, isInsert: true, memberLevelDefaultValues: {} });

    }

    openEditForm(record) {

        this.setState({ isInsert: false, visibleForm: true, editNextId: -1, editId: record.Id });
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

      

        const MemberLevelColumns = [
            {
                title: '级别顺序',
                dataIndex: 'Level',
                key: 'Level',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '级别名称',
                dataIndex: 'Name',
                key: 'Name',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '经验值',
                dataIndex: 'Experience',
                key: 'Experience',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '用户数量',
                dataIndex: 'MemberCount',
                key: 'MemberCount',
                render: (text) => <span> {text}</span>,
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
                        <a onClick={() => { this.openEditForm(record) } }>查看编辑</a>

                    </span>
                ),
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
                self.initMemberLevelList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initMemberLevelList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/User/AgencyManageIndex">所有用户</a>
                    <a className="main-content-word pull-left set-content-word-te" href="/User/MemberLevelSetIndex">用户设置</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" onClick={this.openMemberLevelForm}>新建用户级别</Button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={MemberLevelColumns}
                            dataSource={this.state.MemberLevelListData}
                            pagination={pagination }
                            loading={this.state.loadingMemberLevel}
                            rowKey={record => record.Id}

                            />
                    </div>
                </div>


                <Modal title={this.state.isInsert ? "添加用户级别" : "编辑用户级别"} visible={this.state.visibleForm} onCancel={this.closeMemberLevelForm} footer={[]} >
                    <FormTemplate formElements={this.state.memberLevelData} defaultValues={this.state.memberLevelDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitMemberLevelForm}  onCancel={this.closeMemberLevelForm}></FormTemplate>
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

let MemberLevelSetIndexPage = Form.create({})(MemberLevelSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(MemberLevelSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
