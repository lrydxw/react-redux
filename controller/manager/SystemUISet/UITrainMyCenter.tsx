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
        this.state = {
            IsEnabled: this.props.Props.IsEnabled,
            ShowStudentCode: this.props.Props.ShowStudentCode,
            StudentCode: this.props.Props.StudentCode,
            ShowMemberLevel: this.props.Props.ShowMemberLevel,
            ShareDispaly: this.props.Props.ShareDispaly,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ("IsEnabled" in nextProps.Props) {
            this.setState({ IsEnabled: nextProps.Props.IsEnabled });
        }
        if ("ShowStudentCode" in nextProps.Props) {
            this.setState({ ShowStudentCode: nextProps.Props.ShowStudentCode });
        }
        if ("StudentCode" in nextProps.Props) {
            this.setState({ StudentCode: nextProps.Props.StudentCode });
        }
        if ("ShowMemberLevel" in nextProps.Props) {
            this.setState({ ShowMemberLevel: nextProps.Props.ShowMemberLevel });
        }
        if ("ShareDispaly" in nextProps.Props) {
            this.setState({ ShareDispaly: nextProps.Props.ShareDispaly });
        }
    }
    render() {
        return (
            <div className="padding-left15 padding-right15 editor-left-main2">
                <div className="commonTipsBtn">
                    <span className="topUserPic"><img src="/Content/template/train/images/others/nz1.png" alt="用户头像"/></span>
                    <p className="topUserName">我是五哥 @微领袖商学院Q1</p>
                    <p className="topUserInfo">推荐你加入微领袖商学院</p>
                    <a href="#" className="alinkbg closeTipsBtn">添加班长</a>
                </div>
                <div className="bgColor memberTop">
                    <span className="memberImg"><img src="/Content/template/train/images/others/IMG_6610.png" alt="会员头像" /></span>
                    <h2 className="memberTopName">吴高远</h2>
                    <p className="memberNumber">学号：86001069</p>
                    <div className="memberCash"><a href="#" className="alinkFontTheme myCash">预计佣金：9119.00元</a></div>
                </div>
                <div className="noticeWrap">
                    <span className="noticeIcon">noticeIcon</span>
                    <p className="noticeContent">粉丝经济学拓客营销三十六计联合发起人火招募中粉丝经济学拓客营销三十六计联合发起人火招募中粉丝经济学拓客营销三十六计联合发起人火招募中</p>
                </div>
                <div className="container-fluid blockOut">
                    <ul className="row blockContent">
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockClass.png" alt="我的课程" /></span>
                                <h4 className="blockMain">我的课程</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockMoney.png" alt="返利中心" /></span>
                                <h4 className="blockMain">返利中心</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockOrder.png" alt="我的订单" /></span>
                                <h4 className="blockMain">我的订单</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon blockIconCunt">
                                    <span className="blockCunt">8</span>
                                    <img src="/Content/template/train/images/icons/blockGift.png" alt="待领取产品" />
                                </span>
                                <h4 className="blockMain">待领取产品</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockFlat.png" alt="我的会议" /></span>
                                <h4 className="blockMain">我的会议</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon blockIconCunt">
                                    <span className="blockCunt">8</span>
                                    <img src="/Content/template/train/images/icons/blockServe.png" alt="我的班长" />
                                </span>
                                <h4 className="blockMain">我的班长</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockEr.png" alt="生成推广码" /></span>
                                <h4 className="blockMain">生成推广码</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockHeart.png" alt="联合发起人" /></span>
                                <h4 className="blockMain">联合发起人</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockPartner.png" alt="合作伙伴" /></span>
                                <h4 className="blockMain">合作伙伴</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockSet.png" alt="设置" /></span>
                                <h4 className="blockMain">设置</h4>
                            </a>
                        </li>
                        <li className="col-xs-3 col-md-2 blockItem">
                            <a href="#" className="alinkbgDef blockHref">
                                <span className="blockIcon"><img src="/Content/template/train/images/icons/blockAll.png" alt="全部" /></span>
                                <h4 className="blockMain">全部</h4>
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

