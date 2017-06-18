import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button, Radio, Tabs, Popconfirm } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';
//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import ProductApi from './ProductApi';

//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const ButtonGroup = Button.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class FareTemplateIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
      
        this.initFareTemplateList = this.initFareTemplateList.bind(this)
        this.deleteFareTemplate = this.deleteFareTemplate.bind(this);

        this.state = {
            loadingFareTemplate: false,//正在加载列表
            selectedRowKeys: [],//选择
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
        this.initFareTemplateList();
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

    editFareTemplate(id) {
        LocalStorage.add('FareTemplateId', id);
        Tool.goPush('Product/FareTemplateSet');
    }

    newFareTemplate() {
        LocalStorage.add('FareTemplateId', "");
        Tool.goPush('Product/FareTemplateSet');
    }
   

    initFareTemplateList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
     
        _this.state.loadingFareTemplate = true;

        ProductApi.getFareTemplateList(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.FareTemplateListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingFareTemplate: false, selectedRowKeys: [] });

        });
    }

    deleteFareTemplate(id) {
        var _this = this;
        var obj = { Id: id };

        ProductApi.deleteFareTemplate(obj).then(function (data) {
            if (data.IsOK) {
                _this.initFareTemplateList();
            } else {
                message.error(data.Message);
            }
        });
    }


    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };


        const FareTemplateColumns = [
            {
                title: '模板名称',
                dataIndex: 'Name',
                key: 'Name',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '是否包邮',
                dataIndex: 'IsInclPostage',
                key: 'IsInclPostage',
                render: (text) => <span> {text ? "是" : "否"}</span>,
            },
            {
                title: '计价方式',
                dataIndex: 'ValuationModelType',
                key: 'ValuationModelType',
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
                        <a href="javascript:;" onClick={() => { this.editFareTemplate(record.Id) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？该操作不可恢复！！！" onConfirm={() => { this.deleteFareTemplate(record.Id) } }>
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
                self.initFareTemplateList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initFareTemplateList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">运费模板管理</a>
                </div>

                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={this.newFareTemplate}>创建新模板</Button>
                    </div>
                    
                </div>

                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={FareTemplateColumns}
                            dataSource={this.state.FareTemplateListData}
                            pagination={pagination }
                            loading={this.state.loadingFareTemplate}
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

let FareTemplateIndexPage = Form.create({})(FareTemplateIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FareTemplateIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
