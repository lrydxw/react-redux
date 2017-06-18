import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Popconfirm } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseApi from '../Course/CourseApi';
import ProductApi from '../Product/ProductApi';
import CommunityApi from './CommunityApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CommunityManageIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initCommunityList = this.initCommunityList.bind(this);
        this.openCommunityForm = this.openCommunityForm.bind(this);
        this.closeCommunityForm = this.closeCommunityForm.bind(this);
        this.submitCommunityForm = this.submitCommunityForm.bind(this);
        this.loadClassMonitorData = this.loadClassMonitorData.bind(this);
        this.loadProductData = this.loadProductData.bind(this);
        this.searchCommunity = this.searchCommunity.bind(this);
        this.setSearchKeywords = this.setSearchKeywords.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.loadCommunityFromDb = this.loadCommunityFromDb.bind(this);
        this.productTypeSelectChange = this.productTypeSelectChange.bind(this);
        this.initCommunityList = this.initCommunityList.bind(this);



        this.state = {
            visibleCommunityForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            CommunityListData: [],//列表数据
            loadingCommunity: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            monitorSelectData: [],
            productSelectData: [],
            searchKeywords: "",
            editId: -1,
            editNextId: -1
        }


    }


    componentWillMount() {

    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCommunityList();
        this.loadClassMonitorData();
        //this.loadProductData();
    }
    //更新DOM之前被执行
    componentWillUpdate() {

    }
    //更新DOM之后被执行
    componentDidUpdate() {
        var _this = this;
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleCommunityForm === true) {
            _this.loadCommunityFromDb(_this.state.editId);
            _this.state.editNextId = _this.state.editId;
        }
    }
    //移除DOM之前被执行
    componentWillUnmount() {

    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextState) {

    }


    //关闭创建社群窗口
    closeCommunityForm() {
        this.setState({ visibleCommunityForm: false });
    }


    //打开添加社群窗口
    openCommunityForm() {
        var _this = this;
        const { resetFields  } = _this.props.form;
        this.setState({ visibleCommunityForm: true, isInsert: true });
        resetFields();
    }

    setSearchKeywords(e) {
        this.state.searchKeywords = e.target.value;
    }

    searchCommunity() {
        this.state.PageIndex = 1;
        this.initCommunityList();
    }

    submitCommunityForm() {

        var _this = this;
        var form = _this.props.form;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();
            if (_this.state.isInsert) {
                CommunityApi.createCommunity(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.state.visibleCommunityForm = false;
                        _this.initCommunityList();
                    } else {
                        message.error(data.Message);
                    }
                });
            }
            else {
                obj.Id = _this.state.editId;
                CommunityApi.updateCommunity(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.state.visibleCommunityForm = false;
                        _this.initCommunityList();
                    } else {
                        message.error(data.Message);
                    }
                });
            }

        });




    }

    productTypeSelectChange(value) {
        var _this = this;
        const { setFieldsValue, getFieldValue, resetFields  } = _this.props.form;
        setFieldsValue({ "ProductType": value });
        resetFields(["ProductList"]);
        _this.loadProductData(value);
    }

    initCommunityList() {
        var _this = this;
        var obj = obj || {};
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.CommunityName = _this.state.searchKeywords;
        _this.state.visibleCommunityForm = false;
        _this.setState({ loadingCommunity: true });
        CommunityApi.getCommunityPageList(obj).then(function (data) {
            if (data.IsOK) {
                var communityData = [];
                if (Array.isArray(data.Value)) {
                    communityData = data.Value;
                }
                _this.state.CommunityListData = communityData;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingCommunity: false, selectedRowKeys: [] });

        });

    }

    loadProductData(productType) {
        var _this = this;

        ProductApi.getSelectProductDataList({ ProductType: productType }).then(function (data) {
            if (data.IsOK) {
                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].ProductName, value: String(data.Value[i].Id) });
                }

                _this.setState({ productSelectData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    loadClassMonitorData() {
        var _this = this;
        CourseApi.getClassMonitorList({}).then(function (data) {
            if (data.IsOK) {
                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].MonitorNickName, value: String(data.Value[i].Id) });
                }
                _this.setState({ monitorSelectData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    deleteCommunity(id) {
        var _this = this;
        CommunityApi.deleteCommunity({ Id: id }).then(function (data) {
            if (data.IsOK) {
                _this.initCommunityList();

            } else {
                message.error(data.Message);
            }
        });
    }

    handleSearch() {
        var _this = this;
        _this.state.PageIndex = 1;
        _this.initCommunityList();
    }

    loadCommunityFromDb(id) {
        var _this = this
        const { setFieldsValue, getFieldValue  } = _this.props.form;
        CommunityApi.getCommunity({ Id: id }).then(function (data) {
            if (data.IsOK) {

                var obj = data.Value;

                _this.loadProductData(obj.ProductType);

                setFieldsValue({
                    "CommunityName": obj.CommunityName, "PerClassPeopleNumber": String(obj.PerClassPeopleNumber), "MonitorList": obj.MonitorList,
                    "ProductType": String(obj.ProductType), "ProductList": obj.ProductList
                });

                _this.setState({ editId: id, });
            } else {
                message.error(data.Message);
            }
        });
    }

    openEditForm(record) {

        var _this = this;

        _this.setState({ isInsert: false, visibleCommunityForm: true, editNextId: -1, editId: record.Id });
    }



    goToStudentManage(id) {
        Tool.goPush('User/StudentManageIndex');
        LocalStorage.add('CommunityId', id);
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };


        const communityNameProps = getFieldProps('CommunityName', {
            validate: [{
                rules: [
                    { required: true, message: '请输入微信班级名称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const perClassPeopleNumberProps = getFieldProps('PerClassPeopleNumber', {
            validate: [{
                rules: [
                    { required: true, message: '请输入每群人数' },
                    { validator: RegExpVerify.checkPositiveInteger },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const monitorListProps = getFieldProps('MonitorList', {
            validate: [{
                rules: [
                    { required: false, message: '请选择群管理', type: 'array' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const productTypeProps = getFieldProps('ProductType', {
            validate: [{
                rules: [
                    { required: true, message: '请选择产品类型' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const productListProps = getFieldProps('ProductList', {
            validate: [{
                rules: [
                    { required: false, message: '请选择关联产品', type: 'array' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const CommunityColumns = [
            {
                title: '微信班级名称',
                dataIndex: 'CommunityName',
                key: 'CommunityName',
                render: (text, record) => <span><a href="javascript:;" onClick={() => { this.goToStudentManage(record.Id) } }>{text}</a> </span>,
            },
            {
                title: '班级数量',
                dataIndex: 'ClassCount',
                key: 'ClassCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '进群人员数量',
                dataIndex: 'EnterGroupPeopleCount',
                key: 'EnterGroupPeopleCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '学员数量',
                dataIndex: 'StudentCount',
                key: 'StudentCount',
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
                        <a onClick={() => { this.openEditForm(record) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => { this.deleteCommunity(record.Id) } }>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];

        var classMonitorSelectOption = this.state.monitorSelectData.map(function (item) {
            return (
                <Option key={"key" + item.Id} value={item.Id}>{item.MonitorNickName}</Option>
            );
        });

        var productSelectOption = this.state.productSelectData.map(function (item) {
            return (
                <Option key={"key" + item.Id} value={item.Id}>{item.ProductName}</Option>
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
                self.initCommunityList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initCommunityList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">微信班级管理</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2"><a className="btn btn-success" onClick={this.openCommunityForm}>创建新微信班级</a></div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="请输入微信班级名称" onChange={this.setSearchKeywords} style={{ height: 34 }} onPressEnter={this.searchCommunity} />
                            <span className="input-group-addon  search-btn" onClick={this.searchCommunity}>
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Table
                            columns={CommunityColumns}
                            dataSource={this.state.CommunityListData}
                            pagination={pagination}
                            loading={this.state.loadingCommunity}
                            rowKey={record => record.Id}
                            />
                    </div>
                </div>

                <Modal title={this.state.isInsert ? "添加新微信班级" : "编辑微信班级"} visible={this.state.visibleCommunityForm} maskClosable={false} onOk={this.submitCommunityForm} onCancel={this.closeCommunityForm}  >
                    <Form horizontal>
                        <FormItem key="CommunityName"
                            {...formItemLayout}
                            label="微信班级名称"
                            hasFeedback
                            >
                            <Input {...communityNameProps} placeholder="请输入微信班级名称" />

                        </FormItem>


                        <FormItem key="perClassPeopleNumber"
                            {...formItemLayout}
                            label="每群人数"
                            hasFeedback
                            >
                            <Input {...perClassPeopleNumberProps} placeholder="请输入每群人数" />

                        </FormItem>

                        <FormItem key="monitorList"
                            {...formItemLayout}
                            label="选择群管理"
                            hasFeedback
                            >

                            <Select
                                multiple
                                placeholder="请选择群管理"
                                {...monitorListProps}
                                >
                                {classMonitorSelectOption}
                            </Select>



                        </FormItem>

                        <FormItem key="productType"
                            {...formItemLayout}
                            label="产品类型"
                            hasFeedback
                            >

                            <Select
                                placeholder="请选择产品类型"
                                {...productTypeProps}
                                onChange={this.productTypeSelectChange}
                                >
                                <Option value="2">课程</Option>
                                <Option value="3">联合发起</Option>

                            </Select>
                        </FormItem>

                        <FormItem key="productList"
                            {...formItemLayout}
                            label="关联产品"
                            hasFeedback
                            >

                            <Select
                                multiple
                                placeholder="请选择关联产品"
                                {...productListProps}
                                >
                                {productSelectOption}
                            </Select>


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

let CommunityManageIndexPage = Form.create({})(CommunityManageIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CommunityManageIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
