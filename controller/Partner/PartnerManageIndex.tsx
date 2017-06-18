import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button, Radio, Tabs } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import PartnerApi from './Api';
import AgencyManageApi from '../User/AgencyManageApi';
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
class PartnerManageIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.initPartnerList = this.initPartnerList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.loadSelectMemberLevelData = this.loadSelectMemberLevelData.bind(this);
        this.loadSelectPartnerTypeData = this.loadSelectPartnerTypeData.bind(this);
        this.partnerStatusChange = this.partnerStatusChange.bind(this);
        this.exportPartnerList = this.exportPartnerList.bind(this);


        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            PartnerListData: [],//列表数据
            loadingPartner: false,//正在加载列表
            selectCourseIndex: -1,//选择列表序号
            selectCourseId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            selectMemberLevelData: [],
            selectPartnerTypeData: [],
            PartnerStatus: "0"

        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initPartnerList();
        this.loadSelectMemberLevelData();
        this.loadSelectPartnerTypeData();

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

    goToAnencyDetail(id) {
        Tool.goPush('User/AgencyDetailIndex');
        LocalStorage.add('MemberId', id);
    }

    /**
    * 获取列表数据
    */
    initPartnerList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.PartnerStatus = _this.state.PartnerStatus;
        _this.setState({ loadingPartner: true });

        PartnerApi.getPartnerPageListData(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.PartnerListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingPartner: false, selectedRowKeys: [] });

        });
    }


    partnerStatusChange(e) {
        var _this = this;
        _this.state.PartnerStatus = e.target.value;
        _this.initPartnerList();
    }


    handleSearch() {
        var _this = this;
        _this.state.PageIndex = 1;
        _this.state.PartnerStatus = "0";
        _this.initPartnerList();
    }



    loadSelectPartnerTypeData() {
        var _this = this;
        const { setFieldsValue } = this.props.form;
        PartnerApi.getPartnerTypeSelectData({ IsDefault:true}).then(function (data) {
            if (data.IsOK) {
                _this.state.selectPartnerTypeData = data.Value;
                setFieldsValue({"PartnerTypeId":""});

            } else {
                message.error(data.Message);
            }
        });
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


    exportPartnerList() {
        var _this = this;

        var form = this.props.form;
        var obj = form.getFieldsValue();

        Tool.ExportCSVFile("/Partner/ExportPartnerListData", obj);
    }

    //设置合作伙伴
    editParnter(id) {
        LocalStorage.add('MemberId', id);
        Tool.goPush('Partner/PartnerOpenUpIndex');

    }

    goToPartnerRights(id) {
        LocalStorage.add('PartnerId', id);
        Tool.goPush('Partner/PartnerRightsListIndex');
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const partnerTypeIdProps = getFieldProps('PartnerTypeId', {

        });

        const nickNameProps = getFieldProps('NickName', {

        });

        const mobileProps = getFieldProps('Mobile', {
            validate: [{
                rules: [
                    { validator: RegExpVerify.checkMobile },
                ], trigger: ['onBlur'],
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

        var partnerTypeSelectOption = this.state.selectPartnerTypeData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={String(item.Id)}> {item.TypeName}</Option >
            );
        });


        const AnencyColumns = [
            {
                title: '真实姓名（微信昵称）',
                dataIndex: 'NickName',
                key: 'NickName',
                render: (text, record) => {
                    if (!record.HeadImgURL && !record.NickName && !record.RealName)
                        return (<span>
                            <img className="pull-left margin-right10" src="/Content/images/noheader.png" alt="头像" width="52" height="52" />
                            <div className="pull-left margin-top15" >
                                <span>未知用户</span>
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
                dataIndex: 'PartnerLevelName',
                key: 'PartnerLevelName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '手机号',
                dataIndex: 'Mobile',
                key: 'Mobile',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '可提现收益',
                dataIndex: 'AvailableIncome',
                key: 'AvailableIncome',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '用户状态',
                dataIndex: 'PartnerStatus',
                key: 'PartnerStatus',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '开通时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a onClick={() => { this.editParnter(record.MemberId) } }>编辑状态</a>
                        <span className="ant-divider"></span>
                        <a onClick={() => { this.goToPartnerRights(record.Id) } }>查看权益</a>
                        <span className="ant-divider"></span>
                        <a onClick={() => { this.goToAnencyDetail(record.MemberId) } }>查看详情</a>
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
                self.initPartnerList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initPartnerList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">合作伙伴</a>
                    <a className="main-content-word pull-left" href="/Partner/PartnerSetIndex">合作伙伴设置</a>
                </div>
                <Form>

                    <div className="row  margin-top20 margin-btm20">
                        <div className="col-lg-8 col-sm-12">
                            <ul className="row">
                                <li className="col-xs-3">
                                    <FormItem key="MeberLevel">
                                        <Select allowClear={true} placeholder="请选择合作伙伴等级" {...partnerTypeIdProps}>
                                            {partnerTypeSelectOption}
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
                            <div className="row">
                                <div className="col-xs-4">
                                    <Button type="primary" size="large" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                                </div>
                                <div className="col-xs-8 ">
                                    <Button type="ghost" icon="download" size="large" onClick={this.exportPartnerList}> 导出客户数据</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row  margin-top20 margin-btm20">
                        <div className="col-xs-10 add-block clearfix">
                            <RadioGroup value={this.state.PartnerStatus} onChange={this.partnerStatusChange}>
                                <RadioButton value="0">全部</RadioButton>
                                <RadioButton value="1">正常</RadioButton>
                                <RadioButton value="2">锁定</RadioButton>
                                <RadioButton value="3">禁用</RadioButton>
                            </RadioGroup>

                        </div>

                    </div>

                </Form>
                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={AnencyColumns}
                            dataSource={this.state.PartnerListData}
                            pagination={pagination}
                            loading={this.state.loadingPartner}
                            rowKey={record => record.Id}

                            />
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

let PartnerManageIndexPage = Form.create({})(PartnerManageIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(PartnerManageIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
