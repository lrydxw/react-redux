import 'antd/dist/antd.css'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../pub/Server';
import Config from '../pub/Config';
import {message} from 'antd';
import {Button} from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Radio } from 'antd';

const RadioGroup = Radio.Group;
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

//数据流向
//验证的表单配置
let Verifier_RoleInsert = {
    RoleName: {
        name: '角色名称',
        require: true
    },
};


let uuid = 0;

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class DynamicForm extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            roleData: [],//权限列表数据
            loadingRole: false,//正在加载权限列表
            selectRoleIndex: -1,//选择权限列表序号
            selectRoleName: "",//当前选择的角色名称
            selectRoleId: "",//选择的权限Id
            functionData: [],//功能列表数据
            loadingFunction: false,//正在加载功能列表
            selectedRowKeys: []//功能选择
        }
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

    onRadioChange(e) {
        const { setFieldsValue } = this.props.form;

        console.log(JSON.stringify(e));
        var obj = new Object();
        var val = e.target.value;
        obj["radioTest"] = val;

        setFieldsValue(obj);
        //obj[key] = val;
        //setFieldsValue(obj);
        console.log(`radio checked:${e.target.value}`);
        alert("现在选中的是" + `radio checked:${e.target.value}`);
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

        });
    }

    remove(k) {
        const { form } = this.props;

        console.log("remove" + JSON.stringify(form));
        // can use data-binding to get
        let keys = form.getFieldValue('keys');
        console.log("remove" +JSON.stringify(form));
        keys = keys.filter((key) => {
            return key !== k;
        });
        // can use data-binding to set
        form.setFieldsValue({
            keys,
        });
    }

    add() {
        uuid++;
        const { form } = this.props;

        console.log("add" + JSON.stringify(form));
        // can use data-binding to get
        let keys = form.getFieldValue('keys'); 
        console.log("add"+JSON.stringify(keys));
        keys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys,
        });
    }

    submit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log(errors);
            }
            console.log(values);
        });
    }

    render() {
        const {getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        getFieldProps('keys', {
            initialValue: [0],
        });
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItems = getFieldValue('keys').map((k) => {
            return (
                <Form.Item {...formItemLayout} label={`好朋友${k}：`} key={k}>
                    <Input {...getFieldProps(`name${k}`, {
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: '你好友的名字捏！',
                        }],
                    }) } style={{ width: '80%', marginRight: 8 }}
                        />
                    <Button onClick={() => this.remove(k) }>删除</Button>
                </Form.Item>
            );
        });
        return (
            <AppBody>
                <Form horizontal form={this.props.form}>
                    {formItems}
                    <FormItem
                        {...formItemLayout}
                        label="角色名称"
                        hasFeedback
                        >
                        <Input type="text" {...getFieldProps('RoleName', {
                            validate: [{
                                rules: [
                                    { required: true, message: '请填写角色名称' },
                                ], trigger: ['onBlur', 'onChange'],
                            }]
                        }) }/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="单选按钮"
                        >
                        <RadioGroup {...getFieldProps("radioTest", {
                            initialValue: "false",
                            rules: [
                                { required: true, message: "请选择单选按钮" },
                            ],
                        }) }  onChange={this.onRadioChange} >
                            <Radio key= 'radio_1' value="true">是</Radio>
                            <Radio key='radio_2' value="false">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 12, offset: 7 }}
                        >
                        <Button type="primary" onClick={this.submitForm}>确定</Button>
                        &nbsp; &nbsp; &nbsp;
                        <Button type="ghost" onClick={this.submitForm}>取消</Button>
                    </FormItem>
                    <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
                        <Button onClick={this.add} style={{ marginRight: 8 }}>新增好朋友</Button>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Form.Item>
                </Form>

            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let RoleIndexPage = Form.create({})(DynamicForm);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(RoleIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);

