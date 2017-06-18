import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Tool from '../../../pub/Tool';
import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { Popconfirm, message, Switch, Radio, Select, Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';

//api
import ManagerAccountApi from './ManagerAccountApi';
//表单验证模块
import RegExpVerify from '../../../pub/RegExpVerify';
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
//角色Api
import ManagerRoleApi from '../role/Api';

/**
 * 定义组件（首字母比较大写），相当于java中的类的声明
 */
class ManagerAccountIndex extends BaseContainer {
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
        this.initManagerAccountList = this.initManagerAccountList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deleteManagerAccount = this.deleteManagerAccount.bind(this);
        this.initRoleListData = this.initRoleListData.bind(this);
        this.inputonChange = this.inputonChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.checkPass = this.checkPass.bind(this);
        this.checkPass2 = this.checkPass2.bind(this);
        this.batchDeleteManagerAccount = this.batchDeleteManagerAccount.bind(this);
        this.checkIsMonitor = this.checkIsMonitor.bind(this);
        this.searchData = {};

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            ManagerAccountListData: [],//列表数据
            loadingManagerAccount: false,//正在加载列表
            selectManagerAccountIndex: -1,//选择列表序号
            selectManagerAccountId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            ManagerAccountTotal: 0,
            PageIndex: 1,
            PageSize: 10,
            RoleListData: [],
            Keywords: "",
            ConfirmPasswordRequired: false, //是否验证重复密码
            IsMonitorRequired: false,//是否验证班长信息
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initManagerAccountList();
        this.initRoleListData();
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
    /**
     * 获取列表数据
     */
    initManagerAccountList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.Keywords = _this.state.Keywords;
        if (obj.Keywords)//有关键词从第一页查询
            obj.PageIndex = 1;

        _this.state.visibleForm = false;
        _this.setState({ loadingManagerAccount: true });
        ManagerAccountApi.getManagerAccountList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.ManagerAccountListData = functionData;
                _this.state.ManagerAccountTotal = data.AllCount;
            }
            _this.setState({ loadingManagerAccount: false });

        });
    }
    /**
     * 获取角色数据
     */
    initRoleListData() {
        var _this = this;
        ManagerRoleApi.getRoleInfo({}).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData.push({ key: "", label: "请选择角色" })
                    for (var i = 0; i < data.Value.length; i++) {
                        functionData.push({ key: data.Value[i].Id, label: data.Value[i].RoleName });
                    }
                }
                console.log(functionData);
                _this.state.RoleListData = functionData;
            }

        });
    }
    /**
     * 提交数据
     */
    submitForm() {
        var _this = this;
        var form = _this.props.form;
        const { getFieldValue, validateFields } = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                if (_this.state.IsMonitorRequired) {
                    console.log(JSON.stringify(errors));
                    console.log('Errors in form!!!');
                    return;
                } else {
                    if (!errors.MonitorNickName || !errors.MonitorWeChatAccount || !errors.MonitorQRCodeImg || !errors.HeadImgURL) {
                        console.log(JSON.stringify(errors));
                        console.log('Errors in form!!!');
                        return;
                    }
                }
            }
            var obj = form.getFieldsValue();
            obj.ConfirmPassword = getFieldValue("ConfirmPassword") || "";
            console.log('收到表单值：', obj);
            if (_this.state.isInsert) {
                ManagerAccountApi.insertManagerAccount(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initManagerAccountList();
                    } else {
                        message.error(data.Message);
                    }
                });
            } else {
                obj.Id = _this.state.selectManagerAccountId;
                ManagerAccountApi.updateManagerAccount(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initManagerAccountList();
                    } else {
                        message.error(data.Message);
                    }
                });
            }
        });
    }
    /**
     * 删除
     * @param Id
     */
    deleteManagerAccount(Id) {
        var _this = this;
        var obj = { Id: Id };
        ManagerAccountApi.deleteManagerAccount(obj).then(function (data) {
            if (data.IsOK) {
                _this.initManagerAccountList();
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
    openEditForm(record) {
        var _this = this;
        const { setFieldsValue, resetFields } = _this.props.form;
        var obj = { Id: record.Id };
        ManagerAccountApi.getManagerAccount(obj).then(function (data) {
            if (data.IsOK) {
                record = data.Value;
                console.log(record);
                setFieldsValue({
                    "UserName": record.UserName, "Mobile": record.Mobile, "RealName": record.RealName, "IsMonitor": String(record.IsMonitor), "IsMonitorOnline": String(record.IsMonitorOnline),
                    "MonitorWeChatAccount": record.MonitorWeChatAccount, "MonitorNickName": record.MonitorNickName, "MonitorQRCodeImg": record.MonitorQRCodeImg, "RoleId": record.RoleId,
                    "Password": "", "ConfirmPassword": "", "HeadImgURL": record.HeadImgURL
                });
                var monitorQRCodeImg = [{
                    uid: record.Id,
                    name: record.MonitorNickName,
                    status: 'done',
                    url: record.MonitorQRCodeImg,
                }];
                var headImgURL = [{
                    uid: record.Id,
                    name: record.HeadImgURL,
                    status: 'done',
                    url: record.HeadImgURL,
                }];
                _this.setState({ isInsert: false, visibleForm: true, ConfirmPasswordRequired: false, IsMonitorRequired: record.IsMonitor });
                if (record.MonitorQRCodeImg)
                    _this.setState({ MonitorQRCodeImgFileList: monitorQRCodeImg });
                if (record.HeadImgURL)
                    _this.setState({ HeadImgURLFileList: headImgURL });
                resetFields(['ConfirmPassword']);
            }
        });
        return false;
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        this.props.form.resetFields();
        const { setFieldsValue, resetFields } = this.props.form;
        this.setState({ isInsert: true, visibleForm: true, MonitorQRCodeImgFileList: [], HeadImgURLFileList: [], ConfirmPasswordRequired: false, IsMonitorRequired: false });
        setFieldsValue({ "IsMonitor": "false" });
        resetFields(['ConfirmPassword']);
        return false;
    }
    /**
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }

    inputonChange(e) {
        var _this = this;
        _this.state.Keywords = e.target.value;
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    /**
     * 验证密码
     * @param rule
     * @param value
     * @param callback
     */
    checkPass(rule, value, callback) {
        var _this = this;
        const { validateFields, resetFields, getFieldValue } = this.props.form;
        if (value) {
            _this.state.ConfirmPasswordRequired = true;
            //validateFields(['rePassword'], { force: true });
            if (value.length < 6 || value.length > 20) {
                callback('长度只能在6-20个字符之间！');
            } else {
                if (getFieldValue('ConfirmPassword') && value !== getFieldValue('ConfirmPassword')) {
                    callback('两次输入密码不一致！');
                } else {
                    callback();
                }
            }
        } else {
            _this.state.ConfirmPasswordRequired = false;
            resetFields(['ConfirmPassword']);
        }
        callback();
    }
    /**
     * 验证重复密码
     * @param rule
     * @param value
     * @param callback
     */
    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('Password')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }
    /**
     * 批量删除
     */
    batchDeleteManagerAccount() {
        var _this = this;
        var obj = { Id: _this.state.selectedRowKeys };
        confirm({
            title: "确定要删除吗？",
            onOk() {
                ManagerAccountApi.batchDeleteManagerAccount(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initManagerAccountList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }
    checkIsMonitor(rule, value, callback) {
        var _this = this;
        const { validateFields, resetFields } = _this.props.form;
        if (value == "true") {
            _this.state.IsMonitorRequired = true;
        } else {
            _this.state.IsMonitorRequired = false;
        }
        callback();
    }
    render() {
        const { getFieldProps, getFieldValue, resetFields, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const ManagerAccountColumns = [
            {
                title: '真实姓名',
                dataIndex: 'RealName',
                key: 'RealName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '登录名',
                dataIndex: 'UserName',
                key: 'UserName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '手机',
                dataIndex: 'Mobile',
                key: 'Mobile',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '是否班长',
                dataIndex: 'IsMonitor',
                key: 'IsMonitor',
                render: (text) => <span> {text ? '是' : '否'}</span>,
            },
            {
                title: '班长昵称',
                dataIndex: 'MonitorNickName',
                key: 'MonitorNickName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '班长微信号',
                dataIndex: 'MonitorWeChatAccount',
                key: 'MonitorWeChatAccount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '角色',
                dataIndex: 'RoleName',
                key: 'RoleName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.openEditForm(record) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => { this.deleteManagerAccount(record.Id) } }>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        var self = this;
        const pagination = {
            total: self.state.ManagerAccountTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initManagerAccountList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initManagerAccountList();
            },
            showTotal() {
                return `共 ${self.state.ManagerAccountTotal} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        var reactid = 0;
        var selectItems = self.state.RoleListData.map(function (item) {
            return (
                <Option key={'li_' + reactid++} value={item.key}>{item.label}</Option>
            );
        });
        const logoProps = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            data: {
                type: 'course',
                format: 'large'
            },
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["MonitorQRCodeImgFileList"],
            onChange: (info) => {
                let fileList = info.fileList;
                if (fileList.length > 1) {
                    fileList = [info.fileList[info.fileList.length - 1]];
                }
                // 1. 上传列表数量的限制
                //    只显示最近上传的一个，旧的会被新的顶掉
                fileList = fileList;
                // 2. 读取远程路径并显示链接
                fileList = fileList.map((file) => {
                    console.log("fileList：" + fileList.length);
                    if (file.response) {
                        // 组件会将 file.url 作为链接进行展示  
                        file.url = file.response.url;
                    }
                    return file;
                });
                // 3. 按照服务器返回信息筛选成功上传的文件
                fileList = fileList.filter((file) => {
                    console.log("filter：" + fileList.length);
                    //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                    if (file.response) {
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "MonitorQRCodeImg";
                var obj = {};
                var val = "";
                if (fileList.length > 0) {
                    fileList.map(function (file, i) {
                        if (i === 0) {
                            val += file.url;
                        }
                        else {
                            val += "," + file.url;
                        }
                    });
                }
                obj[key] = val;
                setFieldsValue(obj);
                this.setState({ MonitorQRCodeImgFileList: fileList });
            },
            listType: "picture-card",
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }
        };
        const headImgURLProps = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            data: {
                type: 'course',
                format: 'large'
            },
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["HeadImgURLFileList"],
            onChange: (info) => {
                let fileList = info.fileList;
                if (fileList.length > 1) {
                    fileList = [info.fileList[info.fileList.length - 1]];
                }
                // 1. 上传列表数量的限制
                //    只显示最近上传的一个，旧的会被新的顶掉
                fileList = fileList;
                // 2. 读取远程路径并显示链接
                fileList = fileList.map((file) => {
                    console.log("fileList：" + fileList.length);
                    if (file.response) {
                        // 组件会将 file.url 作为链接进行展示  
                        file.url = file.response.url;
                    }
                    return file;
                });
                // 3. 按照服务器返回信息筛选成功上传的文件
                fileList = fileList.filter((file) => {
                    console.log("filter：" + fileList.length);
                    //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                    if (file.response) {
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "HeadImgURL";
                var obj = {};
                var val = "";
                if (fileList.length > 0) {
                    fileList.map(function (file, i) {
                        if (i === 0) {
                            val += file.url;
                        }
                        else {
                            val += "," + file.url;
                        }
                    });
                }
                obj[key] = val;
                setFieldsValue(obj);
                this.setState({ HeadImgURLFileList: fileList });
            },
            listType: "picture-card",
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }
        };
        const monitorNickNameProps = getFieldProps('MonitorNickName', {
            validate: [{
                rules: [
                    { required: this.state.IsMonitorRequired, message: '请填写班长昵称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const monitorWeChatAccountProps = getFieldProps('MonitorWeChatAccount', {
            validate: [{
                rules: [
                    { required: this.state.IsMonitorRequired, message: '请填写班长微信号' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const monitorQRCodeImgProps = getFieldProps('MonitorQRCodeImg', {
            validate: [{
                rules: [
                    { required: this.state.IsMonitorRequired, message: '请上传班长二维码' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const headImgProps = getFieldProps('HeadImgURL', {
            validate: [{
                rules: [
                    { required: this.state.IsMonitorRequired, message: '请上传班长头像' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const isMonitorOnlineProps = getFieldProps('IsMonitorOnline', {
            validate: [{
                rules: [
                    { required: this.state.IsMonitorRequired, message: '请选择班长是否在线' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        })
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">管理人员</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={this.openInsertForm}>添加管理员</Button>
                    </div>
                    <div className="col-xs-3 col-xs-offset-7">
                        <div className="input-group">
                            <Input type="text" className="form-control search-fill" placeholder="搜索" onChange={this.inputonChange} style={{ height: 34 }} onPressEnter={this.initManagerAccountList} />
                            <span className="input-group-addon  search-btn" onClick={this.initManagerAccountList}>
                                <i className="fa fa-search" ></i>
                            </span>
                            <div>
                                <a href="/Manager/Role/Index" className="btn btn-info pull-right margin-left5">管理角色</a>
                            </div>
                        </div>
                    </div>
                </div>
                <Row>
                    <Col>
                        <Table
                            rowKey={record => record.Id}
                            columns={ManagerAccountColumns}
                            dataSource={this.state.ManagerAccountListData}
                            pagination={pagination}
                            loading={this.state.loadingManagerAccount}
                            rowSelection={rowSelection}
                            footer={() => <Button disabled={!hasSelected} onClick={this.batchDeleteManagerAccount}>删除</Button>}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    this.setState({
                                        selectManagerAccountIndex: index,
                                        selectManagerAccountId: record.Id
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectManagerAccountIndex ? " ant-table-row-active " : "";
                                }
                            }
                            />
                    </Col>
                </Row>

                <Modal title={this.state.isInsert ? "添加管理人员" : "修改管理人员"} visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm} maskClosable={false} >
                    <Form horizontal>
                        <FormItem
                            {...formItemLayout}
                            label="真实姓名"
                            hasFeedback
                            >
                            <Input type="text" placeholder="真实姓名" {...getFieldProps('RealName', {
                                validate: [{
                                    rules: [
                                        { required: true, min: 2, max: 16, message: '请填写真实姓名(长度【2-16】)' },
                                    ], trigger: ['onBlur', 'onChange'],
                                }]
                            }) } />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="登录名"
                            hasFeedback
                            >
                            <Input type="text" placeholder="登录名" {...getFieldProps('UserName', {
                                validate: [{
                                    rules: [
                                        { required: true, min: 4, max: 16, message: '请填写登录名(长度【4-16】)' },
                                    ], trigger: ['onBlur', 'onChange'],
                                }]
                            }) } />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机"
                            hasFeedback
                            >
                            <Input type="text" placeholder="手机" {...getFieldProps('Mobile', {
                                validate: [{
                                    rules: [
                                        { required: true, message: '请填写手机号' },
                                        { validator: RegExpVerify.checkMobile },
                                    ], trigger: ['onBlur', 'onChange'],
                                }]
                            }) } />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            hasFeedback
                            >
                            <Input type="password" placeholder="密码" {...getFieldProps('Password', {
                                validate: [{
                                    rules: [
                                        { required: false, message: '请填写密码' },
                                        { validator: this.checkPass },
                                    ], trigger: ['onChange'],
                                }]
                            }) } />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="确认密码"
                            hasFeedback
                            >
                            <Input type="password" placeholder="确认密码" {...getFieldProps('ConfirmPassword', {
                                validate: [{
                                    rules: [
                                        { required: this.state.ConfirmPasswordRequired, message: '请填写确认密码' },
                                        { validator: this.checkPass2 },
                                    ], trigger: ['onChange'],
                                }]
                            }) } />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="是否班长"
                            hasFeedback
                            >
                            <RadioGroup {...getFieldProps('IsMonitor', {
                                validate: [{
                                    rules: [
                                        { required: true, message: '请选择是否班长' },
                                        { validator: this.checkIsMonitor },
                                    ], trigger: ['onBlur', 'onChange'],
                                }]
                            }) }>
                                <Radio key="IsMonitor_1" value="true">是</Radio>
                                <Radio key="IsMonitor_0" value="false">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <div style={{ display: getFieldValue("IsMonitor") == "true" ? "" : "none" }}>
                            <FormItem
                                {...formItemLayout}
                                label="班长昵称"
                                hasFeedback
                                >
                                <Input type="text" placeholder="班长昵称" {...monitorNickNameProps} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="班长微信号"
                                hasFeedback
                                >
                                <Input type="text" placeholder="班长微信号" {...monitorWeChatAccountProps} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="班长二维码"
                                >
                                <Input type="hidden" placeholder="班长二维码" {...monitorQRCodeImgProps} />
                                <div>
                                    <Upload {...logoProps} name="upload" >
                                        <Icon type="plus" />
                                        <div className="ant-upload-text" >班长二维码</div>
                                    </Upload>
                                    <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" src={this.state.priviewImage} />
                                    </Modal>
                                </div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="班长头像"
                                >
                                <Input type="hidden" placeholder="班长头像" {...headImgProps } />
                                <div>
                                    <Upload {...headImgURLProps} name="upload" >
                                        <Icon type="plus" />
                                        <div className="ant-upload-text" >班长头像</div>
                                    </Upload>
                                    <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" src={this.state.priviewImage} />
                                    </Modal>
                                </div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="班长是否在线"
                                hasFeedback
                                >
                                <RadioGroup {...isMonitorOnlineProps}>
                                    <Radio key="IsMonitorOnline_1" value="true">是</Radio>
                                    <Radio key="IsMonitorOnline_0" value="false">否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </div>
                        <FormItem
                            {...formItemLayout}
                            label="用户权限"
                            >
                            <Select placeholder="请选择角色" {...getFieldProps('RoleId', {
                                validate: [{
                                    rules: [
                                        { required: true, message: '请选择角色' },
                                    ], trigger: ['onChange'],
                                }]
                            }) } >
                                {selectItems}
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

let ManagerAccountIndexPage = Form.create({})(ManagerAccountIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ManagerAccountIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
