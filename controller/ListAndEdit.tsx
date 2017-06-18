import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../pub/Server';
import Config from '../pub/Config';
import Tool from '../pub/Tool';
import LocalStorage from '../pub/LocalStorage';

import {message} from 'antd';
import {Button} from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, TreeSelect } from 'antd';
import { Link } from 'react-router';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../components/pubController/BaseContainer';
import AppBody from '../components/layout/AppBody';
import {BaseStore} from '../redux/store/BaseStore';


//api
import PartnerApi from './Partner/PartnerApi';
import PartnerLevelApi from './Partner/PartnerLevelApi';

//表单验证模块
import Verifier from '../pub/Verifier';
const store = BaseStore({});

//按钮组
const ButtonGroup = Button.Group;


//查询表单
import SearchForm from '../components/FormTemplate/SearchForm';
const Search = Form.create()(SearchForm);

//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../components/FormTemplate/FormControl';

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class ListAndEdit extends BaseContainer {
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
        this.initPartnerList = this.initPartnerList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deletePartner = this.deletePartner.bind(this);


        this.searchData = {};
        this.searchDataList = this.searchDataList.bind(this);

        //数据提交
        this.onSubmit = this.onSubmit.bind(this);

        let formElements: FormElement[] = [
            {
                key: "UploadTemp", element: ElementEnum.Upload, type: "array", label: "上传图片", config: {}, message: "请上传图片", defaultValue: "请上传图片", rules: { required: true }, dataList: []
            },
            { key: "RealName", element: ElementEnum.Input, type: "text", label: "合作伙伴名称", message: "请填合作伙伴名称", defaultValue: "莫小夕2", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "Weid", element: ElementEnum.Input, type: "text", label: "Weid", message: "请填写Weid", defaultValue: "1", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "PartnerLevelId", element: ElementEnum.MultipleSelect, type: "string", label: "合作伙伴等级", message: "请选择合作伙伴等级", defaultValue: "false", rules: { required: false, whitespace: true }, dataList: [{ "value": "", "key": "不限" }, { "value": "true", "key": "是" }, { "value": "false", "key": "否" }] },
            { key: "StartTime", element: ElementEnum.DatePicker, type: "date", label: "开始时间", message: "请选择开始时间", defaultValue: "2016-08-18 15:11:51", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "EndTime", element: ElementEnum.TimePicker, type: "date", label: "到期时间", message: "请选择到期时间", defaultValue: "2018-08-18 15:11:51", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            //{ key: "PartnerState", element: ElementEnum.Switch, type: "boolean", label: "合作伙伴状态", message: "请选择合作伙伴状态", defaultValue: false, rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "TextareaTemp", element: ElementEnum.Textarea, type: "string", label: "多行文本", message: "请填写多行文本", defaultValue: "", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            //step:保留小数位
            { key: "PartnerState", element: ElementEnum.InputNumber, type: "number", label: "数字输入框", message: "请输入1-100之间的整数或小数。", max: 100, min: 1, step: 0.1, defaultValue: 1, rules: { required: true, whitespace: false, validator: this.checkInput }, dataList: [] },
            { key: "Password", element: ElementEnum.Input, compareWith: "RePassword", type: "password", label: "密码", message: "请填写密码", defaultValue: "123", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "RePassword", element: ElementEnum.Input, isCompare: true, compareWith: "Password", type: "password", label: "确认密码", message: "请填写确认密码", defaultValue: "123", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },

        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            partnerData: [],//合作伙伴列表数据
            loadingPartner: false,//正在加载合作伙伴列表
            selectPartnerIndex: -1,//选择合作伙伴列表序号
            selectPartnerName: "",//当前选择的合作伙伴名称
            selectPartnerId: "",//选择的合作伙伴Id
            functionData: [],//功能列表数据 
            selectedRowKeys: [],//功能选择

            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 2, //每页条数  

            searchPara: [
                { key: "RealName", type: "Input", name: "名称", message: "合作伙伴名称", defaultValue: "", dataList: [] },
                { key: "Weid", type: "Input", name: "Weid", message: "Weid", defaultValue: "", dataList: [] },
                { key: "PartnerLevelId", type: "Select", name: "合作伙伴等级", message: "", defaultValue: "请选择合作伙伴等级", dataList: [{ "value": "", "key": "不限" }, { "value": "57b56da2044adc31e8505752", "key": "一级合作伙伴" }, { "value": "57b56dd1044adc31e8505754", "key": "二级合作伙伴" }] },
                { key: "StartTime", type: "DatePicker", name: "开始时间", message: "开始时间", defaultValue: "请选择时间", dataList: [] },
                { key: "EndTime", type: "TimePicker", name: "结`束时间", message: "结束时间", defaultValue: "请选择时间", dataList: [] },
            ],

            //添加、修改表单组件参数
            modalPara: formElements,
            //默认值
            defaultValues: {},
            editId: -1,
            editNextId: -1,

            value: ['0-0-0'],
            treeData: [{
                label: '节点一',
                value: '0-0',
                key: '0-0',
                children: [{
                    label: '子节点一',
                    value: '0-0-0',
                    key: '0-0-0',
                }],
            }, {
                    label: '节点二',
                    value: '0-1',
                    key: '0-1',
                    children: [{
                        label: '子节点三',
                        value: '0-1-0',
                        key: '0-1-0',
                    }, {
                            label: '子节点四',
                            value: '0-1-1',
                            key: '0-1-1',
                        }, {
                            label: '子节点五',
                            value: '0-1-2',
                            key: '0-1-2',
                        }],
                }],

        }


        //初始化表单 
        this.initForm = this.initForm.bind(this);

        //绑定数据 
        this.getDataFromDB = this.getDataFromDB.bind(this);

        //绑定数据 
        this.batchDelete = this.batchDelete.bind(this);

        //树选择
        this.onChange = this.onChange.bind(this);


        this.isLeaf = this.isLeaf.bind(this);


        this.checkPass2 = this.checkPass2.bind(this);



    }

    //验证输入框
    checkPass2(rule, value, callback) {
        alert(value);
        if (value && (!(/^\d+$/).test(value.toString().trim()))) {
            callback('只能为数字。');
        }
        else {
            callback();
        }
    }

    /** 初始化表单*/
    initForm() {
        var _this = this;

        //图片上传
        _this.state.modalPara[0].config = {
            multiple: true,
            //action: "/Common/Upload",
            action: "/UploadFile/UploadImage",
            defaultFileList: [],
        };

        _this.initPartnerList();
        PartnerLevelApi.getPartnerLevePageList({}).then(function (data) {
            if (data.IsOK) {
                var partnerLevelData = []; // 查询下拉框
                var partnerLevelListData = []; // 弹出层下拉框
                if (Array.isArray(data.Value)) {
                    //设置默认值
                    partnerLevelData.push({ key: "不限", value: "" });
                    partnerLevelListData.push({ key: "不限", value: "" });
                    for (var i = 0; i < data.Value.length; i++) {
                        //绑定值
                        partnerLevelData.push({ key: data.Value[i].LevelName, value: data.Value[i].Id });
                        partnerLevelListData.push({ key: data.Value[i].LevelName, value: data.Value[i].Id });
                    }
                }
                _this.state.searchPara[2].dataList = partnerLevelData;
                _this.state.modalPara[3].dataList = partnerLevelListData;
                _this.setState(_this.state);
            }

        });


    }

    //插入真实DOM之前被执行
    componentWillMount() {
        console.log("componentWillMount");
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        //初始化表单
        this.initForm();
        console.log("componentDidMount");
    }


    //更新DOM之前被执行
    componentWillUpdate(nextProps) {
        console.log("componentWillUpdate");
        if (nextProps != this.props) {
            console.log("执行componentWillUpdate");
        }
        else {
            console.log("不执行componentWillUpdate");
        }
    }

    getDataFromDB(partnerid) {
        console.log("从数据库读取数据");
        var _this = this;
        var obj = { Id: partnerid };
        //this.setState({ modalPara: modalPara }); 
        var defaultValues = {};
        PartnerApi.getPartner(obj).then(function (data) {
            if (data.IsOK) {
                //绑定值
                defaultValues = data.Value;
                console.log("从数据库读取数据完成，开始刷新数据");
                _this.setState({ editId: partnerid, defaultValues: defaultValues });
                console.log("从数据库读取数据完成，刷新完成");
            }
        });
    }

    //更新DOM之后被执行
    componentDidUpdate(nextProps) {
        var _this = this;
        console.log("开始componentDidUpdate");
        console.log("this.state.editId：" + _this.state.editId);
        console.log("this.state.editId：" + _this.state.editNextId);
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleForm === true) {
            console.log("读取数据");
            _this.getDataFromDB(_this.state.editId);
            _this.state.editNextId = _this.state.editId;
        }
        if (nextProps != this.props) {
            console.log("执行componentDidUpdate");
        }
        else {
            console.log("不执行componentDidUpdate");
        }

    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log("componentWillUnmount");
    }

    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
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

    //数据提交
    onSubmit(obj) {
        var _this = this;
        obj["StartTime"] = Tool.GMTToDate(obj["StartTime"]);
        obj["EndTime"] = Tool.GMTToDate(obj["EndTime"]);
        console.log('收到表单值：', JSON.stringify(obj));
        if (_this.state.isInsert) {
            PartnerApi.insertPartner(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initPartnerList();
                }
                message.info(data.Message);
            });
        } else {
            obj.Id = _this.state.editId;
            PartnerApi.updatePartner(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initPartnerList(true);
                }
                message.info(data.Message);
            });
        }
    }

    searchDataList(obj) {
        this.state.PageIndex = 1;
        this.searchData = obj;
        this.initPartnerList();
    }

    /** 获取合作伙伴列表*/
    initPartnerList(notchangeSelectPartner: boolean = false) {
        var obj = this.searchData;
        var _this = this;
        this.state.visibleForm = false;
        if (!notchangeSelectPartner) {
            this.state.selectPartnerIndex = -1;
            this.state.selectPartnerName = "";
            this.state.selectPartnerId = "";
            this.state.selectedRowKeys = [];
        }
        this.state.loadingPartner = true;
        PartnerApi.getPartnerPageList(obj).then(function (data) {
            if (data.IsOK) {
                if (Array.isArray(data.Value)) {
                    _this.state.partnerData = data.Value;
                }

                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingPartner: false });

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
        console.log(partnerid);
    }
    /**
     * 关闭弹窗
     */
    closeForm() {
        this.setState({ visibleForm: false });
    }

    /**
     * 批量删除
     */
    batchDelete() {
        alert("待删除Id：" + this.state.selectedRowKeys);
    }

    /**
     * 打开修改弹窗
     */
    openEditForm(partnerid) {
        console.log("打开弹出框");
        this.state["isInsert"] = false;
        this.state["visibleForm"] = true;
        var _this = this;

        /** 图片默认值设置     start   **/
        _this.state.modalPara[0].config.defaultFileList = [{
            uid: -1,
            name: 'xxx.png',
            status: 'hide',
            url: 'http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg',
            thumbUrl: 'http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg',
        }, {
                uid: -12,
                name: 'xxx.png',
                status: 'done',
                url: 'http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg',
                thumbUrl: 'http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg',
            }];
        /** 图片默认值设置     end   **/


        /** 异步调用  触发 componentDidUpdate 并触发组件的componentWillReceiveProps 进行弹出层数据绑定    start   **/
        _this.state.editNextId = -1;
        _this.state.editId = partnerid;
        /** 异步调用  end   **/


        ///** 直接传值调用  触发 组件的componentDidUpdate  进行弹出层数据绑定    start   **/
        //var defaultValues = { "RealName": "strin111g", "Weid": "1", "PartnerLevelId": "57b56df6044adc31e850575a", "StartTime": "2016-09-10T08:52:04.911Z", "EndTime": "2016-09-10T08:52:06.244Z", "PartnerState": "0" }
        //_this.setState({ defaultValues: defaultValues });
        ///** 直接传值调用  end   **/

        return false;
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        //var isinsert = true;
        //this.setState({ isInsert: isinsert, visibleForm: true });
        console.log("打开弹出框");
        this.state["isInsert"] = true;
        this.state["visibleForm"] = true;
        var _this = this;

        /** 图片默认值设置     start   **/
        _this.state.modalPara[0].config.defaultFileList = [];
        /** 图片默认值设置     end   **/

        _this.state.modalPara[8].dataList = [{
            label: '节点一',
            value: '0-0',
            key: '0-0',
            children: [{
                label: '子节点一',
                value: '0-0-0',
                key: '0-0-0',
            }],
        }, {
                label: '节点二',
                value: '0-1',
                key: '0-1',
                children: [{
                    label: '子节点三',
                    value: '0-1-0',
                    key: '0-1-0',
                }, {
                        label: '子节点四',
                        value: '0-1-1',
                        key: '0-1-1',
                    }, {
                        label: '子节点五',
                        value: '0-1-2',
                        key: '0-1-2',
                    }],
            }];

        _this.state.modalPara[8].defaultValue = ['0-0-0'];

        ///** 异步调用  触发 componentDidUpdate 并触发组件的componentWillReceiveProps 进行弹出层数据绑定    start   **/
        //_this.state.editNextId = -1;
        //_this.state.editId = partnerid;
        ///** 异步调用  end   **/


        /** 直接传值调用  触发 组件的componentDidUpdate  进行弹出层数据绑定    start   **/
        _this.setState({
            defaultValues: {}
        });
        /** 直接传值调用  end   **/

        return false;
    }

    showNewPage(Id) {
        Tool.goPush('formcontroltest/Index');
        LocalStorage.add('canshu', Id);
    }

    isLeaf(value) {
        if (!value) {
            return false;
        }
        let queues = [...this.state.treeData];
        while (queues.length) { // BFS
            const item = queues.shift();
            if (item.value === value) {
                if (!item.children) {
                    return true;
                }
                return false;
            }
            if (item.children) {
                queues = queues.concat(item.children);
            }
        }
        return false;
    }

    onChange(value) {
        console.log('onChangeChildren', arguments);
        const pre = value ? this.state.value : undefined;
        this.setState({ value: this.isLeaf(value) ? value : pre });
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

        var { router} = this.props;
        let SearchFormModel = Search;

        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }; 

        const partnerColumns = [
            {
                title: '合作伙伴名称',
                dataIndex: 'RealName',
                key: 'RealName',
                // render: (text) => <span> {text}</span>,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={(event) => { this.showNewPage(record.Id) } }>{text}</a>
                    </span>
                ),
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
                        <a href="#" onClick={(event) => { this.openEditForm(record.Id) } }>修改</a>
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
        const treeData = this.state.treeData;

        const tProps = {
            treeData,
            value: this.state.value,
            onChange: this.onChange,
            //multiple: true,
            treeCheckable: true,
            //showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择',
            style: {
                width: 300,
            },
        };
        return (
            <AppBody>
                <Row>
                    <Col>
                        <TreeSelect
                            style={{ width: 300 }}
                            //transitionName="rc-tree-select-dropdown-slide-up"
                            //choiceTransitionName="rc-tree-select-selection__choice-zoom"
                            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                            //placeholder={<i>请下拉选择</i>}
                            searchPlaceholder="please search"
                            showSearch allowClear
                            //treeLine
                            value={this.state.value}
                            treeData={treeData}
                            treeNodeFilterProp="label"
                            //filterTreeNode={false}
                            onChange={this.onChange}
                            />
                    </Col>
                    <Col>
                        <SearchFormModel {...this.state} name={this.props.name} onSearch={this.searchDataList}></SearchFormModel>
                    </Col>
                    <Col>
                        <Table
                            rowKey= { record => record.Id }
                            columns={partnerColumns}
                            dataSource={this.state.partnerData}
                            bordered
                            pagination={pagination}
                            loading={this.state.loadingPartner}
                            rowSelection={rowSelection}
                            footer={() =>
                                <ButtonGroup>
                                    <Button type="primary" style={{ marginLeft: 8 }} disabled={!hasSelected} onClick={this.batchDelete} >批量删除</Button>
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

                <Modal
                    title={this.state.isInsert ? "添加合作伙伴" : "修改合作伙伴"} visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm }
                    footer={[]}
                    >
                    <FormTemplate formElements={this.state.modalPara} defaultValues={this.state.defaultValues} editId={this.state.editId} isInsert={this.state.isInsert} onCancel={this.closeForm}  onSubmit={this.onSubmit}></FormTemplate>
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

let PartnerIndexPage = Form.create({})(ListAndEdit);

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

