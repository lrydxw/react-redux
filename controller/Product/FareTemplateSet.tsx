import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../pub/Server';
import Config from '../../pub/Config';
import { Button, Modal, Form, Checkbox, Input, Upload, DatePicker, InputNumber, Select, message, Radio, Icon, Switch, Popconfirm, Table } from 'antd';
const FormItem = Form.Item;
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { changeActiveAction, getActive } from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import ProductApi from '../Product/ProductApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class FareTemplateSet extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        let formFareDataElements: FormElement[] = [
            { key: "Region", element: ElementEnum.TreeSelect, type: "array", label: "选择地区城市", message: "请选择地区城市", multiple: true, treeCheckable: true, rules: { required: true, whitespace: true }, dataList: [] },
            { key: "FirstUnit", element: ElementEnum.Input, type: "text", label: "首件/首重", message: "请输入首重/首件", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveFloat }, dataList: [] },
            { key: "FirstPrice", addonAfter: "元", element: ElementEnum.Input, type: "text", label: "首费", message: "请输入首费", rules: { required: true, whitespace: true, validator: RegExpVerify.checkMoney }, dataList: [] },
            { key: "ContinueUnit", element: ElementEnum.Input, type: "text", label: "续件/续重", message: "请输入续件/续重", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveFloat }, dataList: [] },
            { key: "ContinuePrice", addonAfter: "元", element: ElementEnum.Input, type: "text", label: "续费", message: "请输入续费", rules: { required: true, whitespace: true, validator: RegExpVerify.checkMoney }, dataList: [] },
        ];

        this.initFareTemplateInfo = this.initFareTemplateInfo.bind(this);
        this.closeGiftForm = this.closeGiftForm.bind(this);
        this.openEditFareDataForm = this.openEditFareDataForm.bind(this);
        this.submitFareTemplate = this.submitFareTemplate.bind(this);
        this.submitFareDataForm = this.submitFareDataForm.bind(this);
        this.openInsertFareDataForm = this.openInsertFareDataForm.bind(this);
        this.setValuationModelTypeChange = this.setValuationModelTypeChange.bind(this);

        this.state = {
            isInsert: true,//是否是添加 true：添加  false：编辑
            FareDataSetData: formFareDataElements,
            FareDataDefaultValues: {},
            visibleFareDataForm: false,
            selectFareDataList: [],
            fareTemplateId: LocalStorage.get('FareTemplateId'),
            editId: -1,
            editNextId: -1,
            areaData: [],
            selectRegionIdArray: [],
            unitName: ""
        };



    }

    //插入真实DOM之前被执行 
    componentWillMount() {
        this.initArea();
        console.log("componentWillMount");
    }
    //插入真实DOM之后被执行
    componentDidMount() {

        this.initFareTemplateInfo();

    }
    //更新DOM之前被执行
    componentWillUpdate() {
        console.log("componentWillUpdate");
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        console.log("componentDidUpdate");
    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log("componentWillUnmount");
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
    }


    //初始化运费模板信息
    initFareTemplateInfo() {
        var _this = this;
        var obj = obj || {};
        const { setFieldsValue } = _this.props.form;
        obj.Id = _this.state.fareTemplateId;

        if (obj.Id.length <= 0) {
            _this.state.unitName = "件";
            setFieldsValue({
                "ValuationModelType": "1", "IsInclPostage": "true", "DefaultFirstUnit": "0", "DefaultFirstPrice": "0", "DefaultContinueUnit": "0",
                "DefaultContinuePrice": "0" });
            return;
        }

        ProductApi.getFareTemplate(obj).then(function (data) {
            if (data.IsOK) {
                var dataObj = data.Value;
                var setObj = {
                    "Name": dataObj.Name, "IsInclPostage": String(dataObj.IsInclPostage), "ValuationModelType": String(dataObj.ValuationModelType),
                    "DefaultFirstUnit": String(dataObj.DefaultFirstUnit), "DefaultFirstPrice": String(dataObj.DefaultFirstPrice), "DefaultContinueUnit": String(dataObj.DefaultContinueUnit),
                    "DefaultContinuePrice": String(dataObj.DefaultContinuePrice),
                }
                if (dataObj.FareDataList && dataObj.FareDataList.length > 0) {
                    var fareDataList = dataObj.FareDataList;


                    for (var i = 0; i < fareDataList.length; i++) {
                        var fareObj = fareDataList[i];
                        for (var j = 0; j < fareObj.RegionIdArray.length; j++) {
                            _this.state.selectRegionIdArray.push(fareObj.RegionIdArray[j]);
                        }

                    }
                    for (var i = 0; i < fareDataList.length; i++) {
                        fareDataList[i].index = i;
                    }
                    _this.state.selectFareDataList = fareDataList;
                }

                var val = dataObj.ValuationModelType;
                if (val == "1") {
                    _this.state.unitName = "件";
                }
                else if (val == "2") {
                    _this.state.unitName = "KG";
                }

                setFieldsValue(setObj);

            }
            else {
                message.error(data.Message);
            }

        });
    }

    initArea() {
        var _this = this;
        ProductApi.getArea({}).then(function (data) {

            if (data.IsOK) {
                _this.state.FareDataSetData[0].dataList = data.Value;
            }
            else {
                message.error(data.Message);
            }

        });
    }


    //关闭添加地区城市运费配置窗口
    closeGiftForm() {
        this.setState({ visibleFareDataForm: false });
    }



    //打开添加地区城市运费配置窗口
    openEditFareDataForm() {
        this.setState({ isInsert: false, visibleFareDataForm: true, editNextId: -1, editId: "" });

    }

    openInsertFareDataForm() {
        this.setState({ visibleFareDataForm: true, FareDataDefaultValues: {}, isInsert: true, });
    }


    //提交添加地区城市运费配置表单
    submitFareDataForm(obj) {
        var _this = this;


        console.log(obj);

        ProductApi.getAreaNames({ RegionIdArray: obj.Region }).then(function (data) {

            if (data.IsOK) {
                var fareObj = fareObj || {};
                fareObj.Region = data.Value;
                fareObj.FirstUnit = obj.FirstUnit;
                fareObj.FirstPrice = obj.FirstPrice;
                fareObj.ContinueUnit = obj.ContinueUnit;
                fareObj.ContinuePrice = obj.ContinuePrice;
                fareObj.RegionIdArray = obj.Region;

                var arrTemp = _this.state.selectRegionIdArray;
                console.log(arrTemp);
                for (var i = 0; i < arrTemp.length; i++) {
                    for (var j = 0; j < obj.Region.length; j++) {
                        if (arrTemp[i] == obj.Region[j]) {
                            Modal.error({
                                title: '温馨提示',
                                content: '选定的地区已经添加！',
                            });
                            return;
                        }
                    }
                }

                currentFareList.push(fareObj);
                for (var i = 0; i < obj.Region.length; i++) {
                    _this.state.selectRegionIdArray.push(obj.Region[i]);
                }



                for (var i = 0; i < currentFareList.length; i++) {
                    currentFareList[i].index = i;
                }




                _this.setState({ selectFareDataList: currentFareList, visibleFareDataForm: false });
            }
            else {
                message.error(data.Message);
            }

        });

        var currentFareList = _this.state.selectFareDataList;

    }

    /**
     * 删除地区
     * @param record
     */
    deleteFareList(record) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var selectFareData = _this.state.selectFareDataList;
        console.log(record);
        var selectRegionIdArrayTemp = _this.state.selectRegionIdArray;
        console.log(record);


        for (var j = 0; j < record.RegionIdArray.length; j++) {
            var index = -1;
            for (var i = 0; i < selectRegionIdArrayTemp.length; i++) {
                if (selectRegionIdArrayTemp[i] == record.RegionIdArray[j]) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                selectRegionIdArrayTemp.splice(index, 1);
            }
        }



        _this.state.selectRegionIdArray = selectRegionIdArrayTemp;


        var index = _this.arrayIndex(selectFareData, record);
        if (index > -1) {
            selectFareData.splice(index, 1);
        }



        console.log(_this.state.selectRegionIdArray);
        _this.setState({ selectFareDataList: selectFareData });

    }

    setValuationModelTypeChange(e) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var val = e.target.value;
        if (val == "1") {
            _this.state.unitName = "件";
        }
        else if (val == "2") {
            _this.state.unitName = "KG";
        }
        setFieldsValue({ "ValuationModelType": val });
    }

    /**
    * 判断表单是否已选
    * @param arr
    * @param obj
    */
    arrayContains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].index === obj.index) {
                return true;
            }
        }
        return false;
    }


    /**
    * 获取数组中某个对象的index
    * @param arr
    * @param obj
    */
    arrayIndex(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].index === obj.index) {
                return i;
            }
        }
        return -1;
    }


    submitFareTemplate() {
        var _this = this;
        var form = _this.props.form;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();

            obj.Id = _this.state.fareTemplateId;
            obj.FareData = JSON.stringify(_this.state.selectFareDataList);

            if (obj.Id.length <= 0) {

                ProductApi.insertFareTemplate(obj).then(function (data) {
                    if (data.IsOK) {
                        Modal.success({
                            title: '操作成功',
                            content: '运费模板信息已保存',
                            onOk() {
                                Tool.goPush('Product/FareTemplateIndex');
                            }
                        });

                    } else {
                        message.error(data.Message);
                    }
                });
            }

            else {
                ProductApi.updateFareTemplate(obj).then(function (data) {
                    if (data.IsOK) {
                        Modal.success({
                            title: '操作成功',
                            content: '运费模板信息已保存',
                            onOk() {
                                Tool.goPush('Product/FareTemplateIndex');
                            }
                        });
                    } else {
                        message.error(data.Message);
                    }
                });
            }

        });
    }



    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;

        const nameProps = getFieldProps('Name', {
            validate: [{
                rules: [
                    { required: true, message: '请输入模板名称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const isInclPostageProps = getFieldProps('IsInclPostage', {
            validate: [{
                rules: [
                    { required: true, message: '请选择是否包邮' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const valuationModelTypeProps = getFieldProps('ValuationModelType', {
            validate: [{
                rules: [
                    { required: true, message: '请选择计价方式' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const defaultFirstUnitProps = getFieldProps('DefaultFirstUnit', {
            validate: [{
                rules: [
                    { required: true, message: '请输入默认首件/首重' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const defaultFirstPriceProps = getFieldProps('DefaultFirstPrice', {
            validate: [{
                rules: [
                    { required: true, message: '请输入默认价格' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const defaultContinueUnitProps = getFieldProps('DefaultContinueUnit', {
            validate: [{
                rules: [
                    { required: true, message: '请输入默认续件/续重' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const defaultContinuePriceProps = getFieldProps('DefaultContinuePrice', {
            validate: [{
                rules: [
                    { required: true, message: '请输入价格' },
                    { validator: RegExpVerify.checkPositiveFloat },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const FareDataColumns = [
            {
                title: '运送到',
                dataIndex: 'Region',
                key: 'Region',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '首件/首重',
                dataIndex: 'FirstUnit',
                key: 'FirstUnit',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '首费（元）',
                dataIndex: 'FirstPrice',
                key: 'FirstPrice',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '续件/续重',
                dataIndex: 'ContinueUnit',
                key: 'ContinueUnit',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '续费',
                dataIndex: 'ContinuePrice',
                key: 'ContinuePrice',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <Popconfirm title="确定要移除该项吗？" onConfirm={() => { this.deleteFareList(record) } }>
                            <a href="javascript:;">移除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];


        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 7 },
        };


        var _self = this;
        return (

            <AppBody>

                <Form horizontal>
                    <div className="main-content-title padding-top15 clearfix">
                        <a className="main-content-word pull-left set-content-word-te" href="#">设置运费模板</a>
                    </div>

                    <div className="row padding-top20 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>运费模板信息</b>
                        </div>
                        <div className="col-lg-10 col-sm-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-horizontal tasi-form" >
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>模板名称：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="Name">
                                                        <Input {...nameProps} className="cp1 form-control" placeholder="模板名称" />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>是否包邮：</label>
                                                <div className="col-xs-4 radios">
                                                    <div className="row radios-block">
                                                        <FormItem key="isInclPostage">
                                                            <RadioGroup  {...isInclPostageProps} >
                                                                <Radio value="true" >卖家承担运费</Radio>
                                                                <Radio value="false" >自定义运费</Radio>
                                                            </RadioGroup>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: getFieldValue("IsInclPostage") == "true" ? "none" : "" }}>
                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">计价方式：</label>
                                                    <div className="col-xs-4 radios">
                                                        <div className="row radios-block">
                                                            <FormItem key="valuationModelType">
                                                                <RadioGroup  {...valuationModelTypeProps} onChange={this.setValuationModelTypeChange} >
                                                                    <Radio value="1" >按件数</Radio>
                                                                    <Radio value="2" >按重量</Radio>
                                                                </RadioGroup>
                                                            </FormItem>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">运费设置：</label>
                                                    <div className="col-xs-5">
                                                        除指定地区外，其余地区的运费采用“默认运费”
                                                </div>
                                                    <div className="col-xs-8 ">
                                                        <div className="row">
                                                            <div className="col-xs-12 ">
                                                                <div className=" border1 border-radius5">
                                                                    <div className="row  padding-top20 padding-btm10 padding-left20 padding-right20">
                                                                        <div className="col-xs-12">
                                                                            <div className="row">
                                                                                <div className="col-xs-4 padding0">
                                                                                    <div className="row">
                                                                                        <div className="col-xs-4"><p className="color3 margin-top10 text-right">默认运费：</p></div>
                                                                                        <div className="col-xs-4 padding0">
                                                                                            <FormItem key="defaultFirstUnit">
                                                                                                <Input {...defaultFirstUnitProps} className="cp1 form-control" />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                        <div className="col-xs-4"><p className="color3 margin-top10">{this.state.unitName}以内，</p></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xs-2">
                                                                                    <div className="row">
                                                                                        <div className="col-xs-9 padding0">
                                                                                            <FormItem key="defaultFirstPrice">
                                                                                                <Input {...defaultFirstPriceProps} className="cp1 form-control" />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                        <div className="col-xs-3"><p className="color3 margin-top10">元；</p></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xs-3">
                                                                                    <div className="row">
                                                                                        <div className="col-xs-4 padding-right0"><p className="color3 margin-top10 text-right ">每增加：</p></div>
                                                                                        <div className="col-xs-6 padding0">
                                                                                            <FormItem key="defaultContinueUnit">
                                                                                                <Input {...defaultContinueUnitProps} className="cp1 form-control" />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                        <div className="col-xs-2"><p className="color3 margin-top10">{this.state.unitName}；</p></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xs-3 ">
                                                                                    <div className="row">
                                                                                        <div className="col-xs-6"><p className="color3 margin-top10 text-right">增加运费：</p></div>
                                                                                        <div className="col-xs-4 padding0">
                                                                                            <FormItem key="defaultContinuePrice">
                                                                                                <Input {...defaultContinuePriceProps} className="cp1 form-control" />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                        <div className="col-xs-2"><p className="color3 margin-top10">元</p></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>


                                                                    <Table columns={FareDataColumns} dataSource={this.state.selectFareDataList} pagination={false} />
                                                                    <div className="margin-top5">
                                                                        <a className="color-blue font12 text-left" onClick={this.openInsertFareDataForm} >+为指定地区城市设置运费</a>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
                            <div className="col-lg-1 col-xs-offset-4">

                            </div>
                            <div className="col-lg-1 margin-left20">
                                <a className="btn btn-block btn-success" onClick={this.submitFareTemplate} >保存</a>
                            </div>
                            <div className="col-lg-1 margin-left20">

                            </div>
                        </div>

                    </div>


                </Form>
                
                    <Modal title="为指定地区城市设置运费" visible={this.state.visibleFareDataForm} onCancel={this.closeGiftForm} maskClosable={false} footer={[]} >
                        <FormTemplate formElements={this.state.FareDataSetData} defaultValues={this.state.FareDataDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitFareDataForm} onCancel={this.closeGiftForm}></FormTemplate>
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

let FareTemplateSetPage = Form.create({})(FareTemplateSet);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(FareTemplateSetPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
