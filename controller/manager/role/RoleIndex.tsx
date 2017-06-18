import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Menu, Checkbox } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import ManagerRoleApi from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母比较大写），相当于java中的类的声明
 */
class RoleIndex extends BaseContainer {
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
        this.initRoleList = this.initRoleList.bind(this);
        this.initMenuList = this.initMenuList.bind(this);
        this.saveRole = this.saveRole.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.selectRoleChange = this.selectRoleChange.bind(this);

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            roleListData: [],//权限列表数据
            menuListData: [],//菜单数据
            selectRoleId: "",//当前选择的角色Id
            selectRoleName: "",//当前选择的角色名称
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
        this.initMenuList();
    }

    //插入真实DOM之后被执行
    componentDidMount() {
        this.initRoleList();
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
    /** 获取角色列表*/
    initRoleList() {
        var _this = this;
        _this.state.visibleForm = false;
        ManagerRoleApi.getRoleInfo({}).then(function (data) {
            if (data.IsOK) {
                var roleData = [];
                if (Array.isArray(data.Value)) {
                    roleData = data.Value;
                }
                if (roleData[0].PermissionString) {
                    var permData = roleData[0].PermissionString.split(",");
                    for (var i = 0; i < permData.length; i++) {
                        $("input:checkbox[value='" + permData[i] + "']").prop("checked", true);
                    }
                } else {
                    $("input[name='permission']").prop("checked", false);
                }
                _this.setState({ roleListData: roleData, selectRoleId: roleData[0].Id, selectRoleName: roleData[0].RoleName });
            }
        });
    }
    /**
     * 获取菜单列表
     */
    initMenuList() {
        var _this = this;
        ManagerRoleApi.getMenuList({}).then(function (data) {
            if (data.IsOK) {
                _this.setState({ menuListData: data.Value });
            }
        });
    }
    /**
     * 提交角色数据
     */
    submitForm() {
        var _this = this;
        var form = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            console.log('收到表单值：', obj);
            if (_this.state.isInsert) {
                ManagerRoleApi.insertRoleInfo(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initRoleList();
                    } else {
                        message.error(data.Message);
                    }
                });
            } else {
                obj.Id = _this.state.selectRoleId;
                ManagerRoleApi.updateRoleName(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initRoleList();
                    } else {
                        message.error(data.Message);
                    }
                });
            }
        });
    }
    /**
     * 删除角色
     * @param roleid
     */
    deleteRole(roleid) {
        var _this = this;
        var obj = { Id: roleid };
        ManagerRoleApi.deleteRole(obj).then(function (data) {
            if (data.IsOK) {
                _this.initRoleList();
            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 保存权限
     */
    saveRole() {
        var _this = this;
        var Permission = [];
        $("input[name='permission']:checked").each(function () {
            Permission.push($(this).val());
        })
        var obj = { Id: _this.state.selectRoleId, PermissionString: Permission.join(",") };
        ManagerRoleApi.updatePermission(obj).then(function (data) {
            if (data.IsOK) {
                Modal.success({
                    title: '操作成功',
                    content: '角色权限设置已保存',
                    onOk() {
                        _this.initRoleList();
                    },
                });
            } else {
                message.error(data.Message);
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
    openEditForm(Id, RoleName) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        _this.state.selectRoleId = Id;
        setFieldsValue({ "RoleName": RoleName });
        _this.setState({ isInsert: false, visibleForm: true });
        return false;
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        var _this = this;
        _this.props.form.resetFields();
        _this.setState({ isInsert: true, visibleForm: true });
        return false;
    }
    /**
     * 选择角色
     * @param Id
     * @param RoleName
     * @param PermissionString
     */
    selectRoleChange(Id, RoleName, PermissionString) {
        var _this = this;
        _this.setState({ selectRoleId: Id, selectRoleName: RoleName });
        if (PermissionString) {
            $("input[name='permission']").prop("checked", false);
            var permData = PermissionString.split(",");
            for (var i = 0; i < permData.length; i++) {
                $("input:checkbox[value='" + permData[i] + "']").prop("checked", true);
            }
        } else {
            $("input[name='permission']").prop("checked", false);
        }
    }
    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        var self = this;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">角色管理</a>
                </div>
                <div className="row  margin-top20 margin-btm20">
                    <div className="col-lg-11 col-sm-12">
                        <i className="nav-collapse-title-sign"></i>
                        <span className="margin-right15">角色</span>
                    </div>
                    <div className="col-lg-1 col-sm-12">
                        <div className="clearfix">
                            <Button type="primary" size="large" className="btn btn-block" onClick={this.saveRole}>保存</Button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 add-block clearfix">
                        {this.state.roleListData.map(function (item, i) {
                            return (
                                <a key={item.Id} className={self.state.selectRoleId == item.Id ? "add-block-con pull-left add-block-active" : "add-block-con pull-left"} onClick={() => { self.selectRoleChange(item.Id, item.RoleName, item.PermissionString) } } >{item.RoleName}</a>
                            );
                        })}
                        <a className="add-block-con pull-left" onClick={this.openInsertForm}><img src="/Content/images/add.png" className="center-block" /></a>
                    </div>
                </div>
                <hr style={{ margin: "20px 0" }} />
                <div className="row  margin-top20 margin-btm20">
                    <div className="col-xs-12">
                        <i className="nav-collapse-title-sign"></i>
                        <span className="margin-right15 margin-left5">{this.state.selectRoleName}</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        {this.state.menuListData.length > 0 ?
                            this.state.menuListData.map(function (item, i) {
                                return (<table className="table table-striped" key={"table_" + item.value}>
                                    <tbody>
                                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                                            <td>
                                                <span className="checkboxes">
                                                    <label className="itemLabel">
                                                        <input type="checkbox" name="permission" value={item.value} /><span className="margin-left5">{item.label}</span>
                                                    </label>
                                                </span>
                                            </td>
                                        </tr>
                                        {item.children && item.children.length > 0 ?
                                            item.children.map(function (children, j) {
                                                return (<tr key={"table_tr_" + children.value}>
                                                    <td className="padding-left15">
                                                        <div className="row margin0">
                                                            <div className="col-xs-12">
                                                                <span className="checkboxes pull-left margin-right20 margin-btm10">
                                                                    <label className="childrenLabel">
                                                                        <input type="checkbox" name="permission" value={children.value} /><span className="margin-left5">{children.label}</span>
                                                                    </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="row margin-left30">
                                                            {children.children && children.children.length > 0 ?
                                                                children.children.map(function (child, k) {
                                                                    return (<div className="col-xs-2" key={"table_tr_div_" + child.value}>
                                                                        <span className="checkboxes pull-left margin-right20 margin-btm10">
                                                                            <label>
                                                                                <input type="checkbox" name="permission" value={child.value} /><span className="margin-left5">{child.label}</span>
                                                                            </label>
                                                                        </span>
                                                                    </div>);
                                                                }) : ""
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>);
                                            }) : ""
                                        }
                                    </tbody>
                                </table>);
                            }) : ""
                        }
                    </div>
                </div>

                <Modal title={this.state.isInsert ? "添加角色" : "修改角色"} visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm} >
                    <Form horizontal>
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
                            }) } />
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

let RoleIndexPage = Form.create({})(RoleIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(RoleIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);

