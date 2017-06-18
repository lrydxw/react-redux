// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
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
import PromotionTemplateAPI from './PromotionTemplateAPI';
//表单验证模块
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;



/**
 * 定义组件（首字母比较大写），相当于java中的类的声明
 */
class PromotionTemplateIndex extends BaseContainer {
    //初始化加载
    searchData: any;
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.GetPromotionTypeList = this.GetPromotionTypeList.bind(this);   //获取系统设置好的模板类型   

        this.searchData = {};
        this.state = {
            ListData: [],//列表数据
            loading: false,//正在加载列表
            selectCourseIndex: -1,//选择列表序号
            selectCourseId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数      
            selectedRows: []
        }
    }

    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.GetPromotionTypeList();
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
 * 获取系统中设置的模板类型列表
 */
    GetPromotionTypeList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;    
         _this.state.visibleForm = false;
        _this.setState({ loading: true });
        PromotionTemplateAPI.GetPromotionTypeList(obj).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.ListData = functionData;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loading: false, selectedRowKeys: [] });

        });
    }
    showNewPage(TypeId,TypeName) {
        Tool.goPush('/Manager/PromotionTemplate/PromotionTemplateListByTypeId');  //跳转连接
        //下面两个是参数
        LocalStorage.add('TypeId', TypeId);
        LocalStorage.add('TypeName', TypeName);
    }  

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const Columns = [
            {
                title: '序号',
                dataIndex: 'TypeId',
                key: 'TypeId',
                render: (text) => <span> {text}</span>
            },          
            {
                title: '模板类型名称',
                dataIndex: 'TypeName',
                key: 'TypeName',
                render: (text, record) => <span><a href="javascript:;" onClick={(event) => { this.showNewPage(record.TypeId,record.TypeName) } }>{text}</a> </span>
            },                  
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>                
                        <a href="javascript:;" onClick={(event) => { this.showNewPage(record.Id,record.TypeName) } }>管理模板</a>
                    </span>
                )
            }
        ];
  
        var self = this;     
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">模板类型列表</a>
                </div>
                <Row>
                    <Col>
                        <Table
                            columns={Columns}
                            dataSource={this.state.ListData}                     
                            loading={this.state.loading}
                            pagination={false}
                            />
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

let IndexPage = Form.create({})(PromotionTemplateIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(IndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);