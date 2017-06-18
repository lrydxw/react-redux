import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, Form, Input, FormProps} from 'antd';
import SystemConfigApi from './Api';

const FormItem = Form.Item;
function noop() {
    return false;
}

interface ManagerSystemConfigInitBaseInfoRequest {
    SiteName: string;
}

class AppWXInfo extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        SystemConfigApi.getWeChatInfo().then(function (data) {
            if (data.IsOK) {
                setFieldsValue(data.Value);
            }
        });

        this.state = {
            priviewVisible: false, priviewImage: ""
        };

    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const WechatPublicAccountProps = getFieldProps('WechatPublicAccount', {
            validate: [{
                rules: [
                    { required: true, message: '请填写微信公众号名称' },
                ], trigger: ['onBlur', 'onChange'],
            }]
        });
        const AppIdProps = getFieldProps('AppId', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const AppSecretProps = getFieldProps('AppSecret', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const WechatCommercialNoProps = getFieldProps('WechatCommercialNo', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const WechatPayKeyProps = getFieldProps('WechatPayKey', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const WechatPayCallbackUrlProps = getFieldProps('WechatPayCallbackUrl', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const ScanCallbackUrlProps = getFieldProps('ScanCallbackUrl', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const HelpDocumentUrlProps = getFieldProps('HelpDocumentUrl', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const ShareTitleProps = getFieldProps('ShareTitle', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const ShareSubtitleProps = getFieldProps('ShareSubtitle', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const ShareDescriptionProps = getFieldProps('ShareDescription', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="微信公众号"
                    hasFeedback
                    >
                    <Input {...WechatPublicAccountProps} placeholder="微信公众号" />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="AppID(应用ID)"
                    hasFeedback
                    >
                    <Input {...AppIdProps} placeholder="AppID(应用ID)" />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="AppSecret(应用密钥)"
                    hasFeedback
                    >
                    <Input {...AppSecretProps} placeholder="AppSecret(应用密钥)"
                        />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="微信商户号"
                    hasFeedback
                    >
                    <Input {...WechatCommercialNoProps} placeholder="微信商户号"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="微信支付密钥"
                    hasFeedback
                    >
                    <Input {...WechatPayKeyProps} placeholder="微信支付密钥"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="微信内回调处理页面"
                    hasFeedback
                    >
                    <Input {...WechatPayCallbackUrlProps} placeholder="微信内回调处理页面"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="扫码回调处理页面"
                    hasFeedback
                    >
                    <Input {...ScanCallbackUrlProps} placeholder="扫码回调处理页面"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="帮助中心地址"
                    hasFeedback
                    >
                    <Input {...HelpDocumentUrlProps} placeholder="帮助中心地址"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分享标题"
                    hasFeedback
                    >
                    <Input {...ShareTitleProps} placeholder="分享标题"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分享副标题"
                    hasFeedback
                    >
                    <Input {...ShareSubtitleProps} placeholder="分享副标题"
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分享描述"
                    hasFeedback
                    >
                    <Input {...ShareDescriptionProps} placeholder="分享描述"
                        />
                </FormItem>

            </Form>
        );
    }
}
const AppWXInfoPage = Form.create()(AppWXInfo);

export {AppWXInfoPage }
