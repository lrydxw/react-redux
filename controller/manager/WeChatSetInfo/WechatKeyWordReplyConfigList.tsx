import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio, Upload, Popconfirm } from 'antd';
import { Sortable } from "sortable";
const  FormItem = Form.Item;
import LocalStorage from '../../../pub/LocalStorage';
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
//api
import WeChatSetInfoApi from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
const confirm = Modal.confirm;
//表单验证模块

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class WechatKeyWordReplyConfigList extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initKeyWordReplyList = this.initKeyWordReplyList.bind(this);
        this.editKeyWordReply = this.editKeyWordReply.bind(this);


        this.state = {
            WechatKeyWordReplyData: [],//列表数据
            loadingWechatKeyWordReply: false,//正在加载列表
            selectWechatKeyWordReplyIndex: -1,//选择列表序号
            selectKeyWodReplyId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            KeyWodReplyIdTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            searchPara: [
                { key: "ProductName", type: "Input", name: "课程名称", message: "课程名称" },
            ],
            searchKeywords: "",
            selectedRows: []
        };
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        this.initKeyWordReplyList();
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

    //编辑
    editKeyWordReply(Id) {
        LocalStorage.add('Id',Id);
        Tool.goPush('Manager/WeChatSetInfo/WechatNewCreatReplyConfig');
    }

    deleteWeChatKeywordInfo(id) {
        var _self = this;
        WeChatSetInfoApi.deleteWeChatKeywordContentInfo({ Id: id }).then(function (data) {
            if (data.IsOK) {
                _self.initKeyWordReplyList();
            }
            else {
                message.error(data.Message);
            }

        });
    }

    initKeyWordReplyList() {
        var _this = this;
        var obj = obj || {};
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        
        _this.state.visibleForm = false;
        _this.setState({ loadingWechatKeyWordReply: true });
        WeChatSetInfoApi.getWeChatKeywordContentListInfo(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.WechatKeyWordReplyData = functionData;
                _this.state.KeyWodReplyIdTotalCount = data.AllCount;
            }
            _this.setState({ loadingWechatKeyWordReply: false, selectedRowKeys: [] });

        });
    }
    render() {
        var _self = this;
        const KeyWordReplyColumns = [
            {
                title: '自动回复名称',
                dataIndex: 'RuleName',
                key: 'RuleName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '关键词',
                dataIndex: 'KeyWordInfo',
                key: 'KeyWordInfo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '类型',
                dataIndex: 'TypeInfo',
                key: 'TypeInfo',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a onClick={() => { _self.editKeyWordReply(record.Id) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => { _self.deleteWeChatKeywordInfo(record.Id) } }>
                            <a href="javascript:;" >删除</a>
                            </Popconfirm>
                    </span>
                ),
            }
        ]; 
        var self = this;
        const pagination = {
            total: self.state.KeyWodReplyIdTotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initKeyWordReplyList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initKeyWordReplyList();
            },
            showTotal() {
                return `共 ${self.state.KeyWodReplyIdTotalCount} 条`;
            }
        }; 
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetMenu/Index">公众号菜单</a>
                    <a className="main-content-word pull-left" href="/Manager/WeChatSetInfo/Index">公众号配置</a>
                    <a className="main-content-word pull-left set-content-word-te" >自动回复</a>
                </div>
                
          <div className="wechat-hui clearfix">
                    <a href="/Manager/WeChatSetInfo/WechatReplyConfig" className="wechat-hui-1">被关注自动回复</a>
                    <a className="wechat-hui-1 wechat-hui-act margin-left10">关键词自动回复</a>
                </div>
          <div className="width130 margin-top20">
                    <Button type="primary" size="large" className="btn" onClick={() => { this.editKeyWordReply("") }}>新建自动回复</Button>
                </div>
                <div className="row margin-top20">
                    <div className="col-xs-12">
                        <Table
                            columns={KeyWordReplyColumns}
                            dataSource={this.state.WechatKeyWordReplyData}
                            pagination={pagination}
                            loading={this.state.loadingWechatKeyWordReply}
                            
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

let WechatReplyConfigIndexPage = Form.create({})(WechatKeyWordReplyConfigList);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(WechatReplyConfigIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);


