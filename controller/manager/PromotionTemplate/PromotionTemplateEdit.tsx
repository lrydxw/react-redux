// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { Button, Modal, Form, Checkbox, Input, Upload, DatePicker, InputNumber, Select, message, Radio, Icon, Switch, Popconfirm, Table, TreeSelect, Tabs, Row, Col, CreateFormOptions, Menu, Dropdown, Affix, Collapse, Spin } from 'antd';

const FormItem = Form.Item;
import Tool from '../../../pub/Tool';
import LocalStorage from '../../../pub/LocalStorage';
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';
//api
import PromotionTemplateAPI from './PromotionTemplateAPI';
//表单验证模块
import RegExpVerify from '../../../pub/RegExpVerify';
import Verifier from '../../../pub/Verifier';
const store = BaseStore({});
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const Panel = Collapse.Panel;


import * as MiniColor from 'minicolor';

/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class PromotionTemplateEdit extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.handelSubmit = this.handelSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);      
        this.addNewConfig = this.addNewConfig.bind(this);
        this.state = {
            operationType: LocalStorage.get("OP"),//操作类型  Add 添加   Edit  编辑      
            promotionTemplateId: LocalStorage.get('Id'), //推广模板ID
            promotionTemplateType: LocalStorage.get('TemplateType'), //推广模板类型    
            promotionName: "", //当前推广模板名称
            promotionTemplateImagePath: "", //模板底图
            promotionTemplateDesc: "", //模板描述
            promotionExampleImage: "", //模板样例图
            promotionIsEnable: false, //模板是否启用
            promotionConfigs: [], //推广模板配置项
            ConfigsEnum: [], // 配置项枚举  
            visibleImg: false,
        };
    }

    //插入真实DOM之前被执行 
    componentWillMount() {

    }

    //插入真实DOM之后被执行
    componentDidMount() {
        this.GetPromotionTemplateInfo();
        //获取枚举值
        this.GetAllTemplateConfigEnum();
     

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

    //获取推广模板信息
    GetPromotionTemplateInfo() {
        var _this = this;
        var obj = obj || {};
        const { setFieldsValue } = _this.props.form;
        obj.Id = _this.state.promotionTemplateId; //获取参数，推广模板ID
  
        if (obj.Id !="0") {
            //通过api请求数据
            PromotionTemplateAPI.GetPromotionTemplateInfoById(obj).then(function (data) {
                if (data.IsOK) {
                    var obj = data.Value;              
                    _this.state.promotionName = obj.TemplateName;//模板名称
                    _this.state.promotionTemplateImagePath = obj.TemplateImagePath; //模板底图
                    _this.state.promotionTemplateDesc = obj.TemplateDesc; //模板描述
                    _this.state.promotionExampleImage = obj.ExampleImage; //模板样例图               
                    _this.setState({ promotionIsEnable: obj.IsEnabled });    //模板是否启用   
                    _this.setState({ DataObj: obj });    //模板数据   
                    setFieldsValue({ "IsEnabled": obj });

                    if (Array.isArray(obj.TemplateConfigs)) {

                        _this.setState({ promotionConfigs: obj.TemplateConfigs }); //模板配置项
                    }
                    //对页面元素进行赋值
                    _this.bindValue(obj);
                }
            });
        }
  
    }


    //赋值操作
    bindValue(obj) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        //对页面元素进行赋值
        var setObj = {
            "Id": obj.Id, //模板ID
            "TemplateImagePath": obj.TemplateImagePath,  //模板底图
            "TemplateName": obj.TemplateName,  //模板名称
            "TemplateDesc": obj.TemplateDesc, //模板描述
            "IsEnabled": obj.IsEnabled //模板是否启用
        };

        obj.TemplateConfigs.map(function (item, i) {
            setObj['Name' + i] = String(item.Name); //配置项名称
            setObj["DefaultValue" + i] = String(item.DefaultValue);  //模板配置默认值
            setObj["OffsetX" + i] = String(item.OffsetX);  //模板配置项距离左侧距离
            setObj["OffsetY" + i] = String(item.OffsetY);  //模板配置项距离顶部距离
            setObj["Width" + i] = String(item.Width);  //模板配置图层宽度
            setObj["Height" + i] = String(item.Height);  //模板配置图层高度
            setObj["CenterScreen" + i] = String(item.CenterScreen);  //模板配置 居中显示模板宽度百分比
            setObj["DrawTemplateType" + i] = String(item.DrawTemplateType);  //模板配置类型
            setObj["BgColor" + i] = String(item.BgColor);  //模板配置背景颜色
            setObj["Color" + i] = String(item.Color);  //模板配置字体颜色
            setObj["ForeColor" + i] = String(item.ForeColor);  //模板配置前景颜色
            setObj["FontStyle" + i] = String(item.FontStyle);  //模板配置字体样式
            setObj["FontFamily" + i] = String(item.FontFamily == null ? "微软雅黑" : item.FontFamily);  //模板配置字体格式
            setObj["FontSize" + i] = String(item.FontSize);  //模板配置字体大小
            setObj["ImageBorderColor" + i] = String(item.ImageBorderColor);  //模板配置图片边框线颜色
            setObj["ImageBorderWidth" + i] = String(item.ImageBorderWidth);  //模板配置图片边框线宽度
            setObj["RightPadding" + i] = String(item.RightPadding);  //模板配置距离模板右侧位置
            setObj["LetterSpacing" + i] = String(item.LetterSpacing);  //模板配置行间距
            setObj["RowCount" + i] = String(item.RowCount);  //模板配置行数
            setObj["RowFontLength" + i] = String(item.RowFontLength);  //模板配置每行多少字
            setObj["LineHeight" + i] = String(item.LineHeight);  //模板配置行高
        });


        var fileList = [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: obj.TemplateImagePath,
            multiple: false
        }];
        _this.setState({ FileList: fileList });
        $(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
        setFieldsValue(setObj);
    }


    //获取所有模板配置项枚举数据
    GetAllTemplateConfigEnum() {
        var _this = this;
        var obj = obj || {};  
        //通过api请求数据
        PromotionTemplateAPI.GetAllTemplateConfigEnum(obj).then(function (data) {
            if (data.IsOK) {
                _this.state.ConfigsEnum = data.Value;
            }
        });
    }

    
    //保存 
    handelSubmit(isPreview) {
        var _this = this;
        var form = _this.props.form;
        const {getFieldValue, validateFields} = _this.props.form;
        _this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log("Errors in form!");
                return;
            }

            //页面上所有元素值
            var obj = form.getFieldsValue();
            if (_this.state.promotionConfigs.length <= 0) {
                return;
            }            

            var configs = [];//配置项数组
            _this.state.promotionConfigs.map(function (item, i) {

                var newConfig = { "Name": item.Name, "DefaultValue": obj["DefaultValue" + i], "OffsetX": obj["OffsetX" + i], "OffsetY": obj["OffsetY" + i], "Width": obj["Width" + i], "Height": obj["Height" + i], "CenterScreen": obj["CenterScreen" + i], "DrawTemplateType": obj["DrawTemplateType" + i], "BgColor": "", "ForeColor": "", "Color": "", "FontStyle": "Regular", "FontSize": "10", "FontFamily": "微软雅黑", "RightPadding": "0", "LetterSpacing": "0", "RowCount": "0", "RowFontLength": "0", "LineHeight": "0", "ImageBorderWidth": "0.00", "ImageBorderColor": "255,255,255" };
                if (item.DrawTemplateTypeInt == 1 || item.DrawTemplateTypeInt == 2) {
                    newConfig.BgColor = obj["BgColor" + i];
                    newConfig.ForeColor = obj["ForeColor" + i];
                    newConfig.Color = obj["Color" + i];
                    newConfig.FontStyle = obj["FontStyle" + i];
                    newConfig.FontSize = obj["FontSize" + i];
                    newConfig.FontFamily = obj["FontFamily" + i];
                    newConfig.RightPadding = obj["RightPadding" + i];
                    newConfig.LetterSpacing = obj["LetterSpacing" + i];
                    newConfig.RowCount = obj["RowCount" + i];
                    newConfig.RowFontLength = obj["RowFontLength" + i];
                    newConfig.LineHeight = obj["LineHeight" + i];
                } else {
                    newConfig.ImageBorderWidth = obj["ImageBorderWidth" + i];
                    newConfig.ImageBorderColor = obj["ImageBorderColor" + i];
                }
                configs.push(newConfig);
            });

            //回传的对象
            var result = {
                "Id": obj.Id,
                "TemplateName": obj.TemplateName,
                "TemplateImagePath": obj.TemplateImagePath,
                "ExampleImage": obj.ExampleImage,
                "TemplateDesc": obj.TemplateDesc,
                "IsEnabled": obj.IsEnabled,
                "TemplateConfigs": configs
            };

            PromotionTemplateAPI.UpdatePromotionTemplateById(result).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: "",
                        onOk() {
                            message.success("保存成功！");
                        },
                    });
                } else {
                    message.error(data.Message);
                }
            });

            if (isPreview) {
                _this.ImagePreview(obj.Id);
            }
        });
    }

    //预览生成的图片
    ImagePreview(tId) {
        var _this = this;
        var obj = obj || {};
        const { setFieldsValue } = _this.props.form;
        obj.Id = tId;
        _this.setState({
            visibleImg: true,
            visibleSpin: true,
            displayPreview: false
        });


        //通过api请求数据
        PromotionTemplateAPI.GetTemplatePreview(obj).then(function (data) {
            if (data.IsOK && data.Value != "") {

                setTimeout(function () {
                    _this.setState({
                        visibleSpin: false,
                        displayPreview: true,
                        previewImg: "data:image/png;base64," + data.Value
                    });
                }, 5000);

            } else {
                message.error("生成预览图失败！");
            }
        });



    }

    ImagePreviewOk() {
        this.setState({
            visibleImg: false,
            visibleSpin: false,
        });
    }

    //关闭预览
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }

    //
    handleChange(value) {

    }

    //添加配置项 
    addNewConfig(typeName, typeValue) {
        var _this = this;
        var newIndex = _this.state.promotionConfigs.length;
        var newObj = _this.state.DataObj;
        var DrawTemplateTypeInt = typeValue % 10 == 1 ? 4 : 1;
        var DrawTemplateType = DrawTemplateTypeInt == 1 ? "普通文本" : "方形图层";

        var newConfig = { "Name": typeName, "DefaultValue": "", "OffsetX": 100, "OffsetY": 100, "Width": 100, "Height": 100, "CenterScreen": 1, "DrawTemplateType": DrawTemplateType, "DrawTemplateTypeInt": DrawTemplateTypeInt, "BgColor": "255,255,255", "ForeColor": "255,255,255", "Color": "255,255,255", "FontStyle": "Regular", "FontSize": 10, "FontFamily": "微软雅黑", "RightPadding": 10, "LetterSpacing": 10, "RowCount": 1, "RowFontLength": 10, "LineHeight": 24, "ImageBorderWidth": 0, "ImageBorderColor": "255,255,255" };
        var configList = _this.state.promotionConfigs;

        configList.push(newConfig);
        _this.setState({ promotionConfigs: configList });
        _this.bindValue(newObj);
        location.href = "#div_" + newIndex
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;

        const imageProps = {
            multiple: false,
            action: "/UploadFile/UploadImage",
            data: {
                type: 'course',
                format: 'large'
            },
            fileList: this.state["FileList"],
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
                    if (file.response) {
                        return file.response.status === 'success';
                    }
                    return true;
                });
                var key = "TemplateImagePath";
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
                this.setState({ FileList: fileList, ShowFaceUrl: val });
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


        var _self = this;
        return (
            <AppBody>
                <div className="main-content-title padding-top15 clearfix">
                    <a className="main-content-word pull-left set-content-word-te" href="#">推广二维码模板编辑</a>
                </div>

                <div className="main-content-title padding-top35 clearfix">
                    <a className="main-content-word pull-left  set-content-word-te">{this.state.promotionTemplateType}</a>
                </div>

                <div className=" editor-left8 ">
                    <Affix >
                        <div className=" padding-top20 padding-btm20 pull-left ">
                            <div className=" editor-left" style={{ height: "auto" }}>
                                <div>
                                    <FormItem>
                                        <Input type="Hidden" value="" {...getFieldProps("TemplateImagePath") } />
                                    </FormItem>
                                    <img alt="模板底图" style={{ maxWidth: "320px" }} src={getFieldValue("TemplateImagePath")} />
                                </div>

                            </div>



                            <div className=" editor-left-main  margin-top20 margin-btm20" style={{ width: 520 }} >

                                {this.state.ConfigsEnum.map(function (item, i) {
                                    return (
                                        <Button key={"configEnum_" + i} className="margin-left10 margin-top5" onClick={() => _self.addNewConfig(item.ConfigValue, item.ConfigKey)}>{item.ConfigValue}</Button>
                                    );
                                })
                                }
                            </div>

                        </div>

                    </Affix>

                </div>

                <div className="pull-right">
                    <Form className="horizontal">
                        <div className="well well-sm margin-btm10 editor-right99">

                            <FormItem>
                                <Input type="hidden" className="form-control" placeholder="模板ID" {...getFieldProps("Id") } />
                            </FormItem>

                            <div className="row margin0">
                                <p className="col-xs-12 font12">模板名称</p>
                                <div className="col-xs-12">
                                    <FormItem>
                                        <Input type="text" className="form-control" placeholder="模板名称" {...getFieldProps("TemplateName") } />
                                    </FormItem>
                                </div>
                            </div>

                            <div className="row margin0">
                                <p className="col-xs-12 font12">模板描述</p>
                                <div className="col-xs-12">
                                    <FormItem>
                                        <Input type="text" className="form-control" placeholder="模板描述" {...getFieldProps("TemplateDesc") } />
                                    </FormItem>
                                </div>
                            </div>

                            <div className="row margin0">
                                <p className="col-xs-12 font12">推广二维码模板示例(宽度：640 px，高度：705px) <a onClick={() => { this.setState({ visibleForm: true }) } }>推广二维码模板示例</a> </p>
                                <div className="col-xs-12">
                                    <FormItem hasFeedback>
                                        <Input type="hidden" className="form-control" placeholder="推广二维码模板" {...getFieldProps("TemplateImagePath", {
                                            validate: [{
                                                rules: [
                                                    { required: false, message: '请上传推广二维码模板底图' },
                                                ], trigger: ['onBlur', 'onChange'],
                                            },]
                                        }) } />
                                        <div>
                                            <Upload name="upload" {...imageProps} >
                                                <Icon type="plus" />
                                                <div className="ant-upload-text" >推广二维码模板底图</div>
                                            </Upload>
                                            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                                                <img alt="example" src={this.state.priviewImage} style={{ maxWidth: "460px" }} />
                                            </Modal>
                                        </div>
                                    </FormItem>
                                </div>
                            </div>


                            <div className="row margin0">
                                <div className="col-xs-12">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <FormItem>
                                                模板是否启用：<Switch checkedChildren={'启用'} unCheckedChildren={'禁用'} {...getFieldProps('IsEnabled', { valuePropName: 'checked' }) } />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Collapse accordion>
                                {this.state.promotionConfigs.length > 0 ?
                                    this.state.promotionConfigs.map(function (item, i) {
                                        return (
                                            <Panel header={getFieldValue("Name" + i)} key={"panel_" + i}>

                                                <div className="col-xs-12">
                                                    <label className="form-control-label col-xl-2" >配置项名称：</label>
                                                    <label className="form-control-label col-xl-2" >{getFieldValue("Name" + i)}</label>
                                                    <FormItem>
                                                        <Input type="hidden" className="form-control"  {...getFieldProps("Name" + i) } />
                                                    </FormItem>
                                                </div>

                                                <div className="col-xs-12">
                                                    <label className="form-control-label col-xl-2" >默认值：</label>
                                                    <FormItem >
                                                        <Input type="text" className="form-control col-xl-8" placeholder="默认值" {...getFieldProps("DefaultValue" + i) } />
                                                    </FormItem>
                                                </div>

                                                <div className="col-xs-5">
                                                    <label className="form-control-label col-xl-2" >距离模板左侧距离：</label>
                                                    <FormItem>
                                                        <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('OffsetX' + i, {
                                                            validate: [{
                                                                rules: [
                                                                    { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                ], trigger: ['onBlur', 'onChange']
                                                            }]
                                                        }) } />
                                                    </FormItem>
                                                </div>


                                                <div className="col-xs-5">
                                                    <label className="form-control-label col-xl-2" >距离模板顶部距离：</label>
                                                    <FormItem>
                                                        <Input type="text" className="form-control col-xl-1" placeholder="0" {...getFieldProps('OffsetY' + i, {
                                                            validate: [{
                                                                rules: [
                                                                    { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                ], trigger: ['onBlur', 'onChange']
                                                            }]
                                                        }) } />
                                                    </FormItem>
                                                </div>


                                                <div className="col-xs-5">
                                                    <label className="form-control-label col-xl-2" >图层宽度：</label>
                                                    <FormItem>
                                                        <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('Width' + i, {
                                                            validate: [{
                                                                rules: [
                                                                    { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                ], trigger: ['onBlur', 'onChange']
                                                            }]
                                                        }) } />
                                                    </FormItem>
                                                </div>


                                                <div className="col-xs-5">
                                                    <label className="form-control-label col-xl-2" >图层高度：</label>
                                                    <FormItem>
                                                        <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('Height' + i, {
                                                            validate: [{
                                                                rules: [
                                                                    { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                ], trigger: ['onBlur', 'onChange']
                                                            }]
                                                        }) } />
                                                    </FormItem>
                                                </div>


                                                <div className="col-xs-5">
                                                    <label className="form-control-label col-xl-2" >居中显示的时候,模版宽度的百分比：</label>
                                                    <FormItem>
                                                        <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('CenterScreen' + i, {
                                                            validate: [{
                                                                rules: [
                                                                    { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveFloat }
                                                                ], trigger: ['onBlur', 'onChange']
                                                            }]
                                                        }) } />
                                                    </FormItem>
                                                </div>


                                                {item.DrawTemplateTypeInt == 1 || item.DrawTemplateTypeInt == 2 ?
                                                    <div className="col-xs-12 margin0" >

                                                        <div className="col-xs-12">
                                                            <label className="form-control-label col-xl-2" >配置类型：</label>
                                                            <FormItem >
                                                                <Select style={{ width: 120 }} {...getFieldProps("DrawTemplateType" + i) }>
                                                                    <Option value="1">普通文本</Option>
                                                                    <Option value="2">多行文本</Option>
                                                                </Select>
                                                            </FormItem>
                                                        </div>


                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >背景颜色：</label>
                                                            <div className="col-xs-12">
                                                                <FormItem >
                                                                    <Input type="text" className="form-control col-xl-8" placeholder="请选择背景颜色" {...getFieldProps("BgColor" + i) } />
                                                                </FormItem>
                                                            </div>
                                                        </div>

                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >字体颜色：</label>
                                                            <div className="col-xs-12">
                                                                <FormItem >
                                                                    <Input type="text" className="form-control col-xl-8" placeholder="请选择字体颜色"   {...getFieldProps("Color" + i) } />
                                                                </FormItem>
                                                            </div>
                                                        </div>

                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >前景颜色：</label>
                                                            <div className="col-xs-12">
                                                                <FormItem >
                                                                    <Input type="text" className="form-control col-xl-8" placeholder="请选择前景颜色" {...getFieldProps("ForeColor" + i) } />
                                                                </FormItem>
                                                            </div>
                                                        </div>


                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >字体样式：</label>
                                                            <div className="col-xs-12">
                                                                <FormItem >
                                                                    <Select style={{ width: 120 }} {...getFieldProps("FontStyle" + i) }>
                                                                        <Option value="Regular">普通文本</Option>
                                                                        <Option value="Bold">粗体</Option>
                                                                        <Option value="Italic">斜体</Option>
                                                                        <Option value="Underline">下划线</Option>
                                                                    </Select>
                                                                </FormItem>
                                                            </div>
                                                        </div>

                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >字体格式：</label>
                                                            <div className="col-xs-12">
                                                                <FormItem >
                                                                    <Select style={{ width: 120 }} {...getFieldProps("FontFamily" + i) }>
                                                                        <Option value="宋体">宋体</Option>
                                                                        <Option value="黑体">黑体</Option>
                                                                        <Option value="微软雅黑">微软雅黑</Option>
                                                                        <Option value="仿宋">仿宋</Option>
                                                                        <Option value="仿宋_GB2312">仿宋_GB2312</Option>
                                                                        <Option value="楷体">楷体</Option>
                                                                        <Option value="楷体_GB2312">楷体_GB2312</Option>
                                                                    </Select>
                                                                </FormItem>
                                                            </div>
                                                        </div>

                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >字体大小：</label>
                                                            <div className="col-xs-12">
                                                                <FormItem >
                                                                    <Select style={{ width: 120 }} {...getFieldProps("FontSize" + i) }>
                                                                        <Option value="10">10</Option>
                                                                        <Option value="12">12</Option>
                                                                        <Option value="14">14</Option>
                                                                        <Option value="16">16</Option>
                                                                        <Option value="18">18</Option>
                                                                        <Option value="20">20</Option>
                                                                        <Option value="22">22</Option>
                                                                        <Option value="24">24</Option>
                                                                        <Option value="26">26</Option>
                                                                        <Option value="28">28</Option>
                                                                        <Option value="30">30</Option>
                                                                        <Option value="32">32</Option>
                                                                    </Select>
                                                                </FormItem>
                                                            </div>
                                                        </div>


                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >距离模版图右侧位置：</label>
                                                            <FormItem>
                                                                <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('RightPadding' + i, {
                                                                    validate: [{
                                                                        rules: [
                                                                            { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveFloat }
                                                                        ], trigger: ['onBlur', 'onChange']
                                                                    }]
                                                                }) } />
                                                            </FormItem>
                                                        </div>


                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >行间距：</label>
                                                            <FormItem>
                                                                <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('LetterSpacing' + i, {
                                                                    validate: [{
                                                                        rules: [
                                                                            { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                        ], trigger: ['onBlur', 'onChange']
                                                                    }]
                                                                }) } />
                                                            </FormItem>
                                                        </div>



                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >行数：</label>
                                                            <FormItem>
                                                                <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('RowCount' + i, {
                                                                    validate: [{
                                                                        rules: [
                                                                            { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                        ], trigger: ['onBlur', 'onChange']
                                                                    }]
                                                                }) } />
                                                            </FormItem>
                                                        </div>




                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >每行多少字：</label>
                                                            <FormItem>
                                                                <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('RowFontLength' + i, {
                                                                    validate: [{
                                                                        rules: [
                                                                            { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                        ], trigger: ['onBlur', 'onChange']
                                                                    }]
                                                                }) } />
                                                            </FormItem>
                                                        </div>


                                                        <div className="col-xs-5">
                                                            <label className="form-control-label col-xl-2" >行高：</label>
                                                            <FormItem>
                                                                <Input type="text" className="form-control col-xl-1" placeholder="0"  {...getFieldProps('LineHeight' + i, {
                                                                    validate: [{
                                                                        rules: [
                                                                            { required: true, message: '请填写正确的数字' }, { validator: RegExpVerify.checkPositiveInteger }
                                                                        ], trigger: ['onBlur', 'onChange']
                                                                    }]
                                                                }) } />
                                                            </FormItem>
                                                        </div>



                                                    </div> : item.DrawTemplateTypeInt == 3 || item.DrawTemplateTypeInt == 4 ?
                                                        <div className="col-xs-12 margin0" >
                                                            <div className="col-xs-12">
                                                                <label className="form-control-label col-xl-2" >配置类型：</label>
                                                                <FormItem >
                                                                    <Select style={{ width: 120 }} {...getFieldProps("DrawTemplateType" + i) }>
                                                                        <Option value="3">圆形图层</Option>
                                                                        <Option value="4">方形图层</Option>
                                                                    </Select>
                                                                </FormItem>
                                                            </div>

                                                            <div className="col-xs-5">
                                                                <label className="form-control-label col-xl-2" >图片边框线颜色：</label>
                                                                <div className="col-xs-12">
                                                                    <FormItem >
                                                                        <Input type="text" className="form-control col-xl-8" placeholder="请选择图片边框线颜色" {...getFieldProps("ImageBorderColor" + i) } />
                                                                    </FormItem>
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-5">
                                                                <label className="form-control-label col-xl-2" >图片边框线宽度：</label>
                                                                <div className="col-xs-12">
                                                                    <FormItem >
                                                                        <Select style={{ width: 120 }} {...getFieldProps("ImageBorderWidth" + i) }>
                                                                            <Option value="0">0</Option>
                                                                            <Option value="1">1</Option>
                                                                            <Option value="2">2</Option>
                                                                            <Option value="3">3</Option>
                                                                            <Option value="4">4</Option>
                                                                            <Option value="5">5</Option>
                                                                        </Select>
                                                                    </FormItem>
                                                                </div>
                                                            </div>

                                                        </div> : ""}

                                            </Panel>)
                                    }) : ""}
                            </Collapse>

                        </div>

                        <div className="seat-80"></div>
                        <div className="position-btm">
                            <div className="row margin0 bg-colorFC padding10 margin-top20">
                                <div className="col-lg-1 margin-left20">
                                    <a className="btn btn-block btn-info2" onClick={() => { this.handelSubmit(false) } } >保存</a>
                                </div>
                                <div className="col-lg-2 margin-left20">
                                    <a className="btn btn-block btn-success" onClick={() => { this.handelSubmit(true) } } >保存并预览</a>
                                </div>
                            </div>
                        </div>

                    </Form>
                </div>


                <Modal title="推广二维码模板示例" visible={this.state.visibleForm} onCancel={() => { this.setState({ visibleForm: false }) } } footer={[]}>
                    <div className="modal-body" style={{ overflow: "auto" }}>
                        <div className="col-sm-8">
                            <img style={{ maxWidth: 300 }} src={this.state.promotionExampleImage} />
                        </div>
                        <div className="col-sm-4">
                            宽度：640 px<br />高度：705 px<br />水平分辨率：96 dpi<br />垂直分辨率： 96 dpi<br />处理技巧：从PS导出图片时，要导出为WEB所用格式(快捷键是：ctrl+shift+alt+s) ，将会大大减少图片所占内存大小，提高用户打开速度！
                        </div>
                    </div>
                </Modal>

                <Modal title="生成图片预览" visible={this.state.visibleImg} onOk={() => { this.ImagePreviewOk() } } onCancel={() => { this.ImagePreviewOk() } } >
                    <Spin size="large" spinning={this.state.visibleSpin} />
                    <img alt="模板底图" style={{ maxWidth: "460px", display: this.state.displayPreview ? "block" : "none" }} src={this.state.previewImg} />
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

let editPage = Form.create({})(PromotionTemplateEdit);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(editPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);