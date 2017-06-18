import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import Tool from '../../../pub/Tool';
import { Icon, Modal, Form, Input, Tabs, Upload, Popconfirm, message, Button, FormComponentProps } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//添加、修改表单
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
//api
import WeChatSetInfoApi from './Api';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import ArrayHelper from '../../../pub/ArrayHelper';
const store = BaseStore({});
const confirm = Modal.confirm;

interface ContentItemFormProps extends FormComponentProps {

    form?: any;
    shopBannerListData?: any;
    displayShopBanner?: Function;
}


class ContentItemForm extends React.Component<ContentItemFormProps, any> {

    constructor(props) {

        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initShopHomeBannerList = this.initShopHomeBannerList.bind(this);
        this.addNewBanner = this.addNewBanner.bind(this);
        this.deleteBanner = this.deleteBanner.bind(this);
        
        this.state = {
            shopBannerList: props.shopBannerListData,
            priviewVisible: false,

        }



    }



    //插入真实DOM之前被执行 
    componentWillMount() {
        console.log('执行组件 componentWillMount');
    }


    //插入真实DOM之后被执行
    componentDidMount() {
       
        console.log('执行组件 componentDidMount');

    }


    //更新DOM之前被执行
    componentWillUpdate() {
        console.log('执行组件 componentWillUpdate');
    }

    //更新DOM之后被执行
    componentDidUpdate(nextProps) {

        console.log('执行组件 componentDidUpdate');
    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log('执行组件 componentWillUnmount');
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        console.log('执行组件 componentWillReceiveProps');

    }


    initShopHomeBannerList() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;

        if (_this.state.shopBannerList.length > 0) {
            var setObj = {};
            _this.state.shopBannerList.map(function (item) {
                setObj["Link_" + item.Id] = item.Link;
                setObj["Image_" + item.Id] = item.Image;

                if (item.Image && item.Image.length > 0) {
                    var imgUrlFileList = [{
                        uid: item.Id,
                        name: item.Id,
                        status: 'done',
                        url: item.Image,
                        thumbUrl: item.Image
                    }];

                    _this.state["ImageUrlFileList_" + item.Id] = imgUrlFileList;
                }
                else {
                    _this.state["uploadImg_" + item.Id] = true;
                }

            });
            setFieldsValue(setObj);
        }
        else {

            var shopBannerList = _this.state.shopBannerList;
            var banner = { Id: Math.floor(Math.random() * 1000), Image: "", Link: "", SortIndex: 0, Title: "", EditType: 0 }
            shopBannerList.splice(0, 0, banner);

            shopBannerList = _this.sortBannerIndex(shopBannerList);
        }



    }

    addNewBanner(sortIndex) {
        var _this = this;
        var shopBannerList = _this.state.shopBannerList;
        if (shopBannerList.length >= 5) {
            Modal.warning({
                title: '温馨提示',
                content: 'Banner图最多为5个',
            });
            return;
        }
        var banner = { Id: Math.floor(Math.random() * 1000), Image: "", Link: "", SortIndex: sortIndex, Title: "", EditType: 0 }
        shopBannerList.splice(sortIndex + 1, 0, banner);

        shopBannerList = _this.sortBannerIndex(shopBannerList);

        _this.state["uploadImg_" + banner.Id] = true;

        _this.setState({ shopBannerList: shopBannerList });
        _this.props.displayShopBanner(_this.state.shopBannerList);

    }




    sortBannerIndex(shopBannerList) {
        for (var i = 0; i < shopBannerList.length; i++) {
            var shopBanner = shopBannerList[i];
            shopBanner.SortIndex = i;
        }
        return shopBannerList;
    }

    deleteBanner(sortIndex) {
        var _this = this;
        var shopBannerList = _this.state.shopBannerList;
        if (shopBannerList.length <= 1) {
            Modal.warning({
                title: '温馨提示',
                content: '请至少保留一个Banner图',
            });
            return;
        }
        shopBannerList.splice(sortIndex, 1);
        shopBannerList = _this.sortBannerIndex(shopBannerList);
        _this.setState({ shopBannerList: shopBannerList });
        console.log(shopBannerList);
        _this.props.displayShopBanner(_this.state.shopBannerList);
    }

    displayShopBanner(shopBannerList) {
        var _this = this;
        _this.setState({ shopBannerList });
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



        let shopBannerDom = _this.state.shopBannerList.map(function (item, i) {
            let { setFieldsValue, getFieldValue } = _this.props.form;

            let imageProps = getFieldProps('Image_' + item.Id, {
                validate: [{
                    rules: [
                        { required: true, message: '请上传图片' },
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

            let imageUploadProps = {

                multiple: false,
                action: "/UploadFile/UploadImage",
                beforeUpload(file) {
                    return Tool.ImgBeforeUpload(file);
                },
                fileList: _this.state["ImageUrlFileList_" + item.Id],
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
                    var key = "Image_" + item.Id;
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

                    var shopBannerList = _this.state.shopBannerList;
                    var index = -1;
                    for (var i = 0; i <= shopBannerList.length; i++) {
                        if (shopBannerList[i].Id == item.Id) {
                            shopBannerList[i].Image = val;
                            break;
                        }
                    }
                    setFieldsValue(obj);
                    _this.props.displayShopBanner(_this.state.shopBannerList);
                    //$(".ant-upload-select-picture-card").css("display", fileList && fileList.length > 0 ? "none" : "");
                },
                listType: "picture-card",
                onPreview: (file) => {

                    _this.state["priviewVisible_" + item.Id] = true;
                    _this.state["priviewImage_" + item.Id] = file.url;
                    _this.setState(_this);
                    //_this.setState({
                    //    priviewImage: file.url,
                    //    priviewVisible: true,
                    //})
                }

            };

            return (
                <div className="row margin-top10" key={"banner_div_" + item.Id}>
                    <div className=" col-xs-2">
                        <div className="file-img margin-right10">
                            <FormItem>
                                <Input type="hidden"  {...imageProps} />

                                <div >
                                    <Upload {...imageUploadProps} name="upload" >

                                        {_this.state["uploadImg_" + item.Id] ? <div> <Icon type="plus" />
                                            <div className="ant-upload-text" >Banner图</div></div> : null}

                                    </Upload>
                                    <Modal visible={_this.state["priviewVisible_" + item.Id]} footer={null} onCancel={() => { _this.handleCancel(item.Id) } }>
                                        <img style={{ width: "100%" }} alt="example" src={_this.state["priviewImage_" + item.Id]} />
                                    </Modal>
                                </div>
                            </FormItem>
                        </div>
                    </div>
                    <div className="col-xs-7">
                        <div className="input-group margin-btm10 margin-top30 margin-left20">
                            <FormItem>
                                <Input addonBefore={"链接地址"} {...linkProps} className="control" placeholder="您的链接地址" />
                            </FormItem>
                        </div>
                    </div>
                    <a className="col-xs-2 color-blue  margin-top30" onClick={() => { _this.addNewBanner(item.SortIndex) } }>添加</a>
                    <a className="col-xs-1 color-red padding0 margin-top7 margin-top30" onClick={() => { _this.deleteBanner(item.SortIndex) } }>删除</a>
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
                                <label className="control-label col-xs-2 ">广告图管理：</label>
                                <span className=" font12 color9 col-xs-9 margin-top10">图标尺寸比例需为16：9  (建议上传尺寸为750*422px)</span>
                            </div>
                            <div className="col-xs-9 col-xs-offset-2 margin-top15">

                                {shopBannerDom}


                            </div>
                        </div>
                        <div className="text-center padding-top20">
                            <Button type="primary" >保存</Button>


                        </div>
                    </div>
                </div>

            </div>
        );
    }

}
let ContentItemFormContent = Form.create()(ContentItemForm)

export default ContentItemFormContent;