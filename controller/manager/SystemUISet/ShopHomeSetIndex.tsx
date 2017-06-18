import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import Tool from '../../../pub/Tool';
import Server from '../../../pub/Server';
import Config from '../../../pub/Config';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, Upload, Tabs, Radio, Switch } from 'antd';
const FormItem = Form.Item;
import { changeActiveAction, getActive } from '../../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../../components/pubController/BaseContainer';
import AppBody from '../../../components/layout/AppBody';
import { BaseStore } from '../../../redux/store/BaseStore';
import { DragDropContext } from 'react-dnd';
import { DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ShopHomeBannerConfigFrom from './ShopHomeBannerConfig';
import ShopNavigationModuleConfigForm from './ShopNavigationModuleConfig';
import ShopHomeRecommendedConfigForm from './ShopHomeRecommendedConfig';
import Slider from '../../../components/slider/Slider';
import update = require('react/lib/update');
import ProductCard from './component/ProductCard'
import NavCard from './component/NavCard'

//api
import ShopHomeSetApi from './ShopHomeSetApi';
//表单验证模块
import Verifier from '../../../pub/Verifier';
import RegExpVerify from '../../../pub/RegExpVerify';
const ItemTypes = { CARD: 'card' }
const store = BaseStore({});


/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
class ShopHomeSetIndex extends BaseContainer {
    //初始化加载
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initShopHomeConfig = this.initShopHomeConfig.bind(this);
        this.isEnableShopBannerChange = this.isEnableShopBannerChange.bind(this);
        this.isEnableShopNavigationModuleChange = this.isEnableShopNavigationModuleChange.bind(this);
        this.displayNavigationList = this.displayNavigationList.bind(this);
        this.displayRecommend = this.displayRecommend.bind(this);
        this.loadShopHomeConfigInfo = this.loadShopHomeConfigInfo.bind(this);
        this.displayShopBanner = this.displayShopBanner.bind(this);
        this.moveCard = this.moveCard.bind(this);
        this.saveOrder = this.saveOrder.bind(this);
        this.cancleRecommend = this.cancleRecommend.bind(this);
        this.state = {
            visibleBanner: false,
            visibleShopNavigationModule: false,
            showBanner: false,
            showNavigationModule: false,
            showRecommend: false,
            shopNavigationModuleList: [],
            recommendedList: [],
            shopBannerList:[],
            showType: 0,
            imageData: [],
            TemplateName: "",//模板名称
            Functions: [],
            cancleProductId: null
        }



    }

    //插入真实DOM之前被执行
    componentWillMount() {
        //this.initShopNavigationModuleList();
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        var self = this;
        this.initShopHomeConfig();
        this.loadShopHomeConfigInfo();
        ShopHomeSetApi.GetTemplatePageSet({}).then((data) => {
            if (data.IsOK) {
                self.setState({ TemplateName: data.Value.TemplateName });
            }
        });
        ShopHomeSetApi.GetMyCenterFunction({}).then(function (data) {
            if (data.IsOK) {
                self.state.Functions = data.Value;
                self.setState({ Functions: data.Value });
            }
        });
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


    initShopHomeConfig() {
        var _this = this;
        const { setFieldsValue } = _this.props.form;
        ShopHomeSetApi.getShopHomeSetConfig({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;

                var setObj = {
                    "IsEnableShopBanner": obj.IsEnableShopBanner, "IsEnableShopNavigationModule": obj.IsEnableShopNavigationModule,
                }
                _this.state.visibleBanner = obj.IsEnableShopBanner;
                _this.state.visibleShopNavigationModule = obj.IsEnableShopNavigationModule;
                setFieldsValue(setObj);
            } else {
                message.error(data.Message);
            }
        });
    }

    loadShopHomeConfigInfo() {
        var _this = this;
        ShopHomeSetApi.getShopHomeConfigInfo({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;

                if (obj.ShopBannerList.length > 0)
                {
                    obj.ShopBannerList.map(function (item) {
                        var imgItem = new Object();
                        imgItem["src"] = item.Image;
                        imgItem["alt"] = item.Title;
                        _this.state.imageData.push(imgItem);
                    });
                }
                if (obj.ShopBannerList.length == 0) {
                    var banner = { Id: Math.floor(Math.random() * 1000), Image: "", Link: "", SortIndex: 0, Title: "", EditType: 0 }
                    obj.ShopBannerList.push(banner);
                }
                if (obj.ShopNavigationModuleList.length == 0) {
                    var shopNavigationModule = { Id: Math.floor(Math.random() * 1000), Icon: "/Content/editor/images/icons/divide_block_5.png", Link: "", SortIndex: 0, Name: "快速导航", EditType: 0 }
                    obj.ShopNavigationModuleList.push(shopNavigationModule);
                }
                console.log(_this.state.imageData);
                _this.setState({ recommendedList: obj.ProductRecommendedInfoList, shopNavigationModuleList: obj.ShopNavigationModuleList, shopBannerList: obj.ShopBannerList });

            } else {
                message.error(data.Message);
            }
        });
    }

    isEnableShopBannerChange(checked) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;

        ShopHomeSetApi.switchIsEnableShopBanner({ IsEnableShopBanner: checked }).then(function (data) {
            if (data.IsOK) {
                _this.state.visibleBanner = checked;
                setFieldsValue({ "IsEnableShopBanner": checked });
            } else {
                message.error(data.Message);
            }
        });
    }


    isEnableShopNavigationModuleChange(checked) {
        var _this = this;
        const { setFieldsValue } = _this.props.form;

        ShopHomeSetApi.switchIsEnableShopNavigationModule({ IsEnableShopNavigationModule: checked }).then(function (data) {
            if (data.IsOK) {
                _this.state.visibleShopNavigationModule = checked;
                setFieldsValue({ "IsEnableShopNavigationModule": checked });
            } else {
                message.error(data.Message);
            }
        });
    }

    changeShowType(showType) {
        this.setState({ showType: showType });
    }

   

    displayNavigationList(shopNavigationModuleList) {
        console.log(shopNavigationModuleList);

        var _this = this;
        _this.setState({ shopNavigationModuleList });
    }

    displayRecommend(recommendedList) {
        var _this = this;
        _this.state.cancleProductId= null
        _this.setState({ recommendedList });
    }

    displayShopBanner(shopBannerList) {
        var _this = this;
        if (shopBannerList.length > 0)
        {
            _this.state.imageData = [];
            shopBannerList.map(function (item) {
                var imgItem = new Object();
                imgItem["src"] = item.Image;
                imgItem["alt"] = item.Title;
                _this.state.imageData.push(imgItem);
            });
        }
        _this.setState({ shopBannerList });
    }

    moveCard(dragIndex, hoverIndex) {
        var self = this;
        const {recommendedList} = self.state;
        const dragCard = recommendedList[dragIndex];

        self.setState(update(self.state, {
            recommendedList: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard]
                ]
            }
        }));
        console.log(recommendedList);
    }

    saveOrder() {
        var self = this;
        const {recommendedList} = self.state;
        var updateSorts = [];
        for (var i = 0; i < recommendedList.length; i++) {
            recommendedList[i].SortIndex = i;
            updateSorts.push({
                ProductId: recommendedList[i].ProductId,
                SortIndex: recommendedList[i].SortIndex
               
            });
        }

        ShopHomeSetApi.updateProductRecommendedInfoList({ ProductRecommendedInfoList: updateSorts }).then(function (data) {
            if (data.IsOK) {
                Modal.success({
                    title: '保存成功',
                    content: '商品推荐配置已保存',
                });
                //_this.initShopHomeBannerList();
                return;

            } else {
                message.error(data.Message);
            }
        });

    }

    cancleRecommend(index)
    {
        var _this = this;
        var recommendedList = _this.state.recommendedList;
        var recommendedProduct= recommendedList[index];

        recommendedList.splice(index, 1);
        debugger;
        _this.setState({ recommendedList: recommendedList, cancleProductId: recommendedProduct.ProductId });

    }

    render() {

        var _this = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = this.props.form;

       

        const isEnableShopBannerProps = getFieldProps('IsEnableShopBanner', {
            valuePropName: 'checked'
        });

        const isEnableShopNavigationModuleProps = getFieldProps('IsEnableShopNavigationModule', {
            valuePropName: 'checked'
        });

        const navigationListDom = _this.state.shopNavigationModuleList.map(function (item) {
            return (
                <li className="hrefblock" key={"li_navigationListDom_" + item.Id}>
                    <a className="alinkbgDef hreflist">
                        <span className="listpicture"><img src={item.Icon} /></span>
                        <p className="picBottom">{item.Name}</p>
                    </a>
                </li>
            );
        });
        
        const recommendDom = _this.state.recommendedList.map(function (item,index) {
            return (

                <ProductCard key={"ProductCard_" + item.ProductId} id={item.ProductId} index={index} item={item} moveCard={_this.moveCard} cancleRecommend={_this.cancleRecommend} />

              
            );
        });
     
        return (
            <AppBody>
                <Form horizontal>
                    <div className="main-content-title padding-top15 clearfix">
                        <a className="main-content-word pull-left " href="/Manager/SystemTemplate/Index">模板设置</a>
                        <a className="main-content-word pull-left " href="/Manager/SystemBasicInfo/Index">基础信息</a>
                    </div>
                    <div className="row padding-top20 margin0">
                        <div className="col-lg-2 col-sm-12 padding-top5">
                            <b>{this.state.TemplateName}</b>
                        </div>
                    </div>
                    <div className="main-content-title padding-top15 clearfix">
                        <a className="main-content-word pull-left" href="/Manager/SystemUISet/Index">会员中心及功能设置</a>
                        <a className="main-content-word pull-left   set-content-word-te">商城首页设置</a>
                    </div>
                    <div className="editor-box88  padding-top60 padding-btm20 clearfix ">
                        <div className="pull-left editor-left editor-left-te">
                            <div className="editor-left-title">
                                <p className="text-center">平台名称</p>
                            </div>
                            <div className="editor-left-main2">
                                <div className="margTop10 topgroup">
                                    <span className="groupLogo"><img src="/Content/images/class-con356.png" /></span>
                                    <div className="serchInputDef">
                                        <input className="borderOut inputDef" placeholder="搜索商品" /><span className="InputDefIcon">搜索图标</span>
                                    </div>
                                    <span className="groupDivide"></span>
                                </div>
                                {_this.state.visibleBanner ? <div className="loopwrapper" onClick={() => { _this.changeShowType(1) } }>
                                    <div className="loopout">
                                        <Slider
                                            items={this.state.imageData}
                                            speed={1.2}
                                            delay={2.1}
                                            pause={true}
                                            autoplay={true}
                                            dots={true}
                                            arrows={true}
                                            />
                                    </div>
                                </div> : null}

                                {this.state.visibleShopNavigationModule ? <ul className="getdivide" onClick={() => { _this.changeShowType(2) } }>

                                    {navigationListDom}

                                </ul> : null}


                                <ul className="clearfix productWrapper" onClick={() => { _this.changeShowType(3) } }>

                                    {recommendDom}
                                </ul>
                            </div>

                            <div className="navWrapper">
                                <ul className="navItemOut">
                                    {
                                        this.state.Functions.filter((item) => { return item.ShowNav }).sort((a, b) => { return (a.NavSort - b.NavSort) > 0 }).map(function (item, index) {
                                            if (item.ShowNav) {
                                                return <NavCard key={index} item={item} />
                                            }
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className="pull-right editor-right editor-right88  padding20">
                            <div className="form-horizontal tasi-form" >
                                <div className="row">
                                    <div className="form-group margin-top30 col-xs-6">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-5">广告图：</label>
                                            <div className="col-xs-7">
                                                <FormItem>
                                                    <Switch {...isEnableShopBannerProps} onChange={_this.isEnableShopBannerChange} checkedChildren={'开'} unCheckedChildren={'关'} />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group margin-top30 col-xs-6">
                                        <div className="row margin0">
                                            <label className="control-label col-xs-5">导航模块：</label>
                                            <div className="col-xs-7">
                                                <FormItem>
                                                    <Switch {...isEnableShopNavigationModuleProps} onChange={_this.isEnableShopNavigationModuleChange} checkedChildren={'开'} unCheckedChildren={'关'} />
                                                </FormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {_this.state.shopBannerList.length > 0 ? <div style={{ display:  _this.state.showType == 1 ? "" : "none" } }> <ShopHomeBannerConfigFrom displayShopBanner={_this.displayShopBanner} shopBannerListData={_this.state.shopBannerList} >   </ShopHomeBannerConfigFrom></div> : null}
                        

                        {_this.state.shopNavigationModuleList.length > 0 ? <div style={{ display: _this.state.showType == 2 ? "" : "none" }}> <ShopNavigationModuleConfigForm displayNavigationList={_this.displayNavigationList} shopNavigationModuleListData={_this.state.shopNavigationModuleList} >   </ShopNavigationModuleConfigForm></div> : null}

                        <ShopHomeRecommendedConfigForm displayRecommend={_this.displayRecommend} showRecommendConfig={_this.state.showType == 3 ? true : false} saveOrder={_this.saveOrder} cancleProductId={_this.state.cancleProductId}>   </ShopHomeRecommendedConfigForm>


                    </div>
                </Form>
            </AppBody>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}

let ShopHomeSetIndexPage = Form.create({})(DragDropContext(HTML5Backend)(ShopHomeSetIndex));

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(ShopHomeSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);
