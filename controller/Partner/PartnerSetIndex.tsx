import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button, Popconfirm } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';
//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import PartnerApi from './Api';
import AgencyManageApi from '../User/AgencyManageApi';
import MemberSetInfoApi from '../manager/MemberSetInfo/Api';
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
class PartnerSetIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initPartnerTypeList = this.initPartnerTypeList.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.openInsertForm = this.openInsertForm.bind(this);
        this.closePartnerTypeForm = this.closePartnerTypeForm.bind(this);
        this.loadSelectMemberLevelData = this.loadSelectMemberLevelData.bind(this);
        this.submitPartnerTypeForm = this.submitPartnerTypeForm.bind(this);
        this.loadPartnerSetFromDb = this.loadPartnerSetFromDb.bind(this);
        this.openEditPartnerMaxQuotaProportionForm = this.openEditPartnerMaxQuotaProportionForm.bind(this);
        this.closePartnerMaxQuotaProportionForm = this.closePartnerMaxQuotaProportionForm.bind(this);
        this.loadPartnerMaxQuotaProportionFromDb = this.loadPartnerMaxQuotaProportionFromDb.bind(this);
        this.submitPartnerMaxQuotaProportionForm = this.submitPartnerMaxQuotaProportionForm.bind(this);
        this.deletePartnerType = this.deletePartnerType.bind(this);

        let formPartnerSetElements: FormElement[] = [
            { key: "TypeName", element: ElementEnum.Input, type: "string", label: "名称", message: "请输入名称", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "RebateProportion", addonAfter: "%", element: ElementEnum.Input, type: "string", label: "返利比例", message: "请输入返利比例", rules: { required: true, whitespace: true, validator: this.checkNumberMax }, dataList: [] },
            { key: "RightsDescription", element: ElementEnum.Editor, type: "string", label: "权益描述", message: "请输入权益描述", rules: { required: true, whitespace: true }, dataList: [] },
        ];

        let formPartnerMaxQuotaProportionElements: FormElement[] = [
            { key: "PartnerMaxQuotaProportion", element: ElementEnum.Input, addonAfter: "%", type: "string", label: "最高限额", message: "请输入最高限额", rules: { required: true, whitespace: true, validator: this.checkNumberMax }, dataList: [] },

        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            PartnerTypeListData: [],//列表数据
            loadingPartnerType: false,//正在加载列表
            selectCourseIndex: -1,//选择列表序号
            selectCourseId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            selectMemberLevelData: [],
            partnerSetDefaultValues: {},
            partnerSetData: formPartnerSetElements,
            editId: -1,
            editNextId: -1,

            visibleEditPartnerMaxQuotaProportionForm: false,
            partnerMaxQuotaProportionDefaultValues: {},
            partnerMaxQuotaProportionData: formPartnerMaxQuotaProportionElements,
            editPartnerMaxQuotaProportionId: -1,

        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initPartnerTypeList();
        //this.loadSelectMemberLevelData();
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

        if (_this.state.editPartnerMaxQuotaProportionId !== _this.state.editNextId && _this.state.visibleEditPartnerMaxQuotaProportionForm === true) {

            _this.loadPartnerMaxQuotaProportionFromDb();
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
    initPartnerTypeList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;

        _this.state.loadingPartnerType = true;

        PartnerApi.getPartnerTypeSetPageList(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.PartnerTypeListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingPartnerType: false, selectedRowKeys: [] });

        });
    }


   

    loadSelectMemberLevelData() {
        var _this = this;

        AgencyManageApi.getMemberLevelSelectData({}).then(function (data) {
            if (data.IsOK) {

                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].Name, value: String(data.Value[i].Level) });
                }

                _this.state.partnerSetData[1].dataList = arrayData;


            } else {
                message.error(data.Message);
            }
        });
    }

    loadPartnerSetFromDb(id) {
        var _this = this
        PartnerApi.getPartnerSet({ Id: id }).then(function (data) {
            if (data.IsOK) {
                data.Value.RebateProportion = String(data.Value.RebateProportion);
                data.Value.MaxCount = String(data.Value.MaxCount);
                //data.Value.InfiniteRebateProportion = String(data.Value.InfiniteRebateProportion);
                _this.setState({ partnerSetDefaultValues: data.Value, editId: id, });
            } else {
                message.error(data.Message);
            }
        });
    }

    loadPartnerMaxQuotaProportionFromDb() {
        var _this = this
        PartnerApi.getPartnerMaxQuotaProportion({}).then(function (data) {
            if (data.IsOK) {

                _this.setState({ partnerMaxQuotaProportionDefaultValues: { PartnerMaxQuotaProportion: String(data.Value) }, editId: 1, });
            } else {
                message.error(data.Message);
            }
        });
    }


    submitPartnerTypeForm(obj) {
        var _this = this;

        if (_this.state.isInsert) {
            PartnerApi.insertPartnerTypeSet(obj).then(function (data) {
                if (data.IsOK) {
                    _this.state.visibleForm = false;
                    _this.initPartnerTypeList();
                } else {
                    message.error(data.Message);
                }
            });
        }
        else {
            obj.Id = _this.state.editId;
            PartnerApi.updatePartnerTypeSet(obj).then(function (data) {
                if (data.IsOK) {
                    _this.state.visibleForm = false;
                    _this.initPartnerTypeList();
                } else {
                    message.error(data.Message);
                }
            });
        }
    }


    submitPartnerMaxQuotaProportionForm(obj) {
        var _this = this;
        PartnerApi.setPartnerMaxQuotaProportion(obj).then(function (data) {
            if (data.IsOK) {
                _this.setState({ visibleEditPartnerMaxQuotaProportionForm: false });
            } else {
                message.error(data.Message);
            }
        });

    }

    /**
    * 验证整数
    */
    checkNumberMax(rule, value, callback) {
        if (value && (!(/^\d+$/).test(value.toString().trim()))) {
            callback('请输入整数。');
        }
        else if (parseFloat(value) > 100 || parseFloat(value) < 0) {
            callback('输入的范围在0-100。');
        }
        else {
            callback();
        }
    }

    /**
   * 验证整数或小数
   */
    checkFloat(rule, value, callback) {
        if (value) {
            if (!(/^\d+(\.\d+)?$/).test(value.toString().trim())) {
                callback('请输入整数或小数。');
            }
            else if (parseFloat(value) > 1 || parseFloat(value) < 0) {
                callback('输入的范围在0-1。');
            }
        }
        callback();
    }

    //关闭添加编辑窗口
    closePartnerTypeForm() {
        this.setState({ visibleForm: false });
    }

    //关闭添加编辑窗口
    closePartnerMaxQuotaProportionForm() {
        this.setState({ visibleEditPartnerMaxQuotaProportionForm: false });
    }

    openEditPartnerMaxQuotaProportionForm(record) {

        this.setState({ visibleEditPartnerMaxQuotaProportionForm: true, editNextId: -1, editPartnerMaxQuotaProportionId: 1 });
    }


    //打开添加编辑窗口
    openInsertForm() {
        this.setState({ visibleForm: true, isInsert: true, partnerSetDefaultValues: {} });

    }

    openEditForm(record) {

        this.setState({ isInsert: false, visibleForm: true, editNextId: -1, editId: record.Id });
    }

    deletePartnerType(id)
    {
        var _this = this;
        PartnerApi.deletePartnerType({ Id: id }).then(function (data) {
            if (data.IsOK) {
                _this.initPartnerTypeList();

            } else {
                if (data.Message == "PartnerTypeDelete_PartnerTypeHasBeenApplied") {
                    Modal.error({
                        title: '请手下留情',
                        content: '该合作伙伴类型已经被使用了',

                    });
                }
                else {
                    message.error(data.Message);
                }
            }
        });
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };



        const availableIncomeProps = getFieldProps('MinAvailableIncome', {
            validate: [{
                rules: [
                    { validator: this.checkFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const startTimeProps = getFieldProps('StartTime', {

        });

        const endTimeProps = getFieldProps('EndTime', {

        });


        const PartnerTypeSetColumns = [

            {
                title: '名称',
                dataIndex: 'TypeName',
                key: 'TypeName',
                render: (text) => <span> {text}</span>,
            },
          
            {
                title: '返利比例',
                dataIndex: 'RebateProportion',
                key: 'RebateProportion',
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
                        <a onClick={() => { this.openEditForm(record) } }>查看编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => { this.deletePartnerType(record.Id) } }>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
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
                self.initPartnerTypeList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initPartnerTypeList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Partner/PartnerManageIndex">合作伙伴</a>
                    <a className="main-content-word pull-left set-content-word-te">合作伙伴设置</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" onClick={this.openInsertForm}>创建伙伴</Button>
                    </div>
                  
                </div>


                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={PartnerTypeSetColumns}
                            dataSource={this.state.PartnerTypeListData}
                            pagination={pagination }
                            loading={this.state.loadingPartnerType}
                            rowKey={record => record.Id}

                            />
                    </div>
                </div>



                <Modal title={this.state.isInsert ? "添加伙伴" : "编辑伙伴"} width={800} visible={this.state.visibleForm} maskClosable={false} onCancel={this.closePartnerTypeForm} footer={[]} >
                    <FormTemplate formElements={this.state.partnerSetData} defaultValues={this.state.partnerSetDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitPartnerTypeForm}  onCancel={this.closePartnerTypeForm}></FormTemplate>
                </Modal>

                <Modal title="设置最高限额" visible={this.state.visibleEditPartnerMaxQuotaProportionForm} maskClosable={false} onCancel={this.closePartnerMaxQuotaProportionForm} footer={[]} >
                    <FormTemplate formElements={this.state.partnerMaxQuotaProportionData} defaultValues={this.state.partnerMaxQuotaProportionDefaultValues} isInsert={false} editId={this.state.editPartnerMaxQuotaProportionId} onSubmit={this.submitPartnerMaxQuotaProportionForm}  onCancel={this.closePartnerMaxQuotaProportionForm}></FormTemplate>
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

let PartnerSetIndexPage = Form.create({})(PartnerSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(PartnerSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
