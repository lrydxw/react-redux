import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../pub/Server';
import Config from '../pub/Config';
import {message} from 'antd';
import Api from '../pub/Api';
import {Button} from 'antd';
import AppInitStep from './SystemConfig/AppInitStep';
import {changeActiveAction, getActive} from '../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../components/pubController/BaseContainer';
import AppBody from '../components/layout/AppBody';
import {BaseStore} from '../redux/store/BaseStore';
//表单验证模块
import Verifier from '../pub/Verifier';
const store = BaseStore({});
import {Editor} from '../components/editor/editor';

class TestUeditor extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.setContent = this.setContent.bind(this);
        this.contentChange = this.contentChange.bind(this);
        this.getContent = this.getContent.bind(this);
        this.state = { content: "1111111111" };
    }

    setContent() {
        this.setState({ content: "klsdjflkjasdlfj" });
    }

    getContent() {
        console.log(this.state.content);
    }

    contentChange(value) {
        this.state.content = value;
        //this.setState({ content: value });
    }

    render() {
        console.log(this.state.content);
        return (
            <div>
                <Editor value={this.state.content} id="content" height="500" callbackContentChange={this.contentChange} />
                <button onClick={this.setContent}>设置内容</button>
                <button onClick={this.getContent}>获取内容</button>
            </div>
        );
    }
}

const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <TestUeditor/>,
    ElementContainer
);

