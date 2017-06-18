import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, Form, Input, FormProps, Upload, Icon, Modal, message} from 'antd';
import SystemConfigApi from './Api';

const FormItem = Form.Item;
function noop() {
    return false;
}
//const AppBasicInfo_formProps;

interface ManagerSystemConfigInitBaseInfoRequest {
    SiteName: string;
}

class AppBasicInfo extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        SystemConfigApi.getAppBasciInfo().then(function (data) {
            if (data.IsOK) {
                setFieldsValue({ "SiteName": data.Value.SiteName });
                setFieldsValue({ "LogoPath": data.Value.LogoPath });
                setFieldsValue({ "CustomerServicePhone": data.Value.CustomerServicePhone });
                setFieldsValue({ "DetailAddress": data.Value.DetailAddress });
                _this.state = {
                    priviewVisible: false, priviewImage: "", logoFile: [{
                        uid: -1,
                        name: data.Value.LogoPath,
                        status: 'done',
                        url: data.Value.LogoPath,
                        thumbUrl: data.Value.LogoPath,
                    }]
                };
            }
        });
    }



    handleReset(e) {
        e.preventDefault();
    }

    userExists(rule, value, callback) {
        callback();
    }

    handleChange(info) {
        let fileList = info.fileList;

        // 1. 上传列表数量的限制
        //    只显示最近上传的一个，旧的会被新的顶掉
        fileList = fileList;

        // 2. 读取远程路径并显示链接
        fileList = fileList.map((file) => {
            if (file.response) {
                // 组件会将 file.url 作为链接进行展示
                file.url = file.response.url;
            }
            return file;
        });

        // 3. 按照服务器返回信息筛选成功上传的文件
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.status === 'success';
            }
            return true;
        });
        console.log("logoPath");
        this.props.form.setFieldsValue({ "LogoPath": info.fileList.length > 0 ? info.fileList[0].url : "" });
        this.setState({ fileList: fileList });
    }

    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }

    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const nameProps = getFieldProps('SiteName', {
            validate: [{
                rules: [
                    { required: true, min: 5, message: '网站名称至少为 5 个字符' },
                    { validator: this.userExists },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const logoPathProps = getFieldProps('LogoPath', {
            validate: [{
                rules: [
                    { required: true, message: '请上传品牌Logo' },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });
        const logoProps = {
            multiple: false,
            action: "/Common/Upload",
            defaultFileList: this.state.logoFile,
            onChange: this.handleChange,
            listType: "picture-card", onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                })
            }
        };
        const csPhoneProps = getFieldProps('CustomerServicePhone', {
            validate: [{
                rules: [
                    { required: true, message: '请输入服务电话' },
                ],
                trigger: ['onBlur', 'onChange'],
            },
            ],
        });
        const addressProps = getFieldProps('DetailAddress', {
            rules: [
                { required: true, message: '请输入详细地址' },
            ],
        });
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        console.log("输出");
        return (
            <div>
                <FormItem
                    {...formItemLayout}
                    label="网站名称"
                    hasFeedback
                    help={isFieldValidating('SiteName') ? '校验中...' : (getFieldError('SiteName') || []).join(', ') }
                    >
                    <Input {...nameProps} placeholder="请输入网站名称" />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="品牌Logo"
                    hasFeedback
                    >
                    <Input {...logoPathProps} style={{ width: "0px", height: "0px", display: "none" }} placeholder="请输入网站名称" />
                    <div >
                        <Upload {...logoProps} name="upload" >
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传照片</div>
                        </Upload>
                        <Modal visible={this.state.priviewVisible}  footer={null} onCancel={this.handleCancel}>
                            <img alt="example" src={this.state.priviewImage} />
                        </Modal>
                    </div>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="服务电话"
                    hasFeedback
                    >
                    <Input {...csPhoneProps} placeholder="请输入服务电话"
                        />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="详细地址"
                    >
                    <Input {...addressProps} type="textarea" placeholder="详细地址" id="DetailAddress" />
                </FormItem>

            </div>
        );
    }
}
const AppBasicInfoPage = Form.create()(AppBasicInfo);

export {AppBasicInfoPage }
