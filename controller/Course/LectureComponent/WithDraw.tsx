import * as React from 'react';
import Server from '../../../pub/Server';
import { Table, Icon, Row, Col, Modal, Form, Input, CreateFormOptions, Upload, Menu } from 'antd';

//查询表单
import { FormTemplate, FormElement, ElementEnum } from '../../../components/FormTemplate/FormControl';


const WithDrawApi = {
    InsertLectureWithDraw: (basciInfo: {}) => {
        return Server.resource('POST', "Course/InsertLectureWithDraw",
            basciInfo
        );
    },

}

interface WithDrawProps {
    LectureId: string,
    onClose: Function
}

class WithDraw extends React.Component<WithDrawProps, any>{
    searchData: any;
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        let formElements: FormElement[] = [
            { key: "RewardMoney", element: ElementEnum.Input, type: "number", label: "提现金额", message: "请填写提现金额", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
            { key: "Remark", element: ElementEnum.Textarea, type: "string", label: "备注", message: "请填写备注", defaultValue: "", rules: { required: true, whitespace: true }, dataList: [] },
        ];
        this.state = {
            PageIndex: 1, //当前页
            PageSize: 10, //每页条数
            searchData: null,
            Keywords: null,
            loadingRewardRecord: false,
            modalPara: formElements,
            defaultValues: {},
        };
        this.searchData = {};
    }

    componentDidMount() {
    }

    /**
     * 提交数据
     */
    submitForm(obj) {
        var self = this;
        console.log('收到表单值：', obj);
        obj.LectureId = self.props.LectureId;
        WithDrawApi.InsertLectureWithDraw(obj).then(function (data) {
            if (data.IsOK) {
                Modal.info({
                    title: '温馨提示',
                    content: data.Message,
                    onOk: () => self.props.onClose(true)
                });
                self.props.onClose();
            } else {
                Modal.info({
                    title: '温馨提示',
                    content: data.Message,
                });

            }
        });
    }
    /**
 * 关闭弹窗
 */
    closeForm() {
        this.props.onClose(false);
    }

    render() {
        var self = this;

        return <div>
            <FormTemplate formElements={this.state.modalPara} defaultValues={this.state.defaultValues} isInsert={this.state.isInsert} editId={this.state.editId} onCancel={this.closeForm} onSubmit={this.submitForm}></FormTemplate>

        </div>
            ;
    }
}

export { WithDraw };