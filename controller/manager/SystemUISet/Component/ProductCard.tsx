import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';


import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio, Popover, Select, Upload } from 'antd';

import { Sortable } from "sortable";
//自己书写的基类

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import { DragDropContext } from 'react-dnd';
import { DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import update = require('react/lib/update');

const ItemTypes = { CARD: 'card' }
const FormItem = Form.Item;

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }

        props.moveCard(dragIndex, hoverIndex);

        monitor.getItem().index = hoverIndex;
    }
};
interface CardPropTypes {
    connectDragSource?: Function,
    connectDropTarget?: Function,
    index: number,
    isDragging?: boolean,
    draggindId?: any,
    id: any,
    moveCard: Function,
    removeFromCenter: Function,
    item: any,
    cancleRecommend: Function
};
var DragSourceDecorator = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    draggindId: monitor.getItem() && monitor.getItem()["id"]
}))

var DropTargetDecorator = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))

class ProductCardC extends React.Component<CardPropTypes, any> {
    constructor(props) {
        super(props);
        this.state = {
            ShowClose: false
        };
    }
    render() {
        const { item, index, isDragging, draggindId, connectDragSource, connectDropTarget, removeFromCenter } = this.props;
        const opacity = isDragging && draggindId == item.ProductId ? 0 : 1;
        let {ShowClose} = this.state;
        return connectDragSource(connectDropTarget(

            <li className="productitem">
                <div className="iteminner">
                    <a className="itemtop"><span className="topimage"><img src={item.ShowImg} /></span></a>
                    <a className="alinkFontDef itemtitle">{item.ProductName}</a>
                    <p className="itemcuntnow">销量：{item.SaleNumber}</p>
                    <div className="clearfix fontColordanger shopleft">
                        <p>¥{item.SalePrice}</p>
                        <span>购物车</span>
                    </div>
                    <a className="lc-yichu" onClick={() => { this.props.cancleRecommend(this.props.index) } }>取消推荐</a>
                </div>
            </li>

           
        ));
    }
}
const ProductCard = DropTargetDecorator(DragSourceDecorator(ProductCardC));

export default ProductCard;
