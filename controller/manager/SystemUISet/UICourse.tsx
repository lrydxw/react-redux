import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Form,Switch,Input } from 'antd';
const FormItem = Form.Item;
interface UICourseLeftProps1{
         IsEnabled:boolean;
        DispalyName:string;
        ShowIntoClassTips:boolean;
       IntoClassTips:string;
        CoursePraise:boolean;
        CourseRecommend:string;
}
interface UICourseLeftProps{
    Props:UICourseLeftProps1;
    }

class UICourseLeft extends React.Component<UICourseLeftProps,any> {
    //初始化加载
    constructor(props) {
        super(props);
        this.state={
            IsEnabled:this.props.Props.IsEnabled,
            DispalyName:this.props.Props.DispalyName,
            ShowIntoClassTips:this.props.Props.ShowIntoClassTips,
            IntoClassTips:this.props.Props.IntoClassTips,
            CoursePraise:this.props.Props.CoursePraise,
            CourseRecommend:this.props.Props.CourseRecommend,
        };
        
    }
    componentWillReceiveProps(nextProps) {
        if("IsEnabled" in nextProps.Props){
            this.setState({IsEnabled:nextProps.Props.IsEnabled});
        }
        if("ShowIntoClassTips" in nextProps.Props){
            this.setState({ShowIntoClassTips:nextProps.Props.ShowIntoClassTips});
        }
        if("IntoClassTips" in nextProps.Props){
            this.setState({IntoClassTips:nextProps.Props.IntoClassTips});
        }
        if("CoursePraise" in nextProps.Props){
            this.setState({CoursePraise:nextProps.Props.CoursePraise});
        }
        if("CourseRecommend" in nextProps.Props){
            this.setState({CourseRecommend:nextProps.Props.CourseRecommend});
        }
    }


    render() {
        return (
                  <div className="padding-left15 padding-right15 editor-left-main2">
                <div className="row topTipsOut" style={{display:this.state.ShowIntoClassTips?"":"none"}}>
                            <div className="col-xs-12 media tipsHei">
                                <a className="media-left media-middle iconPad" href="#">
                                    <img src="/content/editor/images/icons/lian3.png" width="16" height="16" alt="提示"/>
                                </a>
                                <div className="media-body media-middle">
                                    {this.state.IntoClassTips}
                                </div>
                                <a className="media-right media-middle" href="#">
                                    <span className="tipsBtnOut">申请进班</span>
                                </a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 classBanOut">
                                <span className="classBanner"><img src="/content/editor/images/banner/classBanner.png" /></span>
                                <div className="classBackCon">
                                    <span className="clssBanLogo"><img src="/content/editor/images/others/copLogo.png" /></span>
                                    <p className="unionTitleCon companTitle">微领袖商学院 <span className="unionClass enterClass">未进班</span></p>
                                    <p className="comIntro">每周一、周四更新，提供一年百场精品课程，在我们分享干货不装逼</p>
                                    <p className="comTime">有效期：2016-08-25至2017-08-24</p>
                                </div>
                            </div>
                        </div>
                        <div className="row margTop10">
                            <div className="col-xs-12 serchClasses">
                                <div className="serchInputDef">
                                    <input className="borderOut inputDef" placeholder="搜索课程 / 商品"/><span className="InputDefIcon">搜索图标</span>
                                </div>
                            </div>
                        </div>
                        <div className="row borderTop borderBot margTop10 classDaysign">
                            <span className="closeIconOut"><img src="/content/editor/images/icons/closeIcon.png" /></span>
                            <p className="col-xs-12 clasCunt">共<em className="fontColordanger fontNormal">32656</em>名学员参与学习</p>
                            <p className="col-xs-12 classSign">"<em className="fontNormal">{this.state.CourseRecommend}</em>"</p>
                            <a href="#" className="col-xs-8 col-xs-push-2 btnlgBg classShare">分享学员证，邀请好友</a>
                        </div>
                        <div className="row margTop10 borderTop borderBot classKinds">
                            <div className="col-xs-12 borderBot margBot10 panelTitle titleRightConPad">
                                <h2 className="col-xs-6 clearfix titleContent"><em className="pull-left TitleBack">课时列表</em></h2>
                                <span className="col-xs-6 titleRightCon titleRigCon">累计<em className="fontColordanger fontNormal">160</em>节课</span>
                            </div>
                            <div className="col-xs-12 classKindOut">
                                <div className="col-xs-12 classKindCon">
                                    <div className="col-xs-12 lineBack">
                                        <h2 className="col-xs-10 lineTitleCon"><span className="bgColor lineLeft">左侧竖线</span>第一章：开学介绍</h2>
                                        <span className="col-xs-2 lineRight"><i className="fa fa-caret-down lineCaret"></i></span>
                                    </div>
                                </div>
                                <ul className="col-xs-12 kindOut">
                                    <li className="borderBot clearfix kindList">
                                        <a href="#" className="kindImg"><img src="/content/editor/images/banner/classImg.png" /></a>
                                        <a href="#" className="alinkbgDef classTitleItems classTypeItem classTitleRes">
                                            <p className="classTyTitle classTyTitleRe">读“道德经”悟智慧箴言</p>
                                            <div className="classTypeTip classTypeTipRe"><span className="classType classTypeRe classLive">直播</span></div>
                                        </a>
                                        <p className="classLiTime">时间：<em className="fontNormal">2016-08-24  20:00</em></p>
                                        <p className="clearfix crossPrice crossPriceFont">
                                            <em className="pull-left transPrice transPriceRe">第104期</em>
                                            <em className="pull-left transPrice margLeft10 margRight10 transPriceRe">|</em>
                                            <em className="pull-left transPrice theCunt">讲师：大山</em>
                                        </p>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell" style={{display:this.state.CoursePraise?"":"none"}}>赞(1000)</p>
                                        </div>
                                    </li>
                                    <li className="borderBot clearfix kindList">
                                        <a href="#" className="kindImg"><img src="/content/editor/images/banner/classImg.png" /></a>
                                        <a href="#" className="alinkbgDef classTitleItems classTypeItem classTitleRes">
                                            <p className="classTyTitle classTyTitleRe">读“道德经”悟智慧箴言</p>
                                            <div className="classTypeTip classTypeTipRe"><span className="classType classTypeRe classText">录播</span></div>
                                        </a>
                                        <p className="classLiTime">时间：<em className="fontNormal">2016-08-24  20:00</em></p>
                                        <p className="clearfix crossPrice crossPriceFont">
                                            <em className="pull-left transPrice transPriceRe">第104期</em>
                                            <em className="pull-left transPrice margLeft10 margRight10 transPriceRe">|</em>
                                            <em className="pull-left transPrice theCunt">讲师：大山</em>
                                        </p>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell" style={{display:this.state.CoursePraise?"":"none"}}>赞(1000)</p>
                                        </div>
                                    </li>
                                    <li className="borderBot clearfix kindList">
                                        <a href="#" className="kindImg"><img src="/content/editor/images/banner/classImg.png" /></a>
                                        <a href="#" className="alinkbgDef classTitleItems classTypeItem classTitleRes">
                                            <p className="classTyTitle classTyTitleRe">读“道德经”悟智慧箴言</p>
                                            <div className="classTypeTip classTypeTipRe"><span className="classType classTypeRe classPreve">预告</span></div>
                                        </a>
                                        <p className="classLiTime">时间：<em className="fontNormal">2016-08-24  20:00</em></p>
                                        <p className="clearfix crossPrice crossPriceFont">
                                            <em className="pull-left transPrice transPriceRe">第104期</em>
                                            <em className="pull-left transPrice margLeft10 margRight10 transPriceRe">|</em>
                                            <em className="pull-left transPrice theCunt">讲师：大山</em>
                                        </p>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell" style={{display:this.state.CoursePraise?"":"none"}}>赞(1000)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-xs-12 classKindOut">
                                <div className="col-xs-12 classKindCon">
                                    <div className="col-xs-12 lineBack">
                                        <h2 className="col-xs-10 lineTitleCon"><span className="bgColor lineLeft">左侧竖线</span>第二章：上学期</h2>
                                        <span className="col-xs-2 lineRight"><i className="fa fa-caret-down lineCaret"></i></span>
                                    </div>
                                </div>
                                <ul className="col-xs-12 kindOut">
                                    <li className="borderBot clearfix kindList">
                                        <a href="#" className="kindImg"><img src="/content/editor/images/banner/classImg.png" /></a>
                                        <a href="#" className="alinkbgDef classTitleItems classTypeItem classTitleRes">
                                            <p className="classTyTitle classTyTitleRe">读“道德经”悟智慧箴言</p>
                                            <div className="classTypeTip classTypeTipRe"><span className="classType classTypeRe classPreve">预告</span></div>
                                        </a>
                                        <p className="classLiTime">时间：<em className="fontNormal">2016-08-24  20:00</em></p>
                                        <p className="clearfix crossPrice crossPriceFont">
                                            <em className="pull-left transPrice transPriceRe">第104期</em>
                                            <em className="pull-left transPrice margLeft10 margRight10 transPriceRe">|</em>
                                            <em className="pull-left transPrice theCunt">讲师：大山</em>
                                        </p>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell">赞(1000)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row margTop10 borderTop borderBot classKinds none">
                            <div className="col-xs-12 borderBot margBot10 panelTitle titleRightConPad">
                                <h2 className="col-xs-6 clearfix titleContent"><em className="pull-left TitleBack">课时列表</em></h2>
                                <span className="col-xs-6 titleRightCon titleRigCon">累计<em className="fontColordanger fontNormal">160</em>节课</span>
                            </div>
                            <div className="col-xs-12 classKindOut">
                                <div className="col-xs-12 classKindCon">
                                    <div className="col-xs-12 lineBack">
                                        <h2 className="col-xs-10 lineTitleCon"><span className="bgColor lineLeft">左侧竖线</span>第一章：开学介绍</h2>
                                        <span className="col-xs-2 lineRight"><i className="fa fa-caret-down lineCaret"></i></span>
                                    </div>
                                </div>
                                <ul className="col-xs-12 kindOut">
                                    <li className="borderBot clearfix kindListnoPic">
                                        <a href="#" className="alinkFontDef classTitleItems"><em className="fontColorsucc fontNormal classNum">第1期</em>读“道德经”悟智慧箴言</a>
                                        <div className="clearfix classInform">
                                            <p className="pull-left classTimeInfor">2016-08-24  20:00</p>
                                            <p className="pull-left classTeacher">大山</p>
                                        </div>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell">赞(1000)</p>
                                        </div>
                                    </li>
                                    <li className="borderBot clearfix kindListnoPic">
                                        <a href="#" className="alinkFontDef classTitleItems"><em className="fontColorsucc fontNormal classNum">第1期</em>读“道德经”悟智慧箴言</a>
                                        <div className="clearfix classInform">
                                            <p className="pull-left classTimeInfor">2016-08-24  20:00</p>
                                            <p className="pull-left classTeacher">大山</p>
                                        </div>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell">赞(1000)</p>
                                        </div>
                                    </li>
                                    <li className="borderBot clearfix kindListnoPic">
                                        <a href="#" className="alinkFontDef classTitleItems"><em className="fontColorsucc fontNormal classNum">第1期</em>读“道德经”悟智慧箴言</a>
                                        <div className="clearfix classInform">
                                            <p className="pull-left classTimeInfor">2016-08-24  20:00</p>
                                            <p className="pull-left classTeacher">大山</p>
                                        </div>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell">赞(1000)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-xs-12 classKindOut">
                                <div className="col-xs-12 classKindCon">
                                    <div className="col-xs-12 lineBack">
                                        <h2 className="col-xs-10 lineTitleCon"><span className="bgColor lineLeft">左侧竖线</span>第二章：上学期</h2>
                                        <span className="col-xs-2 lineRight"><i className="fa fa-caret-down lineCaret"></i></span>
                                    </div>
                                </div>
                                <ul className="col-xs-12 kindOut">
                                    <li className="borderBot clearfix kindListnoPic">
                                        <a href="#" className="alinkFontDef classTitleItems"><em className="fontColorsucc fontNormal classNum">第1期</em>读“道德经”悟智慧箴言</a>
                                        <div className="clearfix classInform">
                                            <p className="pull-left classTimeInfor">2016-08-24  20:00</p>
                                            <p className="pull-left classTeacher">大山</p>
                                        </div>
                                        <div className="pull-right clearfix otherActive">
                                            <a href="#" className="pull-right alinkFontDef commentWhite">笔记(1000)</a>
                                            <p className="pull-left fellWell">赞(1000)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>



                    </div>
        );
    }
}

interface UICourseRightProps{
    form:any;
    Props:UICourseLeftProps1
}


class UICourseRight extends React.Component<UICourseRightProps, any>{
     //初始化加载
    constructor(props) {
        super(props);
        this.state = {
            firstLoad: true
        }
    }

    componentDidMount(){
    }
    //插入真实DOM之前被执行
    componentWillMount() {
         const { setFieldsValue, getFieldValue } = this.props.form;
             setFieldsValue(this.props.Props);
    }
     componentWillReceiveProps(nextProps) {
         const { setFieldsValue, getFieldValue } = this.props.form;
         if (this.state.firstLoad) {
             this.state.firstLoad = false;
             setFieldsValue(nextProps.Props);
         }
     }

    render(){
        const { getFieldProps, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItemLayout1 = {
            labelCol: { span: 16 },
            wrapperCol: { span: 2 },
        };
        var showTips=getFieldValue('ShowIntoClassTips');
        const IntoClassTipsProps=getFieldProps('IntoClassTips',{validate: [{
                rules: [
                    { required: showTips, message: '请填写进班提示' }
                ],
                trigger: ['onBlur', 'onChange']
            }]});
        return(      
            <div>
                <div className="clearfix editor-title margin-btm20">
                    <span className="pull-left margin-top5">课程模块</span>
                    <span className="pull-right color-blue margin-top5">
                        <FormItem {...formItemLayout1}
                            label="模块是否开启"
                            required
                            >
                            <Switch {...getFieldProps('IsEnabled', { valuePropName: 'checked' })} />
                        </FormItem>
                     </span>
                 </div>
                        <FormItem {...formItemLayout}
                            label="模块名称"
                            required
                            >
                            <Input {...getFieldProps('DispalyName',{validate: [{
                rules: [
                    { required: true, message: '请填写模块名称' },
                ]
            }]})} />
                        </FormItem>                                
                        <FormItem {...formItemLayout}
                            label="进班提示"
                            required
                            >
                            <Switch {...getFieldProps('ShowIntoClassTips', { valuePropName: 'checked' })} />
                        </FormItem>                                
                        <FormItem {...formItemLayout}
                            label="  "
                            >
                            <Input  {...IntoClassTipsProps}/>
                        </FormItem>                                
                        <FormItem {...formItemLayout}
                            label="课程评论点赞"
                            required
                            >
                            <Switch {...getFieldProps('CoursePraise', { valuePropName: 'checked' })} />
                        </FormItem>                                
                        <FormItem {...formItemLayout}
                            label="推荐课程"
                            required
                            >
                            <Input {...getFieldProps('CourseRecommend',{validate: [{
                rules: [
                    { required: true, message: '请填写推荐课程提示语' },
                ]
            }]})} />
                        </FormItem>   
                            </div>
                );
    }
}
export {
UICourseLeft,UICourseRight
}

