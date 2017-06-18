import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Form, Input, Button, message, Select, Radio, Modal, Checkbox } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import { Editor } from '../../components/editor/editor';
import ProductSizeRebate from '../../components/product/ProductSizeRebate';
import SizeCategory from '../../components/product/SizeCategory';
import ProductSize from '../../components/product/ProductSize';
//api
import ProductApi from './ProductApi';
import MemberSetInfoApi from '../manager/MemberSetInfo/Api';
import PartnerApi from '../Partner/Api';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
//表单组件
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;
/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class ProductInfoSetStep2 extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.handelSubmit = this.handelSubmit.bind(this);
        this.initFareTemplateSelectData = this.initFareTemplateSelectData.bind(this);
        this.initProductSellInfo = this.initProductSellInfo.bind(this);
        this.creataTableData = this.creataTableData.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.editPropertyRebate = this.editPropertyRebate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.loadPartnerRebateConfig = this.loadPartnerRebateConfig.bind(this);
        this.computerAllDividedMoney = this.computerAllDividedMoney.bind(this);
        this.setIsRemoveDecimalPlaceChange = this.setIsRemoveDecimalPlaceChange.bind(this);
        this.radioOnChange = this.radioOnChange.bind(this);

        this.state = {
            ProductId: LocalStorage.get('ProductId'),
            TableColumns: [],//TableColumns
            TableData: [],//列表数据
            DefaultTableData: [],//默认数据
            SelectCategoryProperty: [],//选择的规格属性（嵌套）
            fareTemplateData: [],//运费模板
            visibleForm: false,//是否显示编辑或添加弹窗
            isInsert: true,//是否是添加
            selectedRowId: "",//当前选择的Id
            selectedRowIndex: "",//当前选择的序号
            selectedSalePrice: "",//当前商品价格
            updateSizeTableData: false,
            memberRebateConfig: [],
            partnerRebateConfig: [],
            fixFloatNum: 2,
            rebateRecord: null,
        }
    }
    //插入真实DOM之前被执行
    componentWillMount() {
        this.initFareTemplateSelectData();
        this.loadPartnerRebateConfig();
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initProductSellInfo();
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
        if (nextProps.nextActiveKey && this.props.activeKey == 2 && nextProps.nextActiveKey != this.props.activeKey) {
            this.handelSubmit(nextProps.nextActiveKey);
        }
    }
    /**
     * 获取邮费模板数据
     */
    initFareTemplateSelectData() {
        var _this = this;
        ProductApi.getFareTemplateSelectData({}).then(function (data) {
            if (data.IsOK) {
                _this.setState({ fareTemplateData: data.Value });
            }
        });
    }
    loadPartnerRebateConfig() {
        var _this = this;
        PartnerApi.getPartnerTypeList({}).then(function (data) {
            if (data.IsOK) {
                //_this.state.partnerRebateConfig = data.Value;
                _this.setState({ partnerRebateConfig: data.Value });
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
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            obj.ProductId = _this.state.ProductId;
            //判断规格数据是否完成
            if (_this.state.TableData.length > 0) {
                if (!_this.isTableDataComplete(_this.state.TableData)) {
                    Modal.error({
                        title: '温馨提示',
                        content: '规格数据填写不完整，请换个姿势检查一遍',
                    });
                    _this.props.cancelNextActive();
                    return;
                }
            }
            console.log("_this.state.TableData;", _this.state.TableData);
            obj.ProductSizeInfoList = JSON.stringify(_this.state.TableData);
            if (obj.RebateSetType != "0" && _this.state.TableData.length == 0) {
                var partnerLevelConfigObj = [];
                var PartnerMoneyArray = [];
                _this.state.partnerRebateConfig.map(function (item, i) {
                    var currentObj = new Object();
                    currentObj["PartnerLevelId"] = item.Id;
                    currentObj["Commission"] = obj["PartnerLevelDividedMoney_" + item.Id];
                    currentObj["RebateProportion"] = obj["PartnerLevelDividedProportion_" + item.Id];
                    if (currentObj["Commission"] == "")
                        currentObj["Commission"] = 0;
                    if (currentObj["RebateProportion"] == "")
                        currentObj["RebateProportion"] = 0;
                    partnerLevelConfigObj.push(currentObj);
                    PartnerMoneyArray.push(parseFloat(currentObj["Commission"]));
                });
                if (parseFloat(obj.OneLevelDividedProportion) + parseFloat(obj.TwoLevelDividedProportion) + parseFloat(obj.ThreeLevelDividedProportion) > 100) {
                    Modal.error({
                        title: '温馨提示',
                        content: '三级代理分成比例总和不能大于100%',
                    });
                    return;
                }
                var saleMoney = parseFloat(obj.SalePrice);
                var totalThreeLevelDividedMoney = parseFloat(obj.OneDividedMoney) + parseFloat(obj.TwoDividedMoney) + parseFloat(obj.ThreeDividedMoney);
                if (totalThreeLevelDividedMoney > saleMoney) {
                    Modal.error({
                        title: '温馨提示',
                        content: '三级代理分成金额总和不能大于售价',
                    });
                    return;
                }
                var maxPartnerMoney = Math.max.apply(null, PartnerMoneyArray);
                if (maxPartnerMoney > saleMoney) {
                    Modal.error({
                        title: '温馨提示',
                        content: '合作伙伴分成最大金额总和不能大于售价',
                    });
                    return;
                }
            }
            obj.PartnerTypeDividedList = JSON.stringify(partnerLevelConfigObj);
            _this.props.nextTab(Step, { Second: obj });
        });
    }
    /**
     * 获取商品规格信息
     */
    initProductSellInfo() {
        var _this = this;
        const { setFieldsValue } = this.props.form;
        var productId = _this.state.ProductId;
        ProductApi.getProductSellInfo({ ProductId: productId }).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var setObj = {
                    "RebateSetType": String(obj.RebateSetType), "TotalInventory": String(obj.TotalInventory), "SalePrice": String(obj.SalePrice),
                    "MarketPrice": String(obj.MarketPrice), "IsUnifyPostage": String(obj.IsUnifyPostage), "UnifyPostagePrice": String(obj.UnifyPostagePrice),
                    "MerchantCode": obj.MerchantCode, "IsNeedBuyForRebate": String(obj.IsNeedBuyForRebate),
                    "OneLevelDividedProportion": String(obj.OneLevelDividedProportion), "TwoLevelDividedProportion": String(obj.TwoLevelDividedProportion), "ThreeLevelDividedProportion": String(obj.ThreeLevelDividedProportion),
                    "OneDividedMoney": String(obj.OneDividedMoney), "TwoDividedMoney": String(obj.TwoDividedMoney), "ThreeDividedMoney": String(obj.ThreeDividedMoney)
                };
                if (obj.FareTemplateId != null) {
                    setObj["FareTemplateId"] = obj.FareTemplateId;
                }
                if (obj.PartnerTypeDividedList != null && obj.PartnerTypeDividedList.length > 0) {
                    obj.PartnerTypeDividedList.map(function (item, i) {
                        var proportionKeyName = 'PartnerLevelDividedProportion_' + item.Id;
                        setObj[proportionKeyName] = String(item.RebateProportion);
                        var moneyKeyName = 'PartnerLevelDividedMoney_' + item.Id;
                        setObj[moneyKeyName] = String(item.Commission);
                    });
                }
                _this.state.DefaultTableData = obj.ProductSizeInfoList;
                _this.state.TableData = obj.ProductSizeInfoList;
                _this.state.SelectCategoryProperty = obj.ProductStandardInfoList;
                setFieldsValue(setObj);
            } else {
                message.error(data.Message);
            }
        });
    }
    creataTableData(tableData) {
        var _this = this;
        _this.setState({ TableData: tableData, rebateRecord: null });
    }
    tableDataChange(tableData) {
        var _this = this;
        const { setFieldsValue } = this.props.form;
        _this.setState({ TableData: tableData });
        //价格库存计算
        var salePrice = 0, totalInventory = 0, salePriceArray = [];
        if (tableData != null && tableData.length > 0) {
            for (var i = 0; i < tableData.length; i++) {
                totalInventory += parseInt(tableData[i].Inventory || 0);
                salePriceArray.push(parseFloat(tableData[i].SalePrice || 0));
            }
            salePrice = Math.min.apply(null, salePriceArray);
            setFieldsValue({ TotalInventory: String(totalInventory), SalePrice: String(salePrice) });
        }
    }
    closeForm() {
        var _this = this;
        _this.setState({ visibleForm: false, selectedRowId: "" });
        return false;
    }
    onSubmit(obj) {
        var _this = this;
        _this.setState({ visibleForm: false });
        var tableData = _this.state.TableData;
        var index = _this.state.selectedRowIndex;
        tableData[index]["OneDividedMoney"] = obj.OneDividedMoney;
        tableData[index]["OneLevelDividedProportion"] = obj.OneLevelDividedProportion;
        tableData[index]["TwoDividedMoney"] = obj.TwoDividedMoney;
        tableData[index]["TwoLevelDividedProportion"] = obj.TwoLevelDividedProportion;
        tableData[index]["ThreeDividedMoney"] = obj.ThreeDividedMoney;
        tableData[index]["ThreeLevelDividedProportion"] = obj.ThreeLevelDividedProportion;
        tableData[index]["PartnerTypeDividedList"] = obj.PartnerTypeDividedList;
        tableData[index]["SelectedRowIndex"] = index;
        _this.state.TableData = tableData;
        _this.state.rebateRecord = tableData[index];
    }
    /**
     * 编辑分利
     */
    editPropertyRebate(goodsId, salePrice, recordIndex) {
        var _this = this;
        var tableData = _this.state.TableData;
        var rebateRecord = tableData[recordIndex];
        rebateRecord.SelectedRowIndex = recordIndex;
        _this.setState({ visibleForm: true, selectedRowId: goodsId, selectedSalePrice: salePrice, selectedRowIndex: recordIndex, rebateRecord: rebateRecord });
    }
    //获取合作伙伴总分成金额
    getPartnerMaxDividedMoney() {
        const { setFieldsValue, getFieldValue } = this.props.form;
        var partnerMoneyArray = [];
        this.state.partnerRebateConfig.map(function (item) {
            partnerMoneyArray.push(parseFloat(getFieldValue('PartnerLevelDividedMoney_' + item.Id)) || 0);
        });
        if (partnerMoneyArray.length > 0)
            return Math.max.apply(0, partnerMoneyArray);
        return 0;
    }
    //获取普通代理总分成金额
    getThreeLevelTotalDividedMoney() {
        const { setFieldsValue, getFieldValue } = this.props.form;
        return parseFloat(getFieldValue("OneDividedMoney") || 0) + parseFloat(getFieldValue("TwoDividedMoney") || 0) + parseFloat(getFieldValue("ThreeDividedMoney") || 0);
    }
    //获取分利金额总占比
    getTotalDividedProportion() {
        const { setFieldsValue, getFieldValue } = this.props.form;
        var totalDividedProportion = 0;
        var saleMoney = parseFloat(getFieldValue("SalePrice"));
        //合作伙伴分利最大额
        var partnerMaxDividedMoney = this.getPartnerMaxDividedMoney();
        //普通代理分利总额
        var threeLevelTotalDividedMoney = this.getThreeLevelTotalDividedMoney();
        //合计返利
        var totalDividedMoney = partnerMaxDividedMoney + threeLevelTotalDividedMoney;
        if (saleMoney > 0) {
            totalDividedProportion = totalDividedMoney / saleMoney * 100;
        }
        return totalDividedProportion;
    }
    changeCalculateRebateMoney(e, targetName) {
        const { setFieldsValue, getFieldValue } = this.props.form;
        var val = this.fixNumber(e.target.value);
        var saleMoney = getFieldValue("SalePrice");
        var money = this.calculateRebateMoney(saleMoney, val);
        var setObj = {};
        setObj[targetName] = parseFloat(money).toFixed(0);
        setObj[e.target.id] = val;
        setFieldsValue(setObj);
    }
    fixNumber(inputNum) {
        inputNum = inputNum.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
        inputNum = inputNum.replace(/^\./g, ""); //验证第一个字符是数字而不是.  
        inputNum = inputNum.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
        inputNum = inputNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        inputNum = inputNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数 
        return inputNum;
    }
    calculateRebateMoney(money, inputProportion) {
        var fixFloatNum = this.state.fixFloatNum;
        if (fixFloatNum == 2) {
            return String((money * (inputProportion / 100)).toFixed(fixFloatNum));
        }
        else {
            var result = money * (inputProportion / 100);
            return String(parseInt(String(result)));
        }
    }
    computerAllDividedMoney() {
        var _this = this;
        const { setFieldsValue, getFieldValue  } = _this.props.form;
        var saleMoney = getFieldValue("SalePrice");
        var setObj = { "SalePrice": String(saleMoney) };
        setObj["OneDividedMoney"] = _this.calculateRebateMoney(saleMoney, getFieldValue("OneLevelDividedProportion"));
        setObj["TwoDividedMoney"] = _this.calculateRebateMoney(saleMoney, getFieldValue("TwoLevelDividedProportion"));
        setObj["ThreeDividedMoney"] = _this.calculateRebateMoney(saleMoney, getFieldValue("ThreeLevelDividedProportion"));
        _this.state.partnerRebateConfig.map(function (item) {
            var moneyKeyName = 'PartnerLevelDividedMoney_' + item.Id;
            setObj[moneyKeyName] = _this.calculateRebateMoney(saleMoney, getFieldValue('PartnerLevelDividedProportion_' + item.Id));
        });
        setFieldsValue(setObj);
    }
    setIsRemoveDecimalPlaceChange(e) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var fixNum = 2;
        if (e.target.checked) {
            fixNum = 0;
        }
        _this.state.fixFloatNum = fixNum;
        _this.computerAllDividedMoney();
    }
    changeRebateMoney(e, targetName) {
        const { setFieldsValue, getFieldValue } = this.props.form;
        var val = this.fixNumber(e.target.value);
        var saleMoney = parseFloat(getFieldValue("SalePrice"));
        var proportion = 0;
        if (saleMoney > 0) {
            proportion = (val / saleMoney * 100);
        }
        var setObj = {};
        setObj[targetName] = proportion.toFixed(0);
        setObj[e.target.id] = val;
        setFieldsValue(setObj);
    }
    isTableDataComplete(arr) {
        var i = arr.length;
        while (i--) {
            if (String(arr[i].SalePrice) == "" || String(arr[i].Inventory) == "") {
                return false;
            }
        }
        return true;
    }
    radioOnChange(e) {
        var _self = this;
        var {resetFields, setFieldsValue, getFieldValue} = _self.props.form;
        var unifyPostagePrice = getFieldValue("UnifyPostagePrice"), fareTemplateId = getFieldValue("FareTemplateId");
        resetFields(['UnifyPostagePrice', 'FareTemplateId']);
        setFieldsValue({ "IsUnifyPostage": e.target.value, "UnifyPostagePrice": unifyPostagePrice, "FareTemplateId": fareTemplateId });
    }
    render() {
        var _self = this;
        const { getFieldProps, setFieldsValue, getFieldValue } = _self.props.form;
        const rebateRequired = getFieldValue("RebateSetType") != "0" && _self.state.TableData.length == 0 ? true : false;
        const oneDividedMoneyProps = getFieldProps('OneDividedMoney', {
            validate: [{
                rules: [
                    { required: rebateRequired, message: '请输入一级代理分成金额' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const twoDividedMoneyProps = getFieldProps('TwoDividedMoney', {
            validate: [{
                rules: [
                    { required: rebateRequired, message: '请输入二级代理分成金额' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const threeDividedMoneyProps = getFieldProps('ThreeDividedMoney', {
            validate: [{
                rules: [
                    { required: rebateRequired, message: '请输入三级代理分成金额' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const oneLevelDividedProportionProps = getFieldProps('OneLevelDividedProportion', {
            validate: [{
                rules: [
                    { required: rebateRequired, message: '请输入一级代理分成比例' },
                    { validator: RegExpVerify.checkPercentage },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const twoLevelDividedProportionProps = getFieldProps('TwoLevelDividedProportion', {
            validate: [{
                rules: [
                    { required: rebateRequired, message: '请输入二级代理分成比例' },
                    { validator: RegExpVerify.checkPercentage },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const threeLevelDividedProportionProps = getFieldProps('ThreeLevelDividedProportion', {
            validate: [{
                rules: [
                    { required: rebateRequired, message: '请输入三级代理分成比例' },
                    { validator: RegExpVerify.checkPercentage },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const isRemoveDecimalPlaceProps = getFieldProps('IsRemoveDecimalPlace', {

        });

        var fixFloatNum = _self.state.fixFloatNum;
        //售价
        const saleMoney = parseFloat(getFieldValue("SalePrice"));


        //合作伙伴分利最大额
        const partnerMaxDividedMoney = _self.getPartnerMaxDividedMoney().toFixed(fixFloatNum);

        //普通代理分利总额
        const threeLevelTotalDividedMoney = _self.getThreeLevelTotalDividedMoney().toFixed(fixFloatNum);

        //合计返利
        const totalDividedMoney = (parseFloat(partnerMaxDividedMoney) + parseFloat(threeLevelTotalDividedMoney)).toFixed(fixFloatNum);

        //合计返利占比
        const totalDividedProportion = _self.getTotalDividedProportion().toFixed(fixFloatNum);
        const readerDom = ({totalDividedProportion}) => {
            return (<span className="font16 color-red">{totalDividedProportion}%</span>);
        }
        const partnerLevelDividedMoneyDom = _self.state.partnerRebateConfig.map(function (item) {

            const { setFieldsValue, getFieldValue } = _self.props.form;

            const partnerLevelDividedProportionProps = getFieldProps('PartnerLevelDividedProportion_' + item.Id, {
                validate: [{
                    rules: [
                        { required: rebateRequired, message: '请输入' + item.TypeName + '分成比例' },
                        { validator: RegExpVerify.checkPercentage },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });
            const partnerLevelDividedMoneyProps = getFieldProps('PartnerLevelDividedMoney_' + item.Id, {
                validate: [{
                    rules: [
                        { required: rebateRequired, message: '请输入' + item.TypeName + '分成金额' },
                        { validator: RegExpVerify.checkMoney },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });
            return (
                <div className="form-group margin0">
                    <div className="row margin0">
                        <label className="control-label col-xs-2" >{item.TypeName}分成</label>
                        <div className="col-xs-4">
                            <div className="row">
                                <div className="col-xs-6">
                                    <div className="input-group m-bot15">
                                        <FormItem>
                                            <Input addonBefore="返利金额" addonAfter="元"  {...partnerLevelDividedMoneyProps} className="form-control" onChange={(e) => _self.changeCalculateRebateMoney(e, 'PartnerLevelDividedProportion_' + item.Id)} />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="input-group m-bot15">
                                        <FormItem>
                                            <Input addonBefore="返利比例" addonAfter="%" {...partnerLevelDividedProportionProps} onChange={(e) => _self.changeCalculateRebateMoney(e, 'PartnerLevelDividedMoney_' + item.Id)} className="form-control" placeholder={item.TypeName + "分成比例"} />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        var isUnifyPostage = getFieldValue("IsUnifyPostage") == "true" ? true : false;
        const unifyPostagePriceProps = getFieldProps('UnifyPostagePrice', {
            validate: [{
                rules: [
                    { required: isUnifyPostage, message: '请设置运费' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const fareTemplateIdProps = getFieldProps('FareTemplateId', {
            validate: [{
                rules: [
                    { required: !isUnifyPostage, message: '请选择运费模板' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        return (
            <div>
                <Form horizontal>
                    <div className="row padding-top20 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                        </div>
                        <div className="col-lg-10 col-sm-12">
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>返利设置：</label>
                                    <div className="col-xs-4 radios">
                                        <div className="row padding-left15">
                                            <FormItem>
                                                <RadioGroup {...getFieldProps('RebateSetType', {
                                                    validate: [{
                                                        rules: [
                                                            { required: true, message: '请选择返利设置' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) }>
                                                    <Radio value="1">分销返利<span className="color-red padding-left10">(用户可以通过发展下级获得佣金，并成为代理)</span></Radio>
                                                    <Radio value="2" className="margin-top15">奖励返利<span className="color-red padding-left10">(用户可以通过推广产品获得奖励，不成为代理)</span></Radio>
                                                    <Radio value="0" className="margin-top15">关闭返利</Radio>
                                                </RadioGroup>
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>享有收益是否需要购买：</label>
                                    <div className="col-xs-4 radios">
                                        <div className="row radios-block padding-left15">
                                            <FormItem hasFeedback>
                                                <RadioGroup  {...getFieldProps('IsNeedBuyForRebate', {
                                                    validate: [{
                                                        rules: [
                                                            { required: true, message: '请选择分利权类型' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } >
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
                                    <label className="control-label col-xs-2">商品规格：</label>
                                    <div className="col-xs-8">
                                        <SizeCategory defaultCategoryProperty={this.state.SelectCategoryProperty} defaultTableData={this.state.DefaultTableData}
                                            creataTableData={this.creataTableData}></SizeCategory>
                                    </div>
                                </div>
                            </div>
                            {this.state.TableData.length > 0 ?
                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2">商品库存：</label>
                                        <div className="col-xs-8">
                                            <ProductSize TableData={this.state.TableData} tableDataChange={this.tableDataChange} rebateSetType={getFieldValue("RebateSetType")} editPropertyRebate={this.editPropertyRebate}></ProductSize>

                                        </div>
                                    </div>
                                </div> : ""
                            }
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>总库存：</label>
                                    <div className="col-xs-4">
                                        <FormItem hasFeedback>
                                            <Input type="text" className="form-control" placeholder="总库存" disabled={this.state.TableData.length > 0} {...getFieldProps('TotalInventory', {
                                                validate: [{
                                                    rules: [
                                                        { required: true, message: '请填写总库存' },
                                                        { validator: RegExpVerify.checkPositiveInteger },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                }]
                                            }) } />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            {this.state.TableData.length == 0 ?
                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2">商品编码：</label>
                                        <div className="col-xs-4">
                                            <FormItem hasFeedback>
                                                <Input type="text" className="form-control" placeholder="商品编码" {...getFieldProps('MerchantCode', {
                                                    validate: [{
                                                        rules: [
                                                            { required: false, message: '请填写商品编码' },
                                                        ], trigger: ['onBlur', 'onChange'],
                                                    }]
                                                }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div> : ""
                            }
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>商品价格：</label>
                                    <div className="col-xs-4">
                                        <div className="row">
                                            <div className="col-xs-6">
                                                <div className="input-group m-bot15">
                                                    <FormItem>
                                                        <Input addonBefore="售价" addonAfter="¥" className="form-control" placeholder="商品价格" disabled={this.state.TableData.length > 0} {...getFieldProps('SalePrice', {
                                                            validate: [{
                                                                rules: [
                                                                    { required: true, message: '请填写商品价格' },
                                                                    { validator: RegExpVerify.checkMoney },
                                                                ], trigger: ['onBlur', 'onChange'],
                                                            }]
                                                        }) } />
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="col-xs-6">
                                                <FormItem>
                                                    <Input addonBefore="原价" addonAfter="¥" className="form-control" placeholder="原价" {...getFieldProps('MarketPrice', {
                                                        validate: [{
                                                            rules: [
                                                                { required: true, message: '请填写商品原价' },
                                                                { validator: RegExpVerify.checkMoney },
                                                            ], trigger: ['onBlur', 'onChange'],
                                                        }]
                                                    }) } />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row margin0">
                                    <label className="control-label col-xs-2"><span className="color-red">*</span>运费设置：</label>
                                    <div className="col-xs-4">
                                        <FormItem hasFeedback>
                                            <RadioGroup  {...getFieldProps('IsUnifyPostage', {
                                                validate: [{
                                                    rules: [
                                                        { required: true, message: '请选择运费设置' },
                                                    ], trigger: ['onBlur', 'onChange'],
                                                }]
                                            }) } onChange={this.radioOnChange}>
                                                <Radio value="true" >统一运费</Radio>
                                                <Radio value="false" >运费模版</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: getFieldValue("IsUnifyPostage") == "true" ? "" : "none" }}>
                                <div className="row margin0">
                                    <label className="control-label col-xs-2">统一运费：</label>
                                    <div className="col-xs-2">
                                        <FormItem hasFeedback>
                                            <Input className="cp1 form-control" placeholder="统一运费" {...unifyPostagePriceProps} />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: getFieldValue("IsUnifyPostage") == "false" ? "" : "none" }}>
                                <div className="row margin0">
                                    <label className="control-label col-xs-2" >运费模板：</label>
                                    <div className="col-xs-2">
                                        <FormItem hasFeedback>
                                            <Select allowClear={true} placeholder="请选择运费模板" {...fareTemplateIdProps}>
                                                {this.state.fareTemplateData.map(function (item) {
                                                    return (
                                                        <Option key={"key_" + item.Id} value={item.Id}>{item.Name}</Option>
                                                    );
                                                })}
                                            </Select>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: getFieldValue("RebateSetType") != "0" && this.state.TableData.length == 0 ? "" : "none" }}>
                                <div className="form-group margin0">
                                    <div className="row margin15">
                                        <div className="col-xs-4 col-xs-push-2 m-bot15">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <Button onClick={this.computerAllDividedMoney} type="ghost">根据比例重新计算返利</Button>
                                                    </div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <Checkbox  {...isRemoveDecimalPlaceProps} onChange={this.setIsRemoveDecimalPlaceChange}> 抹去小数位</Checkbox>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group margin0">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2 color-green">一级代理分成</label>
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <FormItem key="oneDividedMoney" >
                                                            <Input addonBefore="返利金额" addonAfter="元"  {...oneDividedMoneyProps} className="form-control" onChange={(e) => this.changeRebateMoney(e, "OneLevelDividedProportion")} />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <FormItem key="OneLevelDividedProportion" >
                                                            <Input addonBefore="返利比例" addonAfter="%" {...oneLevelDividedProportionProps} onChange={(e) => this.changeCalculateRebateMoney(e, "OneDividedMoney")} className="form-control" placeholder="一级代理分成比例" />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group margin0">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2 color-green">二级代理分成</label>
                                        <div className="col-xs-4">
                                            <div className="row">

                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <FormItem key="twoLevelDividedMoney">
                                                            <Input addonBefore="返利金额" addonAfter="元"  {...twoDividedMoneyProps} className="form-control" onChange={(e) => this.changeRebateMoney(e, "TwoLevelDividedProportion")} />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <FormItem key="TwoLevelDividedProportion">
                                                            <Input addonBefore="返利比例" addonAfter="%" {...twoLevelDividedProportionProps} onChange={(e) => this.changeCalculateRebateMoney(e, "TwoDividedMoney")} className="form-control" placeholder="二级代理分成比例" />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group margin0">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2 color-green">三级代理分成</label>
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <FormItem key="threeLevelDividedMoney">
                                                            <Input addonBefore="返利金额" addonAfter="元" {...threeDividedMoneyProps} className="form-control" onChange={(e) => this.changeRebateMoney(e, "ThreeLevelDividedProportion")} />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">
                                                        <FormItem key="ThreeLevelDividedProportion">
                                                            <Input addonBefore="返利比例" addonAfter="%" {...threeLevelDividedProportionProps} onChange={(e) => this.changeCalculateRebateMoney(e, "ThreeDividedMoney")} className="form-control" placeholder="三级代理分成比例" />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {getFieldValue("RebateSetType") == "1" ? partnerLevelDividedMoneyDom : null}
                                <div className="form-group">
                                    <div className="row margin0">
                                        <label className="control-label col-xs-2 color-red"></label>
                                        <div className="col-xs-4">
                                            <p className="color9 margin-top10 color-blue">您的设置合计返利：<span className="font20 color-red">{totalDividedMoney}</span>元（其中代理<span className="font16 ">{threeLevelTotalDividedMoney}</span>元，合作伙伴最大返利<span className="font16">{partnerMaxDividedMoney}</span>元），占总价的
                                                    <span className="font16 color-red">{totalDividedProportion}%</span> 。</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >

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
                </Form >
                <Modal title="分利设置" visible={this.state.visibleForm} onCancel={this.closeForm} width={610} maskClosable={false} footer={[]} >
                    <ProductSizeRebate distributionType={getFieldValue("RebateSetType")} salePrice={this.state.selectedSalePrice} goodsId={this.state.selectedRowId} selectedRowIndex={this.state.selectedRowIndex} onCancel={this.closeForm} onSubmit={this.onSubmit} rebateRecord={this.state.rebateRecord}></ProductSizeRebate>
                </Modal>
            </div >
        );
    }
}


let ProductInfoSetStep2Page = Form.create({})(ProductInfoSetStep2);
export { ProductInfoSetStep2Page }


