import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Form, Switch, Input } from 'antd';
const FormItem = Form.Item;
interface UIMyLeftProps1 {
    IsEnabled: boolean,
    DispalyName: string,
    ShowStudentCode: boolean,
    StudentCode: string,
    ShowMemberLevel: boolean,
    ShareDispaly: string
}
interface UIMyLeftProps {
    Props: UIMyLeftProps1;
}
class UIMyLeft extends React.Component<UIMyLeftProps, any> {
    //初始化加载
    constructor(props) {

        super(props);
        this.state={
            IsEnabled:this.props.Props.IsEnabled,
            ShowStudentCode:this.props.Props.ShowStudentCode,
            StudentCode:this.props.Props.StudentCode,
            ShowMemberLevel:this.props.Props.ShowMemberLevel,
            ShareDispaly:this.props.Props.ShareDispaly,
        };
    }

    componentWillReceiveProps(nextProps) {
        if("IsEnabled" in nextProps.Props){
            this.setState({IsEnabled:nextProps.Props.IsEnabled});
        }
        if("ShowStudentCode" in nextProps.Props){
            this.setState({ShowStudentCode:nextProps.Props.ShowStudentCode});
        }
        if("StudentCode" in nextProps.Props){
            this.setState({StudentCode:nextProps.Props.StudentCode});
        }
        if("ShowMemberLevel" in nextProps.Props){
            this.setState({ShowMemberLevel:nextProps.Props.ShowMemberLevel});
        }
        if("ShareDispaly" in nextProps.Props){
            this.setState({ShareDispaly:nextProps.Props.ShareDispaly});
        }
    }
    render() {
        return (
            <div className="padding-left15 padding-right15 editor-left-main2">
                <div className="row borderBot mineInfor">
                    <a href="#" className="col-xs-12 alinkbgDef mineCont">
                        <span className="minePic"><img src="/content/editor/images/others/luo.jpg" /></span>
                        <p className="col-xs-10 mineContLeft mineName">李超</p>
                        <div className="col-xs-2 mineInforRight"><i className="fa fa-angle-right rightCret"></i></div>
                    </a>
                    <a href="#" className="btnmdBorCir becomStu" style={{display:this.state.ShowStudentCode?"":"none"}}>成为学员</a>
                </div>
                <div className="row margTop10 borderOut inviteFri">
                    <a href="#" className="col-xs-12 pad0 alinkbgDef">
                        <h2 className="col-xs-6 pointsOut">积分: <em className="pointCunt">800</em></h2>
                        <div className="col-xs-6 pointRight">{this.state.ShareDispaly}<i className="fa fa-angle-right rightCret"></i></div>
                        <span className="col-xs-12 pointShare"></span>
                        <span className="col-xs-12 pointShareSec"></span>
                    </a>
                </div>
                <div className="row margTop10 borderTop funcOut">
                    <ul className="col-xs-12 clearfix funcListOut">
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func2.png" /></span>
                                <p className="funcTitle">我的课程</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func3.png" /></span>
                                <p className="funcTitle">返利中心</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func4.png" /></span>
                                <p className="funcTitle">我的订单</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func5.png" /></span>
                                <p className="funcTitle">学员等级</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func6.png" /></span>
                                <p className="funcTitle">合作伙伴</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func7.png" /></span>
                                <p className="funcTitle">签到</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func8.png" /></span>
                                <p className="funcTitle">抽奖</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func9.png" /></span>
                                <p className="funcTitle">联合发起</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func10.png" /></span>
                                <p className="funcTitle">排行榜</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func11.png" /></span>
                                <p className="funcTitle">我的消息</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func12.png" /></span>
                                <p className="funcTitle">设置</p>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="row"><h3 className="col-xs-12 otherServe">第三方服务</h3></div>
                <div className="row borderTop funcOut">
                    <ul className="col-xs-12 clearfix funcListOut">
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func13.png" /></span>
                                <p className="funcTitle">表单</p>
                            </a>
                        </li>
                        <li className="col-xs-3 funcItems">
                            <a href="#" className="alinkbgDef funcHref">
                                <span className="funcPicOut"><img src="/content/editor/images/icons/func14.png" /></span>
                                <p className="funcTitle">线下活动</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}


class UIMyRight extends React.Component<any, any>{
    constructor(props) {
        super(props);
        const { setFieldsValue } = this.props.form;
        setFieldsValue(this.props.Props);
        this.state = {
            firstLoad: true
        }
    }

    componentWillMount() {
         const { setFieldsValue } = this.props.form;
             setFieldsValue(this.props.Props);
    }

    componentWillReceiveProps(nextProps) {
         if (this.state.firstLoad) {
            const { setFieldsValue, getFieldValue } = this.props.form;
             this.state.firstLoad = false;
             setFieldsValue(nextProps.Props);
         }
    }
    render() {
        const { getFieldProps, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItemLayout1 = {
            labelCol: { span: 16 },
            wrapperCol: { span: 2 },
        };
        var showStudentCode = getFieldValue('ShowStudentCode');
        const StudentCodeProps = getFieldProps('StudentCode', {
            validate: [{
                rules: [
                    { required: showStudentCode, message: '请填写学号提示' }
                ],
                trigger: ['onBlur', 'onChange']
            }]
        });
        return (
            <div>
                <div className="clearfix editor-title margin-btm20">
                    <span className="pull-left margin-top5">我的模块</span>
                    <span className="pull-right color-blue margin-top5">
                        <FormItem {...formItemLayout1}
                            label="模块是否开启"
                            required
                            >
                            <Switch {...getFieldProps('IsEnabled', { valuePropName: 'checked' }) } />
                        </FormItem>
                    </span>
                </div>
                <FormItem {...formItemLayout}
                    label="模块名称"
                    required
                    >
                    <Input {...getFieldProps('DispalyName', {
                        validate: [{
                            rules: [
                                { required: true, message: '请填写模块名称' },
                            ]
                        }]
                    }) } />
                </FormItem>
                <FormItem {...formItemLayout}
                    label="学号"
                    required
                    >
                    <Switch {...getFieldProps('ShowStudentCode', { valuePropName: 'checked' }) } />
                </FormItem>
                <FormItem {...formItemLayout}
                    label="  "
                    >
                    <Input  {...StudentCodeProps}/>
                </FormItem>
                <FormItem {...formItemLayout}
                    label="会员等级"
                    required
                    >
                    <Switch {...getFieldProps('ShowMemberLevel', { valuePropName: 'checked' }) } />
                </FormItem>
                <FormItem {...formItemLayout}
                    label="分享文案"
                    required
                    >
                    <Input {...getFieldProps('ShareDispaly', {
                        validate: [{
                            rules: [
                                { required: true, message: '请填写推荐课程提示语' },
                            ]
                        }]
                    }) } />
                </FormItem>
            </div>
        );
    }
}
export {
UIMyLeft, UIMyRight
}

