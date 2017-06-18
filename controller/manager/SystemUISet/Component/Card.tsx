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
    item: any
};
var DragSourceDecorator = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    draggindId: monitor.getItem()&&monitor.getItem()["id"]
}))

var DropTargetDecorator = DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))

class CardC extends React.Component<CardPropTypes, any> {
    constructor(props) {
        super(props);
        this.state = {
            ShowClose: false
        };
    }
    render() {
        const { item, index, isDragging, draggindId, connectDragSource, connectDropTarget, removeFromCenter } = this.props;
        const opacity = isDragging && draggindId == item.Id ? 0 : 1;
        let {ShowClose} = this.state;
        return connectDragSource(connectDropTarget(
            <li className="col-xs-3  blockItem " style={{ opacity: opacity, cursor: 'move' }}>
                <a href="#" className="alinkbgDef blockHref" onMouseOver={(e) => { this.setState({ ShowClose: true }) } } onMouseLeave={(e) => { this.setState({ ShowClose: false }) } }>
                    <span className="blockIcon"><img src={item.IcoUrl} alt={item.DisplayName} /></span>
                    <h4 className="blockMain">{item.DisplayName}</h4>
                    <div className="blockArrow" style={{ display: !isDragging && ShowClose ? "block" : "none" }} onClick={(e) => removeFromCenter(index)}><img src="/content/editor/images/icons/cuo.png" /></div>
                </a>
            </li>
        ));
    }
}
const Card = DropTargetDecorator(DragSourceDecorator(CardC));

export default Card;
