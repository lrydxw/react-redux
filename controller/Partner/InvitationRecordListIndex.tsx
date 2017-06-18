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
class InvitationRecordList extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.initInvitationRecord = this.initInvitationRecord.bind(this);

        this.state = {
            RightsInterestsId: LocalStorage.get('RightsInterestsId'),
            visibleForm: false,//是否显示编辑或添加弹窗
            InvitationRecordListData: [],//列表数据
            loadingInvitationRecord: false,//正在加载列表
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数

        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initInvitationRecord();


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

    goToConditionsRecord(id) {
        LocalStorage.add('InvitationId', id);
        Tool.goPush('Partner/ConditionsRecordListIndex');
    }


    /**
    * 获取列表数据
    */
    initInvitationRecord() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.RightsInterestsId = _this.state.RightsInterestsId;
        _this.state.loadingInvitationRecord = true;

        PartnerApi.getInvitationRecord(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.InvitationRecordListData = data.Value.GetInvitationRecordList;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingInvitationRecord: false, selectedRowKeys: [] });

        });
    }





    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };



        const PartnerColumns = [
            {
                title: '标题',
                dataIndex: 'Title',
                key: 'Title',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '开通数量',
                dataIndex: 'OpenCount',
                key: 'OpenCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '领取数量',
                dataIndex: 'GetConditionsCount',
                key: 'GetConditionsCount',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '当前状态',
                dataIndex: 'InvitationStatus',
                key: 'InvitationStatus',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '添加时间',
                dataIndex: 'AddTime',
                key: 'AddTime',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>

                        <a onClick={() => { this.goToConditionsRecord(record.Id) } }>查看领取记录</a>

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
                self.initInvitationRecord();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initInvitationRecord();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">

                    <Menu
                        selectedKeys={["PartnerManageIndex"]}
                        mode="horizontal"
                        >
                        <Menu.Item key="PartnerManageIndex">
                            <a href="PartnerManageIndex" rel="noopener noreferrer">合作伙伴</a>
                        </Menu.Item>

                        <Menu.Item key="PartnerSetIndex">
                            <a href="PartnerSetIndex" rel="noopener noreferrer">合作伙伴设置</a>
                        </Menu.Item>
                    </Menu>


                </div>
                <div className="row margin-top20 margin-btm20">

                </div>
                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={PartnerColumns}
                            dataSource={this.state.InvitationRecordListData}
                            pagination={pagination}
                            loading={this.state.loadingInvitationRecord}
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

let PartnerRightsListIndexPage = Form.create({})(InvitationRecordList);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(PartnerRightsListIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
