import 'antd/dist/antd.less'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import { message } from 'antd';
import { Button } from 'antd';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Tabs, Radio, Popover, Select, Upload, Switch } from 'antd';

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




interface CardGroupProps {
    index: any,
    item: any,
    addToCenter: Function,
    editProps: Function
}

class CardGroup extends React.Component<CardGroupProps, any>{
    constructor(props) {
        super(props);
        this.state = { editContent: null }
        this.showEdit = this.showEdit.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.hideSelectIcoVisible = this.hideSelectIcoVisible.bind(this);
        this.SetConfig = this.SetConfig.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.state = {
            visible: false,
            selectIcoVisible: false
        };
    }
    handleVisibleChange(visible) {
        this.setState({ selectIcoVisible: visible });
    }
    handleOk() {
        this.props.editProps(this.props.index, {
            DisplayName: this.state.DisplayName,
            FunctionType: this.state.FunctionType,
            Display: this.state.Display,
            IcoUrl: this.state.IcoUrl,
            Link: this.state.Link,
            Config: JSON.stringify(this.state.Config),
        });
        this.setState({
            visible: false,
        });
    }
    handleCancel(e) {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    showEdit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            DisplayName: this.props.item.DisplayName,
            FunctionType: this.props.item.FunctionType,
            Display: this.props.item.Display,
            IcoUrl: this.props.item.IcoUrl,
            Link: this.props.item.Link,
            Config: !!this.props.item.Config && JSON.parse(this.props.item.Config) ? JSON.parse(this.props.item.Config) : {},
            visible: true,
        });
    }
    DisplayOnChange(e) {
        this.setState({
            Display: e.target.value,
        });
    }
    DisplayNameOnChange(e) {
        this.setState({
            DisplayName: e.target.value,
        });
    }
    FunctionTypeOnChange(e) {
        this.setState({
            FunctionType: e,
        });
    }
    IcoUrlOnChange(e) {
        this.hideSelectIcoVisible();
        this.setState({
            IcoUrl: e,
        });
    }
    LinkOnChange(e) {
        this.setState({
            Link: e,
        });
    }
    SetConfig(prop, value) {
        var config = this.state.Config;
        this.state.Config[prop] = value;
        this.setState({
            Config: config,
        });
    }

    hideSelectIcoVisible() {
        this.setState({
            selectIcoVisible: false,
        });
    }
    componentDidMount() {
    }
    render() {
        let {index, item, addToCenter, editProps} = this.props;
        let {editContent} = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        let OtherProps = null;
        switch (item.FunctionName) {
            case "返利中心":
                OtherProps =
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="积分名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["PointDisplayName"] : "收益"} onChange={(e) => this.SetConfig("PointDisplayName", e.target.value)} placeholder="请输入积分名称" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="积分单位："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["PointUnitName"] : "元"} onChange={(e) => this.SetConfig("PointUnitName", e.target.value)} placeholder="请输入积分单位" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="积分符号："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["PointSignName"] : "￥"} onChange={(e) => this.SetConfig("PointSignName", e.target.value)} placeholder="请输入积分符号" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="显示电话号码："
                            >
                            <Switch checked={this.state.Config ? this.state.Config["ShowPhoneNumber"] : true} onChange={(e) => this.SetConfig("ShowPhoneNumber", e)} />
                        </FormItem>
                    </div>
                break;
            case "联合发起":
                OtherProps =
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="联合发起名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["JointInitiatedName"] : "联合发起人"} onChange={(e) => this.SetConfig("JointInitiatedName", e.target.value)} placeholder="请输入积分名称" />
                        </FormItem>
                    </div>
                break;
            case "我的课程":
                OtherProps =
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="课时显示排序："
                            >
                            按开课时间<Switch checkedChildren="升" unCheckedChildren="降" checked={this.state.Config ? this.state.Config["CouseHourOrder"] : true} onChange={(e) => this.SetConfig("CouseHourOrder", e)} />序排列
                        </FormItem>
                    </div>
                break;
            case "我的班长":
                OtherProps =
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="客服显示名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["CustomServiceName"] : "班长"} onChange={(e) => this.SetConfig("CustomServiceName", e.target.value)} placeholder="请输入客服显示名称" />
                        </FormItem>
                    </div>
                break;
            case "合作伙伴":
                OtherProps =
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="显示电话号码："
                            >
                            <Switch checked={this.state.Config ? this.state.Config["ShowPhoneNumber"] : true} onChange={(e) => this.SetConfig("ShowPhoneNumber", e)} />
                        </FormItem>
                    </div>
                break;
            case "会员中心":
                OtherProps =
                    <div>
                        <FormItem
                            {...formItemLayout}
                            label="代理显示名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["AgentName"] : "代理"} onChange={(e) => this.SetConfig("AgentName", e.target.value)} placeholder="请输入代理显示名称" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="一级代理显示名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["OneLevelAgentName"] : "一级代理"} onChange={(e) => this.SetConfig("OneLevelAgentName", e.target.value)} placeholder="请输入一级代理显示名称" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="二级代理显示名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["TwoLevelAgentName"] : "二级代理"} onChange={(e) => this.SetConfig("TwoLevelAgentName", e.target.value)} placeholder="请输入二级代理显示名称" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="三级代理显示名称："
                            >
                            <Input type="text" className="form-control" value={this.state.Config ? this.state.Config["ThreeLevelAgentName"] : "三级代理"} onChange={(e) => this.SetConfig("ThreeLevelAgentName", e.target.value)} placeholder="请输入三级代理显示名称" />
                        </FormItem>
                    </div>
                break;
        }

        const selectIco = ["/Content/images/icons/blockClasses.png",
            "/content/images/icons/blockLottery.png",
            "/content/images/icons/blockHeart.png",
            "/content/images/icons/blockSet.png",
            "/Content/images/icons/blockGift.png",
            "/Content/images/icons/blockOrder.png",
            "/content/images/icons/blockEr.png",
            "/content/images/icons/blockPartner.png",
            "/Content/images/icons/blockMoney.png",
            "/content/images/icons/blockRanking.png",
            "/Content/images/icons/blockClass.png",
            "/content/images/icons/blockUIguang.png",
            "/Content/images/icons/blockServe.png",];

        const logoProps = {

            multiple: false,
            action: "/UploadFile/UploadImage",
            beforeUpload(file) {
                return Tool.ImgBeforeUpload(file);
            },
            showUploadList: false,
            onChange: (info) => {
                let fileList = info.fileList;
                if (fileList.length > 1) {
                    fileList = [info.fileList[info.fileList.length - 1]];
                }
                // 1. 上传列表数量的限制
                //    只显示最近上传的一个，旧的会被新的顶掉
                fileList = fileList;
                // 2. 读取远程路径并显示链接
                fileList = fileList.map((file) => {
                    console.log("fileList：" + fileList.length);
                    if (file.response) {
                        // 组件会将 file.url 作为链接进行展示  
                        file.url = file.response.url;
                    }
                    return file;
                });
                // 3. 按照服务器返回信息筛选成功上传的文件
                fileList = fileList.filter((file) => {
                    console.log("filter：" + fileList.length);
                    //console.log("fileList.filter.file.response：" + JSON.stringify(file));
                    if (file.response) {
                        return file.response.status === 'success';
                    }
                    return true;
                });

                this.IcoUrlOnChange(fileList[0].url);
            },
            listType: "picture-card",
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }

        };

        let SimpleProps =
            <div>
                <FormItem
                    {...formItemLayout}
                    label="导航名称："
                    >
                    <Input type="text" onChange={this.DisplayNameOnChange.bind(this)} value={this.state.DisplayName} placeholder="请输入导航名称" />
                </FormItem>
                {
                    item.IsSystem ? null :
                        <FormItem
                            {...formItemLayout}
                            label="导航地址："
                            >
                            <Input type="text" onChange={this.LinkOnChange.bind(this)} value={this.state.Link} placeholder="请输入导航地址" />
                        </FormItem>
                }
                {
                    item.FunctionName == "会员中心" ? null :
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="是否隐藏："
                                >
                                <RadioGroup onChange={this.DisplayOnChange.bind(this)} value={this.state.Display}>
                                    <Radio value={true}>显示</Radio>
                                    <Radio value={false}>隐藏</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="分组："
                                >
                                <Select onChange={this.FunctionTypeOnChange.bind(this)} value={this.state.FunctionType}>
                                    <Select.Option value="主要功能">我的功能</Select.Option>
                                    <Select.Option value="活动">我的活动</Select.Option>
                                    <Select.Option value="更多">更多</Select.Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="导航图标："
                                >
                                <Popover placement="bottom" visible={this.state.selectIcoVisible} onVisibleChange={this.handleVisibleChange} trigger="hover" content={
                                    <div className="tan-kang clearfix" style={{ maxWidth: "330px", position: "static" }}>
                                        {
                                            selectIco.map((item, index) => {
                                                return <div key={index} className="tan-kang-img pull-left" onClick={(e) => this.IcoUrlOnChange(item)}><img src={item} /></div>
                                            })
                                        }

                                    </div>
                                }>
                                    <img style={{ width: "70px" }} onClick={(e) => this.setState({ selectIcoVisible: true })} src={this.state.IcoUrl} />
                                </Popover>
                                <Upload {...logoProps} name="upload" >
                                    <Icon type="plus" />
                                    <div className="ant-upload-text" >自己上传</div>
                                </Upload>
                            </FormItem>
                        </div>
                }
            </div>;
        return <li key={index} className="col-xs-2  blockItem blockItem-9">
            <a href="javascript:void(0)" onClick={this.showEdit.bind(this)} className="alinkbgDef blockHref">
                <span className="blockIcon">
                    <img src={item.IcoUrl} alt={item.DisplayName} />
                    {item.Display ? null : <img className="blockIcon-re-img2" src="/content/images/hideImg.png" />}
                </span>
                <h4 className="blockMain">{item.DisplayName}</h4>
                {
                    item.FunctionType == "None" ? null :
                        !item.Display ?
                            <p className="blockMain-p font12">已隐藏</p>
                            :
                            item.ShowGroup == "学员中心" ?
                                <p className="blockMain-p font12">已显示到主页</p>
                                :
                                <p className="blockMain-p font12 blockMain-p-active" onClick={(e) => {
                                    e.preventDefault(); e.stopPropagation(); addToCenter(index); return false;
                                } }>显示到主页</p>
                }

            </a>
            {this.state.visible ?
                <Modal title="编辑" visible={this.state.visible}
                    onOk={this.handleOk} onCancel={this.handleCancel}
                    >
                    <Form horizontal>
                        {SimpleProps}
                        {OtherProps}
                    </Form>
                </Modal>
                : null}
        </li>;
    }
}

export default CardGroup;