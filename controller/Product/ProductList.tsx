import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Icon, Row, Col, Modal, Form, Input, message, Menu, DatePicker, Select, Button, Radio, Tabs, Popconfirm } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
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
class ProductList extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.initProductList = this.initProductList.bind(this)
        this.setSearchKeywords = this.setSearchKeywords.bind(this);
        this.searchProduct = this.searchProduct.bind(this);
        this.onshelveProduct = this.onshelveProduct.bind(this);
        this.unshelveProduct = this.unshelveProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.deleteProductList = this.deleteProductList.bind(this);

        this.state = {
            loadingProduct: false,//正在加载列表
            selectedRowKeys: [],//选择
            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            searchKeywords: "",
            selectedRows: []

        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initProductList();
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

    editProduct(id) {
        LocalStorage.add('ProductId', id);
        Tool.goPush('Product/ProductSetStep1');
    }

    newProduct() {
        LocalStorage.add('ProductId', "");
        Tool.goPush('Product/ProductSetStep1');
    }
    /**
      * 列表更改事件
      * @param selectedLecturerKeys
      * @param selectedRows
      */
    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
    }

    setSearchKeywords(e) {
        this.state.searchKeywords = e.target.value;
    }

    searchProduct() {
        this.state.PageIndex = 1;
        this.initProductList();
    }

    onshelveProduct() {
        var _this = this;

        var selectedOnShelvesProduct = [];
        _this.state.selectedRows.map(function (item) {
            if (item.IsShelves) {
                selectedOnShelvesProduct.push(item.ProductName);
            }

        });

        if (selectedOnShelvesProduct.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的商品中【' + selectedOnShelvesProduct.join("，") + "】已经是上架状态",
            });
            return;
        }


        confirm({
            title: '您是确认要上架这些商品吗？',
            onOk() {
                var obj = { ProductIdArray: _this.state.selectedRowKeys, IsShelves: true };
                ProductApi.setProductStatusBatch(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initProductList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }

    unshelveProduct() {
        var _this = this;

        var selectedUnShelvesProduct = [];
        _this.state.selectedRows.map(function (item) {
            if (!item.IsShelves) {
                selectedUnShelvesProduct.push(item.ProductName);
            }

        });

        if (selectedUnShelvesProduct.length > 0) {
            Modal.info({
                title: '温馨提示',
                content: '您选的商品中【' + selectedUnShelvesProduct.join("，") + "】已经是下架状态",
            });
            return;
        }


        confirm({
            title: '您是确认要下架这些商品吗？',
            onOk() {
                var obj = { ProductIdArray: _this.state.selectedRowKeys, IsShelves: false };
                ProductApi.setProductStatusBatch(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initProductList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }


    initProductList() {
        var _this = this;
        var form = this.props.form;
        var obj = form.getFieldsValue();
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.PartnerStatus = _this.state.PartnerStatus;
        obj.ProductType = 1;
        obj.ProductName = _this.state.searchKeywords;
        _this.setState({ loadingProduct: true });

        ProductApi.getProductList(obj).then(function (data) {
            if (data.IsOK) {

                _this.state.ProductListData = data.Value;
                _this.state.TotalCount = data.AllCount;
            }
            _this.setState({ loadingProduct: false, selectedRowKeys: [] });

        });
    }

    deleteProduct(id) {
        var _this = this;
        var obj = { ProductIdArray: [id] };

        ProductApi.deleteProduct(obj).then(function (data) {
            if (data.IsOK) {
                _this.initProductList();
            } else {
                message.error(data.Message);
            }
        });
    }

    deleteProductList() {
        var _this = this;
        confirm({
            title: '您是确认要删除已选产品吗？',
            content: '该操作不可恢复！！！',
            onOk() {

                var obj = { ProductIdArray: _this.state.selectedRowKeys };
                ProductApi.deleteProduct(obj).then(function (data) {
                    if (data.IsOK) {
                        _this.initProductList();
                    } else {
                        message.error(data.Message);
                    }
                });
            },
            onCancel() { },
        });
    }



    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };


        const ProductColumns = [
            {
                title: '商品名称',
                dataIndex: 'ProductName',
                key: 'ProductName',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '总库存',
                dataIndex: 'TotalInventory',
                key: 'TotalInventory',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '首页推荐',
                dataIndex: 'IsRecommendedHome',
                key: 'IsRecommendedHome',
                render: (text) => <span> {text ? "是" : "否"}</span>,
            },
            {
                title: '状态',
                dataIndex: 'IsShelves',
                key: 'IsShelves',
                render: (text) => <span> {text ? "上架" : "下架"}</span>,

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
                        <a href="javascript:;" onClick={() => { this.editProduct(record.Id) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？该操作不可恢复！！！" onConfirm={() => { this.deleteProduct(record.Id) } }>
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

        //批量操作按钮是否可用
        const hasSelected = selectedRowKeys.length > 0;
        var self = this;
        const pagination = {
            total: self.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                self.state.PageIndex = current;
                self.state.PageSize = pageSize;
                self.initProductList();
            },
            onChange(current) {
                self.state.PageIndex = current;
                self.initProductList();
            },
            showTotal() {
                return `共 ${self.state.TotalCount} 条`;
            }
        };

        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">商品管理</a>
                </div>

                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2">
                        <Button type="primary" size="large" className="btn" onClick={this.newProduct}>创建新商品</Button>
                    </div>
                    <div className="col-xs-2 col-xs-offset-8">
                        <div className="input-group">

                            <Input type="text" className="form-control search-fill" placeholder="商品名称" onChange={this.setSearchKeywords} style={{ height: 34 }} onPressEnter={this.searchProduct} />

                            <span className="input-group-addon  search-btn" onClick={this.searchProduct} >
                                <i className="fa fa-search" ></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 " >

                        <Table
                            columns={ProductColumns}
                            dataSource={this.state.ProductListData}
                            pagination={pagination}
                            loading={this.state.loadingProduct}
                            rowKey={record => record.Id}
                            rowSelection={rowSelection}
                            footer={() =>
                                <ButtonGroup>
                                    <Button style={{ marginLeft: 8 }} onClick={this.onshelveProduct} disabled={!hasSelected} >上架</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.unshelveProduct} disabled={!hasSelected} >下架</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.deleteProductList} disabled={!hasSelected} >删除</Button>
                                </ButtonGroup>
                            }
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

let ProductListPage = Form.create({})(ProductList);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ProductListPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
