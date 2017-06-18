import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, Form, Input, FormProps, Switch, InputNumber} from 'antd';
import SystemConfigApi from './Api';
import {FormTemplate, FormElement, ElementEnum } from '../ModalForm';

const FormItem = Form.Item;
function noop() {
    return false;
}

interface ManagerSystemConfigInitBaseInfoRequest {
    SiteName: string;
}

class AppDistributionInfo extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { setFieldsValue } = this.props.form;
        var _this = this;
        SystemConfigApi.getDistributionInfo().then(function (data) {
            if (data.IsOK) {
                setFieldsValue(data.Value);
            }
        });
    }
    render() {
        const { getFieldProps, getFieldError, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };
        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="是否发送信息给上级"
                    hasFeedback
                    >
                    <Switch {...getFieldProps('IsSendMessageToSuperior', {
                        initialValue: true,
                        valuePropName: 'checked',
                    }) }
                        />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="取得权益获得收益的天数限制"
                    hasFeedback
                    >
                    <InputNumber min={0}  {...getFieldProps('IncomeLimitDay', { initialValue: 7 }) }  />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="是否启用一级分销"
                    hasFeedback
                    >
                    <Switch {...getFieldProps('OneLevelEnable', {
                        initialValue: true,
                        valuePropName: 'checked',
                    }) }
                        />
                    <InputNumber min={0} max={50} step={0.1} disabled={!getFieldValue('OneLevelEnable') }  {...getFieldProps('OneLevelRebateValue', { initialValue: 0 }) }  />

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否启用二级分销"
                    hasFeedback
                    >
                    <Switch {...getFieldProps('TwoLevelEnable', {
                        initialValue: true,
                        valuePropName: 'checked',
                    }) }
                        />
                    <InputNumber min={0} max={50} step={0.1} disabled={!getFieldValue('TwoLevelEnable') } {...getFieldProps('TwoLevelRebateValue', { initialValue: 0 }) }  />

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否启用三级分销"
                    hasFeedback
                    >
                    <Switch {...getFieldProps('ThreeLevelEnable', {
                        initialValue: true,
                        valuePropName: 'checked',
                    }) }
                        />
                    <InputNumber min={0} max={50} step={0.1} disabled={!getFieldValue('ThreeLevelEnable') } {...getFieldProps('ThreeLevelRebateValue', { initialValue: 0 }) }  />

                </FormItem>

            </Form>
        );
    }
}
const AppDistributionInfoPage = Form.create()(AppDistributionInfo);

export {AppDistributionInfoPage }