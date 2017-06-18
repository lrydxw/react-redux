﻿import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import {message} from 'antd';
import {Button} from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';

//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';

//api
import PartnerApi from './PartnerApi';
import PartnerLevelApi from './PartnerLevelApi';
//表单验证模块
import Verifier from '../../pub/Verifier';

//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';




const store = BaseStore({});
//表单验证模块

//按钮组
const ButtonGroup = Button.Group;

const partnerData = [];


//const pagination = {
//    total: partnerData.length,
//    showSizeChanger: true,
//    onShowSizeChange(current, pageSize) {
//        console.log('Current: ', current, '; PageSize: ', pageSize);
//    },
//    onChange(current) {
//        console.log('Current: ', current);
//    },
//};


//数据流向
//验证的表单配置
let Verifier_RoleInsert = {
    RealName: {
        name: '合作伙伴名称',
        require: true
    }
};

//查询表单
import SearchForm from '../../components/FormTemplate/SearchForm';
const Search = Form.create()(SearchForm);

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class PartnerIndex extends BaseContainer {
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
        //查询       

        this.initDataList = this.initDataList.bind(this);
        this.searchData = {};

        let formElements: FormElement[] = [
            { key: "InputTemp", element: ElementEnum.Input, type: "string", label: "文本", message: "请填写文本", defaultValue: "哈哈", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "InputMobileTemp", element: ElementEnum.Input, type: "string", label: "手机号", message: "请填写手机号码", defaultValue: "", rules: { required: true, whitespace: true, validator: this.checkMobile }, dataList: [] },
            //step:保留小数位
            { key: "InputNumberTemp", element: ElementEnum.InputNumber, type: "number", label: "数字输入框", message: "请输入1-100之间的整数或小数。", max: 100, min: 1, step: 0.1, defaultValue: 0, rules: { required: true, whitespace: false, validator: this.checkFloat }, dataList: [] },
            { key: "SelectTemp", element: ElementEnum.Select, type: "string", label: "下拉框", message: "请选择", defaultValue: "57c64e54044add2a644c0719", rules: { required: true, whitespace: true }, dataList: [{ "value": "", "key": "不限" }, { "value": "true", "key": "是" }, { "value": "false", "key": "否" }] },
            { key: "DatePickerTemp", element: ElementEnum.DatePicker, type: "date", label: "日期", message: "请选择日期", defaultValue: "请选择日期", rules: { required: true }, dataList: [] },
            { key: "TimePickerTemp", element: ElementEnum.TimePicker, type: "date", label: "时间", message: "请选择时间", defaultValue: "请选择时间", rules: { required: true }, dataList: [] },
            { key: "RadioGroupTemp", element: ElementEnum.Radio, type: "string", label: "单选按钮", message: "请选择单选按钮", defaultValue: "请选择单选按钮", rules: { required: true }, dataList: [] },
            { key: "CheckboxTemp", element: ElementEnum.Checkbox, type: "array", label: "多选按钮", message: "请选择多选按钮", defaultValue: "请选择单选按钮", rules: {}, dataList: [] },
            { key: "CascaderTemp", element: ElementEnum.Cascader, type: "array", label: "级联选择", message: "请选择级联选择", defaultValue: "请选择单选按钮", rules: { required: false }, dataList: [] },
            { key: "SwitchTemp", element: ElementEnum.Switch, type: "boolean", label: "开关", message: "请选择开关", defaultValue: false, rules: { required: true }, dataList: [] },
            {
                key: "UploadTemp", element: ElementEnum.Upload, type: "array", label: "上传图片", config: {}, message: "请上传图片", defaultValue: "请上传图片", rules: { required: true }, dataList: []
            },
            { key: "EditorTemp", element: ElementEnum.Editor, type: "boolean", label: "文本编辑器", message: "请填写文本编辑器内容", defaultValue: "", rules: { required: true }, dataList: [] },
            { key: "TextareaTemp", element: ElementEnum.Textarea, type: "string", label: "多行文本", message: "请填写多行文本", defaultValue: "", rules: { required: true, whitespace: true, validator: this.checkMobile }, dataList: [] },

        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            partnerData: [],//合作伙伴列表数据
            loadingPartner: false,//正在加载合作伙伴列表
            selectPartnerIndex: -1,//选择合作伙伴列表序号
            selectPartnerName: "",//当前选择的合作伙伴名称
            selectPartnerId: "",//选择的合作伙伴Id
            loadingFunction: false,//正在加载功能列表
            selectedRowKeys: [],//功能选择           
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 2, //每页条数 

            searchPara: [
                { key: "RealName", type: "Input", name: "名称", message: "合作伙伴名称", defaultValue: "", dataList: [] },
                { key: "Weid", type: "Input", name: "Weid", message: "Weid", defaultValue: "", dataList: [] },
                { key: "PartnerLevelId", type: "Select", name: "合作伙伴等级", message: "", defaultValue: "请选择合作伙伴", dataList: [] },
                { key: "StartTime", type: "DatePicker", name: "开始时间", message: "开始时间", defaultValue: "请选择时间", dataList: [] },
                { key: "EndTime", type: "TimePicker", name: "结束时间", message: "结束时间", defaultValue: "请选择时间", dataList: [] },
            ],

            //添加、修改表单组件参数
            modalPara: formElements,
            //默认值
            defaultValues: {},
        }

        this.openInsertForm = this.openInsertForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.initPartnerList = this.initPartnerList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deletePartner = this.deletePartner.bind(this);


        this.searchDataList = this.searchDataList.bind(this);
        this.initPartnerList();

        this.initPartnerLevelList = this.initPartnerLevelList.bind(this);
        this.initPartnerLevelList();



        //初始化表单 
        this.initForm = this.initForm.bind(this);
        //初始化表单
        this.initForm();
    }

    /** 初始化表单*/
    initForm() {
        var _this = this;

        //图片上传
        _this.state.modalPara[10].config = {
            multiple: true,
            //action: "/Common/Upload",
            action: "/UploadFile/UploadImage",
            defaultFileList: [],
        };


        //单选框
        _this.state.modalPara[6].dataList = [
            { label: '苹果', value: 'Apple' },
            { label: '梨', value: 'Pear' },
            { label: '橘', value: 'Orange' },
        ];

        //多选框
        _this.state.modalPara[7].dataList = [
            { label: '苹果', value: 'Apple', disabled: false },
            { label: '梨', value: 'Pear', disabled: false },
            { label: '橘', value: 'Orange', disabled: false },
        ];

        //级联菜单
        _this.state.modalPara[8].dataList = [{
            value: 'zhejiang',
            label: '浙江',
            children: [{
                value: 'hangzhou',
                label: '杭州',
                children: [{
                    value: 'xihu',
                    label: '西湖',
                }],
            }],
        }, {
                value: 'jiangsu',
                label: '江苏',
                children: [{
                    value: 'nanjing',
                    label: '南京',
                    children: [{
                        value: 'zhonghuamen',
                        label: '中华门',
                    }],
                }],
            }];



        PartnerLevelApi.getPartnerLevePageList({}).then(function (data) {
            if (data.IsOK) {
                var partnerLevelData = [];
                if (Array.isArray(data.Value)) {
                    //设置默认值
                    partnerLevelData.push({ key: "不限", value: "" });
                    for (var i = 0; i < data.Value.length; i++) {
                        //绑定值
                        partnerLevelData.push({ key: data.Value[i].LevelName, value: data.Value[i].Id });
                    }
                }
                _this.state.modalPara[3].dataList = partnerLevelData;
                _this.setState(_this.state.modalPara);
            }

        });


    }

    //验证小数
    checkFloat(rule, value, callback) {
        if (value && (!(/^([0-9])|([1-9]\d+)\.\d?$/).test(value.toString().trim()))) {
            callback('请输入整数或小数。');
        }
        else {
            callback();
        }
    }

    //验证输入框
    checkInput(rule, value, callback) {
        if (value && (!(/^\d+$/).test(value.toString().trim()))) {
            callback('只能为数字。');
        }
        else {
            callback();
        }
    }

    //验证手机号
    checkMobile(rule, value, callback) {
        if (value && (!(/^((1[3578][0-9]{9}))$/).test(value.toString().trim()))) {
            callback('手机号码格式不正确。');
        }
        else {
            callback();
        }
    }

    ////设置默认值
    //openEditForm() {
    //    var _this = this;
    //    //图片上传
    //    _this.state.modalPara[10].config.defaultFileList = [{
    //        uid: -1,
    //        name: 'xxx.png',
    //        status: 'hide',
    //        url: 'http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg',
    //        thumbUrl: 'http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg',
    //    }, {
    //            uid: -12,
    //            name: 'xxx.png',
    //            status: 'done',
    //            url: 'http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg',
    //            thumbUrl: 'http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg',
    //        }];
    //    var defaultValues = { "InputTemp": "1", "InputMobileTemp": "15838260190", "TextareaTemp": "15838260190", "InputNumberTemp": 15, "SelectTemp": "57b56de9044adc31e8505758", "DatePickerTemp": "2016-09-06", "TimePickerTemp": "2016-09-06 12:48:10", "RadioGroupTemp": "Pear", "CheckboxTemp": ["Pear", "Apple"], "CascaderTemp": ["zhejiang", "hangzhou", "xihu"], "SwitchTemp": true, "UploadTemp": "http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg,http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg", "EditorTemp": "文本编辑器1111111111" };
    //    this.setState({ defaultValues: defaultValues });
    //}

    searchDataList(obj) {
        this.state.PageIndex = 1;
        this.searchData = obj;
        this.initPartnerList();
    }

    /**
    * 查询
    */
    initDataList() {
        var _this = this;
        _this.initPartnerList();
    }


    //插入真实DOM之前被执行
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {

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

    /** 获取合作伙伴列表*/
    initPartnerList(notchangeSelectPartner: boolean = false) {
        var obj = this.searchData;
        var _this = this;

        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;

        this.state.visibleForm = false;
        if (!notchangeSelectPartner) {
            this.state.selectPartnerIndex = -1;
            this.state.selectLevelName = "";
            this.state.selectPartnerId = "";
            this.state.selectedRowKeys = [];
        }
        this.state.loadingPartner = true;
        PartnerApi.getPartnerPageList(obj).then(function (data) {
            if (data.IsOK) {
                var partnerData = [];
                if (Array.isArray(data.Value)) {
                    for (var i = 0; i < data.Value.length; i++) {
                        partnerData.push({ key: data.Value[i].Id, RealName: data.Value[i].RealName, Weid: data.Value[i].Weid, PartnerLevelId: data.Value[i].PartnerLevelId, StartTime: data.Value[i].StartTime, EndTime: data.Value[i].EndTime, PartnerState: data.Value[i].PartnerState });
                    }
                }
                _this.state.partnerData = partnerData;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingPartner: false });

        });
    }

    /** 获取合作伙伴列表*/
    initPartnerLevelList() {
        var obj = this.searchData;
        var _this = this;
        PartnerLevelApi.getPartnerLeveList({}).then(function (data) {
            if (data.IsOK) {
                var partnerLevelData = [];
                if (Array.isArray(data.Value)) {
                    for (var i = 0; i < data.Value.length; i++) {
                        partnerLevelData.push({ key: data.Value[i].LevelName, value: data.Value[i].Id });
                    }
                }
                _this.state.searchPara[2].dataList = partnerLevelData;
            }
            // _this.setState({ loadingPartner: false });

        });
    }

    /**
     * 提交数据
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
            if (obj.LogoPath && obj.LogoPath.file && obj.LogoPath.fileList && obj.LogoPath.fileList.length === 1) {
                obj.LogoPath = obj.LogoPath.file.url;
            }
            console.log('收到表单值：', obj);
            _this.state.visibleForm = false;
            if (_this.state.isInsert) {
                PartnerApi.insertPartner(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initPartnerList();
                    }
                    message.info(data.Message);
                });
            } else {
                obj.Id = _this.state.selectPartnerId;
                PartnerApi.updatePartner(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initPartnerList(true);
                    }
                    message.info(data.Message);
                });
            }
        });
    }
    /**
     * 删除合作伙伴
     * @param partnerid
     */
    deletePartner(partnerid) {
        var _this = this;
        var obj = { Id: partnerid };
        PartnerApi.deletePartner(obj).then(function (data) {
            if (data.IsOK) {
                message.info(data.Message);
                _this.initPartnerList();
            } else {
                message.info(data.Message);
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
     * 打开修改弹窗
     */
    openEditForm(key, name) {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ "RealName": name });
        var isinsert = false;
        this.setState({ isInsert: isinsert, visibleForm: true });
        return false;
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        var isinsert = true;
        this.setState({ isInsert: isinsert, visibleForm: true });
        return false;
    }
    /**
     * 合作伙伴列表更改事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys });
    }
    render() {
        let SearchFormModel = Search;

        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        const partnerColumns = [
            {
                title: '合作伙伴名称',
                dataIndex: 'RealName',
                key: 'RealName',
                render: (text) => <span> {text}</span>,
            }, {
                title: 'Weid',
                dataIndex: 'Weid',
                key: 'Weid',
                render: (text) => <span> {text}</span>,
            }, {
                title: '合作伙伴等级',
                dataIndex: 'PartnerLevelId',
                key: 'PartnerLevelId',
                render: (text) => <span> {text}</span>,
            }, {
                title: '开始时间',
                dataIndex: 'StartTime',
                key: 'StartTime',
                render: (text) => <span> {text}</span>,
            }, {
                title: '到期时间',
                dataIndex: 'EndTime',
                key: 'EndTime',
                render: (text) => <span> {text}</span>,
            }, {
                title: '状态',
                dataIndex: 'PartnerState',
                key: 'PartnerState',
                render: (text) => <span> {text}</span>,
            }, {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={(event) => { this.openEditForm(record.key, record.RealName) } }>修改</a>
                        <span className="ant-divider"></span>
                        <a href="#" onClick={(event) => { this.deletePartner(record.key) } }>删除</a>
                    </span>
                ),
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            //getCheckboxProps: record => ({
            //    disabled: this.state.selectPartnerIndex < 0,    // 配置无法勾选的列
            //}),
        };

        //批量操作按钮是否可用
        const hasSelected = selectedRowKeys.length > 0;

        var self = this;
        const pagination = {
            total: self.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['1', '2', '3', '4', '5'],
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
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };


        return (
            <AppBody>
                <Row> 
                    <Col>
                        <SearchFormModel {...this.state} name={this.props.name} onSearch={this.searchDataList}></SearchFormModel>
                    </Col>
                    <Col >
                        <Table
                            columns={partnerColumns}
                            dataSource={this.state.partnerData}
                            bordered
                            pagination={pagination}
                            loading={this.state.loadingPartner}
                            rowSelection={rowSelection}
                            footer={() =>
                                <ButtonGroup>
                                    <Button type="primary" style={{ marginLeft: 8 }} disabled={!hasSelected} >批量删除</Button>
                                    <Button type="primary" style={{ marginLeft: 8 }} disabled={!hasSelected} >批量审核</Button>
                                    <Button type="primary" style={{ marginLeft: 8 }} onClick={this.openInsertForm}>添加</Button>
                                </ButtonGroup>}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    if (record.permission) {
                                        this.state.selectedRowKeys = record.permission.split(",")
                                    }
                                    this.setState({
                                        selectPartnerIndex: index,
                                        selectPartnerId: record.key,
                                        selectPartnerName: record.name,
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectPartnerIndex ? " ant-table-row-active " : "";
                                }
                            }
                            />
                    </Col>
                </Row>

                <Modal title={this.state.isInsert ? "添加合作伙伴" : "修改合作伙伴"} visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm } >
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="合作伙伴名称"
                            hasFeedback
                            >
                            <Input type="text" {...getFieldProps('RealName', {
                                validate: [{
                                    rules: [
                                        { required: true, message: '请填写合作伙伴名称' },
                                    ], trigger: ['onBlur', 'onChange'],
                                }]
                            }) }/>
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

let PartnerIndexPage = Form.create({})(PartnerIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(PartnerIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);

