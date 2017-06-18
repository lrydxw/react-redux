import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import AgencyManageApi from './AgencyManageApi';
import PartnerApi from '../Partner/Api';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class AgencyManageIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.initAgencyList = this.initAgencyList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.loadSelectMemberLevelData = this.loadSelectMemberLevelData.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.closePartnerSetForm = this.closePartnerSetForm.bind(this);
        this.loadPartnerSetFromDb = this.loadPartnerSetFromDb.bind(this);
        this.loadPartnerTypeData = this.loadPartnerTypeData.bind(this);
        this.submitPartnerTypeSetForm = this.submitPartnerTypeSetForm.bind(this);
        this.exportAnencyList = this.exportAnencyList.bind(this);

        let formPartnerTypeSetElements: FormElement[] = [
            { key: "PartnerTypeId", element: ElementEnum.Select, type: "string", label: "设置等级", message: "请选择合作伙伴等级", rules: { required: true, whitespace: true }, dataList: [] },

        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            AgencyListData: [],//列表数据
            loadingAnency: false,//正在加载列表
            selectCourseIndex: -1,//选择列表序号
            selectCourseId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            selectMemberLevelData: [],
            partnerTypeDefaultValues: {},
            partnerTypeData: formPartnerTypeSetElements,
            editId: -1,
            editNextId: -1,


        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initAgencyList();
        this.loadSelectMemberLevelData();
        this.loadPartnerTypeData();
    }
    //更新DOM之前被执行
    componentWillUpdate() {

    }
    //更新DOM之后被执行
    componentDidUpdate() {
        var _this = this;
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleForm === true) {

            _this.loadPartnerSetFromDb(_this.state.editId);
            _this.state.editNextId = _this.state.editId;
        }

    }
    //移除DOM之前被执行
    componentWillUnmount() {

    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextState) {

    }

    goToAnencyDetail(id) {
        Tool.goPush('User/AgencyDetailIndex');
        LocalStorage.add('MemberId', id);
    }

    /**
    * 获取列表数据
    */
    initAgencyList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.StartTime = Tool.GMTToDate(obj.StartTime);
        obj.EndTime = Tool.GMTToDate(obj.EndTime);
        if (obj.StartTime && obj.EndTime) {
            if (Tool.compareDateTime(obj.StartTime, obj.EndTime)) {
                Modal.error({
                    title: '温馨提示',
                    content: '开始时间不能大于结束时间',
                });
                return;
            }
        }
        _this.setState({ loadingAnency: true });
        AgencyManageApi.getAnencyPageList(obj).then(function (data) {
            if (data.IsOK) {
                var agencyData = [];
                if (Array.isArray(data.Value)) {
                    agencyData = data.Value;
                }
                _this.state.AgencyListData = agencyData;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingAnency: false, selectedRowKeys: [] });

        });
    }


    loadPartnerSetFromDb(id) {
        var _this = this
        PartnerApi.getPartner({ AgencyId: id }).then(function (data) {
            if (data.IsOK) {
                data.Value.PartnerTypeId = String(data.Value.PartnerTypeId);
                _this.setState({ partnerTypeDefaultValues: data.Value, editId: id, });
            } else {
                message.error(data.Message);
            }
        });
    }

    loadPartnerTypeData() {
        var _this = this;
        PartnerApi.getPartnerTypeSelectData({}).then(function (data) {
            if (data.IsOK) {

                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].TypeName, value: String(data.Value[i].Id) });
                }

                _this.state.partnerTypeData[0].dataList = arrayData;


            } else {
                message.error(data.Message);
            }
        });
    }

    submitPartnerTypeSetForm(obj) {
        var _this = this;
        obj.AgencyId = _this.state.editId;
        PartnerApi.setPartner(obj).then(function (data) {
            if (data.IsOK) {
                _this.state.visibleForm = false;
                _this.initAgencyList();
            } else {
                message.error(data.Message);
            }
        });

    }

    openEditForm(record) {

        this.setState({ isInsert: false, visibleForm: true, editNextId: -1, editId: record.Id, partnerTypeDefaultValues: {} });
    }

    //关闭添加编辑窗口
    closePartnerSetForm() {
        this.setState({ visibleForm: false });
    }

    handleSearch() {
        var _this = this;
        _this.state.PageIndex = 1;
        _this.initAgencyList();
    }

    loadSelectMemberLevelData() {
        var _this = this;

        AgencyManageApi.getMemberLevelSelectData({}).then(function (data) {
            if (data.IsOK) {

                _this.setState({ selectMemberLevelData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    exportAnencyList() {
        var _this = this;

        var form = this.props.form;
        var obj = form.getFieldsValue();

        Tool.ExportCSVFile("/User/ExportAnencyList", obj);
    }


    //设置合作伙伴
    openUpParnter(id) {
        LocalStorage.add('MemberId', id);
        Tool.goPush('Partner/PartnerOpenUpIndex');

    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const memberLevelProps = getFieldProps('MemberLevel', {

        });

        const nickNameProps = getFieldProps('NickName', {

        });

        const mobileProps = getFieldProps('Mobile', {
            validate: [{
                rules: [
                    { validator: RegExpVerify.checkMobile },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const availableIncomeProps = getFieldProps('MinAvailableIncome', {
            validate: [{
                rules: [
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const startTimeProps = getFieldProps('StartTime', {

        });

        const endTimeProps = getFieldProps('EndTime', {

        });

        var memberLevelSelectOption = this.state.selectMemberLevelData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={String(item.Level)}> {item.Name}</Option >
            );
        });

        const AnencyColumns = [
            {
                title: '微信昵称（真实姓名）',
                dataIndex: 'NickName',
                key: 'NickName',
                render: (text, record) => {
                    if (!record.HeadImgURL && !record.NickName && !record.RealName)
                        return (<span>
                            <img className="pull-left margin-right10" src="/Content/images/noheader.png" alt="头像" width="52" height="52" />
                            <div className="pull-left margin-top15" >
                                <span>新用户</span>
                            </div>
                        </span>)
                    else
                        return (
                            <span>
                                <img className="pull-left margin-right10" src={record.HeadImgURL} alt="头像" width="52" height="52" />
                                <div className="pull-left margin-top15" >
                                    {record.RealName ? <span>{record.NickName}({record.RealName})</span> : <span>{record.NickName}</span>} 
                                </div>
                            </span>)
                },
            },
            {
                title: '级别',
                dataIndex: 'MemberLevelName',
                key: 'MemberLevelName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '手机号',
                dataIndex: 'Mobile',
                key: 'Mobile',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '是否是代理',
                dataIndex: 'IsAgent',
                key: 'IsAgent',
                render: (text, record) => (<span> {record.IsAgent ? "是" : "否"}</span>),
            },
            {
                title: '上级代理',
                dataIndex: 'SuperiorAnency',
                key: 'SuperiorAnency',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '收益',
                dataIndex: 'AvailableIncome',
                key: 'AvailableIncome',
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
                        <a onClick={() => { this.openUpParnter(record.Id) } }> {record.IsPartners ? "编辑合作伙伴" : "设为合作伙伴"}</a>
                        <span className="ant-divider"></span>
                        <a onClick={() => { this.goToAnencyDetail(record.Id) } }>查看详情</a>
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
                self.initAgencyList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initAgencyList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te" href="/User/AgencyManageIndex">所有用户</a>
                    <a className="main-content-word pull-left" href="/User/MemberLevelSetIndex">用户设置</a>
                </div>
                <Form>
                    <div className="row  margin-top20 margin-btm20">
                        <div className="col-lg-6 col-sm-12">
                            <ul className="row">
                                <li className="col-xs-3">
                                    <FormItem key="MeberLevel">
                                        <Select allowClear={true} placeholder="请选择用户等级" {...memberLevelProps}>
                                            {memberLevelSelectOption}
                                        </Select>
                                    </FormItem>
                                </li>
                                <li className="col-xs-3">
                                    <FormItem key="NickName">
                                        <Input {...nickNameProps} className="cp1 form-control" placeholder="请输入昵称" />
                                    </FormItem>
                                </li>
                                <li className="col-xs-3">
                                    <FormItem key="Mobile">
                                        <Input {...mobileProps} className="cp1 form-control" placeholder="请输入手机号" />
                                    </FormItem>
                                </li>
                                <li className="col-xs-3">
                                    <FormItem key="AvailableIncome">
                                        <Input {...availableIncomeProps} className="cp1 form-control" placeholder="请输入最小预计积分" />
                                    </FormItem>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-sm-12">
                            <ul className="row">
                                <li className="col-xs-6">
                                    <div className="input-group">
                                        <FormItem key="StartTime">
                                            <DatePicker showTime={true} format="yyyy-MM-dd HH:mm" {...startTimeProps} placeholder="开始时间" />
                                        </FormItem>


                                    </div>
                                </li>
                                <li className="col-xs-6">
                                    <div className="input-group">
                                        <FormItem key="EndTime">
                                            <DatePicker showTime={true} format="yyyy-MM-dd HH:mm" {...endTimeProps} placeholder="结束时间" />
                                        </FormItem>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-sm-12">
                            <div className="row">
                                <div className="col-xs-4">
                                    <Button type="primary" size="large" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                                </div>
                                <div className="col-xs-8 ">
                                    <Button type="ghost" icon="download" size="large" onClick={this.exportAnencyList}> 导出用户数据</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={AnencyColumns}
                            dataSource={this.state.AgencyListData}
                            pagination={pagination}
                            loading={this.state.loadingAnency}
                            rowKey={record => record.Id}

                            />
                    </div>
                </div>

                <Modal title="开通合作伙伴" visible={this.state.visibleForm} onCancel={this.closePartnerSetForm} footer={[]} >
                    <FormTemplate formElements={this.state.partnerTypeData} defaultValues={this.state.partnerTypeDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitPartnerTypeSetForm} onCancel={this.closePartnerSetForm}></FormTemplate>
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

let AgencyManageIndexPage = Form.create({})(AgencyManageIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(AgencyManageIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
