import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import { BaseStore } from '../../redux/store/BaseStore';
import ProductApi from './ProductApi';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';

import { Tabs, Modal, message } from 'antd';
const TabPane = Tabs.TabPane;
import { ProductInfoSetStep1Page } from './ProductInfoSetStep1'
import { ProductInfoSetStep2Page } from './ProductInfoSetStep2'
import { ProductSetStep3Page } from './ProductSetStep3'

class ProductEditIndex extends BaseContainer {

    constructor(props) {
        super(props);
        this.nextTab = this.nextTab.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveProductInfo = this.saveProductInfo.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.cancelNextActive = this.cancelNextActive.bind(this);
        this.state = { activeKey: 1, nextActiveKey: 1, ProductInfo: null };
    }
    cancelNextActive() {
        this.setState({ nextActiveKey: Number(this.state.activeKey) });
    }
    nextTab(nextKey, currentObj) {
        var activeTab = Number(this.state.activeKey);
        this.state.ProductInfo = Tool.assign(this.state.ProductInfo, currentObj);
        console.log(this.state.ProductInfo);
        var obj = this.state.ProductInfo;
        var showImg = obj.First.ProductImgList.split(",")[0];
        var marketPrice = 0;
        var salePrice = 0;
        if (obj.Second)
        {
            marketPrice = obj.Second.MarketPrice;
            salePrice = obj.Second.SalePrice;
        }
        if (nextKey > 0)
            this.setState({ activeKey: String(nextKey), nextActiveKey: nextKey, showImg: showImg, marketPrice: marketPrice, salePrice: salePrice });
        if (nextKey == -1) {
            this.saveProductInfo();
        }
    }
    saveProductInfo() {
        ProductApi.UpdateOrInsertProduct(this.state.ProductInfo).then((data) => {
            console.log(this.state.ProductInfo);
            if (data.IsOK) {
                //使用Message返回产品id
                if (data.Message) {
                    LocalStorage.add('ProductId', data.Message);
                }
                Modal.success({
                    title: '操作成功',
                    content: '产品信息已保存',
                    onOk() {
                        Tool.goPush('Product/ProductList');
                    },
                });
            } else {
                message.error(data.Message);
            }
        });
    }
    onTabClick(clickKey) {
        var activeTab = Number(this.state.activeKey);
        if (activeTab != Number(clickKey)) {
            this.setState({ nextActiveKey: Number(clickKey) });
        }
    }
    onChange(activeKey) {

    }
    render() {
        return <AppBody>
            <div className="main-content-title padding-top15 clearfix">
                <a className="main-content-word pull-left set-content-word-te">设置商品信息</a>
            </div>
            <Tabs activeKey={this.state.activeKey} onChange={this.onChange} onTabClick={this.onTabClick}>
                <TabPane tab={<li className="step-con step-active" >1.设置商品信息</li>} key="1">
                    <ProductInfoSetStep1Page nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 1 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
                <TabPane tab={<li className="step-con" >2.设置出售设置</li>} key="2">
                    <ProductInfoSetStep2Page nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 2 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
                <TabPane tab={<li className="step-con" >3.编辑商品详情</li>} key="3">
                    <ProductSetStep3Page showImg={this.state.showImg} marketPrice={this.state.marketPrice} salePrice={this.state.salePrice} nextTab={this.nextTab} activeKey={Number(this.state.activeKey)} cancelNextActive={this.cancelNextActive} nextActiveKey={Number(this.state.activeKey) == 3 && this.state.activeKey != this.state.nextActiveKey ? this.state.nextActiveKey : null} />
                </TabPane>
            </Tabs>
        </AppBody>
            ;
    }
}
let mapStateToProps = (state) => {
    return {
        MenuReducers: state.MenuReducers
    }
}
const store = BaseStore({});

const App = connect(mapStateToProps)(ProductEditIndex);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    ElementContainer
);