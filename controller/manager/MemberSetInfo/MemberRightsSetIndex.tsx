import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button, Popconfirm } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import MemberSetInfoApi from './Api';
import CourseApi from '../../Course/CourseApi';
import ProductApi from '../../Product/ProductApi';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import RegExpVerify from '../../../pub/RegExpVerify';
const store = BaseStore({});
const Option = Select.Option;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class MemberRightsSetIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initMemberRightsList = this.initMemberRightsList.bind(this);
        this.openInsertForm = this.openInsertForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.loadSelectCourseData = this.loadSelectCourseData.bind(this);
        this.loadSelectProductData = this.loadSelectProductData.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.changeRightType = this.changeRightType.bind(this);
        this.searchMemberRights = this.searchMemberRights.bind(this);
        this.setSearchKeywords = this.setSearchKeywords.bind(this);
        this.deleteMemberRights = this.deleteMemberRights.bind(this);
        this.loadSelectDonationData = this.loadSelectDonationData.bind(this);
        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            MemberRightsListData: [],//列表数据
            loadingMemberRights: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            selectCourseData: [],
            selectProductData: [],
            selectDonationData: [],
            selectedMemberRightsId: "",
            searchKeywords: "",
            currentRightsType: 0
        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initMemberRightsList();
        this.loadSelectCourseData();
        this.loadSelectProductData();
        this.loadSelectDonationData();
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


    closeForm() {
        this.setState({ visibleForm: false });
    }

    changeRightType(value) {
        alert(value);
        var _this = this;
        _this.setState({ currentRightsType: value });
    }

    setSearchKeywords(e) {
        this.state.searchKeywords = e.target.value;
    }

    openInsertForm() {
        this.props.form.resetFields();
        this.setState({ isInsert: true, visibleForm: true });
    }

    openEditForm(id) {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        MemberSetInfoApi.getMemberRightsInfo({ Id: id }).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var setObj = {
                    "MemberRightsType": String(obj.MemberRightsType), "RightsName": obj.RightsName
                };
                if (obj.MemberRightsType == "1") {
                    setObj["CourseValue"] = obj.MemberRightsValue;
                }
                else if (obj.MemberRightsType == "2") {
                    setObj["ProductValue"] = obj.MemberRightsValue;
                }
                else if (obj.MemberRightsType == "3") {
                    setObj["DiscountValue"] = obj.MemberRightsValue;
                }
                else if (obj.MemberRightsType == "4") {
                    setObj["SaleRightsValue"] = obj.MemberRightsValue;
                }
                else if (obj.MemberRightsType == "5") {
                    setObj["SaleLevelValue"] = obj.MemberRightsValue;
                }
                else if (obj.MemberRightsType == "6") {
                    setObj["OtherValue"] = obj.MemberRightsValue;
                }
                _this.state.isInsert = false;
                _this.state.visibleForm = true;
                _this.state.selectedMemberRightsId = id;
                setFieldsValue(setObj);
            }


        });
    }

    deleteMemberRights(id) {
        var _this = this;
        MemberSetInfoApi.deleteMemberRights({ Id: id }).then(function (data) {
            if (data.IsOK) {
                _this.initMemberRightsList();

            } else {
                message.error(data.Message);
            }

        });

    }

    initMemberRightsList() {
        var _this = this;
        var obj = obj || {};
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;

        obj.RightsName = _this.state.searchKeywords;
        _this.state.visibleForm = false;
        _this.state.loadingMemberRights = true;


        MemberSetInfoApi.getMemberRightsPageList(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.MemberRightsListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingMemberRights: false, selectedRowKeys: [] });

        });
    }

    searchMemberRights() {
        this.state.PageIndex = 1;
        this.initMemberRightsList();
    }

    loadSelectCourseData() {
        var _this = this;

        CourseApi.getCourseInfoList({}).then(function (data) {
            if (data.IsOK) {

                _this.setState({ selectCourseData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    loadSelectDonationData() {
        var _this = this;

        ProductApi.getDonationList({}).then(function (data) {
            if (data.IsOK) {

                _this.setState({ selectDonationData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    loadSelectProductData() {
        var _this = this;

        ProductApi.getSelectProductDataList({ ProductType: 1 }).then(function (data) {
            if (data.IsOK) {

                _this.setState({ selectProductData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    checkDiscount(rule, value, callback) {
        if (value && (!(/^\d+(\.\d+)?$/).test(value.toString().trim()))) {
            callback('输入的数字格式有误');
        }
        else {
            if (value && (value < 0 || value > 10)) {
                callback('请输入0-10的数字');
            }
            else {
                callback();
            }
        }
    }

    submitForm(e) {
        e.preventDefault();
        var form = this.props.form;
        var _this = this;

        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.MemberRightsValue = "";
            if (obj.MemberRightsType == "1") {
                obj.MemberRightsValue = obj.CourseValue;
            }
            else if (obj.MemberRightsType == "2") {
                obj.MemberRightsValue = obj.ProductValue;
            }
            else if (obj.MemberRightsType == "3") {
                obj.MemberRightsValue = obj.DiscountValue;
            }
            else if (obj.MemberRightsType == "4") {
                obj.MemberRightsValue = obj.SaleRightsValue;
            }
            else if (obj.MemberRightsType == "5") {
                obj.MemberRightsValue = obj.SaleLevelValue;
            }
            else if (obj.MemberRightsType == "6") {
                obj.MemberRightsValue = obj.OtherValue;
            }
            console.log('收到表单值：', obj);
            if (_this.state.isInsert) {
                MemberSetInfoApi.insertMemberRights(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initMemberRightsList();
                    } else {
                        message.error(data.Message);
                    }
                });
            } else {

                obj.Id = _this.state.selectedMemberRightsId;
                MemberSetInfoApi.updateMemberRights(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initMemberRightsList();
                    } else {
                        message.error(data.Message);
                    }
                });
            }
        });
    }


    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };


        const memberRightsTypeProps = getFieldProps('MemberRightsType', {
            validate: [{
                rules: [
                    { required: true, message: '请选择类型' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const rightsNameProps = getFieldProps('RightsName', {
            validate: [{
                rules: [
                    { required: true, message: '请输入用户权益' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const courseValueProps = getFieldProps('CourseValue', {
            validate: [{
                rules: [
                    { required: getFieldValue("MemberRightsType") == "1" ? true : false, message: '请选择课程' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const productValueProps = getFieldProps('ProductValue', {
            validate: [{
                rules: [
                    { required: getFieldValue("MemberRightsType") == "2" ? true : false, message: '请选择商品' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const discountValueProps = getFieldProps('DiscountValue', {
            validate: [{
                rules: [
                    { required: getFieldValue("MemberRightsType") == "3" ? true : false, message: '请输入折扣' },
                    { validator: this.checkDiscount },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const otherValueProps = getFieldProps('OtherValue', {
            validate: [{
                rules: [
                    { required: getFieldValue("MemberRightsType") == "6" ? true : false, message: '请输入权益说明' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const saleRightsValueProps = getFieldProps('SaleRightsValue', {
            validate: [{
                rules: [
                    { required: getFieldValue("MemberRightsType") == "4" ? true : false, message: '请选择分销权' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const saleLevelValueProps = getFieldProps('SaleLevelValue', {
            validate: [{
                rules: [
                    { required: getFieldValue("MemberRightsType") == "5" ? true : false, message: '请选择分销层级' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const MemberRightsColumns = [
            {
                title: '权益名称',
                dataIndex: 'RightsName',
                key: 'RightsName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '享受权益',
                dataIndex: 'RightDescription',
                key: 'RightDescription',
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
                        <a onClick={(event) => { this.openEditForm(record.Id) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={(event) => { this.deleteMemberRights(record.Id) } }>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>


                    </span>
                ),
            }
        ];

        var courseSelectOption = this.state.selectCourseData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={item.Id}>{item.ProductName}</Option>
            );
        });

        var productSelectOption = this.state.selectProductData.map(function (item) {
            return (
                <Option key={'li_' + item.Id} value={item.Id}>{item.ProductName}</Option>
            );
        });

        var donationSelectOption = this.state.selectDonationData.map(function (item) {
            return (
                <Option key={'li_' + item.GoodsId} value={item.GoodsId}>{item.GoodsName}</Option>
            );
        });

        var self = this;
        const pagination = {
            total: self.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initMemberRightsList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initMemberRightsList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/User/AgencyManageIndex">所有用户</a>
                    <a className="main-content-word pull-left" href="/User/MemberLevelSetIndex">用户设置</a>
                    <a className="main-content-word pull-left set-content-word-te" href="/Manager/MemberSetInfo/MemberRightsSetIndex">用户权益</a>
                </div>

                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" onClick={this.openInsertForm}>添加新权益</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" onChange={this.setSearchKeywords} style={{ height: 34 }} onPressEnter={this.searchMemberRights} />
                            <span className="input-group-addon  search-btn">
                                <i className="fa fa-search" onClick={this.searchMemberRights}></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Table
                            columns={MemberRightsColumns}
                            dataSource={this.state.MemberRightsListData}
                            pagination={pagination}
                            loading={this.state.loadingMemberRights}
                            rowKey={record => record.Id}
                            />
                    </div>
                </div>


                <Modal
                    title={this.state.isInsert ? "添加用户权益" : "修改用户权益"} visible={this.state.visibleForm} onCancel={this.closeForm}
                    footer={[
                        <a></a>,
                    ]}
                    >
                    <Form horizontal>
                        <div className="modal-content">

                            <div className="modal-body clearfix">
                                <div className="form-horizontal tasi-form padding20">
                                    <div className="form-group">
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>名称：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="RightsName"
                                                    hasFeedback
                                                    >
                                                    <Input {...rightsNameProps} className="cp1 form-control" placeholder="权益名称" />
                                                </FormItem>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>类型：</label>
                                            <div className="col-xs-7">

                                                <FormItem key="MemberRightsType"
                                                    hasFeedback
                                                    >
                                                    <Select placeholder="请选择类型"  {...memberRightsTypeProps}>
                                                        <Option value="1">课程</Option>
                                                        <Option value="2">商品</Option>
                                                        <Option value="3">折扣</Option>
                                                        <Option value="4">分销权</Option>
                                                        <Option value="5">分销层级</Option>
                                                        <Option value="6">自定义</Option>
                                                    </Select>
                                                </FormItem>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ display: getFieldValue("MemberRightsType") == "1" ? "" : "none" }}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>选择课程：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="Course"
                                                    hasFeedback
                                                    >
                                                    <Select placeholder="请选择课程" {...courseValueProps}>
                                                        {courseSelectOption}
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ display: getFieldValue("MemberRightsType") == "2" ? "" : "none" }}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>选择商品：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="Product"
                                                    hasFeedback
                                                    >
                                                    <Select placeholder="请选择商品" {...productValueProps}>
                                                        {donationSelectOption}
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ display: getFieldValue("MemberRightsType") == "3" ? "" : "none" }}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>折扣：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="Discount"
                                                    hasFeedback
                                                    >
                                                    <Input {...discountValueProps} className="cp1 form-control" placeholder="请输入折扣" />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ display: getFieldValue("MemberRightsType") == "4" ? "" : "none" }}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>分销权：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="SaleRights"
                                                    hasFeedback
                                                    >
                                                    <Select placeholder="请选择分销权" {...saleRightsValueProps}>
                                                        {productSelectOption}
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ display: getFieldValue("MemberRightsType") == "5" ? "" : "none" }}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>分销层级：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="SaleLevelValue"
                                                    hasFeedback
                                                    >
                                                    <Select placeholder="请选择分销层级" {...saleLevelValueProps}>
                                                        <Option value="1">一级</Option>
                                                        <Option value="2">二级</Option>
                                                        <Option value="3">三级</Option>
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ display: getFieldValue("MemberRightsType") == "6" ? "" : "none" }}>
                                        <div className="row">
                                            <label className="control-label col-xs-3 text-right"><span className="color-red">*</span>自定义说明：</label>
                                            <div className="col-xs-7">
                                                <FormItem key="Other"
                                                    hasFeedback
                                                    >
                                                    <Input {...otherValueProps} className="cp1 form-control" placeholder="请输入自定义说明" />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row padding-top20">
                                        <div className="col-xs-4 col-xs-offset-4">
                                            <Button type="primary" size="large" onClick={this.submitForm}>保存</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

let MemberRightsSetIndexPage = Form.create({})(MemberRightsSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(MemberRightsSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
