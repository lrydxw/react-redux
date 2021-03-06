﻿import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Row, Col, Modal, Form, Input, Button, Popconfirm, message, Switch, Radio, Select, Tabs } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import { Editor } from '../../components/editor/editor';
import RebateSetForm from '../../components/product/RebateSetForm';
//api
import ProductApi from './ProductApi';
import MemberSetInfoApi from '../manager/MemberSetInfo/Api';
import PartnerApi from '../Partner/Api';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
//表单组件

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ProductSetStep2 extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.handelSubmit = this.handelSubmit.bind(this);
        this.setNeedBuyForDealershipChange = this.setNeedBuyForDealershipChange.bind(this);
        this.openInsertForm = this.openInsertForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.initGoodsRebateList = this.initGoodsRebateList.bind(this);
        this.initProductSellInfo = this.initProductSellInfo.bind(this);
        this.loadFareTemplateSelectData = this.loadFareTemplateSelectData.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.closeAndReload = this.closeAndReload.bind(this);
        this.setIsEnableDividedChange = this.setIsEnableDividedChange.bind(this);

        this.state = {
            memberRebateConfig: [],
            partnerRebateConfig: [],
            ProductId: LocalStorage.get('ProductId'),
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加 true：添加  false：编辑
            selectedRowKeys: [],//功能选择
            selectedRowIndex: -1,//选择列表序号
            selectedRowId: "",//当前选择的Id
            TableData: [],//列表数据
            fareTemplateData: [],


        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {

    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initProductSellInfo();
        this.initGoodsRebateList();
        this.loadFareTemplateSelectData();
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
    initProductSellInfo() {
        var _this = this;
        const { setFieldsValue } = this.props.form;
        var productId = _this.state.ProductId;
        ProductApi.getProductSellSetInfo({ Id: productId }).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;

                var setObj = {
                    "DistributionType": String(obj.DistributionType), "IsNeedBuyForRebate": String(obj.IsNeedBuyForRebate),
                    "IsNeedBuyForDealership": String(obj.IsNeedBuyForDealership), "IsUnifyPostage": String(obj.IsUnifyPostage),
                    "UnifyPostagePrice": String(obj.UnifyPostagePrice), "IsEnableDivided": obj.IsEnableDivided,
                    "IsMail": String(obj.IsMail),
                }
                if (obj.FareTemplateId != null) {
                    setObj["FareTemplateId"] = obj.FareTemplateId;
                }

                setFieldsValue(setObj);


            } else {
                message.error(data.Message);
            }
        });
    }
    /**
     * 获取产品型号
     */
    initGoodsRebateList() {
        var _this = this;
        var productId = _this.state.ProductId;
        ProductApi.getGoodsSizeListData({ Id: productId }).then(function (data) {
            if (data.IsOK) {
                var functionData = [];
                if (Array.isArray(data.Value)) {
                    functionData = data.Value;
                }
                _this.setState({ TableData: functionData });
            } else {
                message.error(data.Message);
            }
        });
    }

    /**
     * 提交数据
     * @param Step 跳转步骤
     */
    handelSubmit(Step) {
        var _this = this;
        var form = _this.props.form;
        const { getFieldValue, validateFields } = _this.props.form;
        _this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();
            obj.Id = _this.state.ProductId;
            ProductApi.updateProductSellSetInfo(obj).then(function (data) {
                if (data.IsOK) {
                    if (Step == 1) {
                        LocalStorage.add('ProductId', obj.Id);
                        Tool.goPush('Product/ProductSetStep1');
                    } else if (Step == 3) {
                        LocalStorage.add('ProductId', obj.Id);
                        Tool.goPush('Product/ProductSetStep3');
                    }
                } else {
                    message.error(data.Message);
                }
            });
        });
    }

    setNeedBuyForDealershipChange(e) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var setObj = { "IsNeedBuyForDealership": e.target.value };
        if (e.target.value == "false") {
            setObj["DistributionType"] = "2";
        }
        setFieldsValue(setObj);
    }
    /**
     * 打开添加弹窗
     */
    openInsertForm() {
        var _this = this;
        //_this.props.form.resetFields();
        _this.state.selectedRowId = "";
        _this.setState({ isInsert: true, visibleForm: true });
        return false;
    }

    closeForm() {
        var _this = this;
        _this.setState({ visibleForm: false, selectedRowId: "" });
        return false;
    }

    closeAndReload() {
        var _this = this;
        _this.setState({ visibleForm: false, selectedRowId: "" });
        _this.initGoodsRebateList();
    }

    /**
     * 打开修改弹窗
     */
    openEditForm(record) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;

        _this.setState({ isInsert: false, visibleForm: true, selectedRowId: record.Id });
        console.log(record);


    }


    /**
     * 删除产品规格
     */
    deleteGoodsSize(Id) {
        var _this = this;
        var obj = { Id: Id };
        ProductApi.deleteGoodsRebate(obj).then(function (data) {
            if (data.IsOK) {
                _this.initGoodsRebateList();
            } else {
                message.error(data.Message);
            }
        });
    }

    setIsEnableDividedChange(checked) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        setFieldsValue({ "IsEnableDivided": checked });
    }

    loadFareTemplateSelectData() {
        var _this = this;
        ProductApi.getFareTemplateSelectData({}).then(function (data) {
            if (data.IsOK) {
                _this.setState({ fareTemplateData: data.Value });
            } else {
                message.error(data.Message);
            }
        });
    }

    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = _self.props.form;

        const distributionTypeProps = getFieldProps('DistributionType', {
            validate: [{
                rules: [
                    { required: true, message: '请选择分销类型' },
                ], trigger: ['onBlur', 'onChange'],
            }],

        });

        const isNeedBuyForRebateProps = getFieldProps('IsNeedBuyForRebate', {
            validate: [{
                rules: [
                    { required: true, message: '请选择分利权类型' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const isNeedBuyForDealershipProps = getFieldProps('IsNeedBuyForDealership', {
            validate: [{
                rules: [
                    { required: true, message: '请选择代理权类型' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const isUnifyPostageProps = getFieldProps('IsUnifyPostage', {
            validate: [{
                rules: [
                    { required: true, message: '请选择运费设置' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const unifyPostagePriceProps = getFieldProps('UnifyPostagePrice', {
            validate: [{
                rules: [
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const fareTemplateIdProps = getFieldProps('FareTemplateId', {

        });

        const isEnableDividedProps = getFieldProps('IsEnableDivided', {
            valuePropName: 'checked'
        });

        const isMailProps = getFieldProps('IsMail', {
            validate: [{
                rules: [
                    { required: true, message: '请选择是否邮寄' },
                ],
                trigger: ['onBlur', 'onChange'],

            },
            ],
        });

        var fareTemplateDataOption = this.state.fareTemplateData.map(function (item) {
            return (
                <Option key={"key" + item.Id} value={item.Id}>{item.Name}</Option>
            );
        });



        const tableColumns = [
            {
                title: '规格',
                dataIndex: 'SizeName',
                key: 'SizeName',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '销售价',
                dataIndex: 'SalePrice',
                key: 'SalePrice',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '市场价',
                dataIndex: 'MarketPrice',
                key: 'MarketPrice',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '库存',
                dataIndex: 'Inventory',
                key: 'Inventory',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => { this.openEditForm(record) } }>编辑</a>
                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => { this.deleteGoodsSize(record.Id) } }>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];
        const locale = { emptyText: '暂无规格' };


        return (
            <div>
                <Form horizontal>
                    <div className="form-horizontal tasi-form" >

                        <div className="row padding-top20 margin0">
                            <div className="col-lg-2 col-sm-12 padding-top5">
                                <b>出售设置</b>
                            </div>
                            <div className="col-lg-10 col-sm-12">

                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>购买后成为代理：</label>
                                        <div className="col-xs-4 radios">
                                            <div className="row radios-block">
                                                <FormItem key="isNeedBuyForDealership" >
                                                    <RadioGroup  {...isNeedBuyForDealershipProps} onChange={this.setNeedBuyForDealershipChange} >
                                                        <Radio value="true" >是</Radio>
                                                        <Radio value="false" >否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>开启分销：</label>
                                        <div className="col-xs-4 margin-top5">

                                            <FormItem key="isEnableDivided">
                                                <Switch onChange={this.setIsEnableDividedChange} {...isEnableDividedProps} checkedChildren={'开'} unCheckedChildren={'关'} />
                                            </FormItem>


                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: getFieldValue("IsEnableDivided") == true ? "" : "none" }}>
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>分销方式：</label>
                                        <div className="col-xs-4 radios">
                                            <div className="row radios-block">
                                                <FormItem key="distributionType" >
                                                    <RadioGroup  {...distributionTypeProps} >
                                                        <Radio value="1" disabled={getFieldValue("IsNeedBuyForDealership") == "false" ? true : false} >多级分销</Radio>
                                                        <Radio value="2" >一级奖励</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: getFieldValue("IsEnableDivided") == true ? "" : "none" }}>
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>享有收益是否需要购买：</label>
                                        <div className="col-xs-4 radios">
                                            <div className="row radios-block">
                                                <FormItem key="isNeedBuyForRebate" >
                                                    <RadioGroup  {...isNeedBuyForRebateProps} >
                                                        <Radio value="true" >是</Radio>
                                                        <Radio value="false" >否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>规格：</label>
                                        <div className="col-xs-6">
                                            <div className="row">
                                                <Table rowKey={record => record.Id} columns={tableColumns} dataSource={this.state.TableData} locale={locale} pagination={false} />
                                                <div className="margin-top5">
                                                    <a className="color-blue font12 text-left" onClick={this.openInsertForm}>+添加规格</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>是否邮寄：</label>
                                        <div className="col-xs-4 radios">
                                            <div className="row radios-block">
                                                <FormItem key="isMail" >
                                                    <RadioGroup  {...isMailProps} >
                                                        <Radio value="true" >是</Radio>
                                                        <Radio value="false" >否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>运费设置：</label>
                                        <div className="col-xs-4 radios">
                                            <div className="row radios-block">
                                                <FormItem key="isUnifyPostage" >
                                                    <RadioGroup  {...isUnifyPostageProps} >
                                                        <Radio value="true" >统一运费</Radio>
                                                        <Radio value="false" >运费模版</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: getFieldValue("IsUnifyPostage") == "true" ? "" : "none" }}>
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2">统一运费：</label>
                                        <div className="col-xs-2">
                                            <FormItem key="unifyPostagePrice">
                                                <Input {...unifyPostagePriceProps} className="cp1 form-control" placeholder="统一运费" />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>


                                <div className="form-group" style={{ display: getFieldValue("IsUnifyPostage") == "false" ? "" : "none" }}>
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2" >运费模板：</label>
                                        <div className="col-xs-2">
                                            <FormItem key="fareTemplateId">
                                                <Select
                                                    placeholder="请选择运费模板"
                                                    {...fareTemplateIdProps}
                                                    >
                                                    {fareTemplateDataOption}
                                                </Select>
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="seat-80"></div>
                    <div className="position-btm">
                        <div className="row margin0 bg-colorFC padding10 margin-top20">
                            <div className="col-lg-1 col-xs-offset-4">
                                <a className="btn btn-block btn-info2" onClick={() => { this.handelSubmit(1) } }>上一步</a>
                            </div>
                            <div className="col-lg-1 margin-left20">
                                <a className="btn btn-block btn-success" onClick={() => { this.handelSubmit(3) } }>下一步</a>
                            </div>
                        </div>
                    </div>
                    <Modal title={this.state.isInsert ? "添加规格" : "修改规格"} visible={this.state.visibleForm} onCancel={this.closeForm} width="610" maskClosable={false} footer={[]} >
                        <RebateSetForm CallBackFunction={this.closeAndReload} distributionType={getFieldValue("DistributionType")} showRebateInfo={getFieldValue("IsEnableDivided")} isInsert={this.state.isInsert} showInventory={true} showWeight={true} showSizeRights={false} productId={this.state.ProductId} goodsId={this.state.selectedRowId} onCancel={this.closeForm} ></RebateSetForm>
                    </Modal>

                </Form>
            </div>
        );
    }
}



let ProductSetStep2Page = Form.create({})(ProductSetStep2);

export { ProductSetStep2Page }
