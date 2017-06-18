import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import {Button} from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message, Switch, Radio  } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions } from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';

//api
import ProductCategoryApi from './CategoryApi';
import ProductApi from './ProductApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
//查询表单
import SearchForm from '../../components/FormTemplate/SearchForm';
const Search = Form.create()(SearchForm);

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ProductIndex extends BaseContainer {
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
        this.initProductList = this.initProductList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.initCategoryTreeList = this.initCategoryTreeList.bind(this);
        this.searchDataList = this.searchDataList.bind(this);
        this.onChangeChildren = this.onChangeChildren.bind(this);
        this.isLeaf = this.isLeaf.bind(this);
        this.searchData = {};

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            ProductListData: [],//列表数据
            loadingProduct: false,//正在加载列表
            selectProductIndex: -1,//选择列表序号
            selectProductId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            ProductTotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            CategoryTreeData: [], //分类树数据
            searchPara: [{ key: "ProductName", type: "Input", name: "商品名称", message: "商品名称" },
                { key: "IsShelves", type: "Select", name: "商品状态", message: "商品状态", dataList: [{ "value": "", "key": "不限" }, { "value": "true", "key": "上架" }, { "value": "false", "key": "下架" }] },
                { key: "CategoryId", type: "TreeSelect", name: "商品类别", message: "商品类别", dataList: [] }],
            CategoryId: "",
        }
        this.initCategoryTreeList();
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
    componentWillReceiveProps(nextProps) {
    }
    /**
     * 查询条件
     */
    searchDataList(obj) {
        this.state.PageIndex = 1;
        this.searchData = obj;
        this.initProductList();
    }
    /**
     * 获取列表数据
     */
    initProductList() {
        var _this = this;
        var obj = _this.searchData;
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.ProductType = 1;//普通产品
        console.log(obj);
        _this.state.visibleForm = false;
        _this.state.loadingProduct = true;
        ProductApi.getProductList(obj).then(function (data) {
            if (data.IsOK) {
                var productData = [];
                if (Array.isArray(data.Value)) {
                    productData = data.Value;
                }
                _this.state.ProductListData = productData;
                _this.state.ProductTotalCount = data.AllCount;
            }
            _this.setState({ loadingProduct: false });
        });
    }
    /**
    * 获取分类树列表
     */
    initCategoryTreeList() {
        var _this = this;
        ProductCategoryApi.getProductCategoryTree({ "ParentId": "0", "IsDefault": false }).then(function (data) {
            if (data.IsOK) {
                var categoryData = [];
                var searchCategoryData = [];
                if (Array.isArray(data.Value)) {
                    categoryData = data.Value;
                    searchCategoryData = data.Value;
                }
                _this.state.CategoryTreeData = categoryData;
                searchCategoryData.unshift({ "ParentId": "", "label": "不限", "value": "", "key": "" });
                _this.state.searchPara[2].dataList = searchCategoryData;
            }
        });
    }
    /**
     * 提交数据
     */
    submitForm() {
        //var form = this.props.form;
        //var _this = this;
        //form.validateFields((errors, values) => {
        //    if (!!errors) {
        //        console.log('Errors in form!!!');
        //        return;
        //    }
        //    var obj = form.getFieldsValue();
        //    obj.CategoryId = _this.state.CategoryId;
        //    console.log('收到表单值：', obj);
        //    if (_this.state.isInsert) {
        //        ProductApi.insertProduct(obj).then(function (data) {
        //            if (data.IsOK) {
        //                _this.initProductList();
        //            } else {
        //                message.error(data.Message);
        //            }
        //        });
        //    } else {
        //        obj.Id = _this.state.selectProductId;
        //        ProductApi.updateProduct(obj).then(function (data) {
        //            if (data.IsOK) {
        //                _this.initProductList();
        //            } else {
        //                message.error(data.Message);
        //            }
        //        });
        //    }
        //});
    }
    /**
     * 删除
     * @param Id
     */
    deleteProduct(Id) {
        var _this = this;
        var obj = { Id: Id };
        ProductApi.deleteProduct(obj).then(function (data) {
            if (data.IsOK) {
                _this.initProductList();
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
        console.log(record);
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            "ProductName": record.ProductName
        });
        var isinsert = false;
        this.setState({ isInsert: isinsert, visibleForm: true, CategoryId: record.CategoryId });
        return false;
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        this.props.form.resetFields();
        var isinsert = true;
        this.setState({ isInsert: isinsert, visibleForm: true, CategoryId: "" });
        return false;
    }
    /**
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    /**
     * 产品上架、下架
     */
    IsShelvesOnClick(id, isShelves) {
        var _this = this;
        var obj = { Id: id };
        if (isShelves) {
            ProductApi.setProductOnLine(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initProductList();
                } else {
                    message.error(data.Message);
                }
            });
        } else {
            ProductApi.setProductOffLine(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initProductList();
                } else {
                    message.error(data.Message);
                }
            });
        }
    }
    /**
     * 是否是叶子节点
     * @param value
     */
    isLeaf(value) {
        if (!value) {
            return false;
        }
        let queues = [...this.state.CategoryTreeData];
        while (queues.length) { // BFS
            const item = queues.shift();
            if (item.value === value) {
                if (!item.children) {
                    return true;
                }
                return false;
            }
            if (item.children) {
                queues = queues.concat(item.children);
            }
        }
        return false;
    }
    onChangeChildren(value) {
        const pre = value ? this.state.CategoryId : undefined;
        this.setState({ CategoryId: this.isLeaf(value) ? value : pre });
    }
    render() {
        let SearchFormModel = Search;
        console.log("onchange");
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
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
                title: '商品类型',
                dataIndex: 'ProductType',
                key: 'ProductType',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '商品类别',
                dataIndex: 'CategoryName',
                key: 'CategoryName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '显示顺序',
                dataIndex: 'DisplayOrder',
                key: 'DisplayOrder',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '首页推荐',
                dataIndex: 'IsRecommendedHome',
                key: 'IsRecommendedHome',
                render: (text) => <span> {text ? "是" : "否"}</span>,
            },
            {
                title: '上架/下架',
                dataIndex: 'IsShelves',
                key: 'IsShelves',
                render: (text, record) => record.IsShelves ?
                    <ButtonGroup>
                        <Button type="primary">上架</Button>
                        <Button onClick={(event) => { this.IsShelvesOnClick(record.Id, false) } }>下架</Button>
                    </ButtonGroup> :
                    <ButtonGroup>
                        <Button onClick={(event) => { this.IsShelvesOnClick(record.Id, true) } }>上架</Button>
                        <Button type="primary">下架</Button>
                    </ButtonGroup>,
            },
            {
                title: '商品种类',
                dataIndex: 'ProductSort',
                key: 'ProductSort',
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
                        <a href="javascript:;" onClick={(event) => { this.openEditForm(record) } }>修改</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={(event) => { this.deleteProduct(record.Id) } }>
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
            total: self.state.ProductTotalCount,
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
                return `共 ${self.state.ProductTotalCount} 条`;
            },
            pageSize: self.state.PageSize,
            current: self.state.PageIndex
        };
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">普通商品管理</a>
                </div>
                <Row>
                    <Col>
                        <SearchFormModel {...this.state} name={this.props.name} onSearch={this.searchDataList}></SearchFormModel>
                    </Col>
                    <Col>
                        <Table
                            columns={ProductColumns}
                            dataSource={this.state.ProductListData}
                            pagination={pagination }
                            loading={this.state.loadingProduct}
                            rowSelection={rowSelection}
                            footer={() => <Button type="primary" onClick={this.openInsertForm}>添加</Button>}
                            onRowClick={
                                (record, index) => {
                                    this.state.selectedRowKeys = [];
                                    this.setState({
                                        selectProductIndex: index,
                                        selectProductId: record.Id
                                    });
                                }
                            }
                            rowClassName={
                                (record, index) => {
                                    return index === this.state.selectProductIndex ? " ant-table-row-active " : "";
                                }
                            }
                            />
                    </Col>
                </Row>

                <Modal title={this.state.isInsert ? "添加商品" : "修改商品"} visible={this.state.visibleForm} onOk={this.submitForm} onCancel={this.closeForm } >
                    <Form horizontal>
                        <FormItem
                            {...formItemLayout}
                            label="商品名称"
                            hasFeedback
                            >
                            <Input type="text" placeholder="请填写商品名称" {...getFieldProps('ProductName', {
                                validate: [{
                                    rules: [
                                        { required: true, message: '请填写商品名称' },
                                    ], trigger: ['onBlur', 'onChange'],
                                }]
                            }) }/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="商品类别"
                            >
                            <TreeSelect treeData={this.state.CategoryTreeData} value={this.state.CategoryId} allowClear={true} onChange={this.onChangeChildren} placeholder="请选择商品类别" {...{
                                validate: [{
                                    rules: [
                                        { required: true, message: '请选择商品类别' },
                                    ], trigger: ['onChange'],
                                }]
                            }}/>
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

let ProductIndexPage = Form.create({})(ProductIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ProductIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);

