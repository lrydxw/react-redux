import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";
import { Steps, Modal, Button, Form, message } from 'antd';
import {AppBasicInfoPage} from './AppBasicInfo';
import {AppWXInfoPage} from './AppWXInfo';
import {AppDistributionInfoPage} from './AppDistributionInfo';
import SystemConfigApi from './Api';

const Step = Steps.Step;

interface InitStep {
    title?: string;
    description?: string;
    isCurrent?: boolean;

}

interface AppInitProps {
    steps?: InitStep[];
    current: number;
}

/*
        定义组件（首字母比较大写），相当于java中的类的声明
    */
let AppInitStep = React.createClass<AppInitProps, any>({
    //初始化加载
    getInitialState: function () {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        return {
            current: -1,
            steps: this.props.steps,
            modalVisible: true
        }
    },
    componentDidMount: function () {
        var current = this.props.current;
        var _this = this;
        setTimeout(function () {
            _this.setState({ current });
        }, 100);
    },


    getContent() {
        if (this.state.current === 0) {
            return <AppBasicInfoPage ref="AppBasicInfoPage"/>;
        } else if (this.state.current === 1) {
            return <AppWXInfoPage ref="AppWXInfoPage"/>;
        } else if (this.state.current === 2) {
            return <AppDistributionInfoPage ref="AppDistributionInfoPage"/>;
        } else {

            return null;
        }
    },
    getFooter() {
        if (this.state.current > 0 && (this.state.current < (this.state.steps.length - 1))) {
            return (
                <div>
                    <Button className="vertical-center" onClick={this.prev}  type="primary" >上一步</Button>
                    <Button className= "vertical-center" onClick={this.next} type= "primary" >下一步</Button>
                </div>
            );
        } else if (this.state.current === this.state.steps.length - 1) {
            return (
                <div>
                    <Button className="vertical-center" onClick={this.prev}  type="primary" >上一步</Button>
                    <Button className= "vertical-center" onClick={this.finish} type= "primary" >完成</Button>
                </div>
            );
        } else {
            return (<Button className= "vertical-center" type= "primary" onClick={ this.next } >下一步</Button>);
        }
    },
    finish() {
    },
    next() {
        if (this.state.current === 0) {
            var form = this.refs.AppBasicInfoPage;
            var _this = this;
            form.validateFields((errors, values) => {
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }
                var obj = form.getFieldsValue();
                if (obj.LogoPath && obj.LogoPath.file && obj.LogoPath.fileList && obj.LogoPath.fileList.length === 1) {
                    obj.LogoPath = obj.LogoPath.file.url;
                }
                SystemConfigApi.setAppBasciInfo(obj).then(function (data) {
                    if (data.IsOK) {
                        let current = _this.state.current + 1;
                        if (current === _this.state.steps.length) {
                            current = 0;
                        }
                        _this.setState({ current });
                    } else {
                        message.info(data.Message);
                    }
                });
            });
        } else if (this.state.current === 1) {
            var form = this.refs.AppWXInfoPage;
            var _this = this;
            form.validateFields((errors, values) => {
                if (!!errors) {
                    return;
                }
                var obj = form.getFieldsValue();
                SystemConfigApi.setWeChatInfo(obj).then(function (data) {
                    if (data.IsOK) {
                        let current = _this.state.current + 1;
                        if (current === _this.state.steps.length) {
                            current = 0;
                        }
                        _this.setState({ current });
                    } else {
                        message.info(data.Message);
                    }
                });
            });

        } else if (this.state.current === 2) {
            var form = this.refs.AppDistributionInfoPage;
            var _this = this;
            form.validateFields((errors, values) => {
                if (!!errors) {
                    return;
                }
                var obj = form.getFieldsValue();
                SystemConfigApi.setDistributionInfo(obj).then(function (data) {
                    if (data.IsOK) {
                        let current = _this.state.current + 1;
                        if (current === _this.state.steps.length) {
                            current = 0;
                        }
                        _this.setState({ current });
                    } else {
                        message.info(data.Message);
                    }
                });
            });

        }
    },
    prev() {
        let current = this.state.current - 1;
        if (current < 0) {
            current = 0;
        }
        this.setState({ current });
    },
    handleCancel() {
        this.setState({
            modalVisible: false,
        });
    },
    render() {
        console.log('加载步骤');
        return (
            <div>
                <Modal
                    width="66%"
                    title="正式使用系统前需要初始化一些设置"
                    visible={this.state.modalVisible}
                    wrapClassName="vertical-center-modal"
                    maskClosable={false}
                    footer={this.getFooter() }
                    onCancel={this.handleCancel}
                    >
                    <div style={{ marginBottom: 24 }}>当前正在执行第 {this.state.current + 1} 步</div>
                    <Steps style={{ marginBottom: 24 }} current={this.state.current}>
                        {this.props.steps.map((s, i) => <Step key={i} title={s.title} description={s.description} />) }
                    </Steps>
                    {this.getContent() }
                </Modal>
            </div>
        );
    }

});

export default AppInitStep;
