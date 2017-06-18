import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import { Provider, connect} from 'react-redux';

import Server from '../../pub/Server';
import Config from '../../pub/Config';
import Tool from '../../pub/Tool';
import LocalStorage from '../../pub/LocalStorage';
import { Table, Row, Col, Modal, Form, Input, Button, Popconfirm, message, Menu, Select} from 'antd';
const FormItem = Form.Item;
import {changeActiveAction, getActive} from '../../redux/actions/MenuAction';
//自己书写的基类
import BaseContainer from '../../components/pubController/BaseContainer';
import AppBody from '../../components/layout/AppBody';
import {BaseStore} from '../../redux/store/BaseStore';
import {Editor} from '../../components/editor/editor';
//添加、修改表单
import {FormTemplate, FormElement, ElementEnum } from '../../components/FormTemplate/FormControl';
//api
import AgencyManageApi from './AgencyManageApi';
const Option = Select.Option;
const store = BaseStore({});


/**
 * 定义组件（首字母必须大写），相当于java中的类的声明
 */
class MemberRecruitmentSetIndex extends BaseContainer {
    constructor(props) {
        /*
            1、初始化时，将被执行
            2、必须return null或者一个对象，数据发生变化，将重新渲染DOM
            3、相当于java中全局变量的声明
            4、值发生变化时，render将会重新被渲染
            */
        super(props);

        this.initFrom = this.initFrom.bind(this);
        this.submitFrom = this.submitFrom.bind(this);
        this.state = {
            detailContent: "请输入招募页详情",
            configId: -1,
            editNextId: -1,
            selectMemberLevelData:[]

        }

        //this.loadCourseInfoDetail();
    }


    componentWillMount() {
    }
    //插入真实DOM之后被执行
    componentDidMount() {
        this.initFrom();
        this.loadSelectMemberLevelData();
    }
    //更新DOM之前被执行
    componentWillUpdate() {

    }
    //更新DOM之后被执行
    componentDidUpdate() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        if (_this.state.configId !== _this.state.editNextId) {
            _this.state.editNextId = _this.state.configId;

           
            AgencyManageApi.getMemberRecruitment({ }).then(function (data) {

                if (data.IsOK) {
                    var result = data.Value;
                    _this.state["detailContent"] = result.RecruitmentContent;



                    //var key = "RecruitmentContent";
                    //var val = result.RecruitmentContent;
                    //var obj = {};
                    //obj[key] = val;


                    setFieldsValue(data.Value);
                  

                } else {
                    message.error(data.Message);
                }
            });

        }

    }
    //移除DOM之前被执行
    componentWillUnmount() {

    }
    //已加载组件收到新的参数时调用
    componentWillReceiveProps(nextState) {

    }

    initFrom() {
        var _this = this;
        _this.state.editNextId = -1;
        _this.state.configId = "";


    }


    loadSelectMemberLevelData() {
        var _this = this;
        AgencyManageApi.getMemberLevelSelectData({ IsShowAll: false }).then(function (data) {
            if (data.IsOK) {

                _this.setState({ selectMemberLevelData: data.Value });

            } else {
                message.error(data.Message);
            }
        });
    }


    backToCourseList() {
        Tool.goPush('Course/Index');
    }
    submitFrom() {
        var _this = this;
        var form = this.props.form;

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            var obj = form.getFieldsValue();
            console.log(obj);
            AgencyManageApi.updateMemberRecruitment(obj).then(function (data) {
                if (data.IsOK) {
                    Modal.success({
                        title: '操作成功',
                        content: '会员招募信息已保存',
                        onOk() {
                           
                        },
                    });

                } else {
                    message.error(data.Message);
                }
            });

        });
    }

  


    render() {
        var _self = this;
        const { getFieldProps, getFieldError, isFieldValidating, setFieldsValue } = _self.props.form;

        const editProps = {
            callbackContentChange: (value) => {
                if (_self.state["detailContent"] !== value) {
                    _self.state["detailContent"] = value;
                    var key = "RecruitmentContent";
                    var val = value;
                    var obj = {};
                    obj[key] = val;
                    setFieldsValue(obj);
                }
            }

        }

        var memberLevelSelectOption = this.state.selectMemberLevelData.map(function (item) {
            return (
                <Option key={ 'li_' + item.Id} value={String(item.Id) }> { item.Name }</Option >
            );
        });

        const inputProps = getFieldProps("RecruitmentContent", {
            rules: [
                { required: true, message: "请输入招募页详情" },
            ],
        });

        const memberLevelListProps = getFieldProps('MemberLevelList', {
            validate: [{
                rules: [
                    { required: true, message: "请选择会员级别" , type: "array" },
                ],
                trigger: ['onBlur', 'onChange'],

            },
            ],

        });

        const shareIntroductionProps = getFieldProps("ShareIntroduction", {
            validate: [{
                rules: [
                    { required: true, message: "请输入分享简介" },
                ],
                trigger: ['onBlur', 'onChange'],

            },
            ],

           
        });

        const shareTitleProps = getFieldProps("ShareTitle", {

            validate: [{
                rules: [
                    { required: true, message: "请输入分享标题" },
                ],
                trigger: ['onBlur', 'onChange'],

            },
            ],
        });

        return (
            <AppBody>

                <div className="main-content-title padding-top15 clearfix">

                    <Menu
                        selectedKeys={["memberLevelSet"]}
                        mode="horizontal"
                        >
                        <Menu.Item key="memberList">
                            <a href="AgencyManageIndex" rel="noopener noreferrer">会员列表</a>
                        </Menu.Item>

                        <Menu.Item key="memberLevelSet">
                            <a href="MemberLevelSetIndex" rel="noopener noreferrer">会员设置</a>
                        </Menu.Item>
                    </Menu>


                </div>

                <Form horizontal>
                    <div className="editor-box padding-top20 padding-btm20 clearfix ">
                        <div className="pull-left editor-left">
                            <div className="editor-left-title">
                                <p className="text-center">微领袖商学院</p>
                            </div>
                            <div className="editor-left-main">

                                <div>
                                    <div dangerouslySetInnerHTML={{ __html: _self.state["detailContent"] }} />
                                </div>
                            </div>
                        </div>
                        <div className="pull-right">
                            <form className="form-horizontal" >
                                <div className="well well-sm margin-btm10 editor-right3">
                                    <div className="row margin0">
                                        <p className="col-xs-3 font12 text-right margin-top8">招募级别: </p>
                                        <div className="col-xs-9">

                                            <FormItem key="ClassMonitorList">
                                                <Select
                                                    multiple
                                                    placeholder="请选择"
                                                    {...memberLevelListProps}
                                                    >

                                                    {memberLevelSelectOption}
                                                </Select>
                                            </FormItem>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="well well-sm margin-btm10 editor-right3">
                                    <div className="row margin0">
                                        <p className="col-xs-12 font12 margin-top8">分享标题（微信分享给好友时会显示这里的文案） </p>
                                        <div className="col-xs-12">
                                        
                                            <FormItem key="shareTitle"
                                                hasFeedback
                                                >
                                                <Input {...shareTitleProps} className="form-control" />

                                            </FormItem>
                                            

                                        </div>
                                    </div>
                                    <div className="row margin0 margin-top10">
                                        <p className="col-xs-12 font12 margin-top8">分享简介（微信分享给好友时会显示这里的文案） </p>
                                        <div className="col-xs-12">
                                            <FormItem key="shareIntroduction"
                                                hasFeedback
                                                >
                                                <Input {...shareIntroductionProps} className="form-control" />
                                            </FormItem>

                                          
                                        </div>
                                    </div>
                                </div>
                                <div className="editor-right editor-right3 padding20 bg-colorF5 ">
                                    <div className="editor-arrow"><img src="/content/images/editor-arrow.jpg"/></div>
                                    <FormItem key="Details"
                                        hasFeedback
                                        >
                                        <Input {...inputProps} type="hidden" />

                                        <Editor {...editProps} value={_self.state["detailContent"]} id="content"  height="500"  />

                                    </FormItem>
                                </div>
                            </form>
                        </div>
                    </div>
                    <hr />
                    <div className="row margin0 bg-colorFC padding10 margin-btm20">
                        <div className="col-lg-1 col-xs-offset-5 col-sm-2">

                            <Button type="primary" size="large" onClick={this.submitFrom}>完成</Button>

                        </div>
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

let MemberRecruitmentSetIndexPage = Form.create({})(MemberRecruitmentSetIndex);

/**
 * 添加监听数据
 */
const App = connect(mapStateToProps)(MemberRecruitmentSetIndexPage);
const ElementContainer = document.getElementById("contentDiv");
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
    ElementContainer
);
