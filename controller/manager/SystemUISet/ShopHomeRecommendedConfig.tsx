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


interface ShopHomeRecommendedConfigFormProps extends FormComponentProps {

    form?: any;
    showRecommendConfig?: boolean;
    displayRecommend?: Function;
    saveOrder?: Function;
    cancleProductId?: any;
}



class ShopHomeRecommendedConfigForm extends React.Component<ShopHomeRecommendedConfigFormProps, any> {

    constructor(props) {

        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);
        this.initRecommendList = this.initRecommendList.bind(this);
        this.setSearchKeywords = this.setSearchKeywords.bind(this);
        this.searchProduct = this.searchProduct.bind(this);
        this.setRecommend = this.setRecommend.bind(this);
        this.loadRecommendedList = this.loadRecommendedList.bind(this);

        this.state = {

            TotalCount: 0,//总记录数
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            ProductRecommendedInfoList: [],
            loadingRecommend: false,//正在加载列表,
            searchKeywords: "",
            recommendedList: [],
            isFirstLoad: true
        }
    }



    //插入真实DOM之前被执行 
    componentWillMount() {
        this.loadRecommendedList();
        console.log('执行组件3componentWillMount');
    }


    //插入真实DOM之后被执行
    componentDidMount() {
        this.initRecommendList();
        console.log('执行组件3componentDidMount');
    }


    //更新DOM之前被执行
    componentWillUpdate() {
        console.log('执行组件3componentWillUpdate');
    }

    //更新DOM之后被执行
    componentDidUpdate(nextProps) {
        console.log('执行组件3componentDidUpdate');
    }
    //移除DOM之前被执行
    componentWillUnmount() {
        console.log('执行组件3componentWillUnmount');
    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        console.log('执行组件3componentWillReceiveProps');

        if (nextProps.cancleProductId && this.state.ProductRecommendedInfoList.length > 0) {
            var productList = this.state.ProductRecommendedInfoList;
            var cancleProductId = nextProps.cancleProductId;
            var index = -1;
            for (var i = 0; i < productList.length; i++) {
                if (productList[i].ProductId == cancleProductId) {
                    index = i;
                    break;

                }
            }
          
            var recommendedList = this.state.recommendedList;

            for (var i = 0; i < recommendedList.length; i++) {
                var recommendIndex = this.getCurrentProductIndex(cancleProductId, recommendedList);
                if (recommendIndex > -1) {
                    recommendedList.splice(recommendIndex, 1);
                }
            }


            if (index > -1) {
                productList[index].IsRecommended = false;
                this.setState({ ProductRecommendedInfoList: productList, recommendedList: recommendedList });
            }
        }
    }

    
    initRecommendList() {
        var _this = this;
        var obj = obj || {};
        obj.PageIndex = _this.state.PageIndex;
        obj.PageSize = _this.state.PageSize;
        obj.ProductName = _this.state.searchKeywords;
        _this.state.loadingRecommend = true;
        ShopHomeSetApi.getProductRecommendedInfoList(obj).then(function (data) {
            if (data.IsOK) {

                var objList = data.Value;
                if (!_this.state.isFirstLoad) {
                    for (var i = 0; i < objList.length; i++) {
                        var existIndex = _this.getCurrentProductIndex(objList[i].ProductId, _this.state.recommendedList);
                        if (existIndex > -1) {
                            objList[i].IsRecommended = true;
                        }
                        else {
                            objList[i].IsRecommended = false;
                        }
                    }
                }
                _this.state.ProductRecommendedInfoList = objList;
                _this.state.isFirstLoad = false;
                _this.state.TotalCount = data.AllCount;
               
                //if (data.Value.length > 0) {
                //    data.Value.map(function (item) {
                //        var index = _this.getCurrentProductIndex(item.ProductId, _this.state.recommendedList);
                //        if (item.IsRecommended && index == -1) {
                //            _this.state.recommendedList.push(item);
                //        }

                //    });
                //}
                _this.setState({ loadingRecommend: false });

                //_this.props.displayRecommend(_this.state.recommendedList);
            } else {
                message.error(data.Message);
            }
        });
    }

    loadRecommendedList() {
        var _this = this;
        ShopHomeSetApi.getShopHomeConfigInfo({}).then(function (data) {
            if (data.IsOK) {
                var obj = data.Value;

                _this.state.recommendedList = obj.ProductRecommendedInfoList;
                //_this.setState({ recommendedList: obj.ProductRecommendedInfoList, shopNavigationModuleList: obj.ShopNavigationModuleList, shopBannerList: obj.ShopBannerList });

            } else {
                message.error(data.Message);
            }
        });
    }

    setRecommend(isRecommend, id) {

        var _this = this;
        var productList = _this.state.ProductRecommendedInfoList;
        var recommendList = _this.state.recommendedList;
        var index = _this.getCurrentProductIndex(id, productList);
        if (index > -1) {
            var currnetObj = productList[index];
            if (isRecommend) {
                if (recommendList.length >= 10)
                {
                    Modal.info({
                        title: '温馨提示',
                        content: '推荐商品的数量最多为10个！',
                    });
                    return false;
                }
                currnetObj.IsRecommended = true;
                recommendList.push(currnetObj);
            }
            else {
                var recommendIndex = _this.getCurrentProductIndex(id, recommendList);
                if (recommendIndex > -1) {
                    recommendList.splice(recommendIndex, 1);
                    currnetObj.IsRecommended = false;
                }
            }
        }

        recommendList = _this.sortRecommendIndex(recommendList);
        _this.setState({ ProductRecommendedInfoList: productList, recommendedList: recommendList });
        _this.props.displayRecommend(recommendList);

    }

    getCurrentProductIndex(id, obj) {
        var _this = this;
        var result = -1;
        var currentObj = obj;
        for (var i = 0; i < currentObj.length; i++) {
            if (currentObj[i].ProductId == id) {
                result = i;
                break;
            }
        }
        return result;
    }

    setSearchKeywords(e) {
        var _this = this;
        _this.state.searchKeywords = e.target.value;
    }

    searchProduct() {
        var _this = this;
        _this.state.PageIndex = 1;
        _this.initRecommendList();
    }

    displayRecommend(recommendedList) {
        var _this = this;
        _this.setState({ recommendedList });
    }

    sortRecommendIndex(recommendedList) {
        for (var i = 0; i < recommendedList.length; i++) {
            var recommendedProduct = recommendedList[i];
            recommendedProduct.SortIndex = i;
        }
        return recommendedList;
    }

    submitForm() {
        var _this = this;
        var form = _this.props.form;

        var productRecommendedInfoList = _this.state.recommendedList;

        ShopHomeSetApi.updateProductRecommendedInfoList({ ProductRecommendedInfoList: productRecommendedInfoList }).then(function (data) {
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

    render() {
        var _this = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue, getFieldValue } = _this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };

        const RecommendedColumns = [
            {
                title: '商品图',
                dataIndex: 'ShowImg',
                key: 'ShowImg',
                render: (text) => <span>  <img className="pull-left margin-right10" src={text} width="52" height="52" /></span>,
            },
            {
                title: '商品名',
                dataIndex: 'ProductName',
                key: 'ProductName',
                render: (text) => <span> {text}</span>,
            },


            {
                title: '操作',
                key: 'operation',
                render: (text, record) => {

                    if (record.IsRecommended) {
                        return (<a className="color-red" onClick={() => { _this.setRecommend(false, record.ProductId) } }>取消推荐</a>)
                    }
                    else {
                        return (<a className="color-green" onClick={() => { _this.setRecommend(true, record.ProductId) } }>推荐到首页</a>)
                    }
                },
            }
        ];

        const pagination = {
            total: _this.state.TotalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            onShowSizeChange(current, pageSize) {
                _this.state.PageIndex = current;
                _this.state.PageSize = pageSize;
                _this.initRecommendList();
            },
            onChange(current) {
                _this.state.PageIndex = current;
                _this.initRecommendList();
            },
            showTotal() {
                return `共 ${_this.state.TotalCount} 条`;
            }
        };

        return (
            <div>
                {this.props.showRecommendConfig ? <div className="pull-right editor-right editor-right88  padding20 editor-top20">
                    <div className="editor-arrow editor-arrow2"><img src="/Content/images/editor-arrow2.png" /></div>
                    <div className="form-horizontal tasi-form" >
                        <div className="form-group margin-top30">
                            <div className="row margin0">
                                <label className="control-label col-xs-2">首页推荐管理：</label>
                            </div>
                            <div className="col-xs-9 col-xs-offset-2 padding0 margin-top15">
                                <div className="input-group">
                                    <input type="text" className="form-control search-fill" onChange={_this.setSearchKeywords} />
                                    <span className="input-group-addon  search-btn">
                                        <i className="fa fa-search" onClick={_this.searchProduct}></i>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-9 col-xs-offset-2 margin-top20">

                                    <Table
                                        columns={RecommendedColumns}
                                        dataSource={_this.state.ProductRecommendedInfoList}
                                        pagination={pagination}
                                        loading={_this.state.loadingRecommend}
                                        rowKey={record => record.ProductId}

                                        />

                                </div>
                            </div>

                        </div>
                        <div className="text-center padding-top20">
                            <Button type="primary" onClick={() => { _this.props.saveOrder() } }>保存</Button>
                        </div>
                    </div>
                </div> : null}

            </div>
        );
    }

}
let ShopHomeRecommendedConfigFormContent = Form.create()(ShopHomeRecommendedConfigForm)

export default ShopHomeRecommendedConfigFormContent;