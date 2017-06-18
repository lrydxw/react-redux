import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';
import LocalStorage from '../pub/LocalStorage';


import Server from '../pub/Server';
import Config from '../pub/Config';
import {message} from 'antd';
import {Button} from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Cascader, Input, CreateFormOptions } from 'antd';
const FormItem = Form.Item;

import {changeActiveAction, getActive} from '../redux/actions/MenuAction';

//自己书写的基类
import BaseContainer from '../components/pubController/BaseContainer';
import AppBody from '../components/layout/AppBody';
import {BaseStore} from '../redux/store/BaseStore';

//表单验证模块
import Verifier from '../pub/Verifier';
const store = BaseStore({});
//表单验证模块

//按钮组
const ButtonGroup = Button.Group;

const partnerData = [];

const pagination = {
    total: partnerData.length,
    showSizeChanger: true,
    onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
    },
    onChange(current) {
        console.log('Current: ', current);
    },
};

//api 
import PartnerLevelApi from './Partner/PartnerLevelApi';

//查询表单
import SearchForm from '../components/FormTemplate/SearchForm';
const Search = Form.create()(SearchForm);

//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../components/FormTemplate/FormControl';

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class FormControlIndex extends BaseContainer {
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
        this.searchData = {};

        let formElements: FormElement[] = [
            { key: "InputTemp", element: ElementEnum.Input, type: "string", label: "文本", message: "请填写文本", defaultValue: "哈哈", rules: { required: true, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "InputMobileTemp", element: ElementEnum.Input, type: "string", label: "手机号", message: "请填写手机号码", defaultValue: "", rules: { required: true, whitespace: true, validator: this.checkMobile }, dataList: [] },
            //step:保留小数位
            { key: "InputNumberTemp", element: ElementEnum.InputNumber, type: "number", label: "数字输入框", message: "请输入1-100之间的整数或小数。", max: 100, min: 1, step: 0.1, defaultValue: 1, rules: { required: true, whitespace: false, validator: this.checkFloat }, dataList: [] },
            { key: "ClassMonitorList", element: ElementEnum.Select, type: "string", label: "下拉框", message: "请选择", defaultValue: "57c64e54044add2a644c0719", rules: { required: true, whitespace: true }, dataList: [{ "value": "", "key": "不限" }, { "value": "true", "key": "是" }, { "value": "false", "key": "否" }] },
            { key: "DatePickerTemp", element: ElementEnum.DatePicker, type: "date", label: "日期", message: "请选择日期", defaultValue: "请选择日期", rules: { required: true }, dataList: [] },
            { key: "TimePickerTemp", element: ElementEnum.TimePicker, type: "date", label: "时间", message: "请选择时间", defaultValue: "请选择时间", rules: { required: true }, dataList: [] },
            { key: "RadioGroupTemp", element: ElementEnum.Radio, type: "string", label: "单选按钮", message: "请选择单选按钮", defaultValue: "请选择单选按钮", rules: { required: true }, dataList: [] },
            { key: "CheckboxTemp", element: ElementEnum.Checkbox, type: "array", label: "多选按钮", message: "请选择多选按钮", defaultValue: "请选择单选按钮", rules: {}, dataList: [] },
            { key: "CascaderTemp", element: ElementEnum.Cascader, type: "array", label: "级联选择", message: "请选择级联选择", defaultValue: "请选择单选按钮", rules: { required: false }, dataList: [] },
            { key: "SwitchTemp", element: ElementEnum.Switch, type: "boolean", label: "开关", message: "请选择开关", defaultValue: false, rules: { required: true }, dataList: [] },
            {
                key: "UploadImageTemp", element: ElementEnum.Upload, type: "array", label: "上传图片", config: {}, message: "请上传图片", defaultValue: "请上传图片", rules: { required: true }, dataList: []
            },
            {
                key: "UploadFileTemp", element: ElementEnum.UploadFile, type: "array", label: "上传文件", config: {}, message: "请上传文件", defaultValue: "请上传文件", rules: { required: true }, dataList: []
            },
            { key: "PasswordTemp", element: ElementEnum.Input, compareWith: "RePasswordTemp", type: "password", label: "密码", message: "请填写密码", defaultValue: "123", rules: { required: false, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "RePasswordTemp", element: ElementEnum.Input, isCompare: true, compareWith: "PasswordTemp", type: "password", label: "确认密码", message: "请填写确认密码", defaultValue: "123", rules: { required: false, whitespace: true, validator: this.checkInput }, dataList: [] },
            { key: "EditorTemp", element: ElementEnum.Editor, type: "string", label: "文本编辑器", message: "请填写文本编辑器内容", defaultValue: "", rules: { required: true }, dataList: [] },
            { key: "TextareaTemp", element: ElementEnum.Textarea, type: "string", label: "多行文本", message: "请填写多行文本", defaultValue: "", rules: { required: true, whitespace: true, validator: this.checkMobile }, dataList: [] },

        ];

        this.state = {
            id: "",
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            partnerData: [],//合作伙伴列表数据
            loadingPartner: false,//正在加载合作伙伴列表
            selectFormControlIndex: -1,//选择合作伙伴列表序号
            selectPartnerName: "",//当前选择的合作伙伴名称
            selectPartnerId: "",//选择的合作伙伴Id 
            loadingFunction: false,//正在加载功能列表
            selectedRowKeys: [],//功能选择 
            //添加、修改表单组件参数
            modalPara: formElements,
            //默认值
            defaultValues: {},
        }

        this.state.id = LocalStorage.get('canshu');

        //alert(this.state.id);


        //绑定默认值
        this.openEditForm = this.openEditForm.bind(this);
        //数据提交
        this.onSubmit = this.onSubmit.bind(this);

        //初始化表单


        this.initForm = this.initForm.bind(this);

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

        //图片上传
        _this.state.modalPara[11].config = {
            multiple: true,
            //action: "/Common/Upload",
            action: "/UploadFile/UploadFile",
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

    //设置默认值
    openEditForm() {
        var _this = this;
        //图片上传
        _this.state.modalPara[10].config.defaultFileList = [{
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

        //文件上传
        _this.state.modalPara[11].config.defaultFileList = [{
            uid: -1111,
            name: 'xxx.png',
            status: 'hide',
            url: 'http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg',
            thumbUrl: 'http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg',
        }, {
                uid: -11112,
                name: 'xxx.png',
                status: 'done',
                url: 'http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg',
                thumbUrl: 'http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg',
            }];
        var defaultValues = { "InputTemp": "1", "InputMobileTemp": "15838260190", "TextareaTemp": "15838260190", "InputNumberTemp": 15, "SelectTemp": "57b56de9044adc31e8505758", "DatePickerTemp": "2016-09-06", "TimePickerTemp": "2016-09-06 12:48:10", "RadioGroupTemp": "Pear", "CheckboxTemp": ["Pear", "Apple"], "CascaderTemp": ["zhejiang", "hangzhou", "xihu"], "SwitchTemp": true, "UploadImageTemp": "http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg,http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg", "UploadFileTemp": "http://localhost:62575/Upload/Image/course/f8e4ba7f-13c2-48c4-aa89-1bcbd0658b95.jpg,http://localhost:62575/Upload/Image/course/f506116e-d314-4927-a0cc-7b540fb41841.jpg", "EditorTemp": "文本编辑器1111111111" };
        this.setState({ defaultValues: defaultValues });
    }

    //数据提交
    onSubmit(obj) {
        alert(JSON.stringify(obj));
    }

    //插入真实DOM之前被执行 
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        //初始化表单
        this.initForm();
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

    render() {

        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };

        return (
            <AppBody>
                <Row>
                    <Col>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.openEditForm}>绑定默认值</Button>
                        <FormTemplate formElements={this.state.modalPara} defaultValues={this.state.defaultValues}  onSubmit={this.onSubmit}></FormTemplate>
                    </Col>
                </Row>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let FormControlIndexPage = Form.create({})(FormControlIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FormControlIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);

