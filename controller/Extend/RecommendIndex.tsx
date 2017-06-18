﻿import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api

import CrmApi from './CrmApi';

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
class RecommendIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.initRecommendList = this.initRecommendList.bind(this);
      

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            RecommendListData: [],//列表数据
            loadingRecommend: false,//正在加载列表
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
        this.initRecommendList();
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

    //回访明细
    visitDetail(id) {
        LocalStorage.add('LeaveMsgId', id);
        Tool.goPush('Extend/RecommendVisitDetail');
    }

    /**
    * 获取列表数据
    */
    initRecommendList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
      
        _this.state.loadingRecommend = true;

        CrmApi.getCrmLeaveMsgList(obj).then(function (data) {
            if (data.IsOK) {
               
                _this.state.RecommendListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingRecommend: false, selectedRowKeys: [] });

        });

       
    }


    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

       

        const RecommendColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '微信号',
                dataIndex: 'wechat',
                key: 'wechat',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '创建时间',
                dataIndex: 'addtime',
                key: 'addtime',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    if (record.state == '已转换') return (
                        <span>
                            <a href="javascript:;" onClick={(event) => { this.visitDetail(record.id) } }>回访明细</a>
                        </span>
                    )
                },
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
                self.initRecommendList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initRecommendList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>

                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">查看我推荐的人</a>
                </div>
                <div className="row margin-top20 margin-btm20">

                </div>
                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={RecommendColumns}
                            dataSource={this.state.RecommendListData}
                            pagination={pagination}
                            loading={this.state.loadingRecommend}
                          
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

let RecommendIndexPage = Form.create({})(RecommendIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(RecommendIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
