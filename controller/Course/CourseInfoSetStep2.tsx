import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import RegExpVerify from '../../pub/RegExpVerify';
import { Table, Row, Col, Modal, Form, Input, Button, Popconfirm, message, Switch, Radio, Checkbox } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';

//api
import CourseApi from './CourseApi';
import MemberSetInfoApi from '../manager/MemberSetInfo/Api';
import PartnerApi from '../Partner/Api';
const RadioGroup = Radio.Group;

const store = BaseStore({});


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class CourseInfoSetStep2 extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.handelSubmit = this.handelSubmit.bind(this);
        this.loadMemberRebateConfig = this.loadMemberRebateConfig.bind(this);
        this.loadPartnerRebateConfig = this.loadPartnerRebateConfig.bind(this);
        this.initCourseRebateInfo = this.initCourseRebateInfo.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.setNeedBuyForDealershipChange = this.setNeedBuyForDealershipChange.bind(this);
        this.changeCalculateRebateMoney = this.changeCalculateRebateMoney.bind(this);
        this.computerAllDividedMoney = this.computerAllDividedMoney.bind(this);
        this.inputMoneyChange = this.inputMoneyChange.bind(this);
        this.setIsRemoveDecimalPlaceChange = this.setIsRemoveDecimalPlaceChange.bind(this);
        this.changeRebateMoney = this.changeRebateMoney.bind(this);
        this.setDistributionTypeChange = this.setDistributionTypeChange.bind(this);
        this.rebateSetTypeChange = this.rebateSetTypeChange.bind(this);

        this.state = {
            memberRebateConfig: [],
            partnerRebateConfig: [],
            CourseProductId: LocalStorage.get('CourseProductId'),
            editNextId: -1,
            fixFloatNum: 2
        }


    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {

        this.loadPartnerRebateConfig();
        this.loadMemberRebateConfig();
        this.initCourseRebateInfo();
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


    initCourseRebateInfo() {
        var _this = this;
        const { setFieldsValue } = this.props.form;
        var productId = _this.state.CourseProductId;

        CourseApi.getCourseRebateInfo({ Id: productId }).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;
                var setObj = {
                    "MarketPrice": String(obj.MarketPrice), "SalePrice": String(obj.SalePrice),
                    "OneLevelDividedProportion": String(obj.OneLevelDividedProportion),
                    "TwoLevelDividedProportion": String(obj.TwoLevelDividedProportion), "ThreeLevelDividedProportion": String(obj.ThreeLevelDividedProportion),
                    "DistributionType": String(obj.DistributionType), "IsNeedBuyForRebate": String(obj.IsNeedBuyForRebate),
                    "IsNeedBuyForDealership": String(obj.IsNeedBuyForDealership), "OneDividedMoney": String(obj.OneDividedMoney), "TwoDividedMoney": String(obj.TwoDividedMoney),
                    "ThreeDividedMoney": String(obj.ThreeDividedMoney), "RebateSetType": String(obj.RebateSetType),
                }

                obj.PartnerTypeDividedList.map(function (item, i) {
                    var proportionKeyName = 'PartnerLevelDividedProportion_' + item.Id;
                    setObj[proportionKeyName] = String(item.RebateProportion);
                    var moneyKeyName = 'PartnerLevelDividedMoney_' + item.Id;
                    setObj[moneyKeyName] = String(item.Commission);
                });

                setFieldsValue(setObj);


            } else {
                message.error(data.Message);
            }
        });

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

    loadMemberRebateConfig() {
        var _this = this;
        MemberSetInfoApi.getMemberRebateConfig({}).then(function (data) {
            if (data.IsOK) {
                _this.state.memberRebateConfig = data.Value;

            } else {
                message.error(data.Message);
            }
        });

    }

    loadPartnerRebateConfig() {
        var _this = this;
        PartnerApi.getPartnerTypeList({}).then(function (data) {
            if (data.IsOK) {
                _this.state.partnerRebateConfig = data.Value;
                _this.setState({ partnerRebateConfig: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    fixNumber(inputNum) {

        inputNum = inputNum.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
        inputNum = inputNum.replace(/^\./g, ""); //验证第一个字符是数字而不是.  
        inputNum = inputNum.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
        inputNum = inputNum.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        inputNum = inputNum.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  


        return inputNum;
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


    inputMoneyChange(e) {
        const { setFieldsValue } = this.props.form;
        var targetName = e.target.id;
        var number = this.fixNumber(e.target.value);
        var setObj = {};
        setObj[targetName] = number;
        setFieldsValue(setObj);

    }

    handelSubmit(step) {
        var _self = this;
        var form = _self.props.form;

        _self.props.form.validateFields((errors, values) => {
            var obj = form.getFieldsValue();
            obj.Id = _self.state.CourseProductId;

            if (!!errors) {
                _self.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }

            var partnerLevelConfigObj = [];
            var PartnerMoneyArray = [];
            _self.state.partnerRebateConfig.map(function (item, i) {

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

            if (obj.IsEnableDivided == true) {

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
            console.log(obj);

            _self.props.nextTab(step, { Second: obj });

        });
    }


    backToCourseList() {
        Tool.goPush('Course/Index');
    }

    //第三步跳转
    nextStep3(id) {
        Tool.goPush('Course/CourseInfoSetStep3');
        LocalStorage.add('CourseProductId', id);
    }

    //第一步跳转
    nextStep1(id) {
        Tool.goPush('Course/CourseInfoSetStep1');
        LocalStorage.add('CourseProductId', id);
    }

    previousStep() {
        var _this = this;
        Tool.goPush('Course/CourseInfoSetStep1');
        LocalStorage.add('CourseProductId', _this.state.CourseProductId);
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

    changeCalculateRebateMoney(e, targetName) {

        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var val = _this.fixNumber(e.target.value);
        var saleMoney = getFieldValue("SalePrice");
        var money = _this.calculateRebateMoney(saleMoney, val);
        var setObj = {};
        setObj[targetName] = parseFloat(money).toFixed(0);
        setObj[e.target.id] = val;
        setFieldsValue(setObj);
    }

    changeRebateMoney(e, targetName) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var val = _this.fixNumber(e.target.value);
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

    //获取普通代理总分成金额
    getThreeLevelTotalDividedMoney() {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        return parseFloat(getFieldValue("OneDividedMoney") || 0) + parseFloat(getFieldValue("TwoDividedMoney") || 0) + parseFloat(getFieldValue("ThreeDividedMoney") || 0);
    }

    //获取合作伙伴总分成金额
    getPartnerMaxDividedMoney() {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;

        var partnerMoneyArray = [];
        _this.state.partnerRebateConfig.map(function (item) {
            partnerMoneyArray.push(parseFloat(getFieldValue('PartnerLevelDividedMoney_' + item.Id)) || 0);
        });
        if (partnerMoneyArray.length > 0)
            return Math.max.apply(0, partnerMoneyArray);
        return 0;
    }

    //获取分利金额总占比
    getTotalDividedProportion() {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var totalDividedProportion = 0;
        var saleMoney = parseFloat(getFieldValue("SalePrice"));

        //合作伙伴分利最大额
        var partnerMaxDividedMoney = _this.getPartnerMaxDividedMoney();

        //普通代理分利总额
        var threeLevelTotalDividedMoney = _this.getThreeLevelTotalDividedMoney();

        //合计返利
        var totalDividedMoney = partnerMaxDividedMoney + threeLevelTotalDividedMoney;

        if (saleMoney > 0) {
            totalDividedProportion = totalDividedMoney / saleMoney * 100;
        }
        return totalDividedProportion;


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

    rebateSetTypeChange(e) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var setObj = { "RebateSetType": e.target.value };
        if (e.target.value != "1") {
            _this.state.partnerRebateConfig.map(function (item) {
                var moneyKeyName = 'PartnerLevelDividedMoney_' + item.Id;
                setObj[moneyKeyName] = "0";
            });
        }
        setFieldsValue(setObj);
    }

    setDistributionTypeChange(e) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var setObj = { "DistributionType": e.target.value };
        if (e.target.value == "2") {
            setObj["TwoDividedMoney"] = "0";
            setObj["TwoLevelDividedProportion"] = "0";
            setObj["ThreeDividedMoney"] = "0";
            setObj["ThreeLevelDividedProportion"] = "0";
        }
        setFieldsValue(setObj);
    }


    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = _self.props.form;

        const salePriceProps = getFieldProps('SalePrice', {

            validate: [{
                rules: [
                    { required: true, message: '请输入价格' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const marketPriceProps = getFieldProps('MarketPrice', {
            validate: [{
                rules: [
                    { required: true, message: '请输入原价' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });




        const oneDividedMoneyProps = getFieldProps('OneDividedMoney', {
            validate: [{
                rules: [
                    { required: true, message: '请输入一级代理分成金额' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const twoDividedMoneyProps = getFieldProps('TwoDividedMoney', {
            validate: [{
                rules: [
                    { required: true, message: '请输入二级代理分成金额' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const threeDividedMoneyProps = getFieldProps('ThreeDividedMoney', {
            validate: [{
                rules: [
                    { required: true, message: '请输入三级代理分成金额' },
                    { validator: RegExpVerify.checkMoney },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const oneLevelDividedProportionProps = getFieldProps('OneLevelDividedProportion', {
            validate: [{
                rules: [
                    { required: true, message: '请输入一级代理分成比例' },
                    { validator: RegExpVerify.checkPercentage },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const twoLevelDividedProportionProps = getFieldProps('TwoLevelDividedProportion', {
            validate: [{
                rules: [
                    { required: true, message: '请输入二级代理分成比例' },
                    { validator: RegExpVerify.checkPercentage },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const threeLevelDividedProportionProps = getFieldProps('ThreeLevelDividedProportion', {
            validate: [{
                rules: [
                    { required: true, message: '请输入三级代理分成比例' },
                    { validator: RegExpVerify.checkPercentage },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const isNeedBuyForRebateProps = getFieldProps('IsNeedBuyForRebate', {
            validate: [{
                rules: [
                    { required: true, message: '请选择分利权类型' },
                ], trigger: ['onBlur', 'onChange'],
            }]

        });


        const rebateSetTypeProps = getFieldProps('RebateSetType', {
            validate: [{
                rules: [
                    { required: true, message: '请选择返利设置' },
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
                        { required: true, message: '请输入' + item.TypeName + '分成比例' },
                        { validator: RegExpVerify.checkPercentage },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });

            const partnerLevelDividedMoneyProps = getFieldProps('PartnerLevelDividedMoney_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请输入' + item.TypeName + '分成金额' },
                        { validator: RegExpVerify.checkMoney },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });



            return (

                <div className="form-group margin0" key={"div_PartnerLevelDividedMoney_" + item.Id}>
                    <div className="row margin0">
                        <label className="control-label col-xs-2" >{item.TypeName}分成</label>
                        <div className="col-xs-4">
                            <div className="row">

                                <div className="col-xs-6">
                                    <div className="input-group m-bot15">

                                        <FormItem key={'PartnerLevelDividedMoney_' + item.Id} >
                                            <Input addonBefore="返利金额" addonAfter="元"  {...partnerLevelDividedMoneyProps} className="form-control" onChange={(e) => _self.changeCalculateRebateMoney(e, 'PartnerLevelDividedProportion_' + item.Id)} />
                                        </FormItem>

                                    </div>
                                </div>

                                <div className="col-xs-6">
                                    <div className="input-group m-bot15">

                                        <FormItem key={'PartnerLevelDividedProportion_' + item.Id} >
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
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>返利设置：</label>
                                        <div className="col-xs-3 radios">
                                            <div className="row radios-block">
                                                <FormItem>
                                                    <RadioGroup {...rebateSetTypeProps} onChange={this.rebateSetTypeChange}>
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
                                        <label className="control-label col-xs-2"><span className="color-red">*</span>课程价格：</label>
                                        <div className="col-xs-4">
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <div className="input-group m-bot15">

                                                        <FormItem key="SalePrice">
                                                            <Input addonBefore="售价" addonAfter="元"  {...salePriceProps} className="form-control" placeholder="售价" />
                                                        </FormItem>

                                                    </div>
                                                </div>
                                                <div className="col-xs-6">

                                                    <FormItem key="MarketPrice">
                                                        <Input addonBefore="原价" addonAfter="元"  {...marketPriceProps} onChange={this.inputMoneyChange} className="form-control" placeholder="原价" />
                                                    </FormItem>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: getFieldValue("RebateSetType") == "0" ? "none" : "" }}>
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
                                    <div style={{ display: getFieldValue("RebateSetType") == "2" ? "none" : "" }}>
                                        {partnerLevelDividedMoneyDom}
                                    </div>
                                    <div className="form-group">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-2 color-red"></label>
                                            <div className="col-xs-4">

                                                <p className="color9 margin-top10 color-blue">您的设置合计返利：<span className="font20 color-red">{totalDividedMoney}</span>元<span style={{ display: getFieldValue("RebateSetType") == "2" ? "none" : "" }}>（其中代理<span className="font16 ">{threeLevelTotalDividedMoney}</span>元，合作伙伴最大返利<span className="font16">{partnerMaxDividedMoney}</span>元）</span>，占总价的
                                                    <span className="font16 color-red">{totalDividedProportion}%</span> 。</p>

                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="seat-80"></div>
                    <div className="position-btm">

                        <div className="row margin0 bg-colorFC padding10 margin-top20">
                            <div className="col-lg-1 col-xs-offset-3">

                            </div>
                            <div className="col-lg-1 margin-left20">
                                <a className="btn btn-block btn-info2" onClick={() => { this.handelSubmit(1) } }>上一步</a>
                            </div>
                            <div className="col-lg-1 margin-left20">
                                <a className="btn btn-block btn-success" onClick={() => { this.handelSubmit(3) } } >下一步</a>
                            </div>
                        </div>


                    </div>

                </Form>
            </div>
        );
    }
}


let CourseInfoSetStep2Page = Form.create({})(CourseInfoSetStep2);
export { CourseInfoSetStep2Page }
