import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../pub/Server';
import Config from '../../pub/Config';
import { Button, Modal, Form, Checkbox, Input, Upload, DatePicker, InputNumber, Select, message, Radio, Icon, Switch, Table, Popconfirm } from 'antd';
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
import PartnerApi from './Api';
import ProductApi from '../Product/ProductApi';
import AgencyManageApi from '../User/AgencyManageApi';
//表单验证模块
import RegExpVerify from '../../pub/RegExpVerify';
import Verifier from '../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;
let owner = null;

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class PartnerOpenUpIndex extends BaseContainer {


    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        owner = this;
        let formGiftElements: FormElement[] = [

            { key: "GoodsId", element: ElementEnum.Select, type: "string", label: "选择商品", message: "请选择商品", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "IsContainGifts", element: ElementEnum.Radio, type: "text", label: "含有赠品是否需要赠送", message: "请选择", rules: { required: true, whitespace: true }, dataList: [{ "value": "true", "label": "是" }, { "value": "false", "label": "否" },] },
        ];

        let formChargeElements: FormElement[] = [
            { key: "AllCount", element: ElementEnum.Input, type: "text", label: "充值名额数量", message: "请输入充值名额数量", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveInteger }, dataList: [] },
            { key: "Remark", element: ElementEnum.Textarea, type: "text", label: "备注", message: "请输入备注", rules: { required: false, whitespace: true }, dataList: [] },
        ];

        let formDeductElements: FormElement[] = [
            { key: "AllCount", element: ElementEnum.Input, type: "text", label: "扣除名额数量", message: "请输入扣除名额数量", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveInteger }, dataList: [] },
            { key: "Remark", element: ElementEnum.Textarea, type: "text", label: "备注", message: "请输入备注", rules: { required: false, whitespace: true }, dataList: [] },
        ];

        this.closeGiftForm = this.closeGiftForm.bind(this);
        this.openGiftForm = this.openGiftForm.bind(this);
        this.loadGiftData = this.loadGiftData.bind(this);
        this.submitGiftForm = this.submitGiftForm.bind(this);
        this.loadSelectPartnerTypeData = this.loadSelectPartnerTypeData.bind(this);
        this.initAgencyInfo = this.initAgencyInfo.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.initPartnerInfo = this.initPartnerInfo.bind(this);
        this.selectGoodsIdChange = this.selectGoodsIdChange.bind(this);
        this.closeGiftChargeForm = this.closeGiftChargeForm.bind(this);
        this.openChargeForm = this.openChargeForm.bind(this);
        this.submitGiftChargeForm = this.submitGiftChargeForm.bind(this);
        this.closeGiftDeductForm = this.closeGiftDeductForm.bind(this);
        this.openDeductForm = this.openDeductForm.bind(this);
        this.submitGiftDeductForm = this.submitGiftDeductForm.bind(this);


        this.state = {
            MemberId: LocalStorage.get('MemberId'),
            isInsert: true,//是否是添加 true：添加  false：编辑
            giftSetData: formGiftElements,
            giftDefaultValues: {},
            visibleGiftForm: false,
            selectGiftList: [],
            giftData: [],
            selectPartnerTypeData: [],
            AgencyInfo: {},
            editId: -1,
            editNextId: -1,

            giftChargeData: formChargeElements,
            giftChargeDefaultValues: {},
            visibleGiftChargeForm: false,

            giftDeductData: formDeductElements,
            giftDeductDefaultValues: {},
            visibleGiftDeductForm: false,

        };



    }

    //插入真实DOM之前被执行 
    componentWillMount() {
        this.loadGiftData();
        console.log("componentWillMount");
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.loadSelectPartnerTypeData();
        this.initAgencyInfo();
        this.initPartnerInfo();

    }
    //更新DOM之前被执行
    componentWillUpdate() {
        console.log("componentWillUpdate");
    }
    //更新DOM之后被执行
    componentDidUpdate() {
        var _this = this;
        if (_this.state.editId !== _this.state.editNextId && _this.state.visibleGiftForm === true) {

            var rightsList = _this.state.selectGiftList;
            for (var i = 0; i <= rightsList.length; i++) {
                if (rightsList[i].Id == _this.state.editId) {
                    rightsList[i].AllCount = String(rightsList[i].AllCount);
                    rightsList[i].IsContainGifts = String(rightsList[i].IsContainGifts);
                    _this.setState({ giftDefaultValues: rightsList[i], editId: rightsList[i].Id });
                    break;
                }
            }

            _this.state.editNextId = _this.state.editId;
        }

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



    selectGoodsIdChange(value) {

        ProductApi.getProductBasicInfo({ Id: value }).then(function (data) {
            if (data.IsOK) {
                if (data.Value.IsHasGift) {
                    owner.state.giftSetData[2].display = true;
                }
                else {
                    owner.state.giftSetData[2].display = false;
                }

            }
            else {
                message.error(data.Message);
            }
        });
        return value;
    }


    //关闭添加赠品窗口
    closeGiftForm() {
        this.setState({ visibleGiftForm: false });
    }

    //关闭名额充值窗口
    closeGiftChargeForm() {
        this.setState({ visibleGiftChargeForm: false });
    }

    //打开名额充值窗口
    openChargeForm(record) {

        this.setState({ isInsert: false, visibleGiftChargeForm: true, editNextId: -1, editId: record.Id });
    }

    //关闭名额扣除窗口
    closeGiftDeductForm() {
        this.setState({ visibleGiftDeductForm: false });
    }

    //打开名额扣除窗口
    openDeductForm(record) {

        this.setState({ isInsert: false, visibleGiftDeductForm: true, editNextId: -1, editId: record.Id });
    }

    openEditForm(record) {

        this.setState({ isInsert: false, visibleGiftForm: true, editNextId: -1, editId: record.Id });
    }

    //打开添加赠品窗口
    openGiftForm() {
        this.setState({ visibleGiftForm: true, isInsert: true, giftDefaultValues: {}, editId: -1 });
    }

    //加载赠品数据
    loadGiftData() {
        var _this = this;
        ProductApi.getDonationList({ ProductType:2}).then(function (data) {

            if (data.IsOK) {
                var arrayData = [];
                for (var i = 0; i < data.Value.length; i++) {
                    arrayData.push({ key: data.Value[i].GoodsName, value: String(data.Value[i].GoodsId) });
                }
                _this.state.giftData = data.Value;
                _this.state.giftSetData[0].dataList = arrayData;


            }
            else {
                message.error(data.Message);
            }

        });
    }

    goToPartnerCountHistory(record) {
        LocalStorage.add('RightsInterestsId', record.RightsInterestsId);
        Tool.goPush('Partner/PartnerRightsInterestsHistoryIndex');
    }

    //提交充值名额表单
    submitGiftChargeForm(obj) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var currentGiftList = _this.state.selectGiftList;
        for (var i = 0; i <= currentGiftList.length; i++) {
            if (_this.state.editId == currentGiftList[i].Id) {
                currentGiftList[i].AllCount += parseInt(obj.AllCount);
                currentGiftList[i].RemainingCount = currentGiftList[i].AllCount - currentGiftList[i].SentoutCount;
                currentGiftList[i].Remark = obj.Remark;
                break;
            }
        }

        _this.setState({ selectGiftList: currentGiftList, visibleGiftChargeForm: false });
    }

    //提交扣除名额表单
    submitGiftDeductForm(obj) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        
        var currentGiftList = _this.state.selectGiftList;
        for (var i = 0; i <= currentGiftList.length; i++) {
            if (_this.state.editId == currentGiftList[i].Id) {
                var allCount = currentGiftList[i].AllCount;


                if (allCount - parseInt(obj.AllCount) < 0) {
                    Modal.error({
                        title: '温馨提示',
                        content: '手下留情，名额要被你扣成负数了！',

                    });
                    return false;
                }
                currentGiftList[i].AllCount -= parseInt(obj.AllCount);
                currentGiftList[i].RemainingCount = currentGiftList[i].AllCount - currentGiftList[i].SentoutCount;
                currentGiftList[i].Remark = obj.Remark;
                break;
            }
        }

        _this.setState({ selectGiftList: currentGiftList, visibleGiftDeductForm: false });

    }


    //提交添加赠品表单
    submitGiftForm(obj) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var giftDataList = _this.state.giftData;
        var giftName = "";

        var index = _this.arrayIndex(giftDataList, obj);
        if (index > -1) {
            giftName = giftDataList[index].GoodsName;
        }

        var rightsName = giftName + "（" + (obj.IsContainGifts == "true" ? "含赠品" : "不含赠品") + "）";
        var currentGiftList = _this.state.selectGiftList;

        var giftObj = giftObj || {};

        //添加新权益
        if (_this.state.isInsert) {

            //if (_this.arrayContains(currentGiftList, obj)) {
            //    Modal.error({
            //        title: '眼睛睁大了么',
            //        content: '该商品权益已经添加！',

            //    });
            //    return;
            //}
            giftObj.IsContainGifts = obj.IsContainGifts;
            giftObj.GoodsName = giftName;
            giftObj.AllCount = 0;
            giftObj.GoodsId = obj.GoodsId;
            giftObj.SentoutCount = 0;
            giftObj.RemainingCount = giftObj.AllCount - giftObj.SentoutCount;
            giftObj.Id = currentGiftList.length + 1;
            giftObj.Remark = obj.Remark;
            giftObj.RightsName = rightsName;
            currentGiftList.push(giftObj);

        }
        else {
            for (var i = 0; i <= currentGiftList.length; i++) {
                if (_this.state.editId == currentGiftList[i].Id) {
                    currentGiftList[i].IsContainGifts = obj.IsContainGifts;
                    currentGiftList[i].GoodsName = giftName;
                    currentGiftList[i].AllCount = obj.AllCount;
                    currentGiftList[i].GoodsId = obj.GoodsId;
                    currentGiftList[i].RemainingCount = currentGiftList[i].AllCount - currentGiftList[i].SentoutCount;
                    currentGiftList[i].Remark = obj.Remark;
                    currentGiftList[i].RightsName = rightsName;
                    break;
                }
            }

        }

        _this.setState({ selectGiftList: currentGiftList, visibleGiftForm: false });

    }

    /**
     * 删除赠品
     * @param record
     */
    deleteGiftList(record) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        var selectGiftData = _this.state.selectGiftList;
        var index = _this.arrayIndex(selectGiftData, record);
        if (index > -1) {
            selectGiftData.splice(index, 1);
        }
        console.log(JSON.stringify(selectGiftData));
        _this.setState({ selectGiftList: selectGiftData });

    }


    /**
    * 判断表单是否已选
    * @param arr
    * @param obj
    */
    arrayContains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].GoodsId === obj.GoodsId) {
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
            if (arr[i].GoodsId === obj.GoodsId) {
                return i;
            }
        }
        return -1;
    }


    loadSelectPartnerTypeData() {
        var _this = this;

        PartnerApi.getPartnerTypeSelectData({}).then(function (data) {
            if (data.IsOK) {

                _this.setState({ selectPartnerTypeData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }

    initAgencyInfo() {
        var _this = this;
        var memberId = _this.state.MemberId;
        AgencyManageApi.getAgencyDetailMemberInfo({ AgencyMemberId: memberId }).then(function (data) {
            if (data.IsOK) {
                var obj = obj || {};
                var result = data.Value;
                obj.WeId = result.WeId;
                obj.HeadImgURL = result.HeadImgURL;
                obj.Mobile = result.Mobile;
                obj.RealName = result.RealName;
                obj.SuperiorAnency = result.SuperiorAnency;
                obj.LastLoginTime = result.LastLoginTime;
                obj.NickName = result.NickName;
                _this.state.AgencyInfo = obj;
                _this.setState({ AgencyInfo: obj });

            }
            else {
                message.error(data.Message);
            }

        });
    }

    initPartnerInfo() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var memberId = _this.state.MemberId;

        PartnerApi.getPartner({ AgencyId: memberId }).then(function (data) {
            if (data.IsOK) {
                var dataObj = data.Value;
                var setObj = {};
                if (dataObj.PartnerTypeId) {
                    setObj["PartnerTypeId"] = dataObj.PartnerTypeId;
                }
                if (dataObj.PartnerStatus > 0) {
                    setObj["PartnerStatus"] = String(dataObj.PartnerStatus);
                }


                if (dataObj.PartnerRightsInfoList && dataObj.PartnerRightsInfoList.length > 0) {
                    _this.state.selectGiftList = dataObj.PartnerRightsInfoList;

                    var currentGiftList = dataObj.PartnerRightsInfoList;
                    for (var i = 0; i < currentGiftList.length; i++) {
                        currentGiftList[i].Id = i;
                    }
                    _this.state.selectGiftList = currentGiftList;



                }

                setFieldsValue(setObj);


            }
            else {
                message.error(data.Message);
            }

        });
    }



    handleSubmit() {
        var _this = this;
        var form = _this.props.form;
        this.props.form.validateFields((errors, values) => {
            var obj = form.getFieldsValue();
            console.log(obj);
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            obj.AgentId = _this.state.MemberId;
            obj.SelectPartnerRightsDataList = JSON.stringify(_this.state.selectGiftList);
            PartnerApi.setPartner(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: "合作伙伴设置成功",
                        onOk() {
                            Tool.goPush('Partner/PartnerManageIndex');
                        },
                    });

                } else {
                    message.error(data.Message);
                }
            });




        });
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;


        const partnerTypeIdProps = getFieldProps('PartnerTypeId', {
            validate: [{
                rules: [
                    { required: true, message: '请选择合作伙伴类型' },
                ], trigger: ['onBlur', 'onChange'],
            }]

        });

        const partnerStatusProps = getFieldProps('PartnerStatus', {
            validate: [{
                rules: [
                    { required: true, message: '请选择合作伙伴状态' },
                ], trigger: ['onBlur', 'onChange'],
            }]

        });


        const giftProductColumns = [
            {
                title: '权益名称',
                dataIndex: 'RightsName',
                key: 'RightsName',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '商品名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '名额总量',
                dataIndex: 'AllCount',
                key: 'AllCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '已使用数量',
                dataIndex: 'SentoutCount',
                key: 'SentoutCount',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '剩余数量',
                dataIndex: 'RemainingCount',
                key: 'RemainingCount',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '含有赠品是否需要赠送',
                dataIndex: 'IsContainGifts',
                key: 'IsContainGifts',
                render: (text, record) => (<span> {String(record.IsContainGifts) == "true" ? "是" : "否"}</span>),
            },

            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    if (record.RightsInterestsId) {
                        return (
                            <span>
                                <a href="javascript:;" onClick={() => { this.openChargeForm(record) } }>充值名额</a>
                                <span className="ant-divider"></span>
                                <a href="javascript:;" onClick={() => { this.openDeductForm(record) } }>扣除名额</a>
                                <span className="ant-divider"></span>
                                <a href="javascript:;" onClick={() => { this.goToPartnerCountHistory(record) } } >查看记录</a>
                            </span>
                        )
                    }
                    else {
                        return (
                            <span>
                                <a href="javascript:;" onClick={() => { this.openChargeForm(record) } }>充值名额</a>
                                <span className="ant-divider"></span>
                                <a href="javascript:;" onClick={() => { this.openDeductForm(record) } }>扣除名额</a>
                            </span>
                        )
                    }

                },
            }
        ];


        var partnerTypeSelectOption = this.state.selectPartnerTypeData.map(function (item) {
            return (
                <Option key={"key" + item.Id} value={item.Id}>{item.TypeName}</Option>
            );
        });




        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 7 },
        };


        var _self = this;
        return (

            <AppBody>
                <Form horizontal>
                    <div className="main-content-title padding-top15 clearfix">
                        <a className="main-content-word pull-left set-content-word-te" href="#">开通合作伙伴</a>
                    </div>



                    <div className="row padding-top20 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>合作伙伴设置</b>
                        </div>
                        <div className="col-lg-10 col-sm-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-horizontal tasi-form" >
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">代理名称：</label>
                                                <div className="col-xs-5">
                                                    <p><img width={52} height={52} src={this.state.AgencyInfo.HeadImgURL} /></p>
                                                    <span>{this.state.AgencyInfo.NickName}（{this.state.AgencyInfo.RealName}{this.state.AgencyInfo.Mobile}）</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>合作伙伴类型：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="partnerTypeId">
                                                        <Select
                                                            placeholder="请选择合作伙伴类型"
                                                            {...partnerTypeIdProps}
                                                            >
                                                            {partnerTypeSelectOption}
                                                        </Select>
                                                    </FormItem>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>合作伙伴状态：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="PartnerStatus">
                                                        <Select
                                                            placeholder="请选择合作伙伴状态"
                                                            {...partnerStatusProps}
                                                            >
                                                            <Option value="1">正常</Option>
                                                            <Option value="2">锁定</Option>
                                                            <Option value="3">禁用</Option>
                                                        </Select>
                                                    </FormItem>
                                                </div>

                                            </div>
                                        </div>


                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">合作伙伴权益设置：</label>
                                                <div className="col-xs-8 ">

                                                    <Table columns={giftProductColumns} dataSource={this.state.selectGiftList} pagination={false} />
                                                    <div className="margin-top5">
                                                        <a className="color-blue font12 text-left" onClick={this.openGiftForm} >+添加新权益</a>
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
                                <a className="btn btn-block btn-success" onClick={this.handleSubmit}>保存</a>
                            </div>
                            <div className="col-lg-1 margin-left20">

                            </div>
                        </div>

                    </div>
                </Form>
                {this.state.visibleGiftForm ?
                    <Modal title={this.state.isInsert ? "添加合作伙伴权益" : "编辑合作伙伴权益"} visible={this.state.visibleGiftForm} onCancel={this.closeGiftForm} maskClosable={false} footer={[]} >
                        <FormTemplate formElements={this.state.giftSetData} defaultValues={this.state.giftDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitGiftForm} onCancel={this.closeGiftForm}></FormTemplate>
                    </Modal>
                    : null
                }

                {this.state.visibleGiftChargeForm ?
                    <Modal title={"充值名额"} visible={this.state.visibleGiftChargeForm} onCancel={this.closeGiftChargeForm} maskClosable={false} footer={[]} >
                        <FormTemplate formElements={this.state.giftChargeData} defaultValues={this.state.giftChargeDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitGiftChargeForm} onCancel={this.closeGiftChargeForm}></FormTemplate>
                    </Modal>
                    : null
                }

                {this.state.visibleGiftDeductForm ?
                    <Modal title={"扣除名额"} visible={this.state.visibleGiftDeductForm} onCancel={this.closeGiftDeductForm} maskClosable={false} footer={[]} >
                        <FormTemplate formElements={this.state.giftDeductData} defaultValues={this.state.giftDeductDefaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onSubmit={this.submitGiftDeductForm} onCancel={this.closeGiftDeductForm}></FormTemplate>
                    </Modal>
                    : null
                }
            </AppBody>
        );
    }
}



let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let PartnerOpenUpIndexPage = Form.create({})(PartnerOpenUpIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(PartnerOpenUpIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
