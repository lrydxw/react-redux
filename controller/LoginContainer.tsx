import 'antd/dist/antd.less'
import * as React from "react";
import * as ReactDOM from "react-dom";
import Config from '../pub/Config';
import BaseApi from '../pub/BaseApi';
import { LoginAction } from '../redux/LoginAction';
import Cookie from '../pub/Cookie';

const TelBaseUrl = Config.TelBaseUrl;
//自己的第三方组件
import {
    Form,
    FormItem,
    Input,
    Select,
    Radio,
    Checkbox,
    Button,
    Tooltip,
    message
} from 'antd';
//表单验证模块
import Verifier from '../pub/Verifier';
//数据流向
//验证的表单配置
let Verifier_Config = {
    accout: {
        name: '用户',
        require: true
    },
    password: {
        name: '密码',
        require: true
    }

};

class LoginApp extends React.Component<any, any>{
    submitDate: any;
    constructor(props) {
        super(props);
        //验证的表单
        this.submitDate = {
            accout: '',
            password: ''
        };
    }

    sublimeButton() {
        //提交数据表单
        let verifyResult = Verifier.verifyConfig(this.submitDate, Verifier_Config, true);
        if (verifyResult.length > 0) {
            message.info(verifyResult[0].tips);
            return false;
        }
        let accout = this.submitDate.accout;
        let password = this.submitDate.password;
        LoginAction(accout, password);
    }

    valueChange(name, value) {
        this.submitDate[name] = value;
    }

    render() {
        return (
            <div>
                <Form >
                    <Form.Item label="用户名">
                        <Input type="text" placeholder="请输入您的用户名" onChange={(event) => this.valueChange('accout', event.target.value)} />
                    </Form.Item>
                    <Form.Item label="密码">
                        <Input type="password" placeholder="请输入您的密码" onChange={(event) => this.valueChange('password', event.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size="large" htmlType="submit" onClick={() => this.sublimeButton()}>登录</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    componentDidMount(): void {

    }

    componentWillUnmount(): void {

    }
}

const ElementContainer = document.getElementById("example");
ReactDOM.render(
    <LoginApp />,
    ElementContainer
);



