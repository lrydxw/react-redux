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
import Tool from '../../../../pub/Tool';

import update = require('react/lib/update');

const ItemTypes = { CARD: 'card' }
const FormItem = Form.Item;




class NavCard extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    render() {
        var self = this;
        const {item} = self.props;
        return (
            <li className={item.Link.toLowerCase() == "/mycenter" ? "navItemList navItemCenter navIconActive" :"navItemList"}>
                {
                    item.Link.toLowerCase() == "/mycenter" ?
                        <a href="#" className="navload">
                            <div className="navIconMember">
                                <span className="navLogo"><img src={item.NavIconUrl} alt={item.DisplayName} /></span>
                                <h2 className="navMain">{item.DisplayName}</h2>
                            </div>
                        </a>
                        :
                        <a href="#" className="navload">
                            <span className="navIcon"><img src={item.NavIconUrl} alt={item.DisplayName} /></span>
                            <h2 className="navMain">{item.DisplayName}</h2>
                        </a>
                }
            </li>
        );
    }
}

export default NavCard;