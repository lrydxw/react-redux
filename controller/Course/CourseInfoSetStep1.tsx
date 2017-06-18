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
import CourseApi from './CourseApi';
import SystemBasicInfoApi from '../manager/SystemBasicInfo/Api';
import CommunityApi from '../User/CommunityApi';
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
class CourseInfoSetStep1 extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        let formGiftElements: FormElement[] = [
            { key: "GoodsId", element: ElementEnum.Select, type: "string", label: "选择赠品", message: "请选择赠品", showSearch: true, rules: { required: true, whitespace: true }, dataList: [] },
            { key: "LargessNumber", element: ElementEnum.Input, type: "text", label: "赠送个数", message: "请输入赠送个数", rules: { required: true, whitespace: true, validator: RegExpVerify.checkPositiveInteger }, dataList: [] },

        ];

        this.initCourseInfo = this.initCourseInfo.bind(this);
        this.loadCommunityData = this.loadCommunityData.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.submitCourseInfoSetStep1 = this.submitCourseInfoSetStep1.bind(this);
        this.closeGiftForm = this.closeGiftForm.bind(this);
        this.openGiftForm = this.openGiftForm.bind(this);
        this.loadGiftData = this.loadGiftData.bind(this);
        this.submitGiftForm = this.submitGiftForm.bind(this);
        //this.setRightsDescription = this.setRightsDescription.bind(this);
        this.setIsHasGiftChange = this.setIsHasGiftChange.bind(this);
        this.loadSystemBasicInfo = this.loadSystemBasicInfo.bind(this);

        this.state = {
            classCommunitySelectData: [],
            priviewVisible: false,
            priviewImage: "",
            CourseProductId: LocalStorage.get('CourseProductId'),
            ShowImgUrlFileList: [],
            giftSetDefaultValues: {},
            giftSetData: formGiftElements,
            giftDefaultValues: {},
            visibleGiftForm: false,
            selectGiftList: [],
            giftData: [],
            siteName: ""
        };



    }

    //插入真实DOM之前被执行 
    componentWillMount() {
        this.loadGiftData();
        console.log("componentWillMount");
    }
    //插入真实DOM之后被执行
    componentDidMount() {

        this.initCourseInfo();
        this.loadCommunityData();
        //this.loadSystemBasicInfo();

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
        if (nextProps.nextActiveKey && this.props.activeKey == 1 && nextProps.nextActiveKey != this.props.activeKey) {
            this.submitCourseInfoSetStep1(nextProps.nextActiveKey);
        }
        console.log("componentWillReceiveProps");
    }


    //初始化课程信息
    initCourseInfo() {
        var _this = this;
        var obj = obj || {};
        const { setFieldsValue } = _this.props.form;
        obj.Id = _this.state.CourseProductId;

        if (obj.Id.length <= 0) {

            setFieldsValue({ "IsHasGift": "false" })
            return;
        }
        if (obj.Id) {
            ProductApi.getProductBasicInfo(obj).then(function (data) {
                if (data.IsOK) {
                    var dataObj = data.Value;
                    var setObj = {
                        "ProductName": dataObj.ProductName, "Introduction": dataObj.Introduction, "ShowImg": dataObj.ShowImg,
                        "CommunityList": dataObj.CommunityList, "IsHasGift": String(dataObj.IsHasGift), "IsAutoSend": dataObj.IsAutoSend,
                        "RightsDescription": dataObj.RightsDescription
                    }

                    if (dataObj.GiftSendStartTime != undefined) {
                        setObj["GiftSendStartTime"] = new Date(dataObj.GiftSendStartTime);
                    }

                    if (dataObj.GiftSendEndTime != undefined) {
                        setObj["GiftSendEndTime"] = new Date(dataObj.GiftSendEndTime);
                    }

                    if (dataObj.ShowImg != undefined && dataObj.ShowImg != "") {
                        var imgUrlFileList = [{
                            uid: dataObj.Id,
                            name: dataObj.ProductName,
                            status: 'done',
                            url: dataObj.ShowImg,
                            thumbUrl: dataObj.ShowImg,
                        }];

                        _this.state.ShowImgUrlFileList = imgUrlFileList;
                        $(".ant-upload-select-picture-card").css("display", !!dataObj.ShowImg ? "none" : "");
                    }

                    if (dataObj.SelectGiftDataList.length > 0) {
                        _this.state.selectGiftList = dataObj.SelectGiftDataList;
                    }


                    setFieldsValue(setObj);

                }
                else {
                    message.error(data.Message);
                }

            });
        }
    }


    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }

    //关闭添加赠品窗口
    closeGiftForm() {
        this.setState({ visibleGiftForm: false });
    }



    //打开添加赠品窗口
    openGiftForm() {
        this.setState({ visibleGiftForm: true, giftDefaultValues: {} });
    }

    //加载赠品数据
    loadGiftData() {
        var _this = this;
        ProductApi.getDonationList({}).then(function (data) {
            debugger;
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


        var currentGiftList = _this.state.selectGiftList;

        if (_this.arrayContains(currentGiftList, obj)) {
            Modal.error({
                title: '温馨提示',
                content: '该赠品已经添加！',

            });
            return;
        }

        var giftObj = giftObj || {};
        giftObj.GoodsName = giftName;
        giftObj.LargessNumber = obj.LargessNumber;
        giftObj.GoodsId = obj.GoodsId;
        currentGiftList.push(giftObj);
        _this.setState({ selectGiftList: currentGiftList, visibleGiftForm: false });
        //_this.setRightsDescription(getFieldValue("ProductName"));
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
        //_this.setRightsDescription(getFieldValue("ProductName"));
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


    //下一步
    submitCourseInfoSetStep1(step) {
        var _this = this;
        var form = _this.props.form;
        _this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                _this.props.cancelNextActive();
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();
            obj.Id = _this.state.CourseProductId;
            obj.GiftSendStartTime = Tool.GMTToDate(obj.GiftSendStartTime);
            obj.GiftSendEndTime = Tool.GMTToDate(obj.GiftSendEndTime);
            if (obj.GiftSendStartTime && obj.GiftSendEndTime) {
                if (Tool.compareDateTime(obj.GiftSendStartTime, obj.GiftSendEndTime)) {
                    Modal.error({
                        title: '温馨提示',
                        content: '赠品赠送开始时间不能大于结束时间',
                    });
                    _this.props.cancelNextActive();
                    return;
                }
            }
            obj.SelectGiftDataList = JSON.stringify(_this.state.selectGiftList);
            obj.ProductType = 2;
            _this.props.nextTab(step, { IsInsert: obj.Id.length <= 0, First: obj });

        });
    }

    setIsHasGiftChange(e) {
        var _this = this;
        const { setFieldsValue, getFieldValue } = _this.props.form;
        setFieldsValue({ "IsHasGift": String(e.target.value) });
        //_this.setRightsDescription(getFieldValue("ProductName"));
    }

    //setRightsDescription(courseName) {

    //    var _this = this;
    //    const { setFieldsValue, getFieldValue } = _this.props.form;
    //    var siteName = _this.state.siteName;

    //    var rightsDescription = "1." + courseName + "课程的听课权限；\r\n";
    //    var selectGiftList = _this.state.selectGiftList;
    //    var num = 1;
    //    if (getFieldValue("IsHasGift") == "true") {
    //        for (var i = 0; i < selectGiftList.length; i++) {
    //            num++;
    //            rightsDescription += "" + num + "." + selectGiftList[i].GoodsName + "" + selectGiftList[i].LargessNumber + "个；\r\n"
    //        }
    //    }
    //    num++;
    //    rightsDescription += "" + num + "." + siteName + "代理权。"
    //    setFieldsValue({ "RightsDescription": rightsDescription, "ProductName": courseName });
    //}

    backToCourseList() {
        Tool.goPush('Course/Index');
    }


    loadCommunityData() {
        var _this = this;
        CommunityApi.getCommunitySelectData({ ProductType: 2 }).then(function (data) {
            if (data.IsOK) {
                _this.setState({ classCommunitySelectData: data.Value });


            } else {
                message.error(data.Message);
            }
        });
    }

    loadSystemBasicInfo() {
        var _this = this;
        SystemBasicInfoApi.getAppBasciInfo().then(function (data) {
            if (data.IsOK) {
                _this.state.siteName = data.Value.SiteName;

            } else {
                message.error(data.Message);
            }
        });
    }


    //第二步跳转
    nextStep2(id) {
        Tool.goPush('Course/CourseInfoSetStep2');
        LocalStorage.add('CourseProductId', id);
    }

    //第三步跳转
    nextStep3(id) {
        Tool.goPush('Course/CourseInfoSetStep3');
        LocalStorage.add('CourseProductId', id);
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;
        const ProductNameProps = getFieldProps('ProductName', {
            validate: [{
                rules: [
                    { required: true, message: '请输入课程名称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const IntroductionProps = getFieldProps('Introduction', {
            validate: [{
                rules: [
                    { required: false, message: '请输入课程简介' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });

        const rightsDescriptionProps = getFieldProps('RightsDescription', {
            validate: [{
                rules: [
                    { required: true, message: '请输入权益描述' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });


        const showImgProps = getFieldProps('ShowImg', {
            validate: [{
                rules: [
                    { required: true, message: '请上传图片' },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });


        const CommunityListProps = getFieldProps('CommunityList', {
            validate: [{
                rules: [
                    { type: "array" },
                ],
                trigger: ['onBlur', 'onChange'],

            },
            ],
            valuePropName: "value"
        });





        const isHasGiftProps = getFieldProps('IsHasGift', {
            validate: [{
                rules: [
                    { required: true, message: '请选择是否含有赠品' },
                ],
                trigger: ['onBlur', 'onChange'],

            },
            ],
        });

        const isAutoSendProps = getFieldProps('IsAutoSend', {
            valuePropName: 'checked'
        });

        const giftSendStartTimeProps = getFieldProps('GiftSendStartTime', {

        });

        const giftSendEndTimeProps = getFieldProps('GiftSendEndTime', {

        });

        const giftProductColumns = [
            {
                title: '赠品名称',
                dataIndex: 'GoodsName',
                key: 'GoodsName',
                width: '60%',
                render: (text) => <span> {text}</span>,
            },

            {
                title: '赠送个数',
                dataIndex: 'LargessNumber',
                key: 'LargessNumber',
                render: (text) => <span> {text}</span>,
            },
            {
                title: '操作',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <Popconfirm title="确定要移除该项吗？" onConfirm={() => { this.deleteGiftList(record) } }>
                            <a href="javascript:;">移除</a>
                        </Popconfirm>
                    </span>
                ),
            }
        ];

        const showImgUploadProps = {

            multiple: false,
            action: "/UploadFile/UploadImage",
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            fileList: this.state["ShowImgUrlFileList"],
            onChange: (info) => {
                let fileList = info.fileList;
                if (fileList.length > 1) {
                    fileList = [info.fileList[info.fileList.length - 1]];
                }
                // 1. 上传列表数量的限制
                //    只显示最近上传的一个，旧的会被新的顶掉
                fileList = fileList;
                // 2. 读取远程路径并显示链接
                fileList = fileList.map((file) => {
                    console.log("fileList：" + fileList.length);
                    if (file.response) {
                        // 组件会将 file.url 作为链接进行展示  
                        file.url = file.response.url;
                    }
                    return file;
                });
                // 3. 按照服务器返回信息筛选成功上传的文件
                fileList = fileList.filter((file) => {
                    console.log("filter：" + fileList.length);
                    //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                    if (file.response) {
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "ShowImg";
                var obj = {};
                var val = "";
                if (fileList.length > 0) {
                    fileList.map(function (file, i) {
                        if (i === 0) {
                            val += file.url;
                        }
                        else {
                            val += "," + file.url;
                        }
                    });
                }
                obj[key] = val;
                setFieldsValue(obj);
                this.state["ShowImgUrlFileList"] = fileList;
                this.setState({ ShowImgUrlFileList: fileList });
                $(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
            },
            listType: "picture-card",
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }

        };


        var classCommunitySelectOption = this.state.classCommunitySelectData.map(function (item) {
            return (
                <Option key={"key" + item.Id} value={item.Id}>{item.CommunityName}</Option>
            );
        });


        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 7 },
        };


        var _self = this;
        return (

            <div>

                <Form horizontal>


                    <div className="row padding-top20 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>基础设置</b>
                        </div>
                        <div className="col-lg-10 col-sm-12">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-horizontal tasi-form" >
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>课程标题：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="ProductName"

                                                        >
                                                        <Input {...ProductNameProps} className="cp1 form-control" placeholder="课程名称" />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2 "><span className="color-red">*</span>课程封面图：</label>
                                                <div className="col-xs-5">
                                                    <FormItem

                                                        >
                                                        <Input type="hidden" className="cp1 form-control" placeholder="课程封面图" {...showImgProps} />
                                                        <div>
                                                            <Upload {...showImgUploadProps} name="upload" >
                                                                <Icon type="plus" />
                                                                <div className="ant-upload-text" >课程封面图</div>
                                                            </Upload>
                                                            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                                <img style={{ width: "100%" }} alt="example" src={this.state.priviewImage} />
                                                            </Modal>
                                                        </div>
                                                    </FormItem>
                                                    <span className="color9">建议尺寸：640*640像素</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>支付成功后权益描述：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="rightsDescription"

                                                        >
                                                        <Input rows="6" className="cp1 form-control" type="textarea" {...rightsDescriptionProps} placeholder="请输入权益描述" />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">课程简介：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="Introduction"

                                                        >
                                                        <Input rows="6" className="cp1 form-control" type="textarea" {...IntroductionProps} placeholder="请输入课程简介" />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2">选择微信班级：</label>
                                                <div className="col-xs-5">
                                                    <FormItem key="ClassCommunityList">
                                                        <Select
                                                            multiple
                                                            placeholder="请选择微信班级"

                                                            {...CommunityListProps}
                                                            >
                                                            {classCommunitySelectOption}
                                                        </Select>
                                                    </FormItem>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row margin0">
                                                <label className="control-label col-xs-2"><span className="color-red">*</span>是否含有赠品：</label>
                                                <div className="col-xs-4 radios">
                                                    <div className="row radios-block">
                                                        <FormItem key="IsHasGift">
                                                            <RadioGroup  {...isHasGiftProps} onChange={this.setIsHasGiftChange} >
                                                                <Radio value="true" >是</Radio>
                                                                <Radio value="false" >否</Radio>
                                                            </RadioGroup>
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: getFieldValue("IsHasGift") == "true" ? "" : "none" }}>

                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">赠品设置：</label>
                                                    <div className="col-xs-5 ">

                                                        <Table columns={giftProductColumns} dataSource={this.state.selectGiftList} pagination={false} />
                                                        <div className="margin-top5">
                                                            <a className="color-blue font12 text-left" onClick={this.openGiftForm} >+添加赠品</a>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">赠品赠送开始时间：</label>
                                                    <div className="col-xs-5">
                                                        <FormItem key="giftSendStartTime">
                                                            <DatePicker showTime={true} format="yyyy-MM-dd HH:mm" {...giftSendStartTimeProps} placeholder="赠品赠送开始时间" />

                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="form-group">
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">赠品赠送结束时间：</label>
                                                    <div className="col-xs-5">
                                                        <FormItem key="giftSendEndTime">
                                                            <DatePicker showTime={true} format="yyyy-MM-dd HH:mm" {...giftSendEndTimeProps} placeholder="赠品赠送结束时间" />
                                                        </FormItem>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="form-group" style={{ display: "none" }}>
                                                <div className="row margin0">
                                                    <label className="control-label col-xs-2">是否自动赠送赠品：</label>
                                                    <div className="col-xs-5">
                                                        <FormItem key="isAutoSend" >
                                                            <FormItem key="isAutoSend">
                                                                <Switch {...isAutoSendProps} checkedChildren={'是'} unCheckedChildren={'否'} />
                                                            </FormItem>
                                                        </FormItem>
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
                            <div className="col-lg-1 col-xs-offset-3">

                            </div>
                            <div className="col-lg-1 margin-left20">
                                <a className="btn btn-block btn-success" onClick={() => { this.submitCourseInfoSetStep1(2) } } >下一步</a>
                            </div>
                            <div className="col-lg-1 margin-left20">

                            </div>
                        </div>

                    </div>


                </Form>

                <Modal title="添加赠品" visible={this.state.visibleGiftForm} onCancel={this.closeGiftForm} maskClosable={false} footer={[]} >
                    <FormTemplate formElements={this.state.giftSetData} defaultValues={this.state.giftDefaultValues} isInsert={true} onSubmit={this.submitGiftForm} onCancel={this.closeGiftForm}></FormTemplate>
                </Modal>
            </div>
        );
    }
}

let CourseInfoSetStep1Page = Form.create({})(CourseInfoSetStep1);
export { CourseInfoSetStep1Page }

