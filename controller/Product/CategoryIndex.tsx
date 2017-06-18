import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import { Button } from 'antd';
import { InputNumber } from 'antd';
import { Select } from 'antd';
import { TreeSelect } from 'antd';
import { Popconfirm, message } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import ProductCategoryApi from './CategoryApi';
//表单验证模块
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;

/**
 * 定义组件（首字母比较大写），相当于java中的类的声明
 */
class CategoryIndex extends BaseContainer {
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
        this.initCategoryList = this.initCategoryList.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.initCategoryTreeList = this.initCategoryTreeList.bind(this);

        let formProductCategoryElements: FormElement[] = [
            { key: "CategoryName", element: ElementEnum.Input, type: "string", label: "类别名称", message: "请输入类别名称", rules: { required: true, whitespace: true, validator: this.checkName }, dataList: [] },
            { key: "ParentId", element: ElementEnum.TreeSelect, treeDefaultExpandAll: true, type: "string", label: "上级类别", message: "请选择上级类别", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "SortIndex", element: ElementEnum.Input, type: "string", label: "排序", message: "请输入排序", rules: { required: true, whitespace: true }, dataList: [] },

        ];

        this.state = {
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            CategoryListData: [],//分类列表数据
            loadingCategory: false,//正在加载权限列表
            selectCategoryIndex: -1,//选择权限列表序号
            selectCategoryName: "",//当前选择的分类名称
            selectCategoryId: "",//选择的分类Id
            selectedRowKeys: [],//功能选择
            CategoryTreeData: [], //分类树数据
            ProductTypeEnumData: [], //产品类型枚举数据
            productCategoryDefaultValues: {},
            productCategoryData: formProductCategoryElements,
            editId: -1,
            editNextId: -1
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initCategoryList();
        this.initCategoryTreeList();
    }
    //更新DOM之前被执行
    componentWillUpdate() {
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        var _this = this;
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleForm === true) {

            _this.loadProductCategoryFromDb(_this.state.editId);
            _this.state.editNextId = _this.state.editId;
        }
    }
    //移除DOM之前被执行
    componentWillUnmount() {
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
    }
    /**
     * 获取分类列表数据
     */
    initCategoryList() {
        var _this = this;
        _this.state.visibleForm = false;
        _this.state.loadingCategory = true;
        ProductCategoryApi.getProductCategoryList({ "ParentId": "0" }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.CategoryListData = functionData;
            }
            _this.setState({ loadingCategory: false });
            //_this.initCategoryTreeList();
            //_this.initProductTypeEnumList();

        });
    }

    loadProductCategoryFromDb(id) {
        var _this = this
        ProductCategoryApi.getProductCategory({ Id: id }).then(function (data) {
            if (data.IsOK) {
                data.Value.SortIndex = String(data.Value.SortIndex);
                if (data.Value.ParentId == '0')
                {
                    data.Value.ParentId = null;
                }
                _this.setState({ productCategoryDefaultValues: data.Value, editId: id, });
            } else {
                message.error(data.Message);
            }
        });
    }

    /**
    * 获取分类树列表
     */
    initCategoryTreeList() {
        var _this = this;
        ProductCategoryApi.getCategorySelectList({ "ParentId": "0", IsDefault: true }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.state.productCategoryData[1].dataList = functionData;
                _this.state.CategoryTreeData = functionData;
            }

        });
    }
   
    /**
     * 提交数据
     */
    submitForm(obj) {
        var _this = this;
        obj.ProductType = 1;
        if (_this.state.isInsert) {
            ProductCategoryApi.insertProductCategory(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initCategoryList();
                    _this.initCategoryTreeList();
                } else {
                    message.error(data.Message);
                }
            });
        } else {
            obj.Id = _this.state.editId;
            if (obj.Id == obj.ParentId)
            {
                Modal.error({
                    title: '温馨提示',
                    content: '选择的上级类别不能和当前相同！',

                });
                return;
            }
            ProductCategoryApi.updateProductCategory(obj).then(function (data) {
                if (data.IsOK) {
                    _this.initCategoryList();
                    _this.initCategoryTreeList();
                } else {
                    message.error(data.Message);
                }
            });
        }

    }
    /**
     * 删除分类
     * @param roleid
     */
    deleteCategory(categoryid) {
        var _this = this;
        var obj = { Id: categoryid };
        ProductCategoryApi.deleteProductCategory(obj).then(function (data) {
            if (data.IsOK) {
                _this.initCategoryList();
            } else {
                message.error(data.Message);
            }
        });
    }

    checkName(rule, value, callback) {
        if (value && value.length>8) {
            callback('类别名称最大为8个字符！');
        }
        else {
            callback();
        }
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
        this.setState({ isInsert: false, visibleForm: true, editNextId: -1, editId: record.Id });
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        this.setState({ visibleForm: true, isInsert: true, productCategoryDefaultValues: {} });
    }
    /**
     * 列表更改事件
     * @param selectedRowKeys
     */
    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    render() {
        console.log("onchange");
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        var reactid = 0;
        var selectItems = this.state.ProductTypeEnumData.map(function (item) {
            return (
                <Option key={'li_' + reactid++} value={item.key}>{item.label}</Option>
            );
        });
        const categoryColumns = [
            {
                title: '商品类别名称',
                dataIndex: 'CategoryName',
                key: 'CategoryName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '商品数量',
                dataIndex: 'ProductCount',
                key: 'ProductCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '分组排序',
                dataIndex: 'SortIndex',
                key: 'SortIndex',
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
                        <Popconfirm title="确定要删除吗？" onConfirm={(event) => { this.deleteCategory(record.Id) } }>
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
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te">商品类别管理</a>
                </div>
                <div className="row margin-top20 margin-btm20">
                    <div className="col-xs-2"><a href="javascript:;" className="btn btn-success" onClick={this.openInsertForm}>添加新类别</a></div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Table
                            rowKey={record => record.Id}
                            columns={categoryColumns}
                            dataSource={this.state.CategoryListData}
                            pagination={false}
                            loading={this.state.loadingCategory}
                            />
                    </div>
                </div>

                <Modal title={this.state.isInsert ? "添加商品类别" : "编辑商品类别"} visible={this.state.visibleForm} onCancel={this.closeForm} footer={[]} >
                    <FormTemplate formElements={this.state.productCategoryData} defaultValues={this.state.productCategoryDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitForm} onCancel={this.closeForm}></FormTemplate>
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

let CategoryIndexPage = Form.create({})(CategoryIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(CategoryIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
