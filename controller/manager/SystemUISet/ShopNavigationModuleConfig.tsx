import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Tool from '../../../pub/Tool';
import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { Table, Icon, Row, Col, Modal, Form, Input, Upload, Tabs, Radio, Switch, FormComponentProps, message, Button, Popover } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
//api
import ShopHomeSetApi from './ShopHomeSetApi';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import RegExpVerify from '../../../pub/RegExpVerify';
const store = BaseStore({});

interface ShopNavigationModuleConfigFormProps extends FormComponentProps {

    form?: any;
    displayNavigationList?: Function;
    shopNavigationModuleList?: any
    shopNavigationModuleListData?: any
}



class ShopNavigationModuleConfigForm extends React.Component<ShopNavigationModuleConfigFormProps, any> {

    constructor(props) {

        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initShopNavigationModuleList = this.initShopNavigationModuleList.bind(this);
        this.addNavigationModule = this.addNavigationModule.bind(this);
        this.deleteNavigationModule = this.deleteNavigationModule.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.deleteIcon = this.deleteIcon.bind(this);
        this.iconUrlOnChange = this.iconUrlOnChange.bind(this);
        this.setNameChange = this.setNameChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            shopNavigationModuleList: props.shopNavigationModuleListData,
            priviewVisible: false,

        }


    }



    //插入真实DOM之前被执行 
    componentWillMount() {
        console.log('执行组件componentWillMount');
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        this.initShopNavigationModuleList();
        console.log('执行组件componentDidMount');

    }


    //更新DOM之前被执行
    componentWillUpdate() {
        console.log('执行组件componentWillUpdate');
    }

    //更新DOM之后被执行
    componentDidUpdate(nextProps) {

        console.log('执行组件componentDidUpdate');
    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log('执行组件componentWillUnmount');
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {


        console.log('执行组件componentWillReceiveProps');
        console.log(nextProps);


    }


    initShopNavigationModuleList() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        console.log(_this.props.shopNavigationModuleListData);
        //_this.state.shopNavigationModuleList = _this.props.shopNavigationModuleListData;
        if (_this.state.shopNavigationModuleList.length > 0) {
            var setObj = {};
            _this.state.shopNavigationModuleList.map(function (item) {
                setObj["Link_" + item.Id] = item.Link;
                setObj["Icon_" + item.Id] = item.Icon;
                setObj["Name_" + item.Id] = item.Name;

            });
            setFieldsValue(setObj);
        }
        else {
            var shopNavigationModuleList = _this.state.shopNavigationModuleList;
            var banner = { Id: Math.floor(Math.random() * 1000), Icon: "/Content/editor/images/icons/divide_block_5.png", Link: "", SortIndex: 0, Name: "", EditType: 0 }
            shopNavigationModuleList.splice(0, 0, banner);

            shopNavigationModuleList = _this.sortNavigationModuleIndex(shopNavigationModuleList);
        }
        //_this.props.displayNavigationList(_this.state.shopNavigationModuleList);


    }

    addNavigationModule(sortIndex) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var shopNavigationModuleList = _this.state.shopNavigationModuleList;
        if (shopNavigationModuleList.length >= 5) {
            Modal.info({
                title: '温馨提示',
                content: '导航模块最多为5个',
            });
            return;
        }
        var shopNavigationModule = { Id: Math.floor(Math.random() * 1000), Icon: "/Content/editor/images/icons/divide_block_5.png", Link: "", SortIndex: sortIndex, Name: "快速导航", EditType: 0 }
        shopNavigationModuleList.splice(sortIndex + 1, 0, shopNavigationModule);

        shopNavigationModuleList = _this.sortNavigationModuleIndex(shopNavigationModuleList);



        //_this.setState({ shopNavigationModuleList: shopNavigationModuleList });

        var setObj = {};

        setObj["Icon_" + shopNavigationModule.Id] = shopNavigationModule.Icon;
        setObj["Name_" + shopNavigationModule.Id] = shopNavigationModule.Name;
        setFieldsValue(setObj);
        console.log(shopNavigationModuleList);
        _this.props.displayNavigationList(_this.state.shopNavigationModuleList);
    }

    sortNavigationModuleIndex(shopNavigationModuleList) {
        for (var i = 0; i < shopNavigationModuleList.length; i++) {
            var shopNavigationModule = shopNavigationModuleList[i];
            shopNavigationModule.SortIndex = i;
        }
        return shopNavigationModuleList;
    }

    deleteNavigationModule(sortIndex) {
        var _this = this;
        var shopNavigationModuleList = _this.state.shopNavigationModuleList;
        if (shopNavigationModuleList.length <= 2) {
            Modal.info({
                title: '温馨提示',
                content: '请至少保留两个导航模块',
            });
            return;
        }
        shopNavigationModuleList.splice(sortIndex, 1);
        shopNavigationModuleList = _this.sortNavigationModuleIndex(shopNavigationModuleList);
        _this.setState({ shopNavigationModuleList: shopNavigationModuleList });
        console.log(shopNavigationModuleList);
        _this.props.displayNavigationList(_this.state.shopNavigationModuleList);
    }

    displayNavigationList(shopNavigationModuleList) {
        var _this = this;
        _this.setState({ shopNavigationModuleList });
    }

    submitForm() {
        var _this = this;
        var form = _this.props.form;
        form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            var obj = form.getFieldsValue();
            var shopNavigationModuleConfig = [];
            _this.state.shopNavigationModuleList.map(function (item, i) {
                var shopNavigationModule = new Object();
                shopNavigationModule["Id"] = item.Id;
                shopNavigationModule["Icon"] = obj["Icon_" + item.Id];
                shopNavigationModule["Link"] = obj["Link_" + item.Id];
                shopNavigationModule["SortIndex"] = item.SortIndex;
                shopNavigationModule["Name"] = obj["Name_" + item.Id];
                shopNavigationModule["EditType"] = item.EditType;
                shopNavigationModuleConfig.push(shopNavigationModule);
            });


            ShopHomeSetApi.updateShopNavigationModuleInfo({ shopNavigationModuleList: shopNavigationModuleConfig }).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '保存成功',
                        content: '导航模块配置已保存',
                    });
                    _this.initShopNavigationModuleList();
                    return;

                } else {
                    message.error(data.Message);
                }
            });


        });
    }


    deleteIcon(id) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var currentObj = _this.state.shopNavigationModuleList;

        var index = _this.getCurrentIconIndex(id);
        if (index > -1) {
            var obj = currentObj[index];
        }
        obj.Icon = "";
        console.log(_this.state["ImageUrlFileList_" + id]);
        debugger;
        currentObj = _this.sortNavigationModuleIndex(currentObj);
        _this.state.shopNavigationModuleList = currentObj;
        _this.state["uploadImg_" + id] = true;
        var setObj = {};
        setObj["Icon_" + id] = "";
        setFieldsValue(setObj);
        _this.props.displayNavigationList(_this.state.shopNavigationModuleList);
    }

    getCurrentIconIndex(id) {
        var _this = this;
        var result = -1;
        var currentObj = _this.state.shopNavigationModuleList;
        for (var i = 0; i < currentObj.length; i++) {
            if (currentObj[i].Id == id) {
                result = i;
                break;
            }
        }
        return result;
    }

    iconUrlOnChange(item, id) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var currentObj = _this.state.shopNavigationModuleList;
        var index = _this.getCurrentIconIndex(id);
        if (index > -1) {
            var obj = currentObj[index];
        }
        obj.Icon = item;
        _this.state.shopNavigationModuleList = currentObj;
        _this.state["uploadImg_" + id] = false;
        var setObj = {};
        setObj["Icon_" + id] = item;
        setFieldsValue(setObj);
        _this.props.displayNavigationList(_this.state.shopNavigationModuleList);
    }

    setNameChange(e, id) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        var currentObj = _this.state.shopNavigationModuleList;
        var index = _this.getCurrentIconIndex(id);
        if (index > -1) {
            var obj = currentObj[index];
        }
        obj.Name = e.target.value;
        _this.state.shopNavigationModuleList = currentObj;
        var setObj = {};
        setObj["Name_" + id] = obj.Name;
        setFieldsValue(setObj);
        _this.props.displayNavigationList(_this.state.shopNavigationModuleList);

    }

    handleCancel(id) {
        var _this = this;
        _this.state["priviewVisible_" + id] = false;
        _this.setState(_this);
    }

    render() {
        var _this = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = _this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };

        const selectIcon = ["/Content/editor/images/icons/1.png",
            "/Content/editor/images/icons/2.png",
            "/Content/editor/images/icons/3.png",
            "/Content/editor/images/icons/4.png",
            "/Content/editor/images/icons/5.png",
            "/Content/editor/images/icons/6.png",
            "/Content/editor/images/icons/7.png",
            "/Content/editor/images/icons/8.png",
            "/Content/editor/images/icons/9.png",
            "/Content/editor/images/icons/10.png",
            "/Content/editor/images/icons/11.png",
            "/Content/editor/images/icons/12.png",
            "/Content/editor/images/icons/13.png",
            "/Content/editor/images/icons/14.png",
            "/Content/editor/images/icons/15.png",
            "/Content/editor/images/icons/16.png",];




        let shopNavigationModuleDom = _this.state.shopNavigationModuleList.map(function (item, i) {
            let { setFieldsValue, getFieldValue } = _this.props.form;

            let iconProps = getFieldProps('Icon_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请选择图标' },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });

            let linkProps = getFieldProps('Link_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请输入链接地址' },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });


            let nameProps = getFieldProps('Name_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请输入模块名称' },
                    ], trigger: ['onBlur', 'onChange'],
                }]
            });

            let imageUploadProps = {

                multiple: false,
                action: "/UploadFile/UploadImage",
                beforeUpload(file) {
                    return Tool.ImgBeforeUpload(file);
                },
                showUploadList: false,
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
                    var key = "Icon_" + item.Id;
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
                    _this.state["ImageUrlFileList_" + item.Id] = fileList;
                    //_this.setState({ ShowImgUrlFileList: fileList });
                    _this.state["uploadImg_" + item.Id] = fileList && fileList.length > 0 ? false : true;

                    var shopNavigationModuleList = _this.state.shopNavigationModuleList;
                    var index = -1;
                    for (var i = 0; i <= shopNavigationModuleList.length; i++) {
                        if (shopNavigationModuleList[i].Id == item.Id) {
                            shopNavigationModuleList[i].Icon = val;
                            break;
                        }
                    }
                    setFieldsValue(obj);
                    _this.props.displayNavigationList(_this.state.shopNavigationModuleList);
                    //$(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
                },
                listType: "picture-card",


            };

            return (


                <div className="row margin-top10" key={"navigationModule_div_" + item.Id}>

                    <div className="col-xs-2">
                        <div className="file-box file-box-kong">
                            <FormItem>
                                <Input type="hidden"  {...iconProps} />
                                {item.Icon && item.Icon.length > 0 ? <div> <img src={item.Icon} alt="模块图片" width="34" height="34" />
                                    <img className="file-img-del" src="/Content/images/del.png" alt="删除" onClick={() => { _this.deleteIcon(item.Id) } } /></div> : null}

                                {!item.Icon || item.Icon.length <= 0 ? <Popover placement="topLeft" title={"选择图标"} content={
                                    <div className="file-box-icon clearfix">
                                        {
                                            selectIcon.map((icon, index) => {
                                                return <div key={index} className="file-box-icon-1" onClick={(e) => _this.iconUrlOnChange(icon, item.Id)}><img src={icon} />
                                                </div>
                                            })
                                        }

                                    </div>
                                } trigger="click">
                                    <img src="/Content/images/add.png" style={{ width: "50%" }} />
                                </Popover> : null}
                                

                            </FormItem>
                        </div>
                    </div>

                    <div className="col-xs-3">
                        <FormItem>
                            <Input {...nameProps} className="control" placeholder="模块名称" onChange={(e) => { _this.setNameChange(e, item.Id) } } />
                        </FormItem>
                    </div>
                    <div className="col-xs-5">
                        <div className="input-group margin-btm10 ">
                            <FormItem>
                                <Input addonBefore={"链接地址"} {...linkProps} className="control" placeholder="您的链接地址" />
                            </FormItem>
                        </div>
                    </div>
                    <a className="col-xs-1 color-blue padding0 margin-top7" onClick={() => { _this.addNavigationModule(item.SortIndex) } }>添加</a>
                    <a className="col-xs-1 color-red padding0 margin-top7" onClick={() => { _this.deleteNavigationModule(item.SortIndex) } }>删除</a>
                </div>


            );

        });

        return (
            <div>
                <div className="pull-right editor-right editor-right88  padding20 editor-top20">
                    <div className="editor-arrow editor-arrow2"><img src="/Content/images/editor-arrow2.png" /></div>
                    <div className="form-horizontal tasi-form" >

                        <div className="form-group margin-top30">
                            <div className="row margin0">
                                <label className="control-label col-xs-2">导航模块管理：</label>
                                <span className="font12 color9 col-xs-9 margin-top10">(建议设置4个模块)</span>
                            </div>
                            <div className="col-xs-9 col-xs-offset-2 margin-top15">

                                {shopNavigationModuleDom}

                            </div>
                        </div>
                        <div className="text-center padding-top20">
                            <Button type="primary" onClick={this.submitForm}>保存</Button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}
let ShopNavigationModuleConfigFormContent = Form.create()(ShopNavigationModuleConfigForm)

export default ShopNavigationModuleConfigFormContent;